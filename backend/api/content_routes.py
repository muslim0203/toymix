"""
Content API Routes — sayt kontentini frontend ga berish.

GET endpointlar — PUBLIC (hamma uchun ochiq, sayt foydalanadi)
POST/PUT/DELETE — faqat API_SECRET_KEY bilan (ichki ishlatish uchun)
"""

from fastapi import APIRouter, HTTPException, Header
from typing import Optional

from database import (
    get_site_settings,
    get_page_content,
    get_blog_posts,
)
from config import API_SECRET_KEY

router = APIRouter(prefix="/api", tags=["content"])


# ─── Public GET Endpoints (sayt frontend uchun) ─────────────────────────────

@router.get("/content")
async def get_all_content():
    """
    Barcha sayt kontentini bir so'rovda qaytarish.
    Frontend buni ishlatadi — contentService.ts dagi fetchSiteContent().
    """
    settings = await get_site_settings()
    about = await get_page_content("about")
    delivery = await get_page_content("delivery")
    blog_posts_raw = await get_blog_posts(published_only=True)

    # Blog postlarni frontend formatiga o'girish
    blog_posts = []
    for post in blog_posts_raw:
        blog_posts.append({
            "id": str(post["id"]),
            "title": post["title"],
            "excerpt": post.get("excerpt", ""),
            "content": post.get("content", ""),
            "image": post.get("image", ""),
            "date": post.get("created_at", ""),
            "author": post.get("author", ""),
        })

    return {
        "settings": settings or {},
        "about": about or {},
        "delivery": delivery or {},
        "blog_posts": blog_posts,
    }


@router.get("/settings")
async def get_settings():
    """Sayt sozlamalarini olish (telefon, email, social linklar, promo banner)."""
    settings = await get_site_settings()
    return settings


@router.get("/content/about")
async def get_about_content():
    """'Biz haqimizda' sahifasi kontentini olish."""
    content = await get_page_content("about")
    if not content:
        return {}
    return content


@router.get("/content/delivery")
async def get_delivery_content():
    """Yetkazish sahifasi kontentini olish."""
    content = await get_page_content("delivery")
    if not content:
        return {}
    return content


@router.get("/blog")
async def get_blog():
    """Blog postlarni olish."""
    posts_raw = await get_blog_posts(published_only=True)
    posts = []
    for post in posts_raw:
        posts.append({
            "id": str(post["id"]),
            "title": post["title"],
            "excerpt": post.get("excerpt", ""),
            "content": post.get("content", ""),
            "image": post.get("image", ""),
            "date": post.get("created_at", ""),
            "author": post.get("author", ""),
        })
    return {"posts": posts}
