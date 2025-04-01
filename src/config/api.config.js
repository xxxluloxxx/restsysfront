// Configuración de URLs de servicios API
const API_CONFIG = {
    // URLs base para diferentes ambientes
    BASE_URL: {
        development: 'http://localhost:8081',
        production: 'https://restsys-production.up.railway.app', // Cambia esto por tu URL de producción
        staging: 'https://staging-api.tudominio.com' // Cambia esto por tu URL de staging
    },

    // Endpoints específicos
    ENDPOINTS: {
        PRODUCTOS: '/api/productos',
        PACIENTES: '/api/pacientes',
        MEDICOS: '/api/medicos',
        FICHAS_ODONTOLOGICAS: '/api/fichas-odontologicas',
        PROFORMAS: '/api/proformas',
        GRAFICAS: '/api/graficas',
        CITAS: '/api/citas',
        ODONTOGRAMA: '/api/odontograma',
        IMAGENES_FICHA: '/api/imagenes-fichas',
        CATEGORIAS: '/api/categorias',
        MESAS: '/api/mesas',
        MESEROS: '/api/meseros',
        RESERVAS: '/api/reservas',
        PEDIDOS: '/api/pedidos',
        DETALLES_PEDIDOS: '/api/detalles-pedido',
        MENU1: '/api/menu/menu1',
        MENU2: '/api/menu/menu2',
        LOGIN: '/api'

    },

    // Función helper para obtener la URL base según el ambiente
    getBaseUrl: function () {
        const env = process.env.NODE_ENV || 'development';
        return this.BASE_URL[env];
    },

    // Función helper para obtener la URL completa de un endpoint
    getUrl: function (endpoint) {
        return `${this.getBaseUrl()}${this.ENDPOINTS[endpoint]}`;
    }
};
export default API_CONFIG;
