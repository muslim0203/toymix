import React, { useState } from 'react';
import { ShoppingCart, Search, User, Rocket, Menu, X, ChevronDown, LogOut } from 'lucide-react';
import { View, Category } from '../types';

interface HeaderProps {
  cartCount: number;
  onCartClick: () => void;
  onSearch: (query: string) => void;
  onNavigate: (view: View, category?: Category) => void;
  currentView: View;
  userEmail?: string;
  onSignOut?: () => void;
  promoBannerText?: string;
}

const Header: React.FC<HeaderProps> = ({ cartCount, onCartClick, onSearch, onNavigate, currentView, userEmail, onSignOut, promoBannerText }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Asosiy', view: 'home' as View },
    { label: 'Katalog', view: 'catalog' as View },
    { label: 'Blog', view: 'blog' as View },
    { label: 'Biz haqimizda', view: 'about' as View },
    { label: 'Yetkazib berish', view: 'delivery' as View },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm" role="banner">
      {/* Top Bar */}
      <div className="bg-[#A29BFE] py-2 px-4 text-center text-white text-[10px] font-black uppercase tracking-[0.2em] hidden sm:block">
        {promoBannerText || "300,000 so'mdan yuqori xaridlar uchun yetkazib berish bepul! 🚚"}
      </div>

      <div className="container mx-auto px-4 h-20 flex items-center justify-between gap-4">
        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden p-2 text-gray-500"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Logo */}
        <div
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => onNavigate('home')}
        >
          <div className="bg-gradient-to-tr from-[#FF6B6B] to-[#FFE66D] p-2 rounded-xl shadow-lg group-hover:rotate-12 transition-transform">
            <Rocket className="text-white" size={20} />
          </div>
          <span className="text-xl font-black tracking-tighter">
            <span className="text-[#FF6B6B]">Toy</span>
            <span className="text-[#4ECDC4]">Mix</span>
          </span>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8" aria-label="Asosiy menyu">
          {navLinks.map((link) => (
            <button
              key={link.view}
              onClick={() => onNavigate(link.view)}
              className={`text-sm font-bold transition-all hover:text-[#FF6B6B] ${
                currentView === link.view ? 'text-[#FF6B6B]' : 'text-gray-500'
              }`}
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="hidden md:flex relative group items-center">
            <input
              type="text"
              placeholder="Qidirish..."
              className="bg-gray-100 border-2 border-transparent rounded-full py-2 px-10 focus:outline-none focus:bg-white focus:border-[#4ECDC4] transition-all text-xs font-medium w-40 focus:w-60"
              onChange={(e) => onSearch(e.target.value)}
            />
            <Search className="absolute left-3 text-gray-400" size={16} />
          </div>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="p-2 text-gray-400 hover:text-[#FF6B6B] transition-all relative"
            >
              <User size={22} />
              {userEmail && (
                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-white"></span>
              )}
            </button>

            {isUserMenuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsUserMenuOpen(false)} />
                <div className="absolute right-0 top-full mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 w-64 z-50">
                  {userEmail && (
                    <div className="px-4 py-3 border-b border-gray-50">
                      <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Hisob</p>
                      <p className="text-sm font-bold text-gray-700 truncate mt-1">{userEmail}</p>
                    </div>
                  )}
                  <button
                    onClick={() => { onNavigate('profile'); setIsUserMenuOpen(false); }}
                    className="w-full text-left px-4 py-3 text-sm font-bold text-gray-600 hover:bg-gray-50 hover:text-[#FF6B6B] transition-colors flex items-center gap-3"
                  >
                    <User size={16} /> Profil
                  </button>
                  {onSignOut && (
                    <button
                      onClick={() => { onSignOut(); setIsUserMenuOpen(false); }}
                      className="w-full text-left px-4 py-3 text-sm font-bold text-red-400 hover:bg-red-50 transition-colors flex items-center gap-3"
                    >
                      <LogOut size={16} /> Chiqish
                    </button>
                  )}
                </div>
              </>
            )}
          </div>

          <button
            onClick={onCartClick}
            className="toy-bounce relative p-2.5 bg-[#4ECDC4] text-white rounded-2xl shadow-lg shadow-teal-50 flex items-center gap-2"
          >
            <ShoppingCart size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#FF6B6B] text-white text-[10px] font-black rounded-full w-5 h-5 flex items-center justify-center border-2 border-white">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-20 left-0 w-full bg-white border-b border-gray-100 p-6 flex flex-col gap-4 shadow-lg z-40">
          {navLinks.map((link) => (
            <button
              key={link.view}
              onClick={() => {
                onNavigate(link.view);
                setIsMobileMenuOpen(false);
              }}
              className="text-left py-3 border-b border-gray-50 font-black text-gray-600 flex justify-between items-center"
            >
              {link.label}
              <ChevronDown size={16} className="-rotate-90 text-gray-300" />
            </button>
          ))}
          {userEmail && (
            <div className="pt-2 border-t border-gray-100">
              <p className="text-xs text-gray-400 font-bold mb-2">{userEmail}</p>
              <button
                onClick={() => { onNavigate('profile'); setIsMobileMenuOpen(false); }}
                className="text-left py-2 font-bold text-gray-600 text-sm"
              >
                Profil
              </button>
              {onSignOut && (
                <button
                  onClick={() => { onSignOut(); setIsMobileMenuOpen(false); }}
                  className="text-left py-2 font-bold text-red-400 text-sm flex items-center gap-2"
                >
                  <LogOut size={14} /> Chiqish
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
