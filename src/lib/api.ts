import axios, { AxiosInstance, AxiosError } from 'axios';
import { toast } from 'sonner';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.diycomponents.in';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add user email token (from original Nuxt app)
    const userEmail = localStorage.getItem('user_email');
    if (userEmail) {
      const encodedEmail = btoa(userEmail);
      config.headers['utoken'] = encodedEmail;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string }>) => {
    const status = error.response?.status;
    const message = error.response?.data?.message || 'An error occurred';

    switch (status) {
      case 401:
        // Unauthorized - clear auth and redirect to login
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_email');
        window.location.href = '/auth/login';
        toast.error('Session expired. Please login again.');
        break;
      case 403:
        toast.error('Access denied');
        break;
      case 404:
        toast.error('Resource not found');
        break;
      case 500:
        toast.error('Server error. Please try again later.');
        break;
      default:
        toast.error(message);
    }

    return Promise.reject(error);
  }
);

export default apiClient;

// API helper functions
export const api = {
  // Auth
  auth: {
    login: (credentials: { e_mail_id: string; password: string }) =>
      apiClient.post('/auth/login', credentials),
    register: (data: {
      first_name: string;
      last_name: string;
      e_mail_id: string;
      phone: string;
      password: string;
    }) => apiClient.post('/auth/register', data),
    profile: () => apiClient.get('/auth/profile'),
    logout: () => apiClient.get('/auth/logout'),
  },

  // Products
  products: {
    getAll: (params?: any) => apiClient.get('/product', { params }),
    getOne: (sku: string) => apiClient.get(`/product/${sku}`),
    search: (query: string) => apiClient.get('/product/search', { params: { q: query } }),
    getByCategory: (category: string) => apiClient.get(`/product/category/${category}`),
  },

  // Categories
  categories: {
    getAll: () => apiClient.get('/product/categories'),
    getFiltered: () => apiClient.get('/product/categories/filtered'),
  },

  // Cart
  cart: {
    get: () => apiClient.get('/cart'),
    add: (item: { SKU: string; quantity: number }) => apiClient.post('/cart', item),
    update: (sku: string, quantity: number) =>
      apiClient.put(`/cart/${sku}`, { quantity }),
    remove: (sku: string) => apiClient.delete(`/cart/${sku}`),
    clear: () => apiClient.delete('/cart'),
  },

  // Orders
  orders: {
    getAll: () => apiClient.get('/orders'),
    getOne: (orderId: string) => apiClient.get(`/orders/${orderId}`),
    create: (data: any) => apiClient.post('/orders', data),
  },

  // Addresses
  addresses: {
    getAll: () => apiClient.get('/user/addresses'),
    add: (address: any) => apiClient.post('/user/addresses', address),
    update: (id: string, address: any) => apiClient.put(`/user/addresses/${id}`, address),
    delete: (id: string) => apiClient.delete(`/user/addresses/${id}`),
  },
};
