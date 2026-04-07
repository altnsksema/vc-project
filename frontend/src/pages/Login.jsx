import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState(''); // E-posta state'i
  const navigate = useNavigate();

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    
    // ŞİMDİLİK SİMÜLASYON (Backend hazır olunca buraya axios gelecek)
    const mockUser = {
      id: 1,
      username: email.split('@')[0] || "Sema", // E-postanın başını isim yapalım
      email: email,
      avatar: ""
    };

    // 1. KİMLİĞİ TARAYICIYA KAYDET (Kritik nokta!)
    localStorage.setItem('user', JSON.stringify(mockUser));

    // 2. NAVIGASYON VE SAYFAYI TAZELEME
    // window.location.href Navbar'ın değişmesini garanti eder.
    window.location.href = "/"; 
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-lg p-8">
        
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-slate-800">
            {isLogin ? 'Giriş Yap' : 'Kayıt Ol'}
          </h2>
          <p className="text-slate-500 text-sm mt-2">Hikaye Evreni'ne hoş geldin.</p>
        </div>

        {/* --- FORM GÜNCELLENDİ --- */}
        <form className="space-y-4" onSubmit={handleLoginSubmit}>
          <input 
            type="email" 
            placeholder="E-posta" 
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-orange-500" 
          />
          <input 
            type="password" 
            placeholder="Şifre" 
            required
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-orange-500" 
          />
          <button type="submit" className="w-full bg-orange-600 text-white py-3 rounded-lg font-bold hover:bg-orange-700 transition-all">
            {isLogin ? 'Giriş Yap' : 'Kayıt Ol'}
          </button>
        </form>

        {/* Sosyal Butonlar ve Switch kısımları aynı kalsın... */}
        <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-2 gap-4">
          <button className="border border-slate-200 py-2 rounded-lg text-sm font-semibold hover:bg-slate-50">
            Google ile Giriş
          </button>
          <button className="border border-slate-200 py-2 rounded-lg text-sm font-semibold hover:bg-slate-50">
            Apple ile Giriş
          </button>
        </div>

        <p className="text-center mt-6 text-sm text-slate-500">
          {isLogin ? 'Hesabın yok mu?' : 'Zaten üye misin?'} 
          <button 
            type="button"
            onClick={() => setIsLogin(!isLogin)} 
            className="ml-2 text-orange-600 font-bold"
          >
            {isLogin ? 'Kayıt Ol' : 'Giriş Yap'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;