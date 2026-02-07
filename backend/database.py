"""
ToyMix Database — SQLite with aiosqlite for async operations.

Jadvallar:
  - admins: bot admin foydalanuvchilari (Telegram user ID)
  - products: mahsulotlar
  - categories: kategoriyalar
  - product_media: mahsulot rasmlari
  - blog_posts: blog maqolalari
  - site_settings: sayt sozlamalari (key-value)
  - about_content: "Biz haqimizda" sahifasi kontenti (JSON)
  - delivery_content: "Yetkazib berish" sahifasi kontenti (JSON)
"""

import aiosqlite
import json
from config import DATABASE_PATH

DB_PATH = DATABASE_PATH


async def get_db() -> aiosqlite.Connection:
    """Get a database connection."""
    db = await aiosqlite.connect(DB_PATH)
    db.row_factory = aiosqlite.Row
    await db.execute("PRAGMA journal_mode=WAL")
    await db.execute("PRAGMA foreign_keys=ON")
    return db


async def init_db():
    """Initialize database tables."""
    db = await get_db()
    try:
        await db.executescript("""
            -- Admin foydalanuvchilari
            CREATE TABLE IF NOT EXISTS admins (
                telegram_id INTEGER PRIMARY KEY,
                username TEXT,
                full_name TEXT,
                added_by INTEGER,
                added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                is_active INTEGER DEFAULT 1
            );

            -- Kategoriyalar
            CREATE TABLE IF NOT EXISTS categories (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL UNIQUE,
                sort_order INTEGER DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            -- Mahsulotlar
            CREATE TABLE IF NOT EXISTS products (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                price TEXT NOT NULL,
                description TEXT DEFAULT '',
                category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
                is_active INTEGER DEFAULT 1,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            -- Mahsulot rasmlari
            CREATE TABLE IF NOT EXISTS product_media (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
                file_id TEXT NOT NULL,
                media_type TEXT DEFAULT 'photo',
                sort_order INTEGER DEFAULT 0
            );

            -- Blog maqolalari
            CREATE TABLE IF NOT EXISTS blog_posts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                excerpt TEXT DEFAULT '',
                content TEXT DEFAULT '',
                image TEXT DEFAULT '',
                author TEXT DEFAULT '',
                is_published INTEGER DEFAULT 1,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            -- Sayt sozlamalari (key-value)
            CREATE TABLE IF NOT EXISTS site_settings (
                key TEXT PRIMARY KEY,
                value TEXT NOT NULL
            );

            -- "Biz haqimizda" sahifasi kontenti (bitta qator, JSON formatda)
            CREATE TABLE IF NOT EXISTS page_content (
                page_name TEXT PRIMARY KEY,
                content_json TEXT NOT NULL,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)
        await db.commit()

        # Default sozlamalarni qo'shish (agar mavjud bo'lmasa)
        default_settings = {
            "phone": "+998 90 123 45 67",
            "email": "info@toymix.uz",
            "address": "Toshkent sh., Chilonzor t.",
            "working_hours": "Har kuni 9:00 - 21:00",
            "instagram_url": "https://instagram.com/toymix.uz",
            "telegram_url": "https://t.me/toymix_uz",
            "whatsapp_url": "https://wa.me/998901234567",
            "promo_banner_text": "300,000 so'mdan yuqori xaridlar uchun yetkazib berish bepul! 🚚",
            "free_delivery_threshold": "300000",
            "site_description": "ToyMix — O'zbekistondagi eng yaxshi bolalar o'yinchoqlari onlayn do'koni.",
        }
        for key, value in default_settings.items():
            await db.execute(
                "INSERT OR IGNORE INTO site_settings (key, value) VALUES (?, ?)",
                (key, value),
            )
        await db.commit()
    finally:
        await db.close()


# ─── Admin operations ────────────────────────────────────────────────────────

async def is_admin(telegram_id: int) -> bool:
    """Foydalanuvchi admin ekanligini tekshirish."""
    from config import SUPER_ADMIN_IDS

    if telegram_id in SUPER_ADMIN_IDS:
        return True

    db = await get_db()
    try:
        cursor = await db.execute(
            "SELECT 1 FROM admins WHERE telegram_id = ? AND is_active = 1",
            (telegram_id,),
        )
        row = await cursor.fetchone()
        return row is not None
    finally:
        await db.close()


async def add_admin(telegram_id: int, username: str, full_name: str, added_by: int) -> bool:
    """Yangi admin qo'shish. Faqat mavjud admin qo'sha oladi."""
    db = await get_db()
    try:
        await db.execute(
            """INSERT OR REPLACE INTO admins (telegram_id, username, full_name, added_by, is_active)
               VALUES (?, ?, ?, ?, 1)""",
            (telegram_id, username, full_name, added_by),
        )
        await db.commit()
        return True
    except Exception:
        return False
    finally:
        await db.close()


async def remove_admin(telegram_id: int) -> bool:
    """Adminni o'chirish (super adminni o'chirib bo'lmaydi)."""
    from config import SUPER_ADMIN_IDS

    if telegram_id in SUPER_ADMIN_IDS:
        return False

    db = await get_db()
    try:
        await db.execute(
            "UPDATE admins SET is_active = 0 WHERE telegram_id = ?",
            (telegram_id,),
        )
        await db.commit()
        return True
    finally:
        await db.close()


async def get_all_admins() -> "list[dict]":
    """Barcha faol adminlar ro'yxati."""
    from config import SUPER_ADMIN_IDS

    db = await get_db()
    try:
        cursor = await db.execute(
            "SELECT telegram_id, username, full_name, added_at FROM admins WHERE is_active = 1"
        )
        rows = await cursor.fetchall()
        admins = []
        for row in rows:
            admins.append({
                "telegram_id": row["telegram_id"],
                "username": row["username"],
                "full_name": row["full_name"],
                "added_at": row["added_at"],
                "is_super": row["telegram_id"] in SUPER_ADMIN_IDS,
            })
        # Super adminlarni ham qo'shish (agar database da yo'q bo'lsa)
        db_ids = {a["telegram_id"] for a in admins}
        for sid in SUPER_ADMIN_IDS:
            if sid not in db_ids:
                admins.append({
                    "telegram_id": sid,
                    "username": None,
                    "full_name": "Super Admin",
                    "added_at": None,
                    "is_super": True,
                })
        return admins
    finally:
        await db.close()


# ─── Site Settings operations ────────────────────────────────────────────────

async def get_site_settings() -> dict:
    """Barcha sayt sozlamalarini olish."""
    db = await get_db()
    try:
        cursor = await db.execute("SELECT key, value FROM site_settings")
        rows = await cursor.fetchall()
        settings = {}
        for row in rows:
            settings[row["key"]] = row["value"]
        # free_delivery_threshold ni int ga aylantirish
        if "free_delivery_threshold" in settings:
            try:
                settings["free_delivery_threshold"] = int(settings["free_delivery_threshold"])
            except (ValueError, TypeError):
                settings["free_delivery_threshold"] = 300000
        return settings
    finally:
        await db.close()


async def update_site_setting(key: str, value: str) -> bool:
    """Bitta sayt sozlamasini yangilash."""
    db = await get_db()
    try:
        await db.execute(
            "INSERT OR REPLACE INTO site_settings (key, value) VALUES (?, ?)",
            (key, value),
        )
        await db.commit()
        return True
    except Exception:
        return False
    finally:
        await db.close()


# ─── Page Content operations ─────────────────────────────────────────────────

async def get_page_content(page_name: str):
    """Sahifa kontentini olish (about, delivery)."""
    db = await get_db()
    try:
        cursor = await db.execute(
            "SELECT content_json FROM page_content WHERE page_name = ?",
            (page_name,),
        )
        row = await cursor.fetchone()
        if row:
            return json.loads(row["content_json"])
        return None
    finally:
        await db.close()


async def update_page_content(page_name: str, content: dict) -> bool:
    """Sahifa kontentini yangilash."""
    db = await get_db()
    try:
        await db.execute(
            """INSERT OR REPLACE INTO page_content (page_name, content_json, updated_at)
               VALUES (?, ?, CURRENT_TIMESTAMP)""",
            (page_name, json.dumps(content, ensure_ascii=False)),
        )
        await db.commit()
        return True
    except Exception:
        return False
    finally:
        await db.close()


# ─── Blog Post operations ────────────────────────────────────────────────────

async def get_blog_posts(published_only: bool = True):
    """Blog postlarini olish."""
    db = await get_db()
    try:
        query = "SELECT * FROM blog_posts"
        if published_only:
            query += " WHERE is_published = 1"
        query += " ORDER BY created_at DESC"
        cursor = await db.execute(query)
        rows = await cursor.fetchall()
        return [dict(row) for row in rows]
    finally:
        await db.close()


async def add_blog_post(title: str, excerpt: str, content: str, image: str, author: str):
    """Yangi blog post qo'shish. Post ID qaytaradi."""
    db = await get_db()
    try:
        cursor = await db.execute(
            """INSERT INTO blog_posts (title, excerpt, content, image, author)
               VALUES (?, ?, ?, ?, ?)""",
            (title, excerpt, content, image, author),
        )
        await db.commit()
        return cursor.lastrowid
    except Exception:
        return None
    finally:
        await db.close()


async def update_blog_post(post_id: int, **kwargs) -> bool:
    """Blog postni yangilash. Faqat berilgan maydonlarni o'zgartiradi."""
    allowed = {"title", "excerpt", "content", "image", "author", "is_published"}
    updates = {k: v for k, v in kwargs.items() if k in allowed}
    if not updates:
        return False

    db = await get_db()
    try:
        set_clause = ", ".join(f"{k} = ?" for k in updates)
        values = list(updates.values())
        values.append(post_id)
        await db.execute(
            f"UPDATE blog_posts SET {set_clause}, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
            values,
        )
        await db.commit()
        return True
    except Exception:
        return False
    finally:
        await db.close()


async def delete_blog_post(post_id: int) -> bool:
    """Blog postni o'chirish."""
    db = await get_db()
    try:
        await db.execute("DELETE FROM blog_posts WHERE id = ?", (post_id,))
        await db.commit()
        return True
    except Exception:
        return False
    finally:
        await db.close()
