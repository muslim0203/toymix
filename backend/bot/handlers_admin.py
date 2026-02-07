"""
Admin Management Handlers — admin qo'shish, o'chirish, ro'yxat.

Komandalar (faqat super admin):
    /add_admin <user_id> — yangi admin qo'shish
    /remove_admin <user_id> — adminni o'chirish
    /admins — barcha adminlar ro'yxati
    /myid — o'zining Telegram ID sini ko'rish (hammaga ochiq)
"""

from telegram import Update
from telegram.ext import ContextTypes

from bot.admin_guard import super_admin_only, admin_only, notify_admin_action
from database import add_admin, remove_admin, get_all_admins
from config import SUPER_ADMIN_IDS


async def myid_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Foydalanuvchiga o'zining Telegram ID sini ko'rsatish."""
    user = update.effective_user
    await update.message.reply_text(
        f"👤 Sizning Telegram ID: <code>{user.id}</code>\n"
        f"Ism: {user.full_name}\n"
        f"Username: @{user.username or 'yo`q'}",
        parse_mode="HTML",
    )


@super_admin_only
async def add_admin_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """
    Yangi admin qo'shish. Faqat super admin ishlatadi.
    Ishlatish: /add_admin <telegram_user_id>

    Yoki biror foydalanuvchining xabariga reply qilib /add_admin yozish.
    """
    user = update.effective_user
    target_id = None
    target_username = ""
    target_fullname = ""

    # Reply orqali admin qo'shish
    if update.message.reply_to_message:
        target_user = update.message.reply_to_message.from_user
        target_id = target_user.id
        target_username = target_user.username or ""
        target_fullname = target_user.full_name or ""
    # ID orqali admin qo'shish
    elif context.args and len(context.args) >= 1:
        try:
            target_id = int(context.args[0])
            target_username = context.args[1] if len(context.args) > 1 else ""
            target_fullname = " ".join(context.args[2:]) if len(context.args) > 2 else ""
        except ValueError:
            await update.message.reply_text(
                "❌ Noto'g'ri format.\n"
                "Ishlatish: /add_admin <user_id> [username] [ism]\n"
                "Yoki biror xabarga reply qilib /add_admin yozing."
            )
            return
    else:
        await update.message.reply_text(
            "📋 Admin qo'shish:\n\n"
            "1️⃣ Biror foydalanuvchining xabariga reply qilib /add_admin yozing\n"
            "2️⃣ Yoki: /add_admin <telegram_id>\n\n"
            "💡 Foydalanuvchi o'z ID sini /myid komandasi bilan bilishi mumkin."
        )
        return

    success = await add_admin(target_id, target_username, target_fullname, user.id)

    if success:
        await notify_admin_action(update, f"Admin qo'shdi: {target_id} ({target_fullname})")
        await update.message.reply_text(
            f"✅ Yangi admin qo'shildi!\n\n"
            f"👤 ID: <code>{target_id}</code>\n"
            f"Ism: {target_fullname or 'Noma`lum'}\n"
            f"Username: @{target_username or 'yo`q'}\n\n"
            f"Endi bu foydalanuvchi bot orqali saytni boshqara oladi.",
            parse_mode="HTML",
        )
    else:
        await update.message.reply_text("❌ Admin qo'shishda xatolik yuz berdi.")


@super_admin_only
async def remove_admin_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """
    Adminni o'chirish. Faqat super admin ishlatadi.
    Super adminni o'chirib bo'lmaydi.
    """
    target_id = None

    if update.message.reply_to_message:
        target_id = update.message.reply_to_message.from_user.id
    elif context.args and len(context.args) >= 1:
        try:
            target_id = int(context.args[0])
        except ValueError:
            await update.message.reply_text("❌ Noto'g'ri format. Ishlatish: /remove_admin <user_id>")
            return
    else:
        await update.message.reply_text(
            "📋 Adminni o'chirish:\n\n"
            "/remove_admin <telegram_id>\n"
            "Yoki xabarga reply qilib /remove_admin"
        )
        return

    if target_id in SUPER_ADMIN_IDS:
        await update.message.reply_text("⛔ Super adminni o'chirib bo'lmaydi!")
        return

    success = await remove_admin(target_id)
    if success:
        await notify_admin_action(update, f"Adminni o'chirdi: {target_id}")
        await update.message.reply_text(
            f"✅ Admin o'chirildi: <code>{target_id}</code>",
            parse_mode="HTML",
        )
    else:
        await update.message.reply_text("❌ Adminni o'chirishda xatolik yuz berdi.")


@admin_only
async def list_admins_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Barcha adminlar ro'yxatini ko'rsatish."""
    admins = await get_all_admins()

    if not admins:
        await update.message.reply_text("Hozircha hech qanday admin yo'q.")
        return

    text = "👥 <b>Adminlar ro'yxati:</b>\n\n"
    for i, admin in enumerate(admins, 1):
        badge = "👑" if admin["is_super"] else "🔧"
        name = admin["full_name"] or "Noma'lum"
        username = f"@{admin['username']}" if admin["username"] else ""
        text += (
            f"{i}. {badge} <b>{name}</b> {username}\n"
            f"   ID: <code>{admin['telegram_id']}</code>\n"
        )

    text += f"\nJami: {len(admins)} ta admin"
    await update.message.reply_text(text, parse_mode="HTML")
