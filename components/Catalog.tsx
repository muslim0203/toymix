import React, { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { Toy, Category } from '../types';
import ProductCard from './ProductCard';

interface CatalogProps {
  toys: Toy[];
  activeCategory: Category;
  searchQuery: string;
  onCategoryChange: (cat: Category) => void;
  onSearchChange: (query: string) => void;
  onAddToCart: (toy: Toy, event: React.MouseEvent) => void;
  onViewDetails: (toy: Toy) => void;
}

const Catalog: React.FC<CatalogProps> = ({
  toys, activeCategory, searchQuery, onCategoryChange, onSearchChange, onAddToCart, onViewDetails
}) => {
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc' | 'rating'>('default');
  const categories = Object.values(Category);

  const sortedToys = useMemo(() => {
    const sorted = [...toys];
    switch (sortBy) {
      case 'price-asc': return sorted.sort((a, b) => a.price - b.price);
      case 'price-desc': return sorted.sort((a, b) => b.price - a.price);
      case 'rating': return sorted.sort((a, b) => b.rating - a.rating);
      default: return sorted;
    }
  }, [toys, sortBy]);

  return (
    <section className="container mx-auto px-4 py-10" aria-label="ToyMix o'yinchoqlar katalogi">
      {/* Page Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-black text-gray-900 mb-2">Bolalar O'yinchoqlari Katalogi</h1>
        <p className="text-gray-400 font-medium">Barcha sifatli va xavfsiz o'yinchoqlar bir joyda — konstruktorlar, robotlar, yumshoq o'yinchoqlar va boshqalar</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4 mb-8">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="O'yinchoq qidirish..."
            className="w-full bg-white border-2 border-gray-100 rounded-2xl pl-12 pr-5 py-3.5 text-sm font-bold focus:outline-none focus:border-[#4ECDC4] transition-all"
          />
        </div>

        {/* Sort */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          className="bg-white border-2 border-gray-100 rounded-2xl px-5 py-3.5 text-sm font-bold focus:outline-none focus:border-[#4ECDC4] transition-all cursor-pointer"
        >
          <option value="default">Tartiblash</option>
          <option value="price-asc">Narx: arzondan qimmatga</option>
          <option value="price-desc">Narx: qimmatdan arzonga</option>
          <option value="rating">Reyting bo'yicha</option>
        </select>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 mb-10">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => onCategoryChange(cat)}
            className={`px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition-all ${
              activeCategory === cat
                ? 'bg-[#FF6B6B] text-white shadow-lg shadow-red-100'
                : 'bg-white text-gray-500 border border-gray-100 hover:border-[#FF6B6B] hover:text-[#FF6B6B]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Results Count */}
      <p className="text-gray-400 text-sm font-bold mb-6">{sortedToys.length} ta mahsulot topildi</p>

      {/* Product Grid */}
      {sortedToys.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-6xl mb-4">🔍</p>
          <h3 className="text-xl font-black text-gray-900 mb-2">Mahsulot topilmadi</h3>
          <p className="text-gray-400 font-medium">Boshqa kategoriya yoki qidiruv so'zini sinab ko'ring</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {sortedToys.map(toy => (
            <ProductCard key={toy.id} toy={toy} onAddToCart={onAddToCart} onViewDetails={onViewDetails} />
          ))}
        </div>
      )}
    </section>
  );
};

export default Catalog;
