import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { UserPlus, UserMinus, MessageCircle, ArrowLeft, Book, Users, Send } from 'lucide-react';
import { ChatBox } from '../components/ChatBox'; // Az önce oluşturduğumuz bileşen

const AuthorProfile = () => {
  const { authorName } = useParams();
  const navigate = useNavigate();

  // --- UI State Yönetimi ---
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(1200);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [panoPosts, setPanoPosts] = useState([
    { id: 1, text: "Yeni bölüm yolda, takipte kalın! ✨", date: "2 saat önce" }
  ]);
  const [newPost, setNewPost] = useState("");

  // --- İş Mantığı (Logic) ---
  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    setFollowerCount(prev => isFollowing ? prev - 1 : prev + 1);
  };

  const handlePostToPano = (e) => {
    e.preventDefault();
    if (!newPost.trim()) return;
    setPanoPosts([{ id: Date.now(), text: newPost, date: "Şimdi" }, ...panoPosts]);
    setNewPost("");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Profil Header */}
      <div className="bg-white border-b border-slate-200 pt-10 pb-6 px-6">
        <div className="container mx-auto max-w-4xl">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 hover:text-orange-600 mb-8 transition-all font-bold text-sm">
            <ArrowLeft size={18} /> GERİ DÖN
          </button>
          
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 border-4 border-white shadow-xl flex items-center justify-center text-4xl font-black text-white shrink-0">
              {authorName ? authorName[0].toUpperCase() : 'A'}
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-black text-slate-900 mb-2 uppercase tracking-tight">{authorName}</h1>
              <p className="text-slate-500 mb-6 max-w-lg italic text-sm">"Kelimelerin gücüyle evrenler inşa eden bir hayalperest."</p>
              
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <button 
                  onClick={handleFollow}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg ${
                    isFollowing 
                    ? 'bg-slate-200 text-slate-700 shadow-none' 
                    : 'bg-orange-600 text-white shadow-orange-200 hover:bg-orange-700'
                  }`}
                >
                  {isFollowing ? <><UserMinus size={18} /> Takibi Bırak</> : <><UserPlus size={18} /> Takip Et</>}
                </button>
                <button 
                  onClick={() => setIsChatOpen(true)}
                  className="flex items-center gap-2 bg-white border-2 border-slate-100 text-slate-700 px-6 py-2.5 rounded-xl font-bold hover:bg-slate-50 transition-all"
                >
                  <MessageCircle size={18} /> Mesaj Gönder
                </button>
              </div>
            </div>

            <div className="flex gap-8 border-l border-slate-100 pl-8 hidden lg:flex">
              <div className="text-center">
                <p className="text-2xl font-black text-slate-900">12</p>
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Eser</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-black text-slate-900">{(followerCount / 1000).toFixed(1)}K</p>
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Takipçi</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* İçerik Alanı */}
      <div className="container mx-auto max-w-4xl py-12 px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="md:col-span-2">
            <h3 className="text-lg font-black mb-6 flex items-center gap-2 text-slate-800 uppercase tracking-wider">
              <Book size={20} className="text-orange-500" /> Yayınlanan Hikayeler
            </h3>
            <div className="p-12 bg-white border-2 border-dashed border-slate-200 rounded-3xl text-center text-slate-400 font-medium">
              Henüz bir eser paylaşılmadı.
            </div>
          </div>
          
          <div className="space-y-6">
            <h3 className="text-lg font-black mb-6 flex items-center gap-2 text-slate-800 uppercase tracking-wider">
              <Users size={20} className="text-orange-500" /> Pano
            </h3>
            
            {/* Pano Yazma Alanı (Clean UI) */}
            <form onSubmit={handlePostToPano} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
              <textarea 
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder="Panoya bir şey yaz..."
                className="w-full bg-slate-50 border-none rounded-lg p-3 text-sm outline-none focus:ring-1 focus:ring-orange-500 resize-none h-20"
              />
              <button className="mt-2 w-full bg-slate-900 text-white py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 hover:bg-orange-600 transition-colors">
                Paylaş <Send size={14} />
              </button>
            </form>

            {/* Pano Mesajları */}
            <div className="space-y-4">
              {panoPosts.map(post => (
                <div key={post.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 relative group">
                  <p className="text-slate-700 text-sm leading-relaxed">{post.text}</p>
                  <span className="text-[10px] text-slate-400 mt-3 block font-bold uppercase tracking-tighter">{post.date}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mesajlaşma Penceresi */}
      {isChatOpen && (
        <ChatBox 
          authorName={authorName} 
          onClose={() => setIsChatOpen(false)} 
        />
      )}
    </div>
  );
};

export default AuthorProfile;