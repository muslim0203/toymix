
import React, { useState } from 'react';
import { Sparkles, Send, Loader2, X, Bot, Wand2 } from 'lucide-react';
import { getToyAdvice } from '../services/geminiService';
import { AIAdviceRequest } from '../types';

const AIAdvisor: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [form, setForm] = useState<AIAdviceRequest>({
    age: '',
    interest: '',
    budget: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResponse(null);
    try {
      const advice = await getToyAdvice(form);
      setResponse(advice);
    } catch (err) {
      setResponse("Kechirasiz, maslahat olishda xatolik yuz berdi. Iltimos, qaytadan urinib ko'ring.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[60]">
      {/* Trigger Button */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="toy-bounce bg-gradient-to-tr from-[#6C5CE7] to-[#A29BFE] text-white p-5 rounded-[2rem] shadow-2xl shadow-purple-200 flex items-center gap-3 active:scale-95 group border-4 border-white"
        >
          <div className="relative">
            <Bot size={28} />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#FFE66D] rounded-full border-2 border-[#6C5CE7] animate-ping"></span>
          </div>
          <div className="text-left">
            <p className="text-[10px] font-black uppercase tracking-widest opacity-80 leading-none mb-0.5">Yordam kerakmi?</p>
            <p className="font-black text-sm">Aqlli Yordamchi</p>
          </div>
        </button>
      )}

      {/* Advisor Window */}
      {isOpen && (
        <div className="bg-white w-[95vw] max-w-[400px] rounded-[3rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] border border-gray-100 overflow-hidden flex flex-col animate-in zoom-in-95 fade-in duration-300 origin-bottom-right">
          <div className="bg-gradient-to-tr from-[#6C5CE7] to-[#A29BFE] p-6 text-white flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md border border-white/30">
                <Bot size={24} />
              </div>
              <div>
                <h3 className="font-black text-lg leading-tight">Mixy Bot</h3>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  <p className="text-[10px] font-bold opacity-80 uppercase tracking-widest">Hozir online</p>
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-2 rounded-full transition-colors">
              <X size={24} />
            </button>
          </div>

          <div className="p-8 max-h-[75vh] overflow-y-auto custom-scrollbar">
            {!response && !loading && (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-2xl border-l-4 border-[#6C5CE7]">
                  <p className="text-sm text-gray-600 font-medium leading-relaxed">
                    Salom! Men Mixy Botman. Farzandingiz uchun mukammal o'yinchoq tanlashda yordam beraman. ✨
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block ml-1">Bolaning yoshi</label>
                    <input 
                      type="text" 
                      placeholder="Masalan: 3 yosh" 
                      className="w-full bg-gray-50 border-2 border-transparent rounded-2xl px-5 py-3.5 text-sm font-bold focus:outline-none focus:bg-white focus:border-[#A29BFE] transition-all"
                      value={form.age}
                      onChange={(e) => setForm({...form, age: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block ml-1">Nimalarga qiziqadi?</label>
                    <input 
                      type="text" 
                      placeholder="Fazogirlar, rasm chizish..." 
                      className="w-full bg-gray-50 border-2 border-transparent rounded-2xl px-5 py-3.5 text-sm font-bold focus:outline-none focus:bg-white focus:border-[#A29BFE] transition-all"
                      value={form.interest}
                      onChange={(e) => setForm({...form, interest: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block ml-1">Budjetingiz</label>
                    <input 
                      type="text" 
                      placeholder="Masalan: 100 000 uzs" 
                      className="w-full bg-gray-50 border-2 border-transparent rounded-2xl px-5 py-3.5 text-sm font-bold focus:outline-none focus:bg-white focus:border-[#A29BFE] transition-all"
                      value={form.budget}
                      onChange={(e) => setForm({...form, budget: e.target.value})}
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  className="toy-bounce w-full bg-[#6C5CE7] hover:bg-[#5a4cc7] text-white font-black py-4 rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-purple-100 transition-all mt-4"
                >
                  Mo'jiza yaratish <Wand2 size={20} />
                </button>
              </form>
            )}

            {loading && (
              <div className="py-20 flex flex-col items-center justify-center text-center">
                <div className="relative mb-8">
                   <div className="w-20 h-20 border-4 border-[#A29BFE]/20 border-t-[#6C5CE7] rounded-full animate-spin"></div>
                   <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#FFE66D] animate-pulse" size={32} />
                </div>
                <p className="text-gray-900 font-black text-lg">Mixy o'ylamoqda...</p>
                <p className="text-gray-400 text-sm font-bold mt-2">Eng zo'r tavsiyalarni qidiryapman</p>
              </div>
            )}

            {response && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-start gap-4">
                  <div className="bg-[#6C5CE7] text-white p-2 rounded-xl mt-1">
                    <Bot size={18} />
                  </div>
                  <div className="flex-1 bg-gray-50 p-5 rounded-[2rem] rounded-tl-none text-sm text-gray-700 leading-relaxed font-bold border border-gray-100">
                    {response}
                  </div>
                </div>
                <button 
                  onClick={() => setResponse(null)}
                  className="w-full py-4 text-[#6C5CE7] font-black text-sm border-4 border-gray-50 rounded-2xl hover:bg-gray-50 transition-colors"
                >
                  Yana so'rash
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AIAdvisor;
