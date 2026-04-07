import React, { useEffect, useState } from 'react';
import socket from './socket';
import { Badge, IconButton, Popover, List, ListItem, ListItemText, Typography, Divider, Box } from '@mui/material';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';

const NotificationBell = ({ userId }) => {
  const [notifications, setNotifications] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    if (!userId) return;
    socket.emit('join-room', userId);

    const handleNewNotification = (data) => {
      setNotifications(prev => [data, ...prev]);
    };

    socket.on('new-notification', handleNewNotification);
    return () => socket.off('new-notification', handleNewNotification);
  }, [userId]);

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const open = Boolean(anchorEl);
  const id = open ? 'notification-popover' : undefined;

  return (
    <>
      <IconButton 
        onClick={handleClick} 
        sx={{ 
          color: 'slate.600',
          transition: 'transform 0.2s',
          '&:hover': { transform: 'scale(1.1)' } 
        }}
      >
        <Badge 
          badgeContent={notifications.length} 
          color="error"
          sx={{ '& .MuiBadge-badge': { fontWeight: 'bold' } }}
        >
          {notifications.length > 0 ? <NotificationsActiveIcon /> : <NotificationsNoneIcon />}
        </Badge>
      </IconButton>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: { 
            width: 360, 
            maxHeight: 480, 
            mt: 2.5, // Çanla arasını biraz açtık
            borderRadius: '16px', // Kartlarındaki ovallik
            border: '1px solid rgba(0,0,0,0.06)', 
            boxShadow: '0 15px 35px rgba(0,0,0,0.1)', // Daha derin ve modern gölge
            overflow: 'hidden'
          }
        }}
      >
        {/* Başlık Kısmı */}
        <Box sx={{ p: 2.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: 'white' }}>
          <Typography variant="h6" sx={{ fontSize: '1.1rem', fontWeight: 700, color: '#1a202c' }}>
            Bildirimler
          </Typography>
          {notifications.length > 0 && (
            <Typography 
              onClick={() => setNotifications([])} 
              variant="caption" 
              sx={{ 
                cursor: 'pointer', 
                color: 'primary.main', 
                fontWeight: 600,
                '&:hover': { textDecoration: 'underline' } 
              }}
            >
              Hepsini Temizle
            </Typography>
          )}
        </Box>
        <Divider />

        <List sx={{ p: 0 }}>
          {notifications.length > 0 ? (
            notifications.map((notif, index) => (
              <ListItem 
                key={index} 
                divider={index !== notifications.length - 1} 
                sx={{ 
                  py: 2, // Daha ferah satırlar
                  px: 2.5,
                  '&:hover': { bgcolor: 'rgba(0,0,0,0.02)' },
                  transition: 'background 0.2s'
                }}
              >
                <ListItemText 
                  primary={notif.text} 
                  secondary={new Date(notif.date).toLocaleTimeString()}
                  primaryTypographyProps={{ 
                    fontSize: '0.9rem', 
                    fontWeight: 500,
                    color: '#2d3748',
                    mb: 0.5 
                  }}
                  secondaryTypographyProps={{ 
                    fontSize: '0.75rem',
                    color: 'text.disabled'
                  }}
                />
              </ListItem>
            ))
          ) : (
            /* Boş Durum Tasarımı */
            <Box sx={{ py: 8, px: 4, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Box 
                sx={{ 
                  width: 60, height: 60, borderRadius: '50%', 
                  bgcolor: '#f7fafc', display: 'flex', 
                  alignItems: 'center', justifyContent: 'center', mb: 2 
                }}
              >
                <NotificationsNoneIcon sx={{ fontSize: 30, color: '#cbd5e0' }} />
              </Box>
              <Typography variant="body2" sx={{ color: '#718096', fontWeight: 500 }}>
                Henüz yeni bir bildirim yok.
              </Typography>
              <Typography variant="caption" sx={{ color: '#a0aec0', mt: 0.5 }}>
                Buralar şimdilik sessiz...
              </Typography>
            </Box>
          )}
        </List>
      </Popover>
    </>
  );
};

export default NotificationBell;