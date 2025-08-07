import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://spiru-backend.onrender.com/api', // Replace with your backend API URL
  headers: {
    'Content-Type': 'application/json',
  },
});

export default instance;