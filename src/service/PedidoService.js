import axios from 'axios';
import API_CONFIG from '../config/api.config';

export const PedidoService = {
    async getAll() {
        console.log('🚀 Iniciando petición a la API de pedidos...');
        try {
            const response = await axios.get(API_CONFIG.getUrl('PEDIDOS'));
            console.log('✅ Respuesta recibida de la API:', response.data);
            console.log('🔄 Pedidos:', response.data);
            console.log(`📊 Total de pedidos procesados: ${response.data.length}`);

            return response.data;
        } catch (error) {
            console.error('❌ Error al obtener pedidos:', error.message);
            if (error.response) {
                console.error('📝 Detalles del error:', {
                    status: error.response.status,
                    data: error.response.data
                });
            }
            throw error;
        }
    },

    async getAllDetalles() {
        console.log('🚀 Iniciando petición a la API de pedidos...');
        try {
            const response = await axios.get(`${API_CONFIG.getUrl('PEDIDOS')}/detalles`);
            console.log('✅ Respuesta recibida de la API:', response.data);
            console.log('🔄 Pedidos:', response.data);
            console.log(`📊 Total de pedidos procesados: ${response.data.length}`);

            return response.data;
        } catch (error) {
            console.error('❌ Error al obtener pedidos:', error.message);
            if (error.response) {
                console.error('📝 Detalles del error:', {
                    status: error.response.status,
                    data: error.response.data
                });
            }
            throw error;
        }
    },

    async getAllFecha() {
        console.log('🚀 Iniciando petición a la API de pedidos por fecha...');
        try {
            const fechaHoy = new Date().toISOString().split('T')[0];
            const response = await axios.get(`${API_CONFIG.getUrl('PEDIDOS')}/detalles/fecha/${fechaHoy}`);
            console.log('✅ Respuesta recibida de la API:', response.data);
            console.log('🔄 Pedidos:', response.data);
            console.log(`📊 Total de pedidos procesados: ${response.data.length}`);

            return response.data;
        } catch (error) {
            console.error('❌ Error al obtener pedidos por fecha:', error.message);
            if (error.response) {
                console.error('📝 Detalles del error:', {
                    status: error.response.status,
                    data: error.response.data
                });
            }
            throw error;
        }
    },

    async getAllUltimosDias() {
        console.log('🚀 Iniciando petición a la API de pedidos...');
        try {
            const response = await axios.get(`${API_CONFIG.getUrl('PEDIDOS')}/detalles/ultimos-dias/4`);
            console.log('✅ Respuesta recibida de la API:', response.data);
            console.log('🔄 Pedidos:', response.data);
            console.log(`📊 Total de pedidos procesados: ${response.data.length}`);

            return response.data;
        } catch (error) {
            console.error('❌ Error al obtener pedidos:', error.message);
            if (error.response) {
                console.error('📝 Detalles del error:', {
                    status: error.response.status,
                    data: error.response.data
                });
            }
            throw error;
        }
    },

    async create(pedido, detalles) {
        console.log('🚀 Iniciando creación de nuevo pedido...');
        console.log('📦 Datos del pedido a guardar:', pedido);

        try {
            const response = await axios.post(API_CONFIG.getUrl('PEDIDOS'), pedido);
            console.log('✅ Pedido creado exitosamente:', response.data);

            // Agregar el id del pedido a cada detalle
            const detallesConPedidoId = detalles.map((detalle) => ({
                ...detalle,
                pedido: {
                    id: response.data.id
                }
            }));

            console.log('📦 Detalles del pedido a guardar:', detallesConPedidoId);

            // Crear los detalles del pedido
            const detallesPromises = detallesConPedidoId.map((detalle) => axios.post(API_CONFIG.getUrl('DETALLES_PEDIDOS'), detalle));
            const detallesResponses = await Promise.all(detallesPromises);
            console.log(
                '✅ Detalles del pedido creados exitosamente:',
                detallesResponses.map((r) => r.data)
            );

            return response.data;
        } catch (error) {
            console.error('❌ Error al crear el pedido:', error.message);
            if (error.response) {
                console.error('📝 Detalles del error:', {
                    status: error.response.status,
                    data: error.response.data
                });
            }
            throw error;
        }
    },

    async update(id, pedido) {
        console.log(`🚀 Iniciando actualización del pedido con ID: ${id}`);
        console.log('📦 Datos del pedido a actualizar:', pedido);
        try {
            const response = await axios.put(`${API_CONFIG.getUrl('PEDIDOS')}/${id}`, pedido);
            return response.data;
        } catch (error) {
            console.error('❌ Error al actualizar el pedido:', error.message);
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
