// src/services/messageService.js
export const messageService = {
  // Şimdilik Mock (Sahte) verilerle çalışıyoruz
  getMessages(authorName) {
    return [
      { id: 1, sender: authorName, text: "Yeni bölüm ne zaman geliyor?", time: "10:30" },
      { id: 2, sender: "Sema", text: "Bu akşam yayında olacak! ✨", time: "11:00" },
    ];
  },

  sendMessage(text, toAuthor) {
    const newMessage = {
      id: Date.now(),
      sender: "Sema", // Login olduktan sonra burası dinamik olacak
      text: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    console.log(`${toAuthor} kişisine mesaj gönderildi:`, newMessage);
    return newMessage;
  }
};