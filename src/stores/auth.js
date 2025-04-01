import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        userData: null,
        isAuthenticated: false
    }),

    actions: {
        setUserData(data) {
            this.userData = data;
            this.isAuthenticated = !!data;
        },

        clearUserData() {
            this.userData = null;
            this.isAuthenticated = false;
        },

        // Método para inicializar el estado desde localStorage (útil para persistencia)
        initializeFromStorage() {
            const storedData = localStorage.getItem('userData');
            if (storedData) {
                this.setUserData(JSON.parse(storedData));
            }
        }
    },

    getters: {
        getUserData: (state) => state.userData,
        isUserAuthenticated: (state) => state.isAuthenticated
    },

    persist: true
});
