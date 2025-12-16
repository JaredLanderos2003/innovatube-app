import axios from 'axios';

const urlBase = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

const clienteAxios = axios.create({
  baseURL: urlBase, 
  withCredentials: true
});

export default clienteAxios;