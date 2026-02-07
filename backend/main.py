"""
ToyMix Backend — FastAPI server + Telegram Bot.

Ishga tushirish:
    python main.py

Yoki alohida:
    uvicorn main:app --host 0.0.0.0 --port 8000

.env faylda kerak:
    BOT_TOKEN=your_telegram_bot_token
    SUPER_ADMIN_IDS=123456789
"""

import asyncio
import uvicorn
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from telegram.ext import ApplicationBuilder, CommandHandler

from config import BOT_TOKEN, API_HOST, API_PORT, CORS_ORIGINS
from database import init_db

# API routes
from api.content_routes import router as content_router

# Bot handlers
from bot.handlers_admin import (
    myid_command,
    add_admin_command,
    remove_admin_command,
    list_admins_command,
)
from bot.handlers_content import (
    view_settings_command,
    edit_settings_command,
    edit_promo_command,
    view_about_command,
    edit_about_command,
    view_delivery_command,
    edit_delivery_command,
    list_blogs_command,
    edit_blog_command,
    delete_blog_command,
    admin_help_command,
    get_blog_conversation_handler,
)


# ─── Telegram Bot Setup ─────────────────────────────────────────────────────

bot_app = None


def create_bot():
    """Telegram bot ni yaratish va handlerlarni ro'yxatdan o'tkazish."""
    global bot_app

    if not BOT_TOKEN:
        print("⚠️  BOT_TOKEN topilmadi. Bot ishga tushmaydi.")
        print("   .env faylga BOT_TOKEN=your_token qo'shing.")
        return None

    builder = ApplicationBuilder().token(BOT_TOKEN)
    bot_app = builder.build()

    # ── Umumiy komandalar (hammaga ochiq) ──
    bot_app.add_handler(CommandHandler("myid", myid_command))
    bot_app.add_handler(CommandHandler("start", start_command))
    bot_app.add_handler(CommandHandler("help", help_command))

    # ── Admin boshqaruv komandlari (super admin only) ──
    bot_app.add_handler(CommandHandler("add_admin", add_admin_command))
    bot_app.add_handler(CommandHandler("remove_admin", remove_admin_command))

    # ── Admin komandalar (admin only) ──
    bot_app.add_handler(CommandHandler("admins", list_admins_command))
    bot_app.add_handler(CommandHandler("admin_help", admin_help_command))

    # ── Sayt sozlamalari (admin only) ──
    bot_app.add_handler(CommandHandler("settings", view_settings_command))
    bot_app.add_handler(CommandHandler("edit_settings", edit_settings_command))
    bot_app.add_handler(CommandHandler("edit_promo", edit_promo_command))

    # ── About sahifasi (admin only) ──
    bot_app.add_handler(CommandHandler("view_about", view_about_command))
    bot_app.add_handler(CommandHandler("edit_about", edit_about_command))

    # ── Delivery sahifasi (admin only) ──
    bot_app.add_handler(CommandHandler("view_delivery", view_delivery_command))
    bot_app.add_handler(CommandHandler("edit_delivery", edit_delivery_command))

    # ── Blog (admin only, conversation handler) ──
    bot_app.add_handler(get_blog_conversation_handler())
    bot_app.add_handler(CommandHandler("blogs", list_blogs_command))
    bot_app.add_handler(CommandHandler("edit_blog", edit_blog_command))
    bot_app.add_handler(CommandHandler("delete_blog", delete_blog_command))

    return bot_app


async def start_command(update, context):
    """Bot /start komandasi."""
    user = update.effective_user
    from database import is_admin as check_admin
    is_adm = await check_admin(user.id)

    if is_adm:
        await update.message.reply_text(
            f"👋 Salom, {user.first_name}!\n\n"
            f"🔧 Siz <b>admin</b> sifatida kirdingiz.\n"
            f"Barcha komandalar: /admin_help\n\n"
            f"Sayt sozlamalari: /settings\n"
            f"Blog boshqaruvi: /blogs\n"
            f"Biz haqimizda: /view_about\n"
            f"Yetkazish: /view_delivery",
            parse_mode="HTML",
        )
    else:
        await update.message.reply_text(
            f"👋 Salom, {user.first_name}!\n\n"
            f"🧸 ToyMix — bolalar o'yinchoqlari do'koni botiga xush kelibsiz!\n\n"
            f"📱 Saytimiz: toymix-14889.web.app\n"
            f"📞 Bog'lanish uchun: /myid"
        )


async def help_command(update, context):
    """Bot /help komandasi."""
    user = update.effective_user
    from database import is_admin as check_admin
    is_adm = await check_admin(user.id)

    text = "🧸 <b>ToyMix Bot</b>\n\n"
    text += "/start — Botni boshlash\n"
    text += "/myid — Telegram ID ni ko'rish\n"
    text += "/help — Yordam\n"

    if is_adm:
        text += "\n🔧 <b>Admin komandalar:</b>\n"
        text += "/admin_help — to'liq admin yordam\n"

    await update.message.reply_text(text, parse_mode="HTML")


# ─── FastAPI Setup ───────────────────────────────────────────────────────────

@asynccontextmanager
async def lifespan(app: FastAPI):
    """FastAPI lifespan — startup va shutdown."""
    # Startup
    print("🚀 ToyMix Backend ishga tushmoqda...")
    await init_db()
    print("✅ Database tayyor")

    # Telegram bot ni ishga tushirish
    bot = create_bot()
    if bot:
        await bot.initialize()
        await bot.start()
        await bot.updater.start_polling(drop_pending_updates=True)
        print("✅ Telegram bot ishga tushdi")

    yield

    # Shutdown
    if bot_app:
        print("⏹ Telegram bot to'xtatilmoqda...")
        await bot_app.updater.stop()
        await bot_app.stop()
        await bot_app.shutdown()

    print("👋 ToyMix Backend to'xtatildi")


app = FastAPI(
    title="ToyMix API",
    description="ToyMix bolalar o'yinchoqlari do'koni — Bot boshqaruv API",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API routerlarni qo'shish
app.include_router(content_router)


@app.get("/")
async def root():
    return {"status": "ok", "service": "ToyMix API", "version": "1.0.0"}


@app.get("/health")
async def health():
    return {"status": "healthy"}


# ─── Entry Point ─────────────────────────────────────────────────────────────

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host=API_HOST,
        port=API_PORT,
        reload=False,
        log_level="info",
    )
