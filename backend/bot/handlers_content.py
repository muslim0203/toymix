"""
Content Management Handlers — sayt kontentini bot orqali boshqarish.

Barcha komandalar faqat admin foydalanuvchilarga ochiq (@admin_only).

Komandalar:
    /edit_settings <key> <value> — sayt sozlamasini o'zgartirish
    /settings — hozirgi sozlamalarni ko'rish
    /edit_about <field> <value> — "Biz haqimizda" sahifasini tahrirlash
    /view_about — hozirgi "Biz haqimizda" kontentini ko'rish
    /edit_delivery <field> <value> — yetkazish sahifasini tahrirlash
    /view_delivery — hozirgi yetkazish kontentini ko'rish
    /add_blog — yangi blog post qo'shish
    /edit_blog <id> <field> <value> — blog postni tahrirlash
    /delete_blog <id> — blog postni o'chirish
    /blogs — barcha blog postlar ro'yxati
    /edit_promo <text> — promo banner matnini o'zgartirish
"""

import json
from telegram import Update
from telegram.ext import (
    ContextTypes,
    ConversationHandler,
    CommandHandler,
    MessageHandler,
    filters,
)

from bot.admin_guard import admin_only, notify_admin_action
from database import (
    get_site_settings,
    update_site_setting,
    get_page_content,
    update_page_content,
    get_blog_posts,
    add_blog_post,
    update_blog_post,
    delete_blog_post,
)


# ═══════════════════════════════════════════════════════════════════════════════
# SITE SETTINGS
# ═══════════════════════════════════════════════════════════════════════════════

EDITABLE_SETTINGS = {
    "phone": "📞 Telefon raqam",
    "email": "📧 Email",
    "address": "📍 Manzil",
    "working_hours": "🕐 Ish vaqti",
    "instagram_url": "📸 Instagram link",
    "telegram_url": "✈️ Telegram link",
    "whatsapp_url": "💬 WhatsApp link",
    "promo_banner_text": "🎯 Promo banner matni",
    "free_delivery_threshold": "🚚 Bepul yetkazish chegarasi (so'm)",
    "site_description": "📝 Sayt tavsifi",
}


@admin_only
async def view_settings_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Hozirgi sayt sozlamalarini ko'rsatish."""
    settings = await get_site_settings()

    text = "⚙️ <b>Sayt sozlamalari:</b>\n\n"
    for key, label in EDITABLE_SETTINGS.items():
        value = settings.get(key, "—")
        text += f"{label}:\n<code>{value}</code>\n\n"

    text += (
        "✏️ O'zgartirish uchun:\n"
        "<code>/edit_settings phone +998 99 888 77 66</code>"
    )
    await update.message.reply_text(text, parse_mode="HTML")


@admin_only
async def edit_settings_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """
    Sayt sozlamasini o'zgartirish.
    Ishlatish: /edit_settings <key> <value>
    """
    if not context.args or len(context.args) < 2:
        keys_text = "\n".join(f"  • <code>{k}</code> — {v}" for k, v in EDITABLE_SETTINGS.items())
        await update.message.reply_text(
            f"📋 <b>Ishlatish:</b>\n"
            f"<code>/edit_settings &lt;key&gt; &lt;value&gt;</code>\n\n"
            f"<b>Mavjud kalitlar:</b>\n{keys_text}\n\n"
            f"<b>Misol:</b>\n"
            f"<code>/edit_settings phone +998 99 888 77 66</code>",
            parse_mode="HTML",
        )
        return

    key = context.args[0].lower()
    value = " ".join(context.args[1:])

    if key not in EDITABLE_SETTINGS:
        await update.message.reply_text(
            f"❌ Noto'g'ri kalit: <code>{key}</code>\n"
            f"Mavjud kalitlar: {', '.join(EDITABLE_SETTINGS.keys())}",
            parse_mode="HTML",
        )
        return

    success = await update_site_setting(key, value)
    if success:
        await notify_admin_action(update, f"Sozlama o'zgartirildi: {key} = {value}")
        await update.message.reply_text(
            f"✅ <b>{EDITABLE_SETTINGS[key]}</b> yangilandi!\n\n"
            f"Yangi qiymat: <code>{value}</code>\n\n"
            f"💡 Saytda 5 daqiqa ichida yangilanadi.",
            parse_mode="HTML",
        )
    else:
        await update.message.reply_text("❌ Sozlamani saqlashda xatolik yuz berdi.")


