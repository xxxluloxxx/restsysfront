import { useAuthStore } from '@/stores/auth';

export const authGuard = (to, from, next) => {
    const authStore = useAuthStore();
    const userData = localStorage.getItem('userData');

    // Permitir acceso a la ruta de solicitud de mesero sin autenticación
    if (to.meta.requiresAuth === false) {
        next();
        return;
    }

    // Si no hay datos de usuario y no está en la página de login
    if (!userData && to.path !== '/auth/login') {
        next('/auth/login');
    } else {
        // Si hay datos de usuario, inicializar el store
        if (userData) {
            authStore.initializeFromStorage();
        }
        next();
    }
};
