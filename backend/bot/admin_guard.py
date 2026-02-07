"""
Admin Guard — Telegram bot komandalarini faqat adminlarga ruxsat berish.

Ishlatish:
    from bot.admin_guard import admin_only, super_admin_only

    @admin_only
    async def edit_product(update, context):
        # Faqat adminlar kiradi
        ...

    @super_admin_only
    async def add_admin_cmd(update, context):
        # Faqat super adminlar kiradi
        ...
"""

from functools import wraps
from telegram import Update
from telegram.ext import ContextTypes

from database import is_admin
from config import SUPER_ADMIN_IDS


def admin_only(func):
    """
    Dekorator: faqat admin foydalanuvchilarga ruxsat beradi.
    Agar admin bo'lmasa, "Ruxsat yo'q" xabarini yuboradi.
    """
    @wraps(func)
    async def wrapper(update: Update, context: ContextTypes.DEFAULT_TYPE, *args, **kwargs):
        user = update.effective_user
        if not user:
            return

        if not await is_admin(user.id):
            await update.message.reply_text(
                "⛔ Sizda bu komandani ishlatish uchun ruxsat yo'q.\n"
                "Faqat adminlar bu amalni bajara oladi."
            )
            return

        return await func(update, context, *args, **kwargs)

    return wrapper


def super_admin_only(func):
    """
    Dekorator: faqat super adminlarga ruxsat beradi.
    Super adminlar .env faylda SUPER_ADMIN_IDS da ko'rsatilgan.
    Admin qo'shish/o'chirish faqat super admin qila oladi.
    """
    @wraps(func)
    async def wrapper(update: Update, context: ContextTypes.DEFAULT_TYPE, *args, **kwargs):
        user = update.effective_user
        if not user:
            return

        if user.id not in SUPER_ADMIN_IDS:
            await update.message.reply_text(
                "⛔ Bu komanda faqat bosh admin uchun.\n"
                "Sizda bu amalni bajarish huquqi yo'q."
            )
            return

        return await func(update, context, *args, **kwargs)

    return wrapper


async def notify_admin_action(update: Update, action: str):
    """Admin bajargan amalni log qilish uchun yordamchi funksiya."""
    user = update.effective_user
    print(
        f"[ADMIN ACTION] {user.full_name} (@{user.username}, ID:{user.id}) — {action}"
    )
