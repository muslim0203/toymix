import React, { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../services/firebaseService';
import { Rocket, Mail, Lock, User, Loader2, Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password) {
      setError('Iltimos, email va parol kiriting!');
      setLoading(false);
      return;
    }

    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      // onAuthStateChanged in App.tsx will detect login and show main app
    } catch (error: any) {
      console.error("Auth error:", error);
      const errorMessages: Record<string, string> = {
        'auth/user-not-found': "Bunday foydalanuvchi topilmadi",
        'auth/wrong-password': "Noto'g'ri parol",
        'auth/email-already-in-use': "Bu email allaqachon ro'yxatdan o'tgan",
        'auth/weak-password': "Parol kamida 6 ta belgidan iborat bo'lishi kerak",
        'auth/invalid-email': "Email formati noto'g'ri",
        'auth/invalid-credential': "Email yoki parol noto'g'ri",
      };
      setError(errorMessages[error.code] || 'Xatolik yuz berdi: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F7F9FC] via-white to-[#F0F4FF] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="bg-gradient-to-tr from-[#FF6B6B] to-[#FFE66D] p-3 rounded-2xl shadow-lg">
              <Rocket className="text-white" size={28} />
            </div>
          </div>
          <h1 className="text-3xl font-black tracking-tighter">
            <span className="text-[#FF6B6B]">Toy</span>
            <span className="text-[#4ECDC4]">Mix</span>
          </h1>
          <p className="text-gray-400 font-medium text-sm mt-2">Bolalar quvonch dunyosi</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-[2.5rem] toy-shadow p-8 sm:p-10">
          <h2 className="text-2xl font-black text-gray-900 mb-2">
            {isSignUp ? "Ro'yxatdan o'tish" : "Kirish"}
          </h2>
          <p className="text-gray-400 font-medium text-sm mb-8">
            {isSignUp
              ? "Yangi hisob yarating va xarid qilishni boshlang"
              : "Hisobingizga kiring va davom eting"}
          </p>

          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 text-sm font-bold px-4 py-3 rounded-2xl mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {isSignUp && (
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block ml-1">Ismingiz</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ismingizni kiriting"
                    className="w-full bg-gray-50 border-2 border-transparent rounded-2xl pl-12 pr-5 py-3.5 text-sm font-bold focus:outline-none focus:bg-white focus:border-[#4ECDC4] transition-all"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block ml-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@misol.com"
                  required
                  className="w-full bg-gray-50 border-2 border-transparent rounded-2xl pl-12 pr-5 py-3.5 text-sm font-bold focus:outline-none focus:bg-white focus:border-[#4ECDC4] transition-all"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block ml-1">Parol</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-gray-50 border-2 border-transparent rounded-2xl pl-12 pr-12 py-3.5 text-sm font-bold focus:outline-none focus:bg-white focus:border-[#4ECDC4] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="toy-bounce w-full bg-[#FF6B6B] hover:bg-[#FF8E8E] disabled:opacity-50 disabled:hover:scale-100 text-white font-black py-4 rounded-2xl shadow-xl shadow-red-100 flex items-center justify-center gap-3 transition-all mt-2"
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Kutilmoqda...
                </>
              ) : (
                isSignUp ? "Ro'yxatdan o'tish" : "Kirish"
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-400 text-sm font-medium">
              {isSignUp ? "Hisobingiz bormi?" : "Hisobingiz yo'qmi?"}{' '}
              <button
                onClick={() => { setIsSignUp(!isSignUp); setError(''); }}
                className="text-[#4D96FF] font-black hover:underline"
              >
                {isSignUp ? "Kirish" : "Ro'yxatdan o'tish"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
