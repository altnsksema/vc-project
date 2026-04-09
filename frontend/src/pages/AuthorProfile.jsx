import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  UserPlus, UserMinus, MessageCircle, ArrowLeft, 
  Book, Users, Send, Trash2, Edit3 
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { ChatBox } from '../components/ChatBox';
import EditProfileModal from '../components/EditProfileModal';

const AuthorProfile = () => {
  const { authorName } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth(); 

  const [userStories, setUserStories] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(1200);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); 
  const [newPost, setNewPost] = useState("");
  const [panoPosts, setPanoPosts] = useState([
    { id: 1, text: "Yeni bölüm yolda, takipte kalın! ✨", date: "2 saat önce" }
  ]);

  const isMyProfile = currentUser?.username?.toLowerCase() === authorName?.toLowerCase();

  useEffect(() => {
    const fetchStories = async () => {
      try {
        setLoading(true);
        const res = await axios.get('http://127.0.0.1:8000/api/stories/');
        const filtered = res.data.kesfet.filter(s => 
          s.author.toLowerCase() === authorName.toLowerCase()
        );
        setUserStories(filtered);
      } catch (err) {
        console.error("Veri çekme hatası:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStories();
  }, [authorName]);

  const handleGoBack = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  const handleDelete = async (storyId) => {
    if (!window.confirm("Bu evreni yok etmek istediğine emin misin Sema? 🌌")) return;
    try {
      await axios.delete(`http://127.0.0.1:8000/api/stories/${storyId}/`, {
        params: { current_user: currentUser.username }
      });
      setUserStories(prev => prev.filter(s => s.id !== storyId));
      alert("Mühür söküldü.");
    } catch (err) {
      alert("Hata oluştu.");
    }
  };

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
      <div className="bg-white border-b border-slate-200 pt-10 pb-6 px-6">
        <div className="container mx-auto max-w-4xl">
          <button onClick={handleGoBack} className="flex items-center gap-2 text-slate-400 hover:text-orange-600 mb-8 transition-all font-bold text-sm">
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
                {!isMyProfile ? (
                  <>
                    <button onClick={handleFollow} className={`px-6 py-2.5 rounded-xl font-bold transition-all ${isFollowing ? 'bg-slate-200 text-slate-700' : 'bg-orange-600 text-white shadow-lg'}`}>
                       {isFollowing ? 'Takibi Bırak' : 'Takip Et'}
                    </button>
                    <button onClick={() => setIsChatOpen(true)} className="bg-white border-2 border-slate-100 px-6 py-2.5 rounded-xl font-bold shadow-sm">
                      Mesaj Gönder
                    </button>
                  </>
                ) : (
                  <button onClick={() => setIsEditModalOpen(true)} className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-orange-600 transition-all shadow-lg">
                    <Edit3 size={18} className="inline mr-2" /> Profili Düzenle
                  </button>
                )}
              </div>
            </div>

            <div className="flex gap-8 border-l border-slate-100 pl-8 hidden lg:flex">
              <div className="text-center">
                <p className="text-2xl font-black text-slate-900">{userStories.length}</p>
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

      <div className="container mx-auto max-w-4xl py-12 px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="md:col-span-2">
            <h3 className="text-lg font-black mb-6 flex items-center gap-2 text-slate-800 uppercase tracking-wider">
              <Book size={20} className="text-orange-500" /> Yayınlanan Hikayeler
            </h3>
            
            <div className="space-y-4">
              {loading ? (
                <div className="p-12 text-center text-slate-300 font-bold animate-pulse">Yükleniyor...</div>
              ) : userStories.length > 0 ? (
                userStories.map(story => (
                  <div key={story.id} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex justify-between items-center group">
                    <div className="cursor-pointer" onClick={() => navigate(`/hikaye/${story.id}`)}>
                      <h4 className="font-bold text-slate-900 group-hover:text-orange-600 transition-colors uppercase italic">
                        {story.title}
                      </h4>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-1">{story.summary}</p>
                    </div>
                    {isMyProfile && (
                      <button onClick={() => handleDelete(story.id)} className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                        <Trash2 size={20} />
                      </button>
                    )}
                  </div>
                ))
              ) : (
                <div className="p-12 bg-white border-2 border-dashed border-slate-200 rounded-3xl text-center text-slate-400">
                  Henüz bir eser paylaşılmadı.
                </div>
              )}
            </div>
          </div>
          
          <div className="space-y-6">
            <h3 className="text-lg font-black mb-6 flex items-center gap-2 text-slate-800 uppercase tracking-wider">
              <Users size={20} className="text-orange-500" /> Pano
            </h3>
            {isMyProfile && (
              <form onSubmit={handlePostToPano} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                <textarea 
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  placeholder="Panoya bir şey yaz..."
                  className="w-full bg-slate-50 border-none rounded-lg p-3 text-sm outline-none focus:ring-1 focus:ring-orange-500 resize-none h-20"
                />
                <button className="mt-2 w-full bg-slate-900 text-white py-2 rounded-lg text-xs font-bold hover:bg-orange-600 transition-colors">
                  Paylaş <Send size={14} className="inline ml-1" />
                </button>
              </form>
            )}
            <div className="space-y-4">
              {panoPosts.map(post => (
                <div key={post.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                  <p className="text-slate-700 text-sm">{post.text}</p>
                  <span className="text-[10px] text-slate-400 mt-3 block font-bold uppercase tracking-tighter">{post.date}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* --- MODAL BURADA --- */}
      {isEditModalOpen && currentUser && (
        <EditProfileModal 
          isOpen={isEditModalOpen} 
          onClose={() => setIsEditModalOpen(false)} 
          user={currentUser}
          onUpdate={(u) => console.log("Başarıyla güncellendi:", u)}
        />
      )}

      {isChatOpen && <ChatBox authorName={authorName} onClose={() => setIsChatOpen(false)} />}
    </div>
  );
};

export default AuthorProfile;