@admin_only
async def edit_promo_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Promo banner matnini tez o'zgartirish. /edit_promo <matn>"""
    if not context.args:
        await update.message.reply_text(
            "📋 Ishlatish: /edit_promo <yangi matn>\n"
            "Misol: /edit_promo 50% chegirma barcha o'yinchoqlarga! 🎉"
        )
        return

    value = " ".join(context.args)
    success = await update_site_setting("promo_banner_text", value)
    if success:
        await notify_admin_action(update, f"Promo banner o'zgartirildi: {value}")
        await update.message.reply_text(
            f"✅ Promo banner yangilandi!\n\n"
            f"🎯 <code>{value}</code>",
            parse_mode="HTML",
        )
    else:
        await update.message.reply_text("❌ Xatolik yuz berdi.")


# ═══════════════════════════════════════════════════════════════════════════════
# ABOUT PAGE
# ═══════════════════════════════════════════════════════════════════════════════

ABOUT_FIELDS = {
    "hero_title": "Sarlavha",
    "hero_description": "Tavsif",
    "mission_text": "Missiya matni",
}


@admin_only
async def view_about_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Hozirgi 'Biz haqimizda' kontentini ko'rsatish."""
    content = await get_page_content("about")

    if not content:
        await update.message.reply_text(
            "ℹ️ 'Biz haqimizda' sahifasi hali tahrir qilinmagan.\n"
            "Default kontentdan foydalanilmoqda.\n\n"
            "Tahrirlash: /edit_about hero_title <yangi sarlavha>"
        )
        return

    text = "📄 <b>'Biz haqimizda' sahifasi:</b>\n\n"
    for key, label in ABOUT_FIELDS.items():
        value = content.get(key, "—")
        text += f"<b>{label}:</b>\n{value}\n\n"

    # Stats
    stats = content.get("stats", [])
    if stats:
        text += "<b>Statistika:</b>\n"
        for s in stats:
            text += f"  • {s.get('number', '')} — {s.get('label', '')}\n"
        text += "\n"

    # Team
    team = content.get("team_members", [])
    if team:
        text += "<b>Jamoa:</b>\n"
        for m in team:
            text += f"  • {m.get('name', '')} — {m.get('role', '')}\n"

    await update.message.reply_text(text, parse_mode="HTML")


