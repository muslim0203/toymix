import React from 'react';
import { Rocket, Phone, Mail, MapPin } from 'lucide-react';
import { View, SiteSettings } from '../types';

interface FooterProps {
  onNavigate: (view: View) => void;
  settings?: SiteSettings;
}

const Footer: React.FC<FooterProps> = ({ onNavigate, settings }) => {
  const phone = settings?.phone || '+998 90 123 45 67';
  const email = settings?.email || 'info@toymix.uz';
  const address = settings?.address || 'Toshkent sh., Chilonzor t.';
  const workingHours = settings?.working_hours || 'Har kuni 9:00 - 21:00';
  const instagramUrl = settings?.instagram_url || 'https://instagram.com/toymix.uz';
  const telegramUrl = settings?.telegram_url || 'https://t.me/toymix_uz';
  const whatsappUrl = settings?.whatsapp_url || 'https://wa.me/998901234567';
  const siteDescription = settings?.site_description ||
    "ToyMix — O'zbekistondagi eng yaxshi bolalar o'yinchoqlari onlayn do'koni. Sifatli, xavfsiz va ta'limiy mahsulotlar. Toshkent va barcha viloyatlarga yetkazib berish.";

  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8 mt-20" role="contentinfo">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Logo & About */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-gradient-to-tr from-[#FF6B6B] to-[#FFE66D] p-2 rounded-xl">
                <Rocket className="text-white" size={20} />
              </div>
              <span className="text-xl font-black tracking-tighter">
                <span className="text-[#FF6B6B]">Toy</span>
                <span className="text-[#4ECDC4]">Mix</span>
              </span>
            </div>
            <p className="text-gray-400 text-sm font-medium leading-relaxed">
              {siteDescription}
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-black text-sm uppercase tracking-widest mb-4">Sahifalar</h4>
            <ul className="space-y-3">
              {[
                { label: 'Asosiy', view: 'home' as View },
                { label: 'Katalog', view: 'catalog' as View },
                { label: 'Blog', view: 'blog' as View },
                { label: 'Biz haqimizda', view: 'about' as View },
                { label: 'Yetkazib berish', view: 'delivery' as View },
              ].map((link) => (
                <li key={link.view}>
                  <button
                    onClick={() => onNavigate(link.view)}
                    className="text-gray-400 hover:text-white text-sm font-medium transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-black text-sm uppercase tracking-widest mb-4">Kontakt</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-gray-400 text-sm font-medium">
                <Phone size={16} /> {phone}
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm font-medium">
                <Mail size={16} /> {email}
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm font-medium">
                <MapPin size={16} /> {address}
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-black text-sm uppercase tracking-widest mb-4">Ijtimoiy tarmoqlar</h4>
            <div className="flex gap-3">
              <a href={instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="ToyMix Instagram sahifasi" className="bg-gray-800 hover:bg-[#FF6B6B] p-3 rounded-xl transition-colors text-gray-400 hover:text-white">
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
              <a href={telegramUrl} target="_blank" rel="noopener noreferrer" aria-label="ToyMix Telegram kanali" className="bg-gray-800 hover:bg-[#4D96FF] p-3 rounded-xl transition-colors text-gray-400 hover:text-white">
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
              </a>
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" aria-label="ToyMix WhatsApp orqali bog'lanish" className="bg-gray-800 hover:bg-green-500 p-3 rounded-xl transition-colors text-gray-400 hover:text-white">
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
              </a>
            </div>
            <p className="text-gray-500 text-xs font-medium mt-4">
              {workingHours}
            </p>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center">
          <p className="text-gray-500 text-xs font-bold">
            © {new Date().getFullYear()} ToyMix — O'zbekistondagi bolalar o'yinchoqlari onlayn do'koni. Barcha huquqlar himoyalangan.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
