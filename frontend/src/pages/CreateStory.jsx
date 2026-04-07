import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, TextField, Button, Typography, Box, Paper, MenuItem } from '@mui/material';
import { BookOpen, Send } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const CATEGORIES = ['Romantik', 'Bilim Kurgu', 'Fantastik', 'Gizem', 'Gençlik'];

const CreateStory = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    category: 'Romantik'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Backend'deki @router.post("/api/stories/") kısmına selam gönderiyoruz
      const response = await axios.post('http://127.0.0.1:8000/api/stories/', {
        ...formData,
        author: user?.username // Otomatik olarak giriş yapan yazarın adını ekle
      });
      
      alert("Evrenin ilk tohumu atıldı! 🌌");
      navigate(`/hikaye/${response.data.id}`); // Yeni hikayenin detayına git
    } catch (err) {
      console.error("Hikaye oluşturulurken bir hata oluştu:", err);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8, mb: 8 }}>
      <Paper elevation={0} sx={{ p: 5, borderRadius: '2.5rem', border: '1px solid #e2e8f0', boxShadow: '0 20px 40px rgba(0,0,0,0.05)' }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <div className="w-20 h-20 bg-orange-100 text-orange-600 rounded-3xl flex items-center justify-center mx-auto mb-4">
            <BookOpen size={40} />
          </div>
          <Typography variant="h4" sx={{ fontWeight: 900, color: '#1a202c' }}>Yeni Bir Dünya</Typography>
          <Typography variant="body2" sx={{ color: 'slate.500', mt: 1 }}>Hikayenin temellerini burada atıyoruz.</Typography>
        </Box>

        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              label="Hikaye Başlığı"
              fullWidth
              required
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
            />

            <TextField
              select
              label="Kategori"
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
            >
              {CATEGORIES.map((cat) => (
                <MenuItem key={cat} value={cat}>{cat}</MenuItem>
              ))}
            </TextField>

            <TextField
              label="Özet"
              multiline
              rows={4}
              fullWidth
              required
              placeholder="Okuyucularını meraklandıracak o cümleyi yaz..."
              value={formData.summary}
              onChange={(e) => setFormData({...formData, summary: e.target.value})}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '16px' } }}
            />

            <Button
              type="submit"
              variant="contained"
              size="large"
              startIcon={<Send size={18} />}
              sx={{ 
                bgcolor: '#ea580c', 
                py: 2, 
                borderRadius: '16px', 
                fontWeight: 'bold',
                '&:hover': { bgcolor: '#c2410c' }
              }}
            >
              Hikayeyi Mühürle
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default CreateStory;