@admin_only
async def edit_about_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """
    'Biz haqimizda' sahifasini tahrirlash.
    Ishlatish: /edit_about <field> <value>
    
    Mavjud fieldlar: hero_title, hero_description, mission_text
    
    Statistika o'zgartirish:
    /edit_about stat <raqam> <label>
    Misol: /edit_about stat 10000+ Mamnun mijozlar

    Jamoa a'zosi qo'shish:
    /edit_about team <ism> | <lavozim> | <rasm_url>
    """
    if not context.args:
        fields_text = "\n".join(f"  • <code>{k}</code> — {v}" for k, v in ABOUT_FIELDS.items())
        await update.message.reply_text(
            f"📋 <b>'Biz haqimizda' sahifasini tahrirlash:</b>\n\n"
            f"<b>Matn o'zgartirish:</b>\n"
            f"<code>/edit_about &lt;field&gt; &lt;value&gt;</code>\n{fields_text}\n\n"
            f"<b>Statistika qo'shish:</b>\n"
            f"<code>/edit_about stat 10000+ Mamnun mijozlar</code>\n\n"
            f"<b>Statistikani tozalash:</b>\n"
            f"<code>/edit_about clear_stats</code>\n\n"
            f"<b>Jamoa a'zosi qo'shish:</b>\n"
            f"<code>/edit_about team Ism Familiya | Lavozim | rasm_url</code>\n\n"
            f"<b>Jamoani tozalash:</b>\n"
            f"<code>/edit_about clear_team</code>",
            parse_mode="HTML",
        )
        return

    field = context.args[0].lower()
    value = " ".join(context.args[1:])

    # Hozirgi kontentni olish yoki yangi yaratish
    content = await get_page_content("about") or {}

    # Oddiy matn fieldlari
    if field in ABOUT_FIELDS:
        content[field] = value
        await update_page_content("about", content)
        await notify_admin_action(update, f"About {field} o'zgartirildi")
        await update.message.reply_text(
            f"✅ <b>{ABOUT_FIELDS[field]}</b> yangilandi!\n\n{value}",
            parse_mode="HTML",
        )
        return

    # Statistika qo'shish
    if field == "stat":
        if len(context.args) < 3:
            await update.message.reply_text("Ishlatish: /edit_about stat <raqam> <label>")
            return
        stat_number = context.args[1]
        stat_label = " ".join(context.args[2:])
        stats = content.get("stats", [])
        stats.append({"number": stat_number, "label": stat_label})
        content["stats"] = stats
        await update_page_content("about", content)
        await update.message.reply_text(
            f"✅ Statistika qo'shildi: <b>{stat_number}</b> — {stat_label}",
            parse_mode="HTML",
        )
        return

    if field == "clear_stats":
        content["stats"] = []
        await update_page_content("about", content)
        await update.message.reply_text("✅ Barcha statistika tozalandi.")
        return

    # Jamoa a'zosi qo'shish
    if field == "team":
        parts = value.split("|")
        if len(parts) < 2:
            await update.message.reply_text(
                "Ishlatish: /edit_about team Ism | Lavozim | rasm_url"
            )
            return
        name = parts[0].strip()
        role = parts[1].strip()
        image = parts[2].strip() if len(parts) > 2 else ""
        team = content.get("team_members", [])
        team.append({"name": name, "role": role, "image": image})
        content["team_members"] = team
        await update_page_content("about", content)
        await update.message.reply_text(
            f"✅ Jamoa a'zosi qo'shildi: <b>{name}</b> — {role}",
            parse_mode="HTML",
        )
        return

    if field == "clear_team":
        content["team_members"] = []
        await update_page_content("about", content)
        await update.message.reply_text("✅ Jamoa ro'yxati tozalandi.")
        return

    # Value o'zgartirish
    if field == "value":
        parts = value.split("|")
        if len(parts) < 2:
            await update.message.reply_text(
                "Ishlatish: /edit_about value Sarlavha | Tavsif | icon_name\n"
                "Icon nomlari: shield, heart, users, star, award, zap"
            )
            return
        title = parts[0].strip()
        desc = parts[1].strip()
        icon = parts[2].strip() if len(parts) > 2 else "shield"
        values = content.get("values", [])
        values.append({"title": title, "description": desc, "icon_name": icon})
        content["values"] = values
        await update_page_content("about", content)
        await update.message.reply_text(
            f"✅ Qadriyat qo'shildi: <b>{title}</b>",
            parse_mode="HTML",
        )
        return

    if field == "clear_values":
        content["values"] = []
        await update_page_content("about", content)
        await update.message.reply_text("✅ Qadriyatlar tozalandi.")
        return

    await update.message.reply_text(f"❌ Noma'lum field: {field}")


# ═══════════════════════════════════════════════════════════════════════════════
# DELIVERY PAGE
# ═══════════════════════════════════════════════════════════════════════════════

@admin_only
async def view_delivery_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Hozirgi yetkazish sahifasi kontentini ko'rsatish."""
    content = await get_page_content("delivery")

    if not content:
        await update.message.reply_text(
            "ℹ️ Yetkazish sahifasi hali tahrir qilinmagan.\n"
            "Default kontentdan foydalanilmoqda."
        )
        return

    text = "🚚 <b>Yetkazish sahifasi:</b>\n\n"
    text += f"<b>Sarlavha:</b> {content.get('hero_title', '—')}\n"
    text += f"<b>Tavsif:</b> {content.get('hero_description', '—')}\n\n"

    options = content.get("delivery_options", [])
    if options:
        text += "<b>Yetkazish variantlari:</b>\n"
        for opt in options:
            text += f"  📦 {opt.get('title', '')}\n"
            for item in opt.get("items", []):
                text += f"    • {item}\n"
        text += "\n"

    faq = content.get("faq", [])
    if faq:
        text += "<b>FAQ:</b>\n"
        for f in faq:
            text += f"  ❓ {f.get('question', '')}\n"

    await update.message.reply_text(text, parse_mode="HTML")


