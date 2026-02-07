import React, { useState, useMemo, useEffect } from 'react';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { auth } from './services/firebaseService';
import { fetchProducts } from './services/productService';
import { fetchSiteContent } from './services/contentService';
import Header from './components/Header';
import ProductCard from './components/ProductCard';
import CartDrawer from './components/CartDrawer';
import AIAdvisor from './components/AIAdvisor';
import Login from './components/Login';
import Catalog from './components/Catalog';
import Blog from './components/Blog';
import About from './components/About';
import Delivery from './components/Delivery';
import Checkout from './components/Checkout';
import Profile from './components/Profile';
import Footer from './components/Footer';
import { useToast } from './components/Toast';
import { Toy, CartItem, Category, View, SiteContent } from './types';
import { TOYS, BLOG_POSTS, DEFAULT_SITE_SETTINGS, DEFAULT_ABOUT_CONTENT, DEFAULT_DELIVERY_CONTENT } from './constants';
import {
  ChevronRight, ArrowRight, Sparkles, Rocket,
  Truck, ShieldCheck, Star, Baby, Brain, Car, ToyBrick, Bot, Gift,
  CheckCircle2, ShoppingBag, Loader2
} from 'lucide-react';

/**
 * ProductGallery — displays multiple product images with thumbnail navigation.
 * Used in the product detail view to show all images from the bot.
 */
