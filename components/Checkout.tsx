import React, { useState } from 'react';
import { ChevronRight, MapPin, Phone, User, CreditCard, Truck, CheckCircle2, ShoppingBag } from 'lucide-react';
import { CartItem, View } from '../types';
import { useToast } from './Toast';

interface CheckoutProps {
  items: CartItem[];
  onNavigate: (view: View) => void;
  onOrderComplete: () => void;
}

const Checkout: React.FC<CheckoutProps> = ({ items, onNavigate, onOrderComplete }) => {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: 'tashkent',
    paymentMethod: 'cash',
    comment: '',
  });
  const [orderPlaced, setOrderPlaced] = useState(false);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = subtotal >= 300000 ? 0 : 25000;
  const total = subtotal + deliveryFee;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In future this would save to Firestore
    console.log('Order placed:', { items, formData, total });
    setOrderPlaced(true);
    showToast("Buyurtma muvaffaqiyatli qabul qilindi!", "success");
  };

  if (orderPlaced) {
    return (
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-lg mx-auto text-center">
          <div className="bg-green-50 p-8 rounded-full w-32 h-32 mx-auto mb-8 flex items-center justify-center">
            <CheckCircle2 size={64} className="text-green-500" />
          </div>
          <h1 className="text-3xl font-black text-gray-900 mb-4">Buyurtma qabul qilindi!</h1>
          <p className="text-gray-500 font-medium mb-2">
            Buyurtma raqami: <span className="font-black text-gray-900">#{Date.now().toString().slice(-6)}</span>
          </p>
          <p className="text-gray-400 font-medium mb-8">
            Tez orada operatorimiz siz bilan bog'lanadi va buyurtmani tasdiqlaydi.
          </p>
          <button
            onClick={() => { onOrderComplete(); onNavigate('home'); }}
            className="toy-bounce bg-[#FF6B6B] text-white font-black px-10 py-4 rounded-2xl shadow-xl shadow-red-100"
          >
            Asosiy sahifaga qaytish
          </button>
        </div>
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-lg mx-auto text-center">
          <div className="bg-gray-50 p-8 rounded-full w-32 h-32 mx-auto mb-8 flex items-center justify-center">
            <ShoppingBag size={64} className="text-gray-200" />
          </div>
          <h1 className="text-2xl font-black text-gray-900 mb-4">Savatingiz bo'sh</h1>
          <p className="text-gray-400 font-medium mb-8">Buyurtma berish uchun avval mahsulot tanlang</p>
          <button
            onClick={() => onNavigate('catalog')}
            className="toy-bounce bg-[#4D96FF] text-white font-black px-10 py-4 rounded-2xl shadow-xl shadow-blue-100"
          >
            Katalogga o'tish
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="container mx-auto px-4 py-10">
      {/* Breadcrumb */}
      <button onClick={() => onNavigate('home')} className="mb-8 flex items-center gap-2 text-gray-400 font-bold hover:text-[#FF6B6B] transition-colors">
        <ChevronRight className="rotate-180" size={18} /> Ortga qaytish
      </button>

      <h1 className="text-4xl font-black text-gray-900 mb-10">Buyurtma berish</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Contact Info */}
            <div className="bg-white rounded-[2.5rem] p-8 toy-shadow">
              <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2">
                <User size={20} className="text-[#4D96FF]" /> Kontakt ma'lumotlari
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block ml-1">To'liq ism</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    placeholder="Ism Familiya"
                    className="w-full bg-gray-50 border-2 border-transparent rounded-2xl px-5 py-3.5 text-sm font-bold focus:outline-none focus:bg-white focus:border-[#4ECDC4] transition-all"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block ml-1">Telefon raqam</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder="+998 90 123 45 67"
                    className="w-full bg-gray-50 border-2 border-transparent rounded-2xl px-5 py-3.5 text-sm font-bold focus:outline-none focus:bg-white focus:border-[#4ECDC4] transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="bg-white rounded-[2.5rem] p-8 toy-shadow">
              <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2">
                <Truck size={20} className="text-[#FF6B6B]" /> Yetkazib berish manzili
              </h3>
              <div className="space-y-5">
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block ml-1">Shahar</label>
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full bg-gray-50 border-2 border-transparent rounded-2xl px-5 py-3.5 text-sm font-bold focus:outline-none focus:bg-white focus:border-[#4ECDC4] transition-all cursor-pointer"
                  >
                    <option value="tashkent">Toshkent</option>
                    <option value="samarkand">Samarqand</option>
                    <option value="bukhara">Buxoro</option>
                    <option value="namangan">Namangan</option>
                    <option value="fergana">Farg'ona</option>
                    <option value="andijan">Andijon</option>
                    <option value="other">Boshqa</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block ml-1">To'liq manzil</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    placeholder="Tuman, ko'cha, uy raqami"
                    className="w-full bg-gray-50 border-2 border-transparent rounded-2xl px-5 py-3.5 text-sm font-bold focus:outline-none focus:bg-white focus:border-[#4ECDC4] transition-all"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block ml-1">Izoh (ixtiyoriy)</label>
                  <textarea
                    name="comment"
                    value={formData.comment}
                    onChange={handleChange}
                    placeholder="Qo'shimcha ma'lumot..."
                    rows={3}
                    className="w-full bg-gray-50 border-2 border-transparent rounded-2xl px-5 py-3.5 text-sm font-bold focus:outline-none focus:bg-white focus:border-[#4ECDC4] transition-all resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className="bg-white rounded-[2.5rem] p-8 toy-shadow">
              <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2">
                <CreditCard size={20} className="text-[#FFD93D]" /> To'lov usuli
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { value: 'cash', label: 'Naqd pul', desc: "Yetkazilganda to'lash" },
                  { value: 'card', label: 'Karta', desc: 'Uzcard / Humo' },
                  { value: 'online', label: 'Click / Payme', desc: "Onlayn to'lov" },
                ].map(method => (
                  <label
                    key={method.value}
                    className={`cursor-pointer p-4 rounded-2xl border-2 transition-all ${
                      formData.paymentMethod === method.value
                        ? 'border-[#4ECDC4] bg-[#4ECDC4]/5'
                        : 'border-gray-100 hover:border-gray-200'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.value}
                      checked={formData.paymentMethod === method.value}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <p className="font-black text-gray-900 text-sm">{method.label}</p>
                    <p className="text-gray-400 text-xs font-medium mt-1">{method.desc}</p>
                  </label>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="toy-bounce w-full bg-[#FF6B6B] hover:bg-[#FF8E8E] text-white font-black py-5 rounded-2xl shadow-xl shadow-red-100 text-lg transition-all lg:hidden"
            >
              Buyurtmani tasdiqlash — {total.toLocaleString()} so'm
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-[2.5rem] p-8 toy-shadow sticky top-28">
            <h3 className="text-lg font-black text-gray-900 mb-6">Buyurtma tafsilotlari</h3>

            <div className="space-y-4 mb-6">
              {items.map(item => (
                <div key={item.id} className="flex items-center gap-3">
                  <img src={item.image} alt={item.name} className="w-14 h-14 rounded-xl object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-800 text-sm truncate">{item.name}</p>
                    <p className="text-gray-400 text-xs font-medium">{item.quantity} dona</p>
                  </div>
                  <p className="font-black text-gray-900 text-sm whitespace-nowrap">
                    {(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 pt-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400 font-medium">Mahsulotlar</span>
                <span className="font-bold text-gray-700">{subtotal.toLocaleString()} so'm</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400 font-medium">Yetkazib berish</span>
                <span className={`font-bold ${deliveryFee === 0 ? 'text-green-500' : 'text-gray-700'}`}>
                  {deliveryFee === 0 ? 'Bepul' : `${deliveryFee.toLocaleString()} so'm`}
                </span>
              </div>
              <div className="border-t border-gray-100 pt-3 flex justify-between">
                <span className="font-black text-gray-900">Jami</span>
                <span className="text-xl font-black text-[#FF6B6B]">{total.toLocaleString()} so'm</span>
              </div>
            </div>

            <button
              type="submit"
              form="checkout-form"
              onClick={handleSubmit}
              className="toy-bounce w-full bg-[#FF6B6B] hover:bg-[#FF8E8E] text-white font-black py-4 rounded-2xl shadow-xl shadow-red-100 mt-6 transition-all hidden lg:block"
            >
              Buyurtmani tasdiqlash
            </button>

            {deliveryFee === 0 && (
              <p className="text-center text-green-500 text-xs font-bold mt-3">
                Bepul yetkazib berish qo'llanildi!
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Checkout;
