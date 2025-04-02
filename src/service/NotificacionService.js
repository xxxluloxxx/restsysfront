import axios from 'axios';
import API_CONFIG from '../config/api.config';

export const NotificacionService = {
    async getAll() {
        console.log('🚀 Iniciando petición a la API de notificaciones...');
        try {
            const response = await axios.get(API_CONFIG.getUrl('NOTIFICACIONES'));
            console.log('✅ Respuesta recibida de la API:', response.data);
            console.log('🔄 Notificaciones:', response.data);
            console.log(`📊 Total de notificaciones procesadas: ${response.data.length}`);

            return response.data;
        } catch (error) {
            console.error('❌ Error al obtener notificaciones:', error.message);
            if (error.response) {
                console.error('📝 Detalles del error:', {
                    status: error.response.status,
                    data: error.response.data
                });
            }
            throw error;
        }
    },

    async create(notificacion) {
        console.log('🚀 Iniciando creación de nueva notificación...');
        console.log('📦 Datos de la notificación a guardar:', notificacion);
        try {
            const response = await axios.post(API_CONFIG.getUrl('NOTIFICACIONES'), notificacion);
            console.log('✅ Notificación creada exitosamente:', response.data);
            return response.data;
        } catch (error) {
            console.error('❌ Error al crear la notificación:', error.message);
            if (error.response) {
                console.error('📝 Detalles del error:', {
                    status: error.response.status,
                    data: error.response.data
                });
            }
            throw error;
        }
    },

    async atendido(id) {
        console.log(`🚀 Iniciando actualización de la notificacion con ID: ${id}`);
        try {
            const response = await axios.get(`${API_CONFIG.getUrl('NOTIFICACIONES')}/${id}/desactivar`);
            console.log('✅ Notificacion actualizada exitosamente:', response.data);
            return response.data;
        } catch (error) {
            console.error('❌ Error al actualizar la notificacion:', error.message);
            if (error.response) {
                console.error('📝 Detalles del error:', {
                    status: error.response.status,
                    data: error.response.data
                });
            }
            throw error;
        }
    }

    /* async delete(id) {
        console.log('🚀 Iniciando eliminación de categoria...');
        console.log('📦 ID de la categoria a eliminar:', id);
        try {
            await axios.delete(`${API_CONFIG.getUrl('CATEGORIAS')}/${id}`);
            console.log('✅ Categoria eliminada exitosamente');
            return true;
        } catch (error) {
            console.error('❌ Error al eliminar la categoria:', error.message);
            if (error.response) {
                console.error('📝 Detalles del error:', {
                    status: error.response.status,
                    data: error.response.data
                });
            }
            throw error;
        }
    },

    async update(id, categoria) {
        console.log(`🚀 Iniciando actualización de la categoria con ID: ${id}`);
        console.log('📦 Datos de la categoria a actualizar:', categoria);
        try {
            const response = await axios.put(`${API_CONFIG.getUrl('CATEGORIAS')}/${id}`, categoria);
            console.log('✅ Categoria actualizada exitosamente:', response.data);
            return response.data;
        } catch (error) {
            console.error('❌ Error al actualizar la categoria:', error.message);
            if (error.response) {
                console.error('📝 Detalles del error:', {
                    status: error.response.status,
                    data: error.response.data
                });
            }
            throw error;
        }
    } */
};
