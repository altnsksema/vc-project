import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import StoryDetail from './pages/StoryDetail';
import AuthorProfile from './pages/AuthorProfile';
import Login from './pages/Login';
import NotificationBell from './components/notifications/NotificationBell';
import ChapterEditor from './pages/ChapterEditor';
import { AuthProvider, useAuth } from './context/AuthContext';
import CreateStory from './pages/CreateStory';

// --- Material UI Importları (Eksik kısımlar için) ---
import { Popover, List, ListItem, ListItemIcon, ListItemText, Divider, Avatar } from '@mui/material';
import { Edit3, Book, Settings, LogOut, PlusCircle, User } from 'lucide-react'; 

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  // Popover State'i
  const [anchorEl, setAnchorEl] = useState(null);
  const handleOpen = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  if (location.pathname === '/login') return null;

  return (
    <nav className="bg-white border-b p-4 flex justify-between items-center shadow-sm sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <a href="/" className="text-xl font-black text-orange-600 uppercase tracking-tighter">
          Hikaye <span className="text-slate-900">Evreni</span>
        </a>

        <div className="flex gap-4 items-center">
          {user ? (
            <>
              <NotificationBell userId={user.id} />
              
              {/* Tıklanabilir Avatar */}
              <div 
                onClick={handleOpen}
                className="w-10 h-10 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold cursor-pointer hover:bg-orange-600 transition-all shadow-sm ring-2 ring-orange-100"
              >
                {user.username[0].toUpperCase()}
              </div>

              {/* --- 👤 PROFİL MENÜSÜ (POPOVER) --- */}
              <Popover
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                PaperProps={{
                  sx: { width: 220, mt: 1.5, borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }
                }}
              >
                <List sx={{ p: 1 }}>
                  {/* Profil Düzenleme */}
                  <ListItem button onClick={() => { navigate(`/profil/${user.username}`); handleClose(); }}>
                    <ListItemIcon><User size={18} /></ListItemIcon>
                    <ListItemText primary="Profilim" />
                  </ListItem>

                  {/* Hikaye Oluşturma */}
                  <ListItem button onClick={() => { navigate('/yeni-hikaye'); handleClose(); }}>
                    <ListItemIcon><PlusCircle size={18} className="text-orange-500" /></ListItemIcon>
                    <ListItemText primary="Hikaye Oluştur" />
                  </ListItem>

                  {/* Kütüphane */}
                  <ListItem button onClick={() => { navigate('/kutuphane'); handleClose(); }}>
                    <ListItemIcon><Book size={18} /></ListItemIcon>
                    <ListItemText primary="Kütüphanem" />
                  </ListItem>

                  <Divider sx={{ my: 1 }} />

                  {/* Ayarlar */}
                  <ListItem button onClick={() => { navigate('/ayarlar'); handleClose(); }}>
                    <ListItemIcon><Settings size={18} /></ListItemIcon>
                    <ListItemText primary="Ayarlar" />
                  </ListItem>

                  {/* Çıkış Yap */}
                  <ListItem button onClick={() => { logout(); handleClose(); }} sx={{ color: 'error.main' }}>
                    <ListItemIcon><LogOut size={18} className="text-red-500" /></ListItemIcon>
                    <ListItemText primary="Çıkış Yap" />
                  </ListItem>
                </List>
              </Popover>
            </>
          ) : (
            <a href="/login" className="bg-slate-900 text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-orange-600 transition-all shadow-md">
              Giriş Yap
            </a>
          )}
        </div>
      </div>
    </nav>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-slate-50 font-sans">
          <Navigation />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/hikaye/:id" element={<StoryDetail />} />
            <Route path="/profil/:authorName" element={<AuthorProfile />} />
            <Route path="/hikaye/:storyId/yeni-bolum" element={<ChapterEditor />} />
            <Route path="/yeni-hikaye" element={<CreateStory />} />
            {/* Henüz boş olan rotalar için geçici mesajlar */}
            <Route path="/yeni-hikaye" element={<div className="p-20 text-center font-bold">📖 Buradan yeni bir dünya başlatacaksın Sema... (Yapım Aşamasında)</div>} />
            <Route path="/kutuphane" element={<div className="p-20 text-center font-bold">📚 Okuduğun ve yazdığın her şey burada olacak.</div>} />
            <Route path="/ayarlar" element={<div className="p-20 text-center font-bold">⚙️ Profilini buradan baştan yaratabilirsin.</div>} />
            <Route path="*" element={<div className="p-20 text-center font-bold text-slate-400">🌌 Evrenin sonuna geldin...</div>} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;