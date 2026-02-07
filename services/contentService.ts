/**
 * Content Service — fetches site content (blog, about, delivery, settings) from
 * the ToyMix bot API server. Falls back to hardcoded constants if the API is unavailable.
 *
 * Bot admin can change all this content via Telegram bot commands:
 *   /edit_about, /edit_delivery, /add_blog, /edit_settings, etc.
 */

import {
  BlogPost,
  SiteSettings,
  AboutPageContent,
  DeliveryPageContent,
  SiteContent,
} from '../types';

import {
  DEFAULT_SITE_SETTINGS,
  DEFAULT_ABOUT_CONTENT,
  DEFAULT_DELIVERY_CONTENT,
  BLOG_POSTS,
} from '../constants';

import { API_BASE_URL } from './productService';

// ─── Cache ──────────────────────────────────────────────────────────────────
// Simple in-memory cache to avoid re-fetching on every navigation
let cachedContent: SiteContent | null = null;
let cacheTimestamp = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function isCacheValid(): boolean {
  return cachedContent !== null && (Date.now() - cacheTimestamp) < CACHE_TTL;
}

// ─── Fetch Helpers ──────────────────────────────────────────────────────────

async function fetchJSON<T>(endpoint: string, timeoutMs = 8000): Promise<T | null> {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      signal: AbortSignal.timeout(timeoutMs),
    });

    if (!response.ok) {
      throw new Error(`API returned ${response.status} for ${endpoint}`);
    }

    return await response.json();
  } catch (error) {
    console.warn(`Failed to fetch ${endpoint}:`, error);
    return null;
  }
}

// ─── Public API ─────────────────────────────────────────────────────────────

/**
 * Fetch all site content at once.
 * The bot API may provide a single endpoint for everything,
 * or we fetch each section separately.
 */
export async function fetchSiteContent(): Promise<SiteContent> {
  // Return cached content if still valid
  if (isCacheValid()) {
    return cachedContent!;
  }

  // Try fetching all content from a single endpoint first
  const allContent = await fetchJSON<SiteContent>('/api/content');
  if (allContent) {
    cachedContent = {
      settings: allContent.settings || DEFAULT_SITE_SETTINGS,
      about: allContent.about || DEFAULT_ABOUT_CONTENT,
      delivery: allContent.delivery || DEFAULT_DELIVERY_CONTENT,
      blog_posts: allContent.blog_posts?.length > 0 ? allContent.blog_posts : BLOG_POSTS,
    };
    cacheTimestamp = Date.now();
    console.info('Loaded all site content from bot API');
    return cachedContent;
  }

  // If single endpoint fails, try fetching each section separately
  const [settings, about, delivery, blogPosts] = await Promise.all([
    fetchSiteSettings(),
    fetchAboutContent(),
    fetchDeliveryContent(),
    fetchBlogPosts(),
  ]);

  cachedContent = {
    settings,
    about,
    delivery,
    blog_posts: blogPosts,
  };
  cacheTimestamp = Date.now();

  return cachedContent;
}

/**
 * Fetch site settings (contacts, social links, promo text, etc.)
 */
export async function fetchSiteSettings(): Promise<SiteSettings> {
  const data = await fetchJSON<SiteSettings>('/api/settings');
  if (data) {
    console.info('Loaded site settings from bot API');
    return { ...DEFAULT_SITE_SETTINGS, ...data };
  }
  return DEFAULT_SITE_SETTINGS;
}

/**
 * Fetch About page content (hero, mission, stats, values, team).
 */
export async function fetchAboutContent(): Promise<AboutPageContent> {
  const data = await fetchJSON<AboutPageContent>('/api/content/about');
  if (data) {
    console.info('Loaded about page content from bot API');
    return {
      hero_title: data.hero_title || DEFAULT_ABOUT_CONTENT.hero_title,
      hero_description: data.hero_description || DEFAULT_ABOUT_CONTENT.hero_description,
      mission_text: data.mission_text || DEFAULT_ABOUT_CONTENT.mission_text,
      stats: data.stats?.length > 0 ? data.stats : DEFAULT_ABOUT_CONTENT.stats,
      values: data.values?.length > 0 ? data.values : DEFAULT_ABOUT_CONTENT.values,
      team_members: data.team_members?.length > 0 ? data.team_members : DEFAULT_ABOUT_CONTENT.team_members,
    };
  }
  return DEFAULT_ABOUT_CONTENT;
}

/**
 * Fetch Delivery page content (options, steps, payments, FAQ).
 */
export async function fetchDeliveryContent(): Promise<DeliveryPageContent> {
  const data = await fetchJSON<DeliveryPageContent>('/api/content/delivery');
  if (data) {
    console.info('Loaded delivery page content from bot API');
    return {
      hero_title: data.hero_title || DEFAULT_DELIVERY_CONTENT.hero_title,
      hero_description: data.hero_description || DEFAULT_DELIVERY_CONTENT.hero_description,
      delivery_options: data.delivery_options?.length > 0 ? data.delivery_options : DEFAULT_DELIVERY_CONTENT.delivery_options,
      steps: data.steps?.length > 0 ? data.steps : DEFAULT_DELIVERY_CONTENT.steps,
      payment_methods: data.payment_methods?.length > 0 ? data.payment_methods : DEFAULT_DELIVERY_CONTENT.payment_methods,
      faq: data.faq?.length > 0 ? data.faq : DEFAULT_DELIVERY_CONTENT.faq,
    };
  }
  return DEFAULT_DELIVERY_CONTENT;
}

/**
 * Fetch blog posts from the bot API.
 */
export async function fetchBlogPosts(): Promise<BlogPost[]> {
  const data = await fetchJSON<{ posts: BlogPost[] }>('/api/blog');
  if (data?.posts && data.posts.length > 0) {
    console.info(`Loaded ${data.posts.length} blog posts from bot API`);
    return data.posts;
  }
  return BLOG_POSTS;
}

/**
 * Force refresh the cache (e.g. after bot notifies of content change).
 */
export function invalidateContentCache(): void {
  cachedContent = null;
  cacheTimestamp = 0;
}
