<script setup>
import { useLayout } from '@/layout/composables/layout';
import { onMounted, ref, watch } from 'vue';

const { getPrimary, getSurface, isDarkTheme } = useLayout();
const lineData = ref(null);
const lineData2 = ref(null);
const lineOptions = ref(null);

onMounted(() => {
    setColorOptions();
});

function setColorOptions() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');



    lineData.value = {
        labels: ['Enero', 'Febrero', 'Marzo', 'April', 'Mayo', 'Junio', 'Julio'],
        datasets: [
            {
                label: 'Ventas',
                data: [80, 75, 80, 81, 56, 55, 60],
                fill: false,
                backgroundColor: documentStyle.getPropertyValue('--p-primary-500'),
                borderColor: documentStyle.getPropertyValue('--p-primary-500'),
                tension: 0.4
            }
        ]
    };

    lineData2.value = {
        labels: ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo'],
        datasets: [
            {
                label: 'Ventas',
                data: [20, 30, 0, 8, 16, 55, 50],
                fill: false,
                backgroundColor: documentStyle.getPropertyValue('--p-primary-500'),
                borderColor: documentStyle.getPropertyValue('--p-primary-500'),
                tension: 0.4
            }
        ]
    };


    lineOptions.value = {
        plugins: {
            legend: {
                labels: {
                    fontColor: textColor
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: textColorSecondary
                },
                grid: {
                    color: surfaceBorder,
                    drawBorder: false
                }
            },
            y: {
                ticks: {
                    color: textColorSecondary
                },
                grid: {
                    color: surfaceBorder,
                    drawBorder: false
                }
            }
        }
    };
}

watch(
    [getPrimary, getSurface, isDarkTheme],
    () => {
        setColorOptions();
    },
    { immediate: true }
);
</script>

<template>
    <div class="card">
        <div class="card">
            <div class="font-semibold text-xl mb-4">Pedidos por mes</div>
            <Chart type="line" :data="lineData" :options="lineOptions"></Chart>
        </div>
    </div>
    <div class="card">
        <div class="card">
            <div class="font-semibold text-xl mb-4">Pedidos por dia</div>
            <Chart type="line" :data="lineData2" :options="lineOptions"></Chart>
        </div>
    </div>
</template>