function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const mainImage = images[activeIndex] || images[0];

  return (
    <div className="space-y-6">
      <div className="aspect-square bg-gray-50 rounded-[2.5rem] overflow-hidden border border-gray-100">
        <img
          src={mainImage}
          alt={name}
          className="w-full h-full object-cover transition-all duration-300"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/600x600?text=Rasm+yuklanmadi';
          }}
        />
      </div>
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-4">
          {images.slice(0, 8).map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`aspect-square bg-gray-50 rounded-2xl overflow-hidden border-2 transition-all ${
                i === activeIndex ? 'border-[#FF6B6B] ring-2 ring-[#FF6B6B]/20' : 'border-transparent hover:border-[#FF6B6B]/50'
              }`}
            >
              <img
                src={img}
                alt={`${name} - rasm ${i + 1}`}
                className={`w-full h-full object-cover transition-opacity ${
                  i === activeIndex ? 'opacity-100' : 'opacity-60 hover:opacity-100'
                }`}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150x150?text=...';
                }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function App() {
  const { showToast } = useToast();

  // Auth state
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // App state
  const [currentView, setCurrentView] = useState<View>('home');
  const [selectedToy, setSelectedToy] = useState<Toy | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<Category>(Category.ALL);

  // Products state — loaded from bot API
  const [allToys, setAllToys] = useState<Toy[]>(TOYS);
  const [productsLoading, setProductsLoading] = useState(true);

  // Site content state — loaded from bot API (blog, about, delivery, settings)
  const [siteContent, setSiteContent] = useState<SiteContent>({
    settings: DEFAULT_SITE_SETTINGS,
    about: DEFAULT_ABOUT_CONTENT,
    delivery: DEFAULT_DELIVERY_CONTENT,
    blog_posts: BLOG_POSTS,
  });

  // Load products from the bot API
  useEffect(() => {
    let cancelled = false;
    setProductsLoading(true);
    fetchProducts()
      .then((toys) => {
        if (!cancelled) {
          setAllToys(toys);
          setProductsLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setAllToys(TOYS);
          setProductsLoading(false);
        }
      });
    return () => { cancelled = true; };
  }, []);

  // Load site content from the bot API (blog, about, delivery, settings)
  useEffect(() => {
    let cancelled = false;
    fetchSiteContent()
      .then((content) => {
        if (!cancelled) {
          setSiteContent(content);
        }
      })
      .catch(() => {
        // Fallback already set as default state
      });
    return () => { cancelled = true; };
  }, []);

  // Trending toys — products marked as popular
  const trendingToys = useMemo(() => allToys.filter(t => t.isPopular), [allToys]);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Sign out handler
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setCurrentView('home');
      setCart([]);
      showToast("Muvaffaqiyatli chiqdingiz", "info");
    } catch (error) {
      console.error('Sign out error:', error);
      showToast("Chiqishda xatolik yuz berdi", "error");
    }
  };

  // Filter toys based on search and category
  const filteredToys = useMemo(() => {
    return allToys.filter(toy => {
      const matchesSearch = toy.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === Category.ALL || toy.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [allToys, searchQuery, activeCategory]);

  // Cart functions (requires authentication)
  const addToCart = (toy: Toy, event?: React.MouseEvent) => {
    if (!user) {
      showToast("Savatga qo'shish uchun tizimga kiring", 'error');
      setCurrentView('checkout'); // triggers login redirect
      return;
    }
    setCart(prev => {
      const existing = prev.find(item => item.id === toy.id);
      if (existing) {
        return prev.map(item =>
          item.id === toy.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...toy, quantity: 1 }];
    });
    showToast(`${toy.name} savatga qo'shildi`, 'cart');
  };

  const updateCartQuantity = (id: string, delta: number) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.id === id) {
          const newQuantity = item.quantity + delta;
          if (newQuantity <= 0) return item; // Will be handled by filter below
          return { ...item, quantity: newQuantity };
        }
        return item;
      }).filter(item => {
        if (item.id === id && item.quantity + delta <= 0) return false;
        return true;
      });
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  // Navigation
  const handleNavigate = (view: View, category?: Category) => {
    setCurrentView(view);
    if (category) setActiveCategory(category);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openProductDetail = (toy: Toy) => {
    setSelectedToy(toy);
    setCurrentView('product-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    setCurrentView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Total cart count
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // --- Auth Loading Screen ---
  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F7F9FC]">
        <div className="bg-gradient-to-tr from-[#FF6B6B] to-[#FFE66D] p-4 rounded-2xl shadow-lg mb-6">
          <Rocket className="text-white animate-bounce" size={36} />
        </div>
        <div className="flex items-center gap-3">
          <Loader2 className="animate-spin text-[#4D96FF]" size={24} />
          <span className="font-black text-gray-400 text-sm uppercase tracking-widest">Yuklanmoqda...</span>
        </div>
      </div>
    );
  }

  // --- Public/Private View Logic ---
  // Public pages are visible to everyone (including Googlebot) for SEO
  const publicViews: View[] = ['home', 'catalog', 'blog', 'about', 'delivery', 'product-detail'];
  const isPublicView = publicViews.includes(currentView);

  // Redirect to login only for private actions (checkout, profile) if not authenticated
  const requiresAuth = !isPublicView && !user;
  if (requiresAuth) {
    return <Login />;
  }

  // --- Main App (public pages + authenticated pages) ---

  const renderHome = () => (
    <>
      {/* Hero Banner - SEO optimized */}
      <section className="relative pt-10 pb-20 px-4 overflow-hidden bg-white" aria-label="Bosh sahifa banneri">
        <div className="container mx-auto relative z-10 flex flex-col lg:flex-row items-center gap-10">
          <div className="flex-1 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-[#FFD93D]/20 text-yellow-700 px-4 py-1.5 rounded-full font-black text-xs uppercase tracking-widest border border-[#FFD93D]/30">
              🎁 Yangi Mavsum To'plami
            </div>
            <h1 className="text-5xl lg:text-7xl font-black leading-[1.1] text-gray-900 tracking-tighter">
              ToyMix — Bolalar O'yinchoqlari <br />
              <span className="text-[#FF6B6B]">Onlayn Do'koni O'zbekistonda!</span>
            </h1>
            <p className="text-lg text-gray-500 font-medium max-w-lg mx-auto lg:mx-0">
              Har bir o'yinchoq farzandingiz uchun yangi kashfiyot. Sifatli, xavfsiz va ta'limiy o'yinchoqlar Toshkent bo'ylab 24 soatda yetkazib beriladi!
            </p>
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              <button
                onClick={() => handleNavigate('catalog')}
                className="toy-bounce bg-[#FF6B6B] text-white font-black px-10 py-4 rounded-2xl shadow-xl shadow-red-100 flex items-center gap-3 text-lg"
              >
                Hozir xarid qilish <ArrowRight size={20} />
              </button>
            </div>
          </div>
          <div className="flex-1 relative">
            <div className="absolute -inset-10 bg-gradient-to-tr from-[#FF6B6B]/10 to-[#4D96FF]/10 blur-3xl rounded-full"></div>
            <img
              src="https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&q=80&w=600"
              alt="ToyMix bolalar o'yinchoqlari do'koni - xavfsiz va ta'limiy o'yinchoqlar O'zbekiston"
              className="rounded-[3rem] shadow-2xl border-[10px] border-white relative z-10 animate-float"
              loading="eager"
              width="600"
              height="600"
            />
          </div>
        </div>
      </section>

      {/* Kategoriyalar - SEO uchun h2 qo'shildi */}
      <section className="container mx-auto px-4 py-16" aria-label="O'yinchoq kategoriyalari">
        <h2 className="sr-only">O'yinchoq kategoriyalari - Bolalar uchun eng yaxshi tanlov</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {[
            { label: 'Kichkintoylar', icon: <Baby />, color: 'bg-pink-100 text-[#FF6B6B]', cat: Category.AGE_0_3 },
            { label: "Ta'limiy", icon: <Brain />, color: 'bg-blue-100 text-[#4D96FF]', cat: Category.EDUCATIONAL },
            { label: 'Mashinalar', icon: <Car />, color: 'bg-yellow-100 text-[#FFD93D]', cat: Category.BOYS },
            { label: 'Yumshoq', icon: <ToyBrick />, color: 'bg-green-100 text-green-500', cat: Category.SOFT },
            { label: 'Robotlar', icon: <Bot />, color: 'bg-purple-100 text-purple-500', cat: Category.TECH },
            { label: "Sovg'alar", icon: <Gift />, color: 'bg-orange-100 text-orange-500', cat: Category.ALL },
          ].map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleNavigate('catalog', item.cat)}
              className="group bg-white p-6 rounded-[2.5rem] toy-shadow border border-gray-50 flex flex-col items-center gap-4 hover:scale-105 transition-all"
            >
              <div className={`w-16 h-16 rounded-2xl ${item.color} flex items-center justify-center group-hover:rotate-6 transition-transform`}>
                {React.cloneElement(item.icon as React.ReactElement<any>, { size: 32 })}
              </div>
              <span className="font-black text-[11px] uppercase tracking-widest text-gray-600">{item.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Ommabop o'yinchoqlar */}
      <section className="container mx-auto px-4 py-10" aria-label="Trendda - Eng mashhur bolalar o'yinchoqlari">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-black flex items-center gap-3">
            <span className="text-[#FFD93D]">🔥</span> Trendda — Eng ommabop o'yinchoqlar
          </h2>
          <button onClick={() => handleNavigate('catalog')} className="text-[#4D96FF] font-bold text-sm hover:underline">Hammasini ko'rish</button>
        </div>
        {productsLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="animate-spin text-[#4D96FF]" size={32} />
            <span className="ml-3 font-bold text-gray-400">Mahsulotlar yuklanmoqda...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {(trendingToys.length > 0 ? trendingToys : allToys.slice(0, 4)).map(toy => (
              <ProductCard key={toy.id} toy={toy} onAddToCart={(t, e) => addToCart(t, e)} onViewDetails={openProductDetail} />
            ))}
          </div>
        )}
      </section>

      {/* Aksiya Banner */}
      <section className="container mx-auto px-4 py-12">
        <div className="bg-gradient-to-r from-[#FF6B6B] to-[#FFD93D] rounded-[3rem] p-10 md:p-16 flex flex-col md:flex-row items-center justify-between text-white overflow-hidden relative">
          <div className="relative z-10 max-w-lg text-center md:text-left">
            <span className="bg-white/20 px-3 py-1 rounded-full text-[10px] font-black uppercase mb-4 inline-block">Mavsumiy Chegirma</span>
            <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">Ikkinchi o'yinchoq uchun <br /> -50% CHEGIRMA!</h2>
            <button onClick={() => handleNavigate('catalog')} className="bg-white text-[#FF6B6B] font-black px-8 py-3.5 rounded-2xl shadow-xl hover:scale-105 transition-all">
              Katalogga o'tish
            </button>
          </div>
          <div className="relative z-10 hidden md:block">
            <img src="https://images.unsplash.com/photo-1594608661623-aa0bd3a69d98?auto=format&fit=crop&q=80&w=300" className="w-64 h-64 rounded-full border-8 border-white/20 object-cover" alt="ToyMix mavsumiy chegirma - ikkinchi o'yinchoqga 50% chegirma" loading="lazy" width="300" height="300" />
          </div>
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        </div>
      </section>

      {/* Nima uchun ToyMix? - SEO Trust Signals */}
      <section className="container mx-auto px-4 py-20" aria-label="ToyMix ustunliklari">
        <h2 className="text-3xl font-black text-center mb-12">Nima uchun ToyMix - O'zbekistonning ishonchli o'yinchoqlar do'koni?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            { title: "Sifat Kafolati", desc: "Barcha mahsulotlarimiz xalqaro sertifikatlarga ega va bolalar uchun 100% xavfsiz.", icon: <ShieldCheck size={40} className="text-green-500" /> },
            { title: "Tez Yetkazib Berish", desc: "Buyurtmangizni Toshkent bo'ylab 24 soat ichida uyingizgacha yetkazib beramiz.", icon: <Truck size={40} className="text-[#4D96FF]" /> },
            { title: "Xavfsiz O'yinchoqlar", desc: "O'tkir qirralarsiz, hidsiz va ekologik toza materiallardan tayyorlangan.", icon: <CheckCircle2 size={40} className="text-[#FF6B6B]" /> },
          ].map((item, i) => (
            <div key={i} className="bg-white p-10 rounded-[3rem] text-center toy-shadow flex flex-col items-center gap-6">
              <div className="bg-gray-50 p-6 rounded-full">{item.icon}</div>
              <h3 className="text-xl font-black text-gray-900">{item.title}</h3>
              <p className="text-gray-500 font-medium text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );

  const renderProductDetail = () => {
    if (!selectedToy) return null;

    // Collect all available images
    const productImages = selectedToy.images && selectedToy.images.length > 0
      ? selectedToy.images
      : [selectedToy.image];

    return (
      <section className="container mx-auto px-4 py-12">
        <button onClick={() => handleNavigate('home')} className="mb-8 flex items-center gap-2 text-gray-400 font-bold hover:text-[#FF6B6B] transition-colors">
          <ChevronRight className="rotate-180" size={18} /> Ortga qaytish
        </button>

        <div className="bg-white rounded-[3rem] toy-shadow p-6 lg:p-12 grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Gallery View — shows real images from bot */}
          <ProductGallery images={productImages} name={selectedToy.name} />

          {/* Product Info */}
          <div className="space-y-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-[#FFD93D]/20 text-yellow-700 px-3 py-1 rounded-full text-[10px] font-black uppercase">{selectedToy.ageRange} bolalar uchun</span>
                <span className="text-[#4D96FF] font-black text-[10px] uppercase tracking-widest">{selectedToy.category}</span>
              </div>
              <h1 className="text-4xl font-black text-gray-900 mb-2">{selectedToy.name}</h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 text-[#FFD93D]">
                  <Star fill="currentColor" size={18} />
                  <span className="font-black text-gray-900">{selectedToy.rating}</span>
                </div>
                <span className="text-gray-400 font-bold text-sm">({selectedToy.reviewsCount || 0} ta sharh)</span>
              </div>
            </div>

            <div className="text-4xl font-black text-[#FF6B6B]">
              {selectedToy.price.toLocaleString()} <small className="text-sm">uzs</small>
            </div>

            <p className="text-gray-500 font-medium leading-relaxed">
              {selectedToy.description}
            </p>

            {/* Colors */}
            {selectedToy.colors && (
              <div className="space-y-3">
                <h4 className="text-sm font-black text-gray-900">Mavjud ranglar:</h4>
                <div className="flex gap-3">
                  {selectedToy.colors.map(color => (
                    <button key={color} className="w-10 h-10 rounded-full border-4 border-white shadow-md ring-1 ring-gray-100" style={{ backgroundColor: color }}></button>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                onClick={(e) => addToCart(selectedToy, e)}
                className="toy-bounce flex-1 bg-[#4D96FF] text-white font-black py-5 rounded-2xl shadow-xl shadow-blue-50 flex items-center justify-center gap-3"
              >
                <ShoppingBag size={22} /> Savatga qo'shish
              </button>
              <button
                onClick={(e) => { addToCart(selectedToy, e); handleCheckout(); }}
                className="toy-bounce flex-1 bg-gray-900 text-white font-black py-5 rounded-2xl shadow-xl flex items-center justify-center gap-3"
              >
                1 klikda xarid
              </button>
            </div>

            {/* Why ToyMix mini */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-50">
              <div className="flex items-center gap-3">
                <Truck className="text-gray-300" size={24} />
                <span className="text-xs font-bold text-gray-500">24 soatda yetkazish</span>
              </div>
              <div className="flex items-center gap-3">
                <ShieldCheck className="text-gray-300" size={24} />
                <span className="text-xs font-bold text-gray-500">Sifat kafolati</span>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Toys */}
        <div className="mt-20">
          <h2 className="text-2xl font-black mb-10">O'xshash mahsulotlar</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {allToys
              .filter(t => t.id !== selectedToy.id && t.category === selectedToy.category)
              .slice(0, 4)
              .concat(allToys.filter(t => t.id !== selectedToy.id).slice(0, 4))
              .slice(0, 4)
              .map(toy => (
                <ProductCard key={toy.id} toy={toy} onAddToCart={(t, e) => addToCart(t, e)} onViewDetails={openProductDetail} />
              ))}
          </div>
        </div>
      </section>
    );
  };

  // Render current view
  const renderCurrentView = () => {
    switch (currentView) {
      case 'home':
        return renderHome();
      case 'catalog':
        return (
          <Catalog
            toys={filteredToys}
            activeCategory={activeCategory}
            searchQuery={searchQuery}
            onCategoryChange={(cat) => setActiveCategory(cat)}
            onSearchChange={(query) => setSearchQuery(query)}
            onAddToCart={addToCart}
            onViewDetails={openProductDetail}
          />
        );
      case 'product-detail':
        return renderProductDetail();
      case 'blog':
        return <Blog posts={siteContent.blog_posts} />;
      case 'about':
        return <About content={siteContent.about} />;
      case 'delivery':
        return <Delivery content={siteContent.delivery} />;
      case 'checkout':
        return (
          <Checkout
            items={cart}
            onNavigate={handleNavigate}
            onOrderComplete={clearCart}
          />
        );
      case 'profile':
        return user ? (
          <Profile
            userEmail={user.email || ''}
            onSignOut={handleSignOut}
            onNavigate={handleNavigate}
          />
        ) : <Login />;
      default:
        return renderHome();
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        cartCount={cartCount}
        onCartClick={() => setIsCartOpen(true)}
        onSearch={(query) => {
          setSearchQuery(query);
          if (currentView !== 'catalog') {
            setCurrentView('catalog');
          }
        }}
        onNavigate={handleNavigate}
        currentView={currentView}
        userEmail={user?.email || ''}
        onSignOut={user ? handleSignOut : undefined}
        promoBannerText={siteContent.settings.promo_banner_text}
      />

      <main className="flex-1">
        {renderCurrentView()}
      </main>

      <Footer onNavigate={handleNavigate} settings={siteContent.settings} />

      {/* SEO: Structured Data - JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "ToyMix",
            "url": "https://toymix-14889.web.app",
            "description": "O'zbekistondagi eng yaxshi bolalar o'yinchoqlari onlayn do'koni",
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://toymix-14889.web.app/catalog?q={search_term_string}",
              "query-input": "required name=search_term_string"
            }
          })
        }}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={updateCartQuantity}
        onRemove={removeFromCart}
        onCheckout={handleCheckout}
      />

      <AIAdvisor />
    </div>
  );
}
