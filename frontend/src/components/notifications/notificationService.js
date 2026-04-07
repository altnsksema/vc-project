import { io } from 'socket.io-client';

// Backend adresin (FastAPI genelde 8000'de çalışır)
const SOCKET_URL = "http://127.0.0.1:8000";

const socket = io(SOCKET_URL, {
  autoConnect: true,
  reconnection: true, // Bağlantı koparsa Alstom trenleri gibi otomatik geri bağlansın 🦾
});

// Bağlantı kontrolü (Konsolda "Bağlandı!" görmen lazım)
socket.on('connect', () => {
  console.log('✅ Bildirim sunucusuna başarıyla bağlandık, Sema!');
});

socket.on('disconnect', () => {
  console.log('❌ Bağlantı koptu, tekrar deneniyor...');
});

export default socket;