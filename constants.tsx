
import {
  Toy,
  Category,
  BlogPost,
  SiteSettings,
  AboutPageContent,
  DeliveryPageContent,
} from './types';

export const TOYS: Toy[] = [
  {
    id: '1',
    name: 'Magnitli Konstruktor 100 dona',
    description: 'Bolalar tasavvurini rivojlantirish uchun rangli magnitli detallar to\'plami. Yuqori sifatli ABS plastikdan tayyorlangan, magnitlari juda kuchli.',
    price: 350000,
    // Fix: Added required categoryId and inventoryCount properties
    categoryId: 'construction-100',
    category: Category.CONSTRUCTION,
    image: 'https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?auto=format&fit=crop&q=80&w=600',
    rating: 4.8,
    ageRange: '3-10 yosh',
    inventoryCount: 45,
    isPopular: true,
    colors: ['#FF6B6B', '#4D96FF', '#FFD93D'],
    reviewsCount: 128
  },
  {
    id: '2',
    name: 'Gapiradigan Ayiqcha Teddy',
    description: 'Yumshoq va do\'stona ayiqcha. U 5 xil qo\'shiq aytadi va bolangizning ismini takrorlashi mumkin.',
    price: 120000,
    // Fix: Added required categoryId and inventoryCount properties
    categoryId: 'soft-teddy',
    category: Category.SOFT,
    image: 'https://images.unsplash.com/photo-1559440666-3f945637b0c4?auto=format&fit=crop&q=80&w=600',
    rating: 4.5,
    ageRange: '0-3 yosh',
    inventoryCount: 30,
    isPopular: true,
    colors: ['#D2B48C', '#F5F5DC'],
    reviewsCount: 45
  },
  {
    id: '3',
    name: 'Robot-Panda Aqlli Hamroh',
    description: 'Dasturlash asoslarini o\'rgatuvchi aqlli robot panda. Ovozli buyruqlarni bajaradi va raqsga tushadi.',
    price: 450000,
    // Fix: Added required categoryId and inventoryCount properties
    categoryId: 'robot-panda',
    category: Category.TECH,
    image: 'https://images.unsplash.com/photo-1531608139434-1912ae0713cd?auto=format&fit=crop&q=80&w=600',
    rating: 4.9,
    ageRange: '8+ yosh',
    inventoryCount: 12,
    isNew: true,
    colors: ['#FFFFFF', '#000000'],
    reviewsCount: 89
  },
  {
    id: '4',
    name: 'Lego City Politsiya Markazi',
    description: 'Klassik konstruktor to\'plami. Bolalarda mantiqiy fikrlash va nozik motorikani rivojlantiradi.',
    price: 280000,
    // Fix: Added required categoryId and inventoryCount properties
    categoryId: 'lego-police',
    category: Category.BOYS,
    image: 'https://images.unsplash.com/photo-1584447128309-b66b7a4d1b63?auto=format&fit=crop&q=80&w=600',
    rating: 4.7,
    ageRange: '4-7 yosh',
    inventoryCount: 25,
    colors: ['#003366', '#FFFFFF'],
    reviewsCount: 210
  },
  {
    id: '5',
    name: 'Barbie Orzuidagi Uy',
    description: '3 qavatli, 8 ta xonali va liftli qo\'g\'irchoqlar uyi. Barcha aksessuarlari bilan birga.',
    price: 600000,
    // Fix: Added required categoryId and inventoryCount properties
    categoryId: 'barbie-dream',
    category: Category.GIRLS,
    image: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&q=80&w=600',
    rating: 4.6,
    ageRange: '4-7 yosh',
    inventoryCount: 8,
    discount: 15,
    colors: ['#FFC0CB', '#FFFFFF'],
    reviewsCount: 76
  }
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'b1',
    title: 'O\'yinchoq tanlashda nimalarga e\'tibor berish kerak?',
    excerpt: 'Bolaning yoshi va qiziqishlariga mos o\'yinchoq tanlash bo\'yicha mutaxassis maslahatlari.',
    image: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&q=80&w=600',
    date: '12-May, 2024',
    author: 'Dr. Madina'
  },
  {
    id: 'b2',
    title: 'Nima uchun sifatli o\'yinchoq muhim?',
    excerpt: 'Xavfsiz materiallar va bolalar salomatligi o\'rtasidagi bog\'liqlik haqida.',
    image: 'https://images.unsplash.com/photo-1566004113932-578598e05c6b?auto=format&fit=crop&q=80&w=600',
    date: '10-May, 2024',
    author: 'Aziza Rahimova'
  }
];

export const TRENDING_TOYS = TOYS.filter(t => t.isPopular);

// ─── Default Site Settings (fallback when bot API is unavailable) ───────────

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  phone: '+998 90 123 45 67',
  email: 'info@toymix.uz',
  address: 'Toshkent sh., Chilonzor t.',
  working_hours: 'Har kuni 9:00 - 21:00',
  instagram_url: 'https://instagram.com/toymix.uz',
  telegram_url: 'https://t.me/toymix_uz',
  whatsapp_url: 'https://wa.me/998901234567',
  promo_banner_text: "300,000 so'mdan yuqori xaridlar uchun yetkazib berish bepul! 🚚",
  free_delivery_threshold: 300000,
  site_description:
    "ToyMix — O'zbekistondagi eng yaxshi bolalar o'yinchoqlari onlayn do'koni. Sifatli, xavfsiz va ta'limiy mahsulotlar. Toshkent va barcha viloyatlarga yetkazib berish.",
};

