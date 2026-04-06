// src/services/authService.js
import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/auth';

export const authService = {
  async login(email, password) {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    if (response.data.token) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  },

  async socialLogin(provider) {
    // Provider: 'google' veya 'apple'
    // Burada OAuth yönlendirmesi veya Firebase SDK tetiklenir
    console.log(`${provider} ile giriş başlatıldı...`);
    // Simülasyon:
    return { user: "Sema", token: "jwt-token-123" };
  },

  logout() {
    localStorage.removeItem('user');
  }
};