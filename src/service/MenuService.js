import axios from 'axios';
import API_CONFIG from '../config/api.config';

export const MenuService = {
    async getAll1() {
        console.log('🚀 Iniciando petición a la API de menu 1...');
        try {
            const response = await axios.get(API_CONFIG.getUrl('MENU1'));
            console.log('✅ Respuesta recibida de la API:', response.data);
            console.log('🔄 Menu 1:', response.data);
            console.log(`📊 Total de categorias procesadas: ${response.data.length}`);

            return response.data;
        } catch (error) {
            console.error('❌ Error al obtener menu 1:', error.message);
            if (error.response) {
                console.error('📝 Detalles del error:', {
                    status: error.response.status,
                    data: error.response.data
                });
            }
            throw error;
        }
    },

    async getAll2() {
        console.log('🚀 Iniciando petición a la API de menu 2...');
        try {
            const response = await axios.get(API_CONFIG.getUrl('MENU2'));
            console.log('✅ Respuesta recibida de la API:', response.data);
            console.log('🔄 Menu 2:', response.data);
            console.log(`📊 Total de categorias procesadas: ${response.data.length}`);

            return response.data;
        } catch (error) {
            console.error('❌ Error al obtener menu 2:', error.message);
            if (error.response) {
                console.error('📝 Detalles del error:', {
                    status: error.response.status,
                    data: error.response.data
                });
            }
            throw error;
        }
    },


    /* async createProduct(producto) {
        console.log('🚀 Iniciando creación de nuevo producto...');
        console.log('📦 Datos del producto a guardar:', producto);
        try {
            const response = await axios.post(API_CONFIG.getUrl('PRODUCTOS'), producto);
            console.log('✅ Producto creado exitosamente:', response.data);
            return response.data;
        } catch (error) {
            console.error('❌ Error al crear el producto:', error.message);
            if (error.response) {
                console.error('📝 Detalles del error:', {
                    status: error.response.status,
                    data: error.response.data
                });
            }
            throw error;
        }
    },

    async deleteProduct(id) {
        console.log('🚀 Iniciando eliminación de producto...');
        console.log('📦 ID del producto a eliminar:', id);
        try {
            await axios.delete(`${API_CONFIG.getUrl('PRODUCTOS')}/${id}`);
            console.log('✅ Producto eliminado exitosamente');
            return true;
        } catch (error) {
            console.error('❌ Error al eliminar el producto:', error.message);
            if (error.response) {
                console.error('📝 Detalles del error:', {
                    status: error.response.status,
                    data: error.response.data
                });
            }
            throw error;
        }
    },

    async updateProduct(id, producto) {
        console.log(`🚀 Iniciando actualización del producto con ID: ${id}`);
        console.log('📦 Datos del producto a actualizar:', producto);
        try {
            // Primero obtenemos el producto existente
            const existingProduct = await axios.get(`${API_CONFIG.getUrl('PRODUCTOS')}/${id}`);

            // Mantenemos el createdAt del producto existente
            const productoToUpdate = {
                ...producto,
                createdAt: existingProduct.data.createdAt
            };

            const response = await axios.put(`${API_CONFIG.getUrl('PRODUCTOS')}/${id}`, productoToUpdate);
            console.log('✅ Producto actualizado exitosamente:', response.data);
            return response.data;
        } catch (error) {
            console.error('❌ Error al actualizar el producto:', error.message);
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