// ─── Default About Page Content (fallback) ──────────────────────────────────

export const DEFAULT_ABOUT_CONTENT: AboutPageContent = {
  hero_title: "ToyMix Haqida — O'zbekistondagi Bolalar O'yinchoqlari Do'koni",
  hero_description:
    "ToyMix — O'zbekistondagi eng ishonchli bolalar o'yinchoqlari onlayn do'koni. Biz har bir bolaning tabassumini qadrlaymiz. Sifatli, xavfsiz va ta'limiy o'yinchoqlar.",
  mission_text:
    "Har bir bolaga sifatli, xavfsiz va rivojlantiruvchi o'yinchoqlarni yetkazish. Biz bolalarning quvonchi va ota-onalarning xotirjamligini ta'minlaymiz.",
  stats: [
    { number: '5000+', label: 'Mamnun mijozlar' },
    { number: '500+', label: 'Mahsulotlar' },
    { number: '3 yil', label: 'Tajriba' },
    { number: '24/7', label: "Qo'llab-quvvatlash" },
  ],
  values: [
    {
      title: 'Xavfsizlik',
      description:
        "Barcha o'yinchoqlarimiz xalqaro xavfsizlik standartlariga javob beradi. Bolalar uchun 100% xavfsiz materiallardan tayyorlangan.",
      icon_name: 'shield',
    },
    {
      title: 'Sifat',
      description:
        "Faqat eng yaxshi brendlar va ishonchli ishlab chiqaruvchilardan mahsulotlar tanlaymiz.",
      icon_name: 'heart',
    },
    {
      title: 'Mijozlar uchun',
      description:
        "Har bir mijozimiz biz uchun muhim. Tezkor yetkazish va doimiy qo'llab-quvvatlash kafolatlanadi.",
      icon_name: 'users',
    },
  ],
  team_members: [
    {
      name: 'Aziz Karimov',
      role: 'Asoschisi',
      image:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    },
    {
      name: 'Madina Rahimova',
      role: 'Mahsulot menejeri',
      image:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
    },
    {
      name: 'Sardor Toshev',
      role: "Yetkazib berish bo'limi",
      image:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
    },
  ],
};

// ─── Default Delivery Page Content (fallback) ───────────────────────────────

export const DEFAULT_DELIVERY_CONTENT: DeliveryPageContent = {
  hero_title: "O'yinchoqlarni Yetkazib Berish — Toshkent va Viloyatlarga",
  hero_description:
    "Tez va ishonchli yetkazib berish xizmati. Toshkent bo'ylab 24 soatda, viloyatlarga 2-3 ish kunida",
  delivery_options: [
    {
      title: "Toshkent shahri bo'ylab",
      items: [
        '24 soat ichida yetkaziladi',
        "300,000 so'mdan yuqori — bepul",
        "300,000 gacha — 25,000 so'm",
      ],
      color: 'blue',
    },
    {
      title: 'Viloyatlarga',
      items: [
        '2-3 ish kuni ichida',
        'Pochta orqali',
        "Narxi: 30,000 - 50,000 so'm",
      ],
      color: 'red',
    },
  ],
  steps: [
    {
      step: '1',
      title: 'Tanlang',
      description: "O'yinchoqni tanlang va savatga qo'shing",
    },
    {
      step: '2',
      title: 'Buyurtma bering',
      description: "Ma'lumotlarni to'ldiring va tasdiqlang",
    },
    {
      step: '3',
      title: 'Yetkazamiz',
      description: 'Tez va xavfsiz yetkazib beramiz',
    },
    {
      step: '4',
      title: 'Quvoning!',
      description: "Farzandingiz yangi o'yinchoqdan zavqlansin",
    },
  ],
  payment_methods: [
    {
      title: 'Naqd pul',
      description: "Yetkazib berilganda to'lash",
      icon_name: 'cash',
    },
    {
      title: 'Karta orqali',
      description: 'Uzcard, Humo, Visa, MasterCard',
      icon_name: 'card',
    },
    {
      title: 'Click / Payme',
      description: "Onlayn to'lov tizimlari",
      icon_name: 'phone',
    },
  ],
  faq: [
    {
      question: 'Buyurtmani qanday kuzataman?',
      answer:
        "Buyurtma berganingizdan so'ng SMS orqali kuzatish raqami yuboriladi.",
    },
    {
      question: 'Qaytarish mumkinmi?',
      answer:
        "Ha, mahsulot yetkazilganidan keyin 3 kun ichida qaytarish mumkin (qutisi ochilmagan bo'lsa).",
    },
    {
      question: 'Yetkazib berish bepulmi?',
      answer:
        "300,000 so'mdan yuqori buyurtmalar uchun Toshkent bo'ylab yetkazish bepul!",
    },
    {
      question: 'Viloyatlarga qancha vaqtda yetadi?',
      answer:
        'Viloyatlarga pochta orqali 2-3 ish kuni ichida yetkaziladi.',
    },
  ],
};
