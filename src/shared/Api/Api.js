import axios from 'axios';

// Carga la URL desde .env.development o .env.production
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, 
});

export default api;