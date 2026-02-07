import React from 'react';
import { User as UserIcon, Mail, LogOut, ShoppingBag, Heart, Settings, ChevronRight, Package } from 'lucide-react';
import { View } from '../types';

interface ProfileProps {
  userEmail: string;
  onSignOut: () => void;
  onNavigate: (view: View) => void;
}

const Profile: React.FC<ProfileProps> = ({ userEmail, onSignOut, onNavigate }) => {
  const userName = userEmail.split('@')[0];

  return (
    <section className="container mx-auto px-4 py-10">
      <div className="max-w-2xl mx-auto">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-[#4D96FF] to-[#6BA5FF] rounded-[2.5rem] p-8 sm:p-10 text-white text-center mb-8">
          <div className="bg-white/20 backdrop-blur-md w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center border-4 border-white/30">
            <UserIcon size={40} />
          </div>
          <h1 className="text-2xl font-black mb-1">{userName}</h1>
          <p className="text-white/80 font-medium text-sm flex items-center justify-center gap-2">
            <Mail size={14} /> {userEmail}
          </p>
        </div>

        {/* Menu Items */}
        <div className="space-y-3 mb-8">
          {[
            {
              icon: <Package size={22} className="text-[#FF6B6B]" />,
              title: "Buyurtmalarim",
              desc: "Buyurtmalar tarixini ko'rish",
              badge: "Tez kunda",
            },
            {
              icon: <Heart size={22} className="text-pink-500" />,
              title: "Sevimlilar",
              desc: "Saqlangan mahsulotlar",
              badge: "Tez kunda",
            },
            {
              icon: <Settings size={22} className="text-gray-400" />,
              title: "Sozlamalar",
              desc: "Profil sozlamalari",
              badge: "Tez kunda",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-5 toy-shadow flex items-center gap-4 cursor-pointer hover:shadow-lg transition-all"
            >
              <div className="bg-gray-50 p-3 rounded-xl">{item.icon}</div>
              <div className="flex-1">
                <h4 className="font-black text-gray-900 text-sm">{item.title}</h4>
                <p className="text-gray-400 text-xs font-medium">{item.desc}</p>
              </div>
              {item.badge && (
                <span className="bg-gray-100 text-gray-400 text-[10px] font-black px-3 py-1 rounded-full uppercase">
                  {item.badge}
                </span>
              )}
              <ChevronRight size={16} className="text-gray-300" />
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <button
            onClick={() => onNavigate('catalog')}
            className="bg-white rounded-2xl p-6 toy-shadow text-center hover:shadow-lg transition-all"
          >
            <ShoppingBag size={28} className="text-[#4D96FF] mx-auto mb-3" />
            <p className="font-black text-gray-900 text-sm">Xarid qilish</p>
          </button>
          <button
            onClick={() => onNavigate('delivery')}
            className="bg-white rounded-2xl p-6 toy-shadow text-center hover:shadow-lg transition-all"
          >
            <Package size={28} className="text-[#FFD93D] mx-auto mb-3" />
            <p className="font-black text-gray-900 text-sm">Yetkazib berish</p>
          </button>
        </div>

        {/* Sign Out */}
        <button
          onClick={onSignOut}
          className="w-full bg-red-50 hover:bg-red-100 text-red-500 font-black py-4 rounded-2xl flex items-center justify-center gap-3 transition-all"
        >
          <LogOut size={20} /> Chiqish
        </button>
      </div>
    </section>
  );
};

export default Profile;