@admin_only
async def edit_delivery_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """
    Yetkazish sahifasini tahrirlash.

    /edit_delivery hero_title <sarlavha>
    /edit_delivery hero_description <tavsif>
    /edit_delivery faq <savol> | <javob>
    /edit_delivery clear_faq
    """
    if not context.args:
        await update.message.reply_text(
            "📋 <b>Yetkazish sahifasini tahrirlash:</b>\n\n"
            "<code>/edit_delivery hero_title &lt;sarlavha&gt;</code>\n"
            "<code>/edit_delivery hero_description &lt;tavsif&gt;</code>\n"
            "<code>/edit_delivery faq Savol matni | Javob matni</code>\n"
            "<code>/edit_delivery clear_faq</code>\n"
            "<code>/edit_delivery step &lt;raqam&gt; &lt;sarlavha&gt; | &lt;tavsif&gt;</code>\n"
            "<code>/edit_delivery clear_steps</code>\n"
            "<code>/edit_delivery payment &lt;nomi&gt; | &lt;tavsif&gt; | &lt;icon&gt;</code>\n"
            "<code>/edit_delivery clear_payments</code>",
            parse_mode="HTML",
        )
        return

    field = context.args[0].lower()
    value = " ".join(context.args[1:])
    content = await get_page_content("delivery") or {}

    if field in ("hero_title", "hero_description"):
        content[field] = value
        await update_page_content("delivery", content)
        await update.message.reply_text(f"✅ {field} yangilandi!\n\n{value}")
        return

    if field == "faq":
        parts = value.split("|")
        if len(parts) < 2:
            await update.message.reply_text("Ishlatish: /edit_delivery faq Savol | Javob")
            return
        faq = content.get("faq", [])
        faq.append({"question": parts[0].strip(), "answer": parts[1].strip()})
        content["faq"] = faq
        await update_page_content("delivery", content)
        await update.message.reply_text(f"✅ FAQ qo'shildi: {parts[0].strip()}")
        return

    if field == "clear_faq":
        content["faq"] = []
        await update_page_content("delivery", content)
        await update.message.reply_text("✅ FAQ tozalandi.")
        return

    if field == "step":
        parts = value.split("|")
        if len(parts) < 2:
            await update.message.reply_text("Ishlatish: /edit_delivery step 1 Tanlang | O'yinchoqni tanlang")
            return
        first_part = parts[0].strip().split(" ", 1)
        step_num = first_part[0]
        step_title = first_part[1] if len(first_part) > 1 else ""
        step_desc = parts[1].strip()
        steps = content.get("steps", [])
        steps.append({"step": step_num, "title": step_title, "description": step_desc})
        content["steps"] = steps
        await update_page_content("delivery", content)
        await update.message.reply_text(f"✅ Qadam qo'shildi: {step_num}. {step_title}")
        return

    if field == "clear_steps":
        content["steps"] = []
        await update_page_content("delivery", content)
        await update.message.reply_text("✅ Qadamlar tozalandi.")
        return

    if field == "payment":
        parts = value.split("|")
        if len(parts) < 2:
            await update.message.reply_text(
                "Ishlatish: /edit_delivery payment Naqd pul | Yetkazib berilganda | cash\n"
                "Icon nomlari: cash, card, phone"
            )
            return
        title = parts[0].strip()
        desc = parts[1].strip()
        icon = parts[2].strip() if len(parts) > 2 else "cash"
        payments = content.get("payment_methods", [])
        payments.append({"title": title, "description": desc, "icon_name": icon})
        content["payment_methods"] = payments
        await update_page_content("delivery", content)
        await update.message.reply_text(f"✅ To'lov usuli qo'shildi: {title}")
        return

    if field == "clear_payments":
        content["payment_methods"] = []
        await update_page_content("delivery", content)
        await update.message.reply_text("✅ To'lov usullari tozalandi.")
        return

    await update.message.reply_text(f"❌ Noma'lum field: {field}")


# ═══════════════════════════════════════════════════════════════════════════════
# BLOG POSTS
# ═══════════════════════════════════════════════════════════════════════════════

