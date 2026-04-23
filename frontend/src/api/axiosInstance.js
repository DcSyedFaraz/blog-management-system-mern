import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const axiosInstance = axios.create({ baseURL: BASE_URL });

// Attach the stored access token as a Bearer header before every request.
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// On 401, attempt a silent token refresh and replay the original request once.
// _retry flag prevents infinite loops if the refresh call itself returns 401.
// A plain axios call (not axiosInstance) is used for the refresh so it doesn't
// trigger this interceptor recursively.
axiosInstance.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (!original) return Promise.reject(error);

    // Wrong credentials return 401 too — never run refresh for those or we replay login,
    // and failed refresh triggers a full-page redirect that wipes the error message.
    const url = (original.url || '').toLowerCase();
    const isPublicAuth = url.includes('/auth/login') || url.includes('/auth/register');

    if (error.response?.status === 401 && !original._retry && !isPublicAuth) {
      original._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const { data } = await axios.post(`${BASE_URL}/auth/refresh`, { refreshToken });
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        original.headers.Authorization = `Bearer ${data.accessToken}`;
        return axiosInstance(original); // replay with new token
      } catch {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        const path = window.location.pathname;
        if (path !== '/login' && path !== '/register') {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
