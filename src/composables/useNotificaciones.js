import { useToast } from 'primevue/usetoast';
import { h, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import NotificacionToast from '../components/NotificacionToast.vue';
import { NotificacionService } from '../service/NotificacionService';

export function useNotificaciones() {
    let intervalId = null;
    const toast = useToast();
    const route = useRoute();

    const cargarNotificaciones = async () => {
        try {
            // Verificar si estamos en la ruta /mesa/id
            if (route.path.startsWith('/mesa/')) {
                return; // No mostrar notificaciones en esta ruta
            }

            const notificaciones = await NotificacionService.getAll();
            notificaciones.forEach(notificacion => {
                if (notificacion.estado === true) {
                    const toastId = toast.add({
                        severity: 'info',
                        summary: 'Nueva notificación',
                        detail: notificacion.descripcion,
                        life: 5000,
                        sticky: true,
                        content: () => h(NotificacionToast, {
                            notificacion,
                            onVer: () => {
                                console.log('Ver notificación:', notificacion);
                            },
                            onAtendido: async () => {
                                try {
                                    await NotificacionService.atendido(notificacion.id);
                                    toast.add({
                                        severity: 'success',
                                        summary: 'Éxito',
                                        detail: 'Notificación marcada como atendida',
                                        life: 3000
                                    });
                                    toast.remove(toastId);
                                } catch (error) {
                                    console.error('Error al actualizar la notificación:', error);
                                    toast.add({
                                        severity: 'error',
                                        summary: 'Error',
                                        detail: 'No se pudo marcar la notificación como atendida',
                                        life: 3000
                                    });
                                }
                            },
                            onCerrar: () => {
                                toast.remove(toastId);
                            }
                        })
                    });
                }
            });
        } catch (error) {
            console.error('Error al cargar notificaciones:', error);
        }
    };

    const iniciarPolling = () => {
        // Cargar notificaciones inmediatamente
        cargarNotificaciones();

        // Configurar polling cada 30 segundos
        intervalId = setInterval(cargarNotificaciones, 30000);
    };

    const detenerPolling = () => {
        if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
        }
    };

    onMounted(() => {
        iniciarPolling();
    });

    onUnmounted(() => {
        detenerPolling();
    });
}