@admin_only
async def list_blogs_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Barcha blog postlarni ko'rsatish."""
    posts = await get_blog_posts(published_only=False)

    if not posts:
        await update.message.reply_text(
            "📝 Hozircha blog postlar yo'q.\n"
            "Yangi post qo'shish: /add_blog"
        )
        return

    text = "📝 <b>Blog postlar:</b>\n\n"
    for post in posts:
        status = "✅" if post.get("is_published", 1) else "📝"
        text += (
            f"{status} <b>#{post['id']}</b> — {post['title']}\n"
            f"   ✍️ {post.get('author', '—')} | {post.get('created_at', '')}\n\n"
        )

    text += (
        "✏️ Tahrirlash: /edit_blog <id> <field> <value>\n"
        "🗑 O'chirish: /delete_blog <id>\n"
        "➕ Yangi: /add_blog"
    )
    await update.message.reply_text(text, parse_mode="HTML")


# ─── Add Blog Post (conversation) ────────────────────────────────────────────
BLOG_TITLE, BLOG_EXCERPT, BLOG_CONTENT, BLOG_IMAGE, BLOG_AUTHOR = range(5)


@admin_only
async def add_blog_start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Yangi blog post qo'shish jarayonini boshlash."""
    await update.message.reply_text(
        "📝 <b>Yangi blog post qo'shish</b>\n\n"
        "1️⃣ Maqola sarlavhasini yozing:",
        parse_mode="HTML",
    )
    return BLOG_TITLE


async def blog_title_handler(update: Update, context: ContextTypes.DEFAULT_TYPE):
    context.user_data["blog_title"] = update.message.text
    await update.message.reply_text("2️⃣ Qisqacha tavsif (excerpt) yozing:")
    return BLOG_EXCERPT


async def blog_excerpt_handler(update: Update, context: ContextTypes.DEFAULT_TYPE):
    context.user_data["blog_excerpt"] = update.message.text
    await update.message.reply_text(
        "3️⃣ To'liq maqola matnini yozing\n(yoki /skip boshing):"
    )
    return BLOG_CONTENT


