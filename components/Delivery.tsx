import React from 'react';
import { Truck, CreditCard, Phone, CheckCircle2, Package } from 'lucide-react';
import { DeliveryPageContent } from '../types';

interface DeliveryProps {
  content: DeliveryPageContent;
}

/**
 * Map icon_name string from bot API to a lucide-react icon component for payment methods.
 */
function getPaymentIcon(iconName: string, index: number) {
  const iconMap: Record<string, React.ReactNode> = {
    cash: <CreditCard size={28} className="text-green-500" />,
    card: <CreditCard size={28} className="text-[#4D96FF]" />,
    phone: <Phone size={28} className="text-[#FF6B6B]" />,
  };

  if (iconMap[iconName]) return iconMap[iconName];

  // Default cycle
  const defaults = [
    <CreditCard size={28} className="text-green-500" />,
    <CreditCard size={28} className="text-[#4D96FF]" />,
    <Phone size={28} className="text-[#FF6B6B]" />,
  ];
  return defaults[index % defaults.length];
}

/**
 * Step icons cycle through these colors.
 */
function getStepIcon(index: number) {
  const icons = [
    <Package size={28} className="text-[#FF6B6B]" />,
    <CreditCard size={28} className="text-[#4D96FF]" />,
    <Truck size={28} className="text-[#FFD93D]" />,
    <CheckCircle2 size={28} className="text-green-500" />,
  ];
  return icons[index % icons.length];
}

const Delivery: React.FC<DeliveryProps> = ({ content }) => {
  return (
    <section className="container mx-auto px-4 py-10" aria-label="ToyMix yetkazib berish xizmati">
      <div className="mb-10">
        <h1 className="text-4xl font-black text-gray-900 mb-2">{content.hero_title}</h1>
        <p className="text-gray-400 font-medium">{content.hero_description}</p>
      </div>

      {/* Delivery Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {content.delivery_options.map((option, i) => {
          const gradientClass = option.color === 'blue'
            ? 'bg-gradient-to-br from-[#4D96FF] to-[#6BA5FF]'
            : 'bg-gradient-to-br from-[#FF6B6B] to-[#FF8E8E]';
          const Icon = option.color === 'blue' ? Truck : Package;

          return (
            <div key={i} className={`${gradientClass} rounded-[2.5rem] p-10 text-white`}>
              <Icon className="mb-4" size={40} />
              <h3 className="text-2xl font-black mb-4">{option.title}</h3>
              <ul className="space-y-3 text-white/90 font-medium">
                {option.items.map((item, j) => (
                  <li key={j} className="flex items-center gap-2">
                    <CheckCircle2 size={16} /> {item}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      {/* How It Works */}
      <h2 className="text-3xl font-black text-center mb-10">Qanday ishlaydi?</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {content.steps.map((item, i) => (
          <div key={i} className="bg-white rounded-[2.5rem] p-8 toy-shadow text-center flex flex-col items-center gap-4 relative">
            <div className="absolute -top-3 -left-3 bg-gray-900 text-white w-8 h-8 rounded-full flex items-center justify-center text-xs font-black">
              {item.step}
            </div>
            <div className="bg-gray-50 p-4 rounded-full">{getStepIcon(i)}</div>
            <h3 className="font-black text-gray-900">{item.title}</h3>
            <p className="text-gray-400 text-sm font-medium">{item.description}</p>
          </div>
        ))}
      </div>

      {/* Payment Methods */}
      <div className="bg-white rounded-[2.5rem] p-10 toy-shadow mb-16">
        <h2 className="text-2xl font-black text-gray-900 mb-6 text-center">To'lov usullari</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {content.payment_methods.map((item, i) => (
            <div key={i} className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
              <div className="bg-white p-3 rounded-xl shadow-sm">{getPaymentIcon(item.icon_name, i)}</div>
              <div>
                <h4 className="font-black text-gray-900 text-sm">{item.title}</h4>
                <p className="text-gray-400 text-xs font-medium">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <h2 className="text-3xl font-black text-center mb-10">Ko'p so'raladigan savollar</h2>
      <div className="max-w-2xl mx-auto space-y-4">
        {content.faq.map((item, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 toy-shadow">
            <h4 className="font-black text-gray-900 mb-2">{item.question}</h4>
            <p className="text-gray-500 text-sm font-medium">{item.answer}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Delivery;
