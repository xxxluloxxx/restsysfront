<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { NotificacionService } from '../service/NotificacionService';

const route = useRoute();
const notificaciones = ref([]);
let intervalId = null;
const timeouts = ref({});

const mostrarNotificaciones = computed(() => {
    // Mostrar notificaciones en todas las rutas excepto en /mesa/
    return !route.path.startsWith('/mesa/');
});

const cargarNotificaciones = async () => {
    try {
        if (!mostrarNotificaciones.value) {
            return;
        }

        const data = await NotificacionService.getAll();
        // Filtrar solo las notificaciones activas
        notificaciones.value = data.filter(notif => notif.estado === true);

        // Iniciar temporizador para cada nueva notificación
        data.forEach(notificacion => {
            if (!timeouts.value[notificacion.id]) {
                timeouts.value[notificacion.id] = setTimeout(() => {
                    eliminarNotificacion(notificacion);
                }, 10000);
            }
        });
    } catch (error) {
        console.error('Error al cargar notificaciones:', error);
    }
};

const marcarComoAtendida = async (notificacion) => {
    try {
        // Limpiar el timeout de auto-eliminación
        clearTimeout(timeouts.value[notificacion.id]);
        delete timeouts.value[notificacion.id];

        // Actualizar el estado de la notificación en el backend
        const notificacionActualizada = {
            ...notificacion,
            estado: false
        };

        await NotificacionService.atendido(notificacion.id, notificacionActualizada);

        // Eliminar la notificación del array local
        notificaciones.value = notificaciones.value.filter(n => n.id !== notificacion.id);
    } catch (error) {
        console.error('Error al actualizar la notificación:', error);
        // Mostrar mensaje de error al usuario si lo deseas
    }
};

const eliminarNotificacion = (notificacion) => {
    clearTimeout(timeouts.value[notificacion.id]);
    delete timeouts.value[notificacion.id];
    notificaciones.value = notificaciones.value.filter(n => n.id !== notificacion.id);
};

onMounted(() => {
    if (mostrarNotificaciones.value) {
        cargarNotificaciones();
        intervalId = setInterval(cargarNotificaciones, 30000);
    }
});

onUnmounted(() => {
    if (intervalId) {
        clearInterval(intervalId);
    }
    // Limpiar todos los timeouts
    Object.values(timeouts.value).forEach(timeout => clearTimeout(timeout));
});
</script>

<template>
    <div v-if="mostrarNotificaciones" class="notificaciones-container">
        <div v-for="notificacion in notificaciones" :key="notificacion.id" class="notificacion-card">
            <div class="notificacion-header">
                <div class="notificacion-titulo-container">
                    <i class="pi pi-info-circle"></i>
                    <span class="notificacion-titulo">Nueva notificación</span>
                </div>
                <Button
                    class="p-button-rounded p-button-text p-button-sm"
                    @click="eliminarNotificacion(notificacion)"
                >
                    <i class="pi pi-times"></i>
                </Button>
            </div>
            <div class="notificacion-contenido">
                <p>{{ notificacion.descripcion }}</p>
            </div>
            <div class="notificacion-acciones">
                <Button
                    class="p-button-sm p-button-success"
                    @click="marcarComoAtendida(notificacion)"
                >
                    <i class="pi pi-check"></i>
                    <span class="ml-2">Atendido</span>
                </Button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.notificaciones-container {
    position: fixed;
    top: 1rem;
    right: 1rem;
    z-index: 1000;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.notificacion-card {
    background: rgba(255, 255, 255, 0.6);
    backdrop-filter: blur(5px);
    border-radius: 6px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    padding: 0.75rem;
    min-width: 250px;
    max-width: 300px;
    border: 1px solid rgba(255, 255, 255, 0.2);
}

.notificacion-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.25rem;
}

.notificacion-titulo-container {
    display: flex;
    align-items: center;
    gap: 0.25rem;
}

.notificacion-titulo {
    font-weight: bold;
    font-size: 0.9rem;
}

.notificacion-contenido {
    margin-bottom: 0.5rem;
    font-size: 0.85rem;
}

.notificacion-acciones {
    display: flex;
    justify-content: flex-end;
}

.p-button-sm {
    padding: 0.25rem 0.5rem;
    font-size: 0.8rem;
}
</style>
