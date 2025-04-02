<script setup>
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { NotificacionService } from '../service/NotificacionService';

const route = useRoute();
const mesaId = ref('');
const solicitudEnviada = ref(false);
const toast = useToast();

onMounted(() => {
    mesaId.value = route.params.mesaId;
});

function createNotificacion() {
    const notificacionData = {
        descripcion: `Solicitud de mesero para la mesa ${mesaId.value}`,
        numeroMesa: 1,
        estado: true
    };
    NotificacionService.create(notificacionData)
        .then(() => {
            solicitudEnviada.value = true;
            toast.add({ severity: 'success', summary: 'Éxito', detail: 'Solicitud enviada correctamente', life: 3000 });
        })
        .catch((error) => {
            console.error('Error al crear la notificación:', error);
            toast.add({ severity: 'error', summary: 'Error', detail: 'Error al enviar la solicitud', life: 3000 });
        });
}
</script>

<template>
    <div class="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
        <div class="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
            <h1 class="text-3xl font-bold text-center mb-8">Mesa {{ mesaId }}</h1>

            <div class="flex flex-col items-center space-y-6">
                <div class="text-center">
                    <p class="text-gray-600 mb-4">¿Necesitas ayuda?</p>
                    <button
                        @click="createNotificacion"
                        :disabled="solicitudEnviada"
                        class="bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-8 rounded-lg text-xl transition-colors duration-200 transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                        {{ solicitudEnviada ? 'Solicitud Enviada' : 'Solicitar Mesero' }}
                    </button>
                </div>

                <div v-if="solicitudEnviada" class="mt-4 p-4 bg-green-100 text-green-700 rounded-lg">
                    <p>¡Solicitud enviada! Un mesero llegará pronto.</p>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* Estilos adicionales si son necesarios */
</style>
