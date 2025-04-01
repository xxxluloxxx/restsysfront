import axios from 'axios';
import API_CONFIG from '../config/api.config';

export const ReservaService = {
    async getAll() {
        console.log('🚀 Iniciando petición a la API de reservas...');
        try {
            const response = await axios.get(API_CONFIG.getUrl('RESERVAS'));
            console.log('✅ Respuesta recibida de la API:', response.data);
            console.log('🔄 Reservas:', response.data);
            console.log(`📊 Total de reservas procesadas: ${response.data.length}`);

            return response.data;
        } catch (error) {
            console.error('❌ Error al obtener reservas:', error.message);
            if (error.response) {
                console.error('📝 Detalles del error:', {
                    status: error.response.status,
                    data: error.response.data
                });
            }
            throw error;
        }
    },

    async create(reserva) {
        console.log('🚀 Iniciando creación de nueva reserva...');
        console.log('📦 Datos de la reserva a crear:', reserva);
        try {
            const response = await axios.post(API_CONFIG.getUrl('RESERVAS'), reserva);
            console.log('✅ Reserva creada exitosamente:', response.data);
            return response.data;
        } catch (error) {
            console.error('❌ Error al crear la reserva:', error.message);
            if (error.response) {
                console.error('📝 Detalles del error:', {
                    status: error.response.status,
                    data: error.response.data
                });
            }
            throw error;
        }
    },

    async delete(id) {
        console.log('🚀 Iniciando eliminación de reserva...');
        console.log('📦 ID de la reserva a eliminar:', id);
        try {
            await axios.delete(`${API_CONFIG.getUrl('RESERVAS')}/${id}`);
            console.log('✅ Reserva eliminada exitosamente');
            return true;
        } catch (error) {
            console.error('❌ Error al eliminar la reserva:', error.message);
            if (error.response) {
                console.error('📝 Detalles del error:', {
                    status: error.response.status,
                    data: error.response.data
                });
            }
            throw error;
        }
    },

    async update(id, reserva) {
        console.log(`🚀 Iniciando actualización de la reserva con ID: ${id}`);
        console.log('📦 Datos de la reserva a actualizar:', reserva);
        try {
            const response = await axios.put(`${API_CONFIG.getUrl('RESERVAS')}/${id}`, reserva);
            console.log('✅ Reserva actualizada exitosamente:', response.data);
            return response.data;
        } catch (error) {
            console.error('❌ Error al actualizar la reserva:', error.message);
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
