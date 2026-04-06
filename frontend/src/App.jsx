import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage';
import StoryDetail from './pages/StoryDetail';
import AuthorProfile from './pages/AuthorProfile';
import Login from './pages/Login';
import NotificationBell from './components/notifications/NotificationBell';

// Navbar Bileşeni (Clean Code: Fonksiyonu dışarı aldık)
const Navigation = () => {
  const location = useLocation();
  
  // Eğer kullanıcı /login sayfasındaysa Navbar'ı gösterme
  if (location.pathname === '/login') return null;

  return (
    <nav className="bg-white border-b p-4 flex justify-between items-center shadow-sm sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <a href="/" className="text-xl font-black text-orange-600 uppercase tracking-tighter">
          Hikaye <span className="text-slate-900">Evreni</span>
        </a>
        <NotificationBell userId={5} />
        <div className="flex gap-6 items-center">
          <a href="/login" className="bg-slate-900 text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-orange-600 transition-all shadow-md">
            Giriş Yap
          </a>
        </div>
      </div>
    </nav>
  );
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50 font-sans">
        <Navigation /> {/* Şartlı render edilen navigasyon */}
        
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/hikaye/:id" element={<StoryDetail />} />
          <Route path="/profil/:authorName" element={<AuthorProfile />} />
          <Route path="*" element={<div className="p-20 text-center font-bold text-slate-400">🌌 Evrenin sonuna geldin, burada henüz bir hikaye yok.</div>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;