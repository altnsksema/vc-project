import React, { useEffect, useState } from 'react';
import socket from './socket';
import { Badge, IconButton, Popover, List, ListItem, ListItemText, Typography, Divider, Box } from '@mui/material';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive'; // Bildirim varken dolusu olsun

const NotificationBell = ({ userId }) => {
  const [notifications, setNotifications] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null); // Popover'ın nerede açılacağını tutar

  useEffect(() => {
    if (!userId) return;
    socket.emit('join-room', userId);

    const handleNewNotification = (data) => {
      setNotifications(prev => [data, ...prev]);
    };

    socket.on('new-notification', handleNewNotification);
    return () => socket.off('new-notification', handleNewNotification);
  }, [userId]);

  // Popover'ı açma/kapama fonksiyonları
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const open = Boolean(anchorEl);
  const id = open ? 'notification-popover' : undefined;

  return (
    <>
      <IconButton onClick={handleClick} sx={{ color: 'slate.600' }}>
        <Badge badgeContent={notifications.length} color="error">
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
          sx: { width: 320, maxHeight: 400, mt: 1.5, borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }
        }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 600 }}>Bildirimler</Typography>
          {notifications.length > 0 && (
             <Typography 
               onClick={() => setNotifications([])} 
               variant="caption" 
               sx={{ cursor: 'pointer', color: 'primary.main', '&:hover': { textDecoration: 'underline' } }}
             >
               Temizle
             </Typography>
          )}
        </Box>
        <Divider />

        <List sx={{ p: 0 }}>
          {notifications.length > 0 ? (
            notifications.map((notif, index) => (
              <ListItem key={index} divider={index !== notifications.length - 1} sx={{ '&:hover': { bgcolor: 'action.hover' } }}>
                <ListItemText 
                  primary={notif.text} 
                  secondary={new Date(notif.date).toLocaleTimeString()}
                  primaryTypographyProps={{ fontSize: '0.875rem' }}
                  secondaryTypographyProps={{ fontSize: '0.75rem' }}
                />
              </ListItem>
            ))
          ) : (
            <Box sx={{ p: 4, textCenter: 'center', textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                🌌 Henüz bildirim yok.
              </Typography>
            </Box>
          )}
        </List>
      </Popover>
    </>
  );
};

export default NotificationBell;