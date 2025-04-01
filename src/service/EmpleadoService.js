import axios from 'axios';

const API_URL = 'http://localhost:8081/api';

export const EmpleadoService = {
    async getAll() {
        try {
            const response = await axios.get(`${API_URL}/empleados`);
            console.log('Respuesta de empleados:');
            console.log(response.data);
            return response.data;
        } catch (error) {
            console.error('Error al obtener empleados:', error);
            throw error;
        }
    },

    async getById(id) {
        try {
            const response = await axios.get(`${API_URL}/empleados/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error al obtener empleado:', error);
            throw error;
        }
    },

    async create(empleado) {
        console.log('Empleado a crear:', empleado);
        try {
            const response = await axios.post(`${API_URL}/empleados`, empleado);
            return response.data;
        } catch (error) {
            console.error('Error al crear empleado:', error);
            throw error;
        }
    },

    async update(id, empleado) {
        try {
            const response = await axios.put(`${API_URL}/empleados/${id}`, empleado);
            return response.data;
        } catch (error) {
            console.error('Error al actualizar empleado:', error);
            throw error;
        }
    },

    async delete(id) {
        try {
            await axios.delete(`${API_URL}/empleados/${id}`);
            return true;
        } catch (error) {
            console.error('Error al eliminar empleado:', error);
            throw error;
        }
    }
};
