import {create} from 'zustand';
import axios from '../lib/axios';
import {toast} from 'react-hot-toast'

export const useAuthStore = create((set, get) => ({
    user: null,
    profileUser: null,
    isSigningUp: false,

    signup: async (formData) => {
        set({isSigningUp: true});
        try {
            const response = await axios.post('/auth/register', formData);
            set({user: response.data.user, isSigningUp: false});
            toast.success('Registration successful! Please log in.');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Registration failed');
        }
        finally {
            set({isSigningUp: false});
        }
    },

    login: async (formData) => {
        try {
            const response = await axios.post('/auth/login', formData);
            set({user: response.data});
            toast.success('Login successful!');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Login failed');
        }
    },

    logout: async () => {
        try {
            await axios.post('/auth/logout');
            set({user: null});
            toast.success('Logout successful!');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Logout failed');
        }
    },

    getProfile: async (userId) => {
        try {
            const response = await axios.get(`/auth/profile/${userId}`);
            set({profileUser: response.data});
        } catch (error) {
            console.error('Failed to fetch user:', error);
        }
    },

    getMe: async () => {
        try {
            const response = await axios.get('/auth/me');
            set({user: response.data});
        } catch (error) {
            console.error('Failed to fetch user:', error);
        }
    }
}));