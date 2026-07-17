import axios from 'axios';

const API = axios.create({
  baseURL: 'http://10.200.18.101:5000/api',
});

// Automatically attach the user's JWT token to requests if they are logged in
API.interceptors.request.use((req) => {
  const userInfo = localStorage.getItem('userInfo');
  if (userInfo) {
    const { token } = JSON.parse(userInfo);
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;