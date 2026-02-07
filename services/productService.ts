/**
 * Product Service — fetches product data from the ToyMix bot API server.
 * Falls back to hardcoded constants if the API is unavailable.
 */

import { Toy, Category } from '../types';
import { TOYS } from '../constants';

// ─── Configuration ─────────────────────────────────────────────────────────
// In development, Vite proxies /api/* to the bot API server.
// In production, set VITE_API_BASE_URL to the deployed API URL.
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

// ─── Types from API ────────────────────────────────────────────────────────
interface ApiMediaItem {
  id: number;
  file_id: string;
  media_type: string;
  sort_order: number;
  image_url: string;
}

interface ApiProduct {
  id: number;
  title: string;
  price: string;
  description: string;
  category_id: number | null;
  category_name: string | null;
  is_active: boolean;
  created_at: string | null;
  updated_at: string | null;
  image: string;
  images: string[];
  media: ApiMediaItem[];
}

interface ApiProductListResponse {
  products: ApiProduct[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

interface ApiCategory {
  id: number;
  name: string;
  toy_count: number;
}

interface ApiCategoryListResponse {
  categories: ApiCategory[];
}

// ─── Category Mapping ──────────────────────────────────────────────────────
/**
 * Map a category name from the bot database to the website's Category enum.
 * Uses fuzzy matching for flexibility.
 */
function mapCategoryName(name: string | null): Category {
  if (!name) return Category.ALL;

  const lower = name.toLowerCase();

  // Try to match known categories
  if (lower.includes('konstruktor') || lower.includes('lego') || lower.includes('building'))
    return Category.CONSTRUCTION;
  if (lower.includes('yumshoq') || lower.includes('soft') || lower.includes('plush'))
    return Category.SOFT;
  if (lower.includes('robot') || lower.includes('texnik') || lower.includes('tech') || lower.includes('elektron'))
    return Category.TECH;
  if (lower.includes('qiz') || lower.includes('girl') || lower.includes('barbie') || lower.includes('kukla'))
    return Category.GIRLS;
  if (lower.includes("o'g'il") || lower.includes("o'g'il") || lower.includes('boy') || lower.includes('mashina') || lower.includes('car'))
    return Category.BOYS;
  if (lower.includes("ta'lim") || lower.includes('educ') || lower.includes('learning'))
    return Category.EDUCATIONAL;
  if (lower.includes('0-3') || lower.includes('baby') || lower.includes('chaqaloq'))
    return Category.AGE_0_3;
  if (lower.includes('4-7') || lower.includes('kichkina'))
    return Category.AGE_4_7;
  if (lower.includes('8+') || lower.includes('katta'))
    return Category.AGE_8_PLUS;

  return Category.ALL;
}

/**
 * Parse a price string like "350 000", "350000", "350,000 so'm" → number.
 */
function parsePrice(priceStr: string): number {
  // Remove all non-digit characters, then parse
  const digits = priceStr.replace(/[^\d]/g, '');
  return parseInt(digits, 10) || 0;
}

/**
 * Convert an API product to the website's Toy interface.
 */
function apiProductToToy(product: ApiProduct): Toy {
  const category = mapCategoryName(product.category_name);

  return {
    id: String(product.id),
    name: product.title,
    description: product.description,
    price: parsePrice(product.price),
    categoryId: product.category_id ? String(product.category_id) : 'uncategorized',
    category,
    image: product.image,
    images: product.images.length > 0 ? product.images : undefined,
    rating: 4.5 + Math.random() * 0.5, // Default rating (bot doesn't track this)
    ageRange: guessAgeRange(product.title, product.description, category),
    inventoryCount: 50, // Default — bot doesn't track inventory
    isNew: isRecentProduct(product.created_at),
    isPopular: false, // Will be set below based on position
    reviewsCount: Math.floor(Math.random() * 100) + 10,
  };
}

/**
 * Guess appropriate age range from product info.
 */
function guessAgeRange(title: string, description: string, category: Category): string {
  const text = (title + ' ' + description).toLowerCase();

  if (text.includes('0-3') || text.includes('chaqaloq') || text.includes('baby'))
    return '0-3 yosh';
  if (text.includes('4-7') || text.includes('4-6') || text.includes('5-7'))
    return '4-7 yosh';
  if (text.includes('8+') || text.includes('8-12') || text.includes('katta'))
    return '8+ yosh';
  if (text.includes('3-10') || text.includes('3-8'))
    return '3-10 yosh';

  // Infer from category
  switch (category) {
    case Category.AGE_0_3: return '0-3 yosh';
    case Category.AGE_4_7: return '4-7 yosh';
    case Category.AGE_8_PLUS: return '8+ yosh';
    case Category.TECH: return '8+ yosh';
    case Category.SOFT: return '0-3 yosh';
    case Category.CONSTRUCTION: return '3-10 yosh';
    default: return '3+ yosh';
  }
}

/**
 * Check if a product was created within the last 14 days.
 */
function isRecentProduct(createdAt: string | null): boolean {
  if (!createdAt) return false;
  try {
    const created = new Date(createdAt);
    const now = new Date();
    const diffDays = (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24);
    return diffDays <= 14;
  } catch {
    return false;
  }
}

// ─── Public API ────────────────────────────────────────────────────────────

/**
 * Fetch all products from the API. Falls back to hardcoded data on failure.
 */
export async function fetchProducts(): Promise<Toy[]> {
  try {
    const apiBaseUrl = getApiImageBaseUrl();
    const url = `${API_BASE_URL}/api/products?page=1&page_size=200&base_url=${encodeURIComponent(apiBaseUrl)}`;

    const response = await fetch(url, {
      signal: AbortSignal.timeout(10000), // 10s timeout
    });

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    const data: ApiProductListResponse = await response.json();

    if (!data.products || data.products.length === 0) {
      console.warn('API returned no products, using fallback data');
      return TOYS;
    }

    const toys = data.products.map(apiProductToToy);

    // Mark first few as popular
    toys.slice(0, Math.min(4, toys.length)).forEach(t => {
      t.isPopular = true;
    });

    console.info(`Loaded ${toys.length} products from ToyMix bot API`);
    return toys;

  } catch (error) {
    console.warn('Failed to fetch from API, using fallback data:', error);
    return TOYS;
  }
}

/**
 * Fetch product categories from the API.
 */
export async function fetchCategories(): Promise<ApiCategory[]> {
  try {
    const url = `${API_BASE_URL}/api/categories`;
    const response = await fetch(url, {
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) throw new Error(`API returned ${response.status}`);

    const data: ApiCategoryListResponse = await response.json();
    return data.categories;

  } catch (error) {
    console.warn('Failed to fetch categories:', error);
    return [];
  }
}

/**
 * Fetch a single product by ID.
 */
export async function fetchProductById(productId: string): Promise<Toy | null> {
  try {
    const apiBaseUrl = getApiImageBaseUrl();
    const url = `${API_BASE_URL}/api/products/${productId}?base_url=${encodeURIComponent(apiBaseUrl)}`;

    const response = await fetch(url, {
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) return null;

    const product: ApiProduct = await response.json();
    return apiProductToToy(product);

  } catch {
    return null;
  }
}

/**
 * Determine the base URL used for image links in API responses.
 */
function getApiImageBaseUrl(): string {
  // If a custom API URL is set, use that
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  // In dev, the proxy rewrites /api → localhost:8000, but images are served
  // directly from the API server, so we need the real URL
  return import.meta.env.VITE_API_IMAGE_BASE_URL || 'http://localhost:8000';
}
