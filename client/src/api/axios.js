import axios from 'axios';

const clienteAxios = axios.create({
  baseURL: 'http://localhost:3001/api', // url del back
  withCredentials: true
});

export default clienteAxios;