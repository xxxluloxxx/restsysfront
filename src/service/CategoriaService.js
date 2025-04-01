import axios from 'axios';
import API_CONFIG from '../config/api.config';

export const CategoriaService = {
    async getAll() {
        console.log('🚀 Iniciando petición a la API de categorias...');
        try {
            const response = await axios.get(API_CONFIG.getUrl('CATEGORIAS'));
            console.log('✅ Respuesta recibida de la API:', response.data);
            console.log('🔄 Categorias:', response.data);
            console.log(`📊 Total de categorias procesadas: ${response.data.length}`);

            return response.data;
        } catch (error) {
            console.error('❌ Error al obtener categorias:', error.message);
            if (error.response) {
                console.error('📝 Detalles del error:', {
                    status: error.response.status,
                    data: error.response.data
                });
            }
            throw error;
        }
    },

    async create(categoria) {
        console.log('🚀 Iniciando creación de nueva categoria...');
        console.log('📦 Datos de la categoria a guardar:', categoria);
        try {
            const response = await axios.post(API_CONFIG.getUrl('CATEGORIAS'), categoria);
            console.log('✅ Categoria creada exitosamente:', response.data);
            return response.data;
        } catch (error) {
            console.error('❌ Error al crear la categoria:', error.message);
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
    }
};
