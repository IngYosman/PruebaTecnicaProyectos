import { create } from 'zustand';
import { jwtDecode } from 'jwt-decode';

export const useAuthStore = create((set) => ({
    token: localStorage.getItem('token') || null,
    user: localStorage.getItem('token') ? jwtDecode(localStorage.getItem('token')) : null,
    login: (token) => {
        localStorage.setItem('token', token);
        const decoded = jwtDecode(token);
        set({ token, user: decoded });
    },
    logout: () => {
        localStorage.removeItem('token');
        set({ token: null, user: null });
    },
    isAdmin: () => {
        const user = useAuthStore.getState().user;
        return user?.roles?.includes('ROLE_ADMIN') || false;
    }
}));
