import axios from 'axios';

const urlBase = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

const clienteAxios = axios.create({
  baseURL: urlBase, 
  withCredentials: true 
});

clienteAxios.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});


export default clienteAxios;