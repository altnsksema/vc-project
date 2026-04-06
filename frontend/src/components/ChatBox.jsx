import React, { useState } from 'react';
import { Send, X, Smile } from 'lucide-react';

export const ChatBox = ({ authorName, onClose }) => {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { id: 1, sender: authorName, text: "Selam! Hikayelerimi beğendin mi?", isMe: false }
  ]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    setChatHistory([...chatHistory, { id: Date.now(), text: message, isMe: true }]);
    setMessage('');
  };

  return (
    <div className="fixed bottom-6 right-6 w-80 bg-white shadow-2xl rounded-2xl border border-slate-100 overflow-hidden flex flex-col z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* Header */}
      <div className="bg-slate-900 p-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-xs font-bold text-white">
            {authorName[0]}
          </div>
          <span className="text-white font-bold text-sm">{authorName}</span>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors"><X size={18} /></button>
      </div>

      {/* Mesaj Alanı */}
      <div className="h-64 overflow-y-auto p-4 space-y-3 bg-slate-50">
        {chatHistory.map((msg) => (
          <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-2.5 rounded-2xl text-xs font-medium ${
              msg.isMe ? 'bg-orange-600 text-white rounded-tr-none' : 'bg-white text-slate-700 shadow-sm rounded-tl-none border border-slate-100'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input Alanı */}
      <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-100 flex items-center gap-2">
        <input 
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Mesaj yaz..." 
          className="flex-1 bg-slate-100 border-none rounded-xl py-2 px-3 text-xs outline-none focus:ring-1 focus:ring-orange-500" 
        />
        <button type="submit" className="text-orange-600 hover:scale-110 transition-transform">
          <Send size={18} />
        </button>
      </form>
    </div>
  );
};