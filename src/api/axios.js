import axios from 'axios';

// ==========================================
// 1. ИНТЕЛЛЕКТУАЛЬНАЯ КОНФИГУРАЦИЯ (СЕНЬОР-ХАК)
// ==========================================
// Так как фронт и бэк теперь в РАЗНЫХ контейнерах, мы убираем привязку к относительному '/api'.
// Теперь единый источник истины — это переменная окружения VITE_API_URL (которую ты прокинешь в Docker/Vite).
// Если переменной вдруг нет (забыли прописать) — железно стучимся на твой боевой API.
const API_URL = 'https://api-r.yeee.kz/api';

const API = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// ... остальной код интерсепторов и эндпоинтов остается без изменений!

// ==========================================
// 2. ИНТЕРСЕПТОР ЗАПРОСОВ (АВТО-ТОКЕН)
// ==========================================
API.interceptors.request.use(
    (config) => {
        // Единый стандарт ключа: 'token'
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// ==========================================
// 3. ИНТЕРСЕПТОР ОТВЕТОВ (ГЛОБАЛЬНАЯ ОШИБКА 401)
// ==========================================
API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            console.warn('🚨 Сессия истекла или доступ закрыт. Выполняю выход.');
            localStorage.removeItem('token');
            localStorage.removeItem('user');

            // Если мы не на странице логина, делаем редирект
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

// ==========================================
// 4. API ЭНДПОИНТЫ (МЕТОДЫ)
// ==========================================

// --- AUTH (Авторизация) ---
export const login = (credentials) => API.post('/auth/login', credentials);
export const register = (userData) => API.post('/auth/register', userData); // Добавлена регистрация
export const getMe = () => API.get('/auth/me');
export const logout = () => API.post('/auth/logout');

// --- ANALYTICS (Аналитика) ---
// 🔥 SENIOR FIX: Маршрут на бэкенде был изменен с /analytics/dashboard на /analytics
export const fetchDashboardStats = (params) => API.get('/analytics', { params });
export const fetchAnalyticsChart = () => API.get('/analytics/chart'); // Новый эндпоинт для графиков

// --- ORDERS (Заказы) ---
export const fetchOrders = (params) => API.get('/orders', { params }); // Добавлена поддержка params (status, clientId)
export const fetchOrderById = (id) => API.get(`/orders/${id}`);
export const createOrder = (orderData) => API.post('/orders', orderData);
export const updateOrder = (id, orderData) => API.put(`/orders/${id}`, orderData);
export const deleteOrder = (id) => API.delete(`/orders/${id}`);

// --- FINANCE (Расходы фирмы) ---
export const fetchExpenses = (params) => API.get('/finance/expenses', { params });
export const addExpense = (expenseData) => API.post('/finance/expenses', expenseData);
export const updateExpense = (id, expenseData) => API.put(`/finance/expenses/${id}`, expenseData);
export const deleteExpense = (id) => API.delete(`/finance/expenses/${id}`);

// --- PRICES (Прайс-лист) ---
export const fetchPrices = () => API.get('/prices');
export const fetchPriceById = (id) => API.get(`/prices/${id}`);
export const addPrice = (priceData) => API.post('/prices', priceData);
export const updatePrice = (id, priceData) => API.put(`/prices/${id}`, priceData);
export const deletePrice = (id) => API.delete(`/prices/${id}`);

// --- PORTFOLIO (Наши работы) ---
export const fetchPortfolio = (params) => API.get('/portfolio', { params });
export const fetchPortfolioItem = (id) => API.get(`/portfolio/${id}`); // Восстановлено в бэкенде
export const addPortfolio = (formData) => API.post('/portfolio', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
});
// 🔥 SENIOR UPDATE: Теперь PUT тоже поддерживает multipart/form-data для обновления фото
export const updatePortfolioItem = (id, formData) => API.put(`/portfolio/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
});
export const deletePortfolioItem = (id) => API.delete(`/portfolio/${id}`);

// --- USERS (Персонал) ---
export const fetchUsers = () => API.get('/users');
export const fetchUserById = (id) => API.get(`/users/${id}`);
export const createUser = (userData) => API.post('/users', userData);
export const updateUser = (id, userData) => API.put(`/users/${id}`, userData);
export const deleteUser = (id) => API.delete(`/users/${id}`);

// ==========================================
// 🔥 НОВЫЕ ENTERPRISE МОДУЛИ
// ==========================================

// --- SETTINGS (Настройки и Калькулятор) ---
export const fetchCalculatorSettings = () => API.get('/settings/calculator');
export const updateCalculatorSettings = (data) => API.put('/settings/calculator', data);
export const fetchAllSettings = () => API.get('/settings');
export const fetchSettingByKey = (key) => API.get(`/settings/cms/${key}`);
export const upsertSettingByKey = (key, data) => API.put(`/settings/cms/${key}`, data);

// --- PAGES & PAGE BUILDER (Headless CMS) ---
export const fetchPublicBlocks = (params) => API.get('/pages/public', { params }); // params: { page: 'slug' }
export const fetchAdminBlocks = (params) => API.get('/pages/admin/blocks', { params });
export const reorderBlocks = (blocks) => API.post('/pages/blocks/reorder', { blocks });
export const createPageBlock = (formData) => API.post('/pages/blocks', formData, {
    headers: { 'Content-Type': 'multipart/form-data' } // Поддержка загрузки фона блока
});
export const updatePageBlock = (id, formData) => API.put(`/pages/blocks/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
});
export const deletePageBlock = (id) => API.delete(`/pages/blocks/${id}`);

// Управление самими страницами
export const fetchAllPages = () => API.get('/pages/all');
export const createPage = (data) => API.post('/pages/create', data);
export const updatePage = (slug, data) => API.put(`/pages/update/${slug}`, data);

// --- MEDIA LIBRARY (Медиабиблиотека) ---
export const fetchMedia = () => API.get('/media');
export const uploadMedia = (formData) => API.post('/media', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
});
export const deleteMedia = (fileName) => API.delete(`/media/${fileName}`);

// --- AUDIT LOGS (Журнал аудита) ---
export const fetchAuditLogs = (params) => API.get('/audit', { params });
export const fetchAuditLogById = (id) => API.get(`/audit/${id}`);

// Экспортируем сам инстанс по умолчанию
export default API;