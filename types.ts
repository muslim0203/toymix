
export enum Category {
  ALL = 'Barchasi',
  AGE_0_3 = '0-3 yosh',
  AGE_4_7 = '4-7 yosh',
  AGE_8_PLUS = '8+ yosh',
  EDUCATIONAL = 'Ta\'limiy',
  TECH = 'Robotlar / Texnika',
  GIRLS = 'Qizlar uchun',
  BOYS = 'O\'g\'il bolalar uchun',
  SOFT = 'Yumshoq',
  CONSTRUCTION = 'Konstruktor'
}

export type OrderStatus = 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';

export type View = 'home' | 'catalog' | 'blog' | 'about' | 'delivery' | 'profile' | 'product-detail' | 'checkout';

export interface Toy {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  category: Category;
  image: string;
  images?: string[];
  rating: number;
  ageRange: string;
  inventoryCount: number;
  isNew?: boolean;
  isPopular?: boolean;
  discount?: number;
  colors?: string[];
  reviewsCount?: number;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: any; // Firestore Timestamp
  shippingAddress: string;
}

export interface CartItem extends Toy {
  quantity: number;
}

export interface AIAdviceRequest {
  age: string;
  interest: string;
  budget: string;
}

// Added missing BlogPost interface to resolve the export error in constants.tsx
export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content?: string;
  image: string;
  date: string;
  author: string;
}

// ─── Site Settings (bot orqali o'zgartiriladi) ────────────────────────────

export interface SiteSettings {
  phone: string;
  email: string;
  address: string;
  working_hours: string;
  instagram_url: string;
  telegram_url: string;
  whatsapp_url: string;
  promo_banner_text: string;
  free_delivery_threshold: number;
  site_description: string;
}

// ─── About Page Content (bot orqali o'zgartiriladi) ───────────────────────

export interface AboutStat {
  number: string;
  label: string;
}

export interface AboutValue {
  title: string;
  description: string;
  icon_name: string; // 'shield' | 'heart' | 'users' | 'star' | etc.
}

export interface TeamMember {
  name: string;
  role: string;
  image: string;
}

export interface AboutPageContent {
  hero_title: string;
  hero_description: string;
  mission_text: string;
  stats: AboutStat[];
  values: AboutValue[];
  team_members: TeamMember[];
}

// ─── Delivery Page Content (bot orqali o'zgartiriladi) ────────────────────

export interface DeliveryOption {
  title: string;
  items: string[];
  color: 'blue' | 'red';
}

export interface PaymentMethod {
  title: string;
  description: string;
  icon_name: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface DeliveryStep {
  step: string;
  title: string;
  description: string;
}

export interface DeliveryPageContent {
  hero_title: string;
  hero_description: string;
  delivery_options: DeliveryOption[];
  steps: DeliveryStep[];
  payment_methods: PaymentMethod[];
  faq: FAQItem[];
}

// ─── All Site Content (bot orqali boshqariladigan barcha ma'lumotlar) ─────

export interface SiteContent {
  settings: SiteSettings;
  about: AboutPageContent;
  delivery: DeliveryPageContent;
  blog_posts: BlogPost[];
}