async def blog_content_handler(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if update.message.text == "/skip":
        context.user_data["blog_content"] = ""
    else:
        context.user_data["blog_content"] = update.message.text
    await update.message.reply_text(
        "4️⃣ Rasm URL yuboring\n(yoki /skip bosing):"
    )
    return BLOG_IMAGE


async def blog_image_handler(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if update.message.text == "/skip":
        context.user_data["blog_image"] = ""
    else:
        context.user_data["blog_image"] = update.message.text
    await update.message.reply_text("5️⃣ Muallif ismini yozing:")
    return BLOG_AUTHOR


async def blog_author_handler(update: Update, context: ContextTypes.DEFAULT_TYPE):
    author = update.message.text
    data = context.user_data

    post_id = await add_blog_post(
        title=data.get("blog_title", ""),
        excerpt=data.get("blog_excerpt", ""),
        content=data.get("blog_content", ""),
        image=data.get("blog_image", ""),
        author=author,
    )

    if post_id:
        await notify_admin_action(update, f"Blog post qo'shdi: #{post_id}")
        await update.message.reply_text(
            f"✅ <b>Blog post yaratildi!</b>\n\n"
            f"📌 ID: #{post_id}\n"
            f"📖 {data.get('blog_title', '')}\n"
            f"✍️ {author}\n\n"
            f"Saytda 5 daqiqa ichida ko'rinadi.",
            parse_mode="HTML",
        )
    else:
        await update.message.reply_text("❌ Blog post saqlashda xatolik yuz berdi.")

    # Clean up user data
    for key in ["blog_title", "blog_excerpt", "blog_content", "blog_image"]:
        context.user_data.pop(key, None)

    return ConversationHandler.END


async def blog_cancel(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Blog yaratishni bekor qilish."""
    await update.message.reply_text("❌ Blog post yaratish bekor qilindi.")
    return ConversationHandler.END


def get_blog_conversation_handler() -> ConversationHandler:
    """Blog post qo'shish uchun ConversationHandler."""
    return ConversationHandler(
        entry_points=[CommandHandler("add_blog", add_blog_start)],
        states={
            BLOG_TITLE: [MessageHandler(filters.TEXT & ~filters.COMMAND, blog_title_handler)],
            BLOG_EXCERPT: [MessageHandler(filters.TEXT & ~filters.COMMAND, blog_excerpt_handler)],
            BLOG_CONTENT: [
                MessageHandler(filters.TEXT & ~filters.COMMAND, blog_content_handler),
                CommandHandler("skip", blog_content_handler),
            ],
            BLOG_IMAGE: [
                MessageHandler(filters.TEXT & ~filters.COMMAND, blog_image_handler),
                CommandHandler("skip", blog_image_handler),
            ],
            BLOG_AUTHOR: [MessageHandler(filters.TEXT & ~filters.COMMAND, blog_author_handler)],
        },
        fallbacks=[CommandHandler("cancel", blog_cancel)],
    )


@admin_only
async def edit_blog_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """
    Blog postni tahrirlash.
    Ishlatish: /edit_blog <id> <field> <value>
    Fieldlar: title, excerpt, content, image, author
    Yashirish/ko'rsatish: /edit_blog <id> publish / /edit_blog <id> unpublish
    """
    if not context.args or len(context.args) < 2:
        await update.message.reply_text(
            "📋 Ishlatish: /edit_blog <id> <field> <value>\n\n"
            "Fieldlar: title, excerpt, content, image, author\n"
            "Yashirish: /edit_blog <id> unpublish\n"
            "Ko'rsatish: /edit_blog <id> publish"
        )
        return

    try:
        post_id = int(context.args[0])
    except ValueError:
        await update.message.reply_text("❌ ID raqam bo'lishi kerak.")
        return

    field = context.args[1].lower()

    if field == "publish":
        success = await update_blog_post(post_id, is_published=1)
    elif field == "unpublish":
        success = await update_blog_post(post_id, is_published=0)
    else:
        if len(context.args) < 3:
            await update.message.reply_text("❌ Qiymat kiritilmagan.")
            return
        value = " ".join(context.args[2:])
        success = await update_blog_post(post_id, **{field: value})

    if success:
        await notify_admin_action(update, f"Blog #{post_id} tahrirlandi: {field}")
        await update.message.reply_text(f"✅ Blog post #{post_id} yangilandi!")
    else:
        await update.message.reply_text("❌ Tahrirlashda xatolik. Fieldni tekshiring.")


@admin_only
async def delete_blog_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Blog postni o'chirish. /delete_blog <id>"""
    if not context.args:
        await update.message.reply_text("Ishlatish: /delete_blog <id>")
        return

    try:
        post_id = int(context.args[0])
    except ValueError:
        await update.message.reply_text("❌ ID raqam bo'lishi kerak.")
        return

    success = await delete_blog_post(post_id)
    if success:
        await notify_admin_action(update, f"Blog #{post_id} o'chirildi")
        await update.message.reply_text(f"✅ Blog post #{post_id} o'chirildi!")
    else:
        await update.message.reply_text("❌ O'chirishda xatolik yuz berdi.")


# ═══════════════════════════════════════════════════════════════════════════════
# HELP COMMAND
# ═══════════════════════════════════════════════════════════════════════════════

@admin_only
async def admin_help_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Admin komandalar ro'yxati."""
    await update.message.reply_text(
        "🔧 <b>Admin komandalar:</b>\n\n"
        "<b>👥 Admin boshqaruv:</b>\n"
        "/admins — adminlar ro'yxati\n"
        "/add_admin — yangi admin qo'shish\n"
        "/remove_admin — adminni o'chirish\n"
        "/myid — Telegram ID ni ko'rish\n\n"
        "<b>⚙️ Sayt sozlamalari:</b>\n"
        "/settings — hozirgi sozlamalar\n"
        "/edit_settings — sozlamani o'zgartirish\n"
        "/edit_promo — promo banner matni\n\n"
        "<b>📄 'Biz haqimizda':</b>\n"
        "/view_about — hozirgi kontentni ko'rish\n"
        "/edit_about — tahrirlash\n\n"
        "<b>🚚 Yetkazish:</b>\n"
        "/view_delivery — hozirgi kontentni ko'rish\n"
        "/edit_delivery — tahrirlash\n\n"
        "<b>📝 Blog:</b>\n"
        "/blogs — postlar ro'yxati\n"
        "/add_blog — yangi post qo'shish\n"
        "/edit_blog — postni tahrirlash\n"
        "/delete_blog — postni o'chirish\n\n"
        "<b>ℹ️ Boshqa:</b>\n"
        "/admin_help — shu yordam\n",
        parse_mode="HTML",
    )
