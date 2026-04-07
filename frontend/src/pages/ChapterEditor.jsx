import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Container, 
  Paper, 
  IconButton,
  Tooltip 
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import axios from 'axios';

const ChapterEditor = () => {
  const { storyId } = useParams(); // URL'den hangi hikayeye yazıyoruz onu alıyoruz
  const navigate = useNavigate();
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!title || !content) {
      alert("Sema, başlık veya içeriği boş bırakamazsın! ✍️");
      return;
    }

    setLoading(true);
    try {
      // Senin backend'deki @router.post("/story/{story_id}/") endpoint'ine gidiyoruz
      await axios.post(`http://localhost:8000/api/chapters/story/${storyId}/`, {
        title: title,
        content: content
      });
      
      alert("Bölüm başarıyla mühürlendi! 🦾");
      navigate(`/stories/${storyId}`); // Kayıttan sonra hikaye detayına geri dön
    } catch (error) {
      console.error("Yazarken bir hata oluştu:", error);
      alert("Bir şeyler ters gitti, konsolu kontrol et.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      {/* Üst Bar: Geri Dönüş ve Başlık */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Tooltip title="Geri Dön">
          <IconButton onClick={() => navigate(-1)} sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
        </Tooltip>
        <Typography variant="h5" sx={{ fontWeight: 700, color: '#2d3748' }}>
          Yeni Bölüm Oluştur
        </Typography>
      </Box>

      <Paper elevation={0} sx={{ p: 4, borderRadius: '16px', border: '1px solid #e2e8f0' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          
          {/* Bölüm Başlığı */}
          <TextField
            label="Bölüm Başlığı"
            variant="standard"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            InputProps={{
              sx: { fontSize: '1.5rem', fontWeight: 600 }
            }}
            placeholder="Bölümün adını buraya yaz..."
          />

          {/* İçerik Alanı (2000 Kelimelik Yer!) */}
          <TextField
            label="Hikayeni Buraya Dök..."
            multiline
            rows={15}
            fullWidth
            variant="outlined"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            sx={{ 
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                backgroundColor: '#f8fafc'
              }
            }}
            placeholder="Bir varmış bir yokmuş..."
          />

          {/* Kaydet Butonu */}
          <Button
            variant="contained"
            size="large"
            startIcon={<SaveIcon />}
            onClick={handleSave}
            disabled={loading}
            sx={{ 
              py: 1.5, 
              borderRadius: '12px', 
              textTransform: 'none',
              fontSize: '1.1rem',
              fontWeight: 600,
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}
          >
            {loading ? 'Yayınlanıyor...' : 'Bölümü Yayınla'}
          </Button>

        </Box>
      </Paper>
    </Container>
  );
};

export default ChapterEditor;