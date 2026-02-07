
import React from 'react';
import { Star, ShoppingBasket, Eye, Zap } from 'lucide-react';
import { Toy } from '../types';

interface ProductCardProps {
  toy: Toy;
  onAddToCart: (toy: Toy, event: React.MouseEvent) => void;
  onViewDetails: (toy: Toy) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ toy, onAddToCart, onViewDetails }) => {
  return (
    <article className="group bg-white rounded-[2rem] overflow-hidden border border-gray-100 toy-shadow hover:shadow-2xl transition-all duration-500 flex flex-col h-full relative" itemScope itemType="https://schema.org/Product">
      {/* Trend Badge */}
      {toy.isPopular && (
        <div className="absolute top-4 left-4 z-10 bg-[#FFD93D] text-gray-900 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1 shadow-sm">
          <Zap size={12} fill="currentColor" /> Trendda
        </div>
      )}

      {/* Image Area */}
      <div className="relative aspect-square overflow-hidden bg-gray-50 m-2 rounded-[1.8rem]">
        <img 
          src={toy.image} 
          alt={`${toy.name} - ${toy.category} bolalar o'yinchoqi ${toy.ageRange} uchun - ToyMix`}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          loading="lazy"
          width="400"
          height="400"
          itemProp="image"
        />
        
        {/* Rating Overlay */}
        <div className="absolute bottom-3 left-3">
          <span className="bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-[10px] font-black text-gray-700 shadow-sm flex items-center gap-1 border border-white/50">
            <Star size={12} className="text-[#FFD93D] fill-[#FFD93D]" /> {toy.rating}
          </span>
        </div>

        {/* Quick View Overlay */}
        <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
           <button 
             onClick={() => onViewDetails(toy)}
             className="bg-white text-gray-900 p-3 rounded-full shadow-xl hover:scale-110 transition-all"
           >
             <Eye size={20} />
           </button>
        </div>
      </div>
      
      {/* Content Area */}
      <div className="px-5 pb-5 pt-2 flex flex-col flex-1">
        <div className="mb-2">
          <span className="text-[10px] uppercase tracking-widest font-black text-[#4D96FF]">
            {toy.category}
          </span>
        </div>
        
        <h3 className="font-bold text-gray-800 text-base line-clamp-1 mb-1" itemProp="name">
          {toy.name}
        </h3>
        <p className="text-[10px] text-gray-400 font-bold mb-4 uppercase">{toy.ageRange} uchun</p>
        <meta itemProp="description" content={toy.description} />
        
        <div className="mt-auto flex items-center justify-between pt-3 border-t border-gray-50" itemProp="offers" itemScope itemType="https://schema.org/Offer">
          <meta itemProp="priceCurrency" content="UZS" />
          <meta itemProp="availability" content="https://schema.org/InStock" />
          <div className="flex flex-col">
            <span className="text-lg font-black text-gray-900 leading-none" itemProp="price" content={String(toy.price)}>
              {toy.price.toLocaleString()} <small className="text-[10px] font-bold text-gray-400">uzs</small>
            </span>
          </div>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(toy, e);
            }}
            className="toy-bounce bg-[#FF6B6B] hover:bg-[#FF8E8E] text-white p-3 rounded-xl shadow-lg shadow-red-100"
          >
            <ShoppingBasket size={18} />
          </button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
