import axios from 'axios';
import API_CONFIG from '../config/api.config';

export const ImagenFichaService = {
    async getAll() {
        try {
            const response = await axios.get(API_CONFIG.getUrl('IMAGENES_FICHA'));
            console.log('✅ Imágenes de ficha obtenidas exitosamente:', response.data);
            console.log(`📊 Total de imágenes procesadas: ${response.data.length}`);
            return response.data;
        } catch (error) {
            console.error('❌ Error al obtener las imágenes de ficha:', error.message);
            if (error.response) {
                console.error('📝 Detalles del error:', {
                    status: error.response.status,
                    data: error.response.data
                });
            }
            throw error;
        }
    },

    async create(imagenData) {
        try {
            const response = await axios.post(API_CONFIG.getUrl('IMAGENES_FICHA'), imagenData);
            console.log('✅ Imagen de ficha creada exitosamente:', response.data);
            return response.data;
        } catch (error) {
            console.error('❌ Error al crear la imagen de ficha:', error.message);
            if (error.response) {
                console.error('📝 Detalles del error:', {
                    status: error.response.status,
                    data: error.response.data
                });
            }
            throw error;
        }
    }
};
