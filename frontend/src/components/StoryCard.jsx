import React from 'react';
import { User, ArrowRight, BookOpenText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const StoryCard = ({ story }) => {
  const navigate = useNavigate();

  // Hikaye özeti çok uzunsa arayüzü bozmaması için kısıtlıyoruz
  const truncateSummary = (text, length = 100) => {
    if (!text) return "Bu hikaye için henüz bir özet eklenmemiş...";
    return text.length > length ? text.substring(0, length) + "..." : text;
  };

  // Kartın kendisine veya butona tıklandığında detay sayfasına git
  const handleReadClick = () => {
    navigate(`/hikaye/${story.id}`);
  };

  return (
    <div 
      onClick={handleReadClick}
      className="group bg-white rounded-3xl p-8 shadow-sm border border-slate-100 hover:border-orange-300 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between cursor-pointer"
    >
      <div>
        {/* Üst Kısım: İkon ve Başlık */}
        <div className="flex items-start gap-4 mb-6">
          <div className="bg-orange-50 text-orange-600 p-3 rounded-2xl group-hover:bg-orange-600 group-hover:text-white transition-all duration-300 shadow-sm">
            <BookOpenText size={22} />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 group-hover:text-orange-600 transition-colors leading-tight line-clamp-2">
            {story.title}
          </h3>
        </div>

        {/* Orta Kısım: Hikaye Özeti */}
        <p className="text-slate-500 text-sm leading-relaxed mb-8 italic">
          "{truncateSummary(story.summary)}"
        </p>
      </div>

      {/* Alt Kısım: Yazar Bilgisi ve Aksiyon Butonu */}
      <div className="flex justify-between items-center pt-6 border-t border-slate-50">
        <div 
          className="flex items-center gap-3 group/author"
          onClick={(e) => {
            e.stopPropagation(); // Buton tıklamasını kart tıklamasından ayırıyoruz
            navigate(`/profil/${story.author}`); // İleride yapacağımız profil sayfası için
          }}
        >
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-slate-100 to-slate-200 flex items-center justify-center border border-slate-200 text-slate-600 text-xs font-bold uppercase shadow-inner group-hover/author:border-orange-400 transition-colors">
            {story.author?.substring(0, 2) || "WA"}
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">Yazar</span>
            <span className="text-xs font-bold text-slate-700 group-hover/author:text-orange-600 transition-colors">
              {story.author || "Anonim"}
            </span>
          </div>
        </div>

        {/* Oku Butonu */}
        <button 
          className="flex items-center gap-2 bg-slate-950 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-orange-500 hover:shadow-lg hover:shadow-orange-200 transition-all active:scale-95 group-hover:gap-3"
        >
          Oku <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};