"""
ToyMix Backend Configuration.

Barcha sozlamalar .env fayldan o'qiladi.
Admin Telegram ID lar ham shu yerda boshqariladi.
"""

import os
from dotenv import load_dotenv

load_dotenv()

# ─── Telegram Bot ────────────────────────────────────────────────────────────
BOT_TOKEN = os.getenv("BOT_TOKEN", "")

# ─── Super Admin ─────────────────────────────────────────────────────────────
# Bu Telegram user ID lar har doim admin bo'ladi (database dan o'chirib bo'lmaydi).
# .env da vergul bilan ajratilgan: SUPER_ADMIN_IDS=123456789,987654321
SUPER_ADMIN_IDS: "set[int]" = set()
_raw_ids = os.getenv("SUPER_ADMIN_IDS", "")
if _raw_ids.strip():
    for _id in _raw_ids.split(","):
        _id = _id.strip()
        if _id.isdigit():
            SUPER_ADMIN_IDS.add(int(_id))

# ─── API Server ──────────────────────────────────────────────────────────────
API_HOST = os.getenv("API_HOST", "0.0.0.0")
API_PORT = int(os.getenv("API_PORT", "8000"))

# ─── Database ────────────────────────────────────────────────────────────────
DATABASE_PATH = os.getenv("DATABASE_PATH", "toymix.db")

# ─── CORS (frontend URL) ────────────────────────────────────────────────────
CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:5173,https://toymix-14889.web.app").split(",")

# ─── API Secret Key (for API-level admin auth from external tools) ───────────
API_SECRET_KEY = os.getenv("API_SECRET_KEY", "")
