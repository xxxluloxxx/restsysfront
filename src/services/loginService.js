import axios from 'axios';
import API_CONFIG from '../config/api.config';

export const loginService = {
    async authenticate(email, password) {
        try {
            const response = await axios.get(`${API_CONFIG.getUrl('LOGIN')}/usuarios/auth`, {
                params: {
                    email: email,
                    password: password
                }
            });
            console.log('Respuesta de autenticación:');
            console.log(response.data);
            return response.data;
        } catch (error) {
            console.error('Error en autenticación:', error);
            return false;
        }
    }
};
