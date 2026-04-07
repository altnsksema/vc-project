import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, BookOpen, Users, Flame, Edit3 } from 'lucide-react'; // Edit3 (Kalem) eklendi

const StoryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. GİRİŞ YAPAN KULLANICIYI YAKALA (Auth sistemine göre 'user' verisi)
  const currentUser = JSON.parse(localStorage.getItem('user')); 

  useEffect(() => {
  // id yoksa veya kelime olarak "undefined" ise hiçbir şey yapma
  if (!id || id === "undefined") return;

  const fetchDetail = async () => {
    try {
      const res = await axios.get(`http://127.0.0.1:8000/api/stories/${id}`);
      setData(res.data);
    } catch (err) {
      console.error("Veri çekilemedi!", err);
    } finally {
      setLoading(false);
    }
  };

  fetchDetail();
}, [id]);

  if (loading) return <div className="p-20 text-center animate-pulse text-orange-600 font-bold">Evren yükleniyor...</div>;
  if (!data) return <div className="p-20 text-center text-red-500 font-bold">Hikaye bulunamadı!</div>;

  const { story_info, chapters, live_views } = data;

  // 2. YAZARLIK KONTROLÜ (Giriş yapan kişi hikaye sahibi mi?)
  const isAuthor = currentUser && currentUser.username === story_info.author;

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* --- ÜST HEADER (Koyu Panel) --- */}
      <div className="bg-slate-900 text-white pt-16 pb-32 px-6 relative z-0">
        <div className="container mx-auto max-w-5xl">
          <button 
            onClick={() => navigate('/')} 
            className="flex items-center gap-2 text-slate-400 hover:text-white mb-10 transition-all font-bold text-sm tracking-widest"
          >
            <ArrowLeft size={18} /> GERİ DÖN
          </button>
          
          <div className="flex flex-col md:flex-row gap-12 items-center md:items-start">
            {/* Kitap Kapağı */}
            <div className="w-56 h-80 bg-gradient-to-br from-orange-500 to-orange-800 rounded-3xl shadow-2xl flex-shrink-0 flex items-center justify-center border-4 border-white/5 transform hover:scale-105 transition-transform duration-500">
              <BookOpen size={80} className="text-white/20" />
            </div>
            
            {/* Hikaye Bilgileri */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-6">
                <span className="bg-orange-600 px-4 py-1.2 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">Popüler</span>
                <div className="flex items-center gap-2 text-orange-400 font-black text-sm">
                  <Flame size={18} /> {live_views} Kişi Okuyor
                </div>

                {/* --- ✍️ YAZAR KONTROLÜ VE KALEM BUTONU --- */}
                {isAuthor && (
                  <button 
                    onClick={() => navigate(`/hikaye/${id}/yeni-bolum`)}
                    className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-5 py-2 rounded-xl transition-all border border-white/10 font-bold text-xs group"
                  >
                    <Edit3 size={16} className="text-orange-500 group-hover:scale-110 transition-transform" /> 
                    BÖLÜM EKLE
                  </button>
                )}
              </div>
              
              <h1 className="text-5xl md:text-6xl font-black mb-6 leading-tight tracking-tighter">
                {story_info.title}
              </h1>

              <div 
                onClick={() => navigate(`/profil/${story_info.author}`)}
                className="inline-flex items-center gap-4 text-slate-300 cursor-pointer hover:text-orange-400 transition-all group"
              >
                <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center font-black text-lg border-2 border-slate-700 group-hover:border-orange-500">
                  {story_info.author[0].toUpperCase()}
                </div>
                <span className="font-bold text-xl tracking-tight">{story_info.author}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- ANA İÇERİK (Beyaz Kartlar) --- */}
      <main className="container mx-auto max-w-5xl -mt-20 px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Sol Kolon: Özet */}
          <div className="lg:col-span-2">
            <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-slate-200/60 border border-slate-100 h-full">
              <h2 className="text-2xl font-black mb-8 text-slate-900 flex items-center gap-3 uppercase tracking-widest text-xs">
                <span className="w-8 h-1 bg-orange-500 rounded-full"></span> Özet
              </h2>
              <p className="text-slate-600 leading-relaxed text-xl italic font-medium">
                "{story_info.summary}"
              </p>
            </div>
          </div>

          {/* Sağ Kolon: Bölümler (Tıklama Özelliği Eklendi!) */}
          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl shadow-slate-200/60 border border-slate-100">
              <h2 className="text-xl font-black mb-8 flex items-center gap-3 text-slate-900 uppercase tracking-widest text-xs">
                <Users size={20} className="text-orange-500" /> Bölümler
              </h2>
              <div className="space-y-4">
                {chapters && chapters.length > 0 ? chapters.map((ch, idx) => (
                  <div 
                    key={ch.id} 
                    onClick={() => navigate(`/bolum/${ch.id}`)} // 2000 kelimeyi okuma sayfasına git
                    className="group p-5 bg-slate-50 rounded-2xl hover:bg-orange-600 transition-all cursor-pointer border border-transparent hover:shadow-lg hover:shadow-orange-200"
                  >
                    <span className="text-[10px] font-black text-slate-400 group-hover:text-orange-200 uppercase tracking-widest">
                      Bölüm {idx + 1}
                    </span>
                    <h4 className="font-black text-slate-800 group-hover:text-white transition-colors">
                      {ch.title}
                    </h4>
                  </div>
                )) : (
                  <div className="py-10 text-center border-2 border-dashed border-slate-100 rounded-2xl">
                    <p className="text-slate-400 text-sm font-bold italic uppercase tracking-tighter">Henüz bölüm eklenmemiş.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default StoryDetail;