<script setup>
import NotificacionGlobal from './components/NotificacionGlobal.vue';
</script>

<template>
    <Suspense>
        <router-view />
    </Suspense>
    <NotificacionGlobal />
</template>

<style scoped></style>
