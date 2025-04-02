<script setup>
import { defineProps } from 'vue';

const props = defineProps({
    notificacion: {
        type: Object,
        required: true
    },
    onVer: {
        type: Function,
        required: true
    },
    onAtendido: {
        type: Function,
        required: true
    },
    onCerrar: {
        type: Function,
        required: true
    }
});
</script>

<template>
    <div class="flex flex-column gap-2" style="min-width: 300px">
        <div class="flex align-items-center gap-2">
            <i class="pi pi-info-circle" style="font-size: 2rem"></i>
            <span class="font-bold">Nueva notificación</span>
        </div>
        <p>{{ notificacion.descripcion }}</p>
        <div class="flex gap-2">
            <Button
                class="p-button-sm p-button-info"
                @click="onVer"
            >
                <i class="pi pi-eye"></i>
                <span class="ml-2">Ver</span>
            </Button>
            <Button
                class="p-button-sm p-button-success"
                @click="onAtendido"
            >
                <i class="pi pi-check"></i>
                <span class="ml-2">Atendido</span>
            </Button>
            <Button
                class="p-button-sm p-button-text"
                @click="onCerrar"
            >
                <i class="pi pi-times"></i>
                <span class="ml-2">Cerrar</span>
            </Button>
        </div>
    </div>
</template>
