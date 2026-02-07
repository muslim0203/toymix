import React from 'react';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { BlogPost } from '../types';

interface BlogProps {
  posts: BlogPost[];
}

const Blog: React.FC<BlogProps> = ({ posts }) => {
  return (
    <section className="container mx-auto px-4 py-10" aria-label="ToyMix blog - bolalar o'yinchoqlari haqida foydali maqolalar">
      <div className="mb-10">
        <h1 className="text-4xl font-black text-gray-900 mb-2">Blog — Bolalar O'yinchoqlari Haqida Maqolalar</h1>
        <p className="text-gray-400 font-medium">Foydali maqolalar, bolalar rivojlanishi va o'yinchoq tanlash bo'yicha maslahatlar</p>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-6xl mb-4">📝</p>
          <h3 className="text-xl font-black text-gray-900 mb-2">Hozircha maqolalar yo'q</h3>
          <p className="text-gray-400 font-medium">Tez orada foydali maqolalar qo'shiladi</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {posts.map(post => (
            <article key={post.id} className="bg-white rounded-[2.5rem] overflow-hidden toy-shadow group hover:shadow-2xl transition-all duration-500">
              <div className="aspect-video overflow-hidden">
                <img src={post.image} alt={`${post.title} - ToyMix blog maqolasi`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" width="600" height="338" />
              </div>
              <div className="p-8">
                <div className="flex items-center gap-4 mb-4">
                  <span className="flex items-center gap-1.5 text-gray-400 text-xs font-bold">
                    <Calendar size={14} /> {post.date}
                  </span>
                  <span className="flex items-center gap-1.5 text-gray-400 text-xs font-bold">
                    <User size={14} /> {post.author}
                  </span>
                </div>
                <h2 className="text-xl font-black text-gray-900 mb-3 leading-tight">{post.title}</h2>
                <p className="text-gray-500 font-medium text-sm leading-relaxed mb-6">{post.excerpt}</p>
                <button className="text-[#4D96FF] font-black text-sm flex items-center gap-2 hover:gap-3 transition-all">
                  Batafsil o'qish <ArrowRight size={16} />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};

export default Blog;
