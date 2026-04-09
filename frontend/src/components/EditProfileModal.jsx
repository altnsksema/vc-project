import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import axios from 'axios';

const EditProfileModal = ({ isOpen, onClose, user, onUpdate }) => {
  // Veri gelene kadar veya modal kapalıyken hiçbir şey yapma
  const [bio, setBio] = useState("");

  // Modal her açıldığında user bilgisini state'e eşitle
  useEffect(() => {
    if (user) {
      setBio(user.bio || "");
    }
  }, [user, isOpen]);

  if (!isOpen || !user) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Backend'e gönderim (Şimdilik URL'yi kontrol et)
      await axios.put(`http://127.0.0.1:8000/api/users/${user.username}`, {
        bio: bio
      });
      
      onUpdate({ ...user, bio });
      onClose();
      alert("Profil mühürlendi! ✨");
    } catch (err) {
      console.error(err);
      alert("Backend bağlantısı kurulamadı ama arayüz çalışıyor.");
      onClose(); // Hata alsa bile kapat ki beyaz ekran kalmasın
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[100] p-4">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100">
        <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
          <h2 className="font-black text-slate-900 uppercase tracking-tighter text-xl">Profili Düzenle</h2>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-all text-slate-400 hover:text-red-500">
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div>
            <label className="block text-[11px] font-black uppercase text-slate-400 mb-3 ml-1 tracking-widest">Biyografin</label>
            <textarea 
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full bg-slate-50 border-2 border-slate-100 rounded-3xl p-5 text-sm outline-none focus:border-orange-500 focus:bg-white transition-all h-40 resize-none shadow-inner"
              placeholder="Hikayen burada başlar..."
            />
          </div>
          
          <button type="submit" className="w-full bg-slate-900 text-white py-5 rounded-3xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-orange-600 transition-all shadow-xl shadow-orange-100 active:scale-95">
            <Save size={20} /> Değişiklikleri Mühürle
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;