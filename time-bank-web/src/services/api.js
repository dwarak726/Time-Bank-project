// src/services/api.js
import axios from 'axios';

// Create an Axios instance
const api = axios.create({
    baseURL: 'http://localhost:8000/api/', // Django backend base URL
});

// Automatically attach Authorization token to every request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Token ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Example API function to fetch tasks
export const fetchTasks = async () => {
    try {
        const response = await api.get('tasks/');
        return response.data;
    } catch (error) {
        console.error("There was an error fetching tasks:", error);
        throw error;
    }
};

// Example API function to create a new task
export const createTask = async (taskData) => {
    try {
        const response = await api.post('tasks/', taskData);
        return response.data;
    } catch (error) {
        console.error("Error creating task:", error);
        throw error;
    }
};

// Example API function to login user (optional)
export const loginUser = async (username, password) => {
    try {
        const response = await api.post('token-auth/', { username, password });
        const { token } = response.data;
        localStorage.setItem('token', token);
        return true;
    } catch (error) {
        console.error('Login failed:', error);
        return false;
    }
};

export default api;
