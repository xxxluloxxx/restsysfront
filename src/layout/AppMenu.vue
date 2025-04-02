<script setup>
import { MenuService } from '@/service/MenuService';
import { onMounted, ref } from 'vue';

import AppMenuItem from './AppMenuItem.vue';

const menu = ref();

const convertMenuFormat = (menuData) => {
    if (!menuData || !menuData.menu) return [];
    return menuData.menu;
};

onMounted(() => {
    const userData = JSON.parse(localStorage.getItem('userData'));
    const rolId = userData?.rol?.id;

    if (rolId === 1) {
        MenuService.getAll1()
            .then((data) => {
                menu.value = convertMenuFormat(data);
            })
            .catch((error) => {
                console.error('Error al cargar el menú 1:', error);
            });
    } else if (rolId === 2) {
        MenuService.getAll2()
            .then((data) => {
                menu.value = convertMenuFormat(data);
            })
            .catch((error) => {
                console.error('Error al cargar el menú 2:', error);
            });
    }
    console.log('🚀 Menú cargado:', menu.value);
});

const model1 = ref([]);
model1.value = convertMenuFormat(menu.value);

const model = ref([
    {
        label: 'Home',
        items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/dashboard' }]
    },
    {
        label: 'Macawa',
        icon: 'pi pi-fw pi-briefcase',
        to: '/pages',
        items: [
            {
                label: 'Pedidos',
                icon: 'pi pi-fw pi-receipt',
                items: [
                    {
                        label: 'Ver pedidos',
                        icon: 'pi pi-fw pi-receipt',
                        to: '/pages/pedidos'
                    },
                    {
                        label: 'Crear pedido',
                        icon: 'pi pi-fw pi-plus-circle',
                        to: '/pages/pedidoCrear'
                    }
                ]
            },
            {
                label: 'Productos',
                icon: 'pi pi-fw pi-box',
                to: '/pages/productosrest'
            },
            {
                label: 'Categorias',
                icon: 'pi pi-fw pi-list',
                to: '/pages/categorias'
            },
            {
                label: 'Mesas',
                icon: 'pi pi-fw pi-tablet',
                to: '/pages/mesas'
            },
            {
                label: 'Usuarios',
                icon: 'pi pi-fw pi-user',
                to: '/pages/meseros'
            },
            {
                label: 'Reservas',
                icon: 'pi pi-fw pi-book',
                to: '/pages/reservas'
            },
            {
                label: 'Ver Agenda',
                icon: 'pi pi-fw pi-calendar',
                to: '/pages/agenda'
            }
        ]
    },
    {
        label: 'UI Components',
        items: [
            { label: 'Form Layout', icon: 'pi pi-fw pi-id-card', to: '/uikit/formlayout' },
            { label: 'Input', icon: 'pi pi-fw pi-check-square', to: '/uikit/input' },
            { label: 'Button', icon: 'pi pi-fw pi-mobile', to: '/uikit/button', class: 'rotated-icon' },
            { label: 'Table', icon: 'pi pi-fw pi-table', to: '/uikit/table' },
            { label: 'Table2', icon: 'pi pi-fw pi-table', to: '/uikit/table2' },
            { label: 'List', icon: 'pi pi-fw pi-list', to: '/uikit/list' },
            { label: 'List2', icon: 'pi pi-fw pi-comment', to: '/uikit/list2' },
            { label: 'Tree', icon: 'pi pi-fw pi-share-alt', to: '/uikit/tree' },
            { label: 'Panel', icon: 'pi pi-fw pi-tablet', to: '/uikit/panel' },
            { label: 'Overlay', icon: 'pi pi-fw pi-clone', to: '/uikit/overlay' },
            { label: 'Media', icon: 'pi pi-fw pi-image', to: '/uikit/media' },
            { label: 'Menu', icon: 'pi pi-fw pi-bars', to: '/uikit/menu' },
            { label: 'Message', icon: 'pi pi-fw pi-comment', to: '/uikit/message' },
            { label: 'File', icon: 'pi pi-fw pi-file', to: '/uikit/file' },
            { label: 'Chart', icon: 'pi pi-fw pi-chart-bar', to: '/uikit/charts' },
            { label: 'Timeline', icon: 'pi pi-fw pi-calendar', to: '/uikit/timeline' },
            { label: 'Misc', icon: 'pi pi-fw pi-circle', to: '/uikit/misc' }
        ]
    },
    {
        label: 'Pages',
        icon: 'pi pi-fw pi-briefcase',
        to: '/pages',
        items: [
            {
                label: 'Landing',
                icon: 'pi pi-fw pi-globe',
                to: '/landing'
            },
            {
                label: 'Auth',
                icon: 'pi pi-fw pi-user',
                items: [
                    {
                        label: 'Login',
                        icon: 'pi pi-fw pi-sign-in',
                        to: '/auth/login'
                    },
                    {
                        label: 'Error',
                        icon: 'pi pi-fw pi-times-circle',
                        to: '/auth/error'
                    },
                    {
                        label: 'Access Denied',
                        icon: 'pi pi-fw pi-lock',
                        to: '/auth/access'
                    }
                ]
            },
            {
                label: 'Not Found',
                icon: 'pi pi-fw pi-exclamation-circle',
                to: '/pages/notfound'
            },
            {
                label: 'Empty',
                icon: 'pi pi-fw pi-circle-off',
                to: '/pages/empty'
            }
        ]
    },
    {
        label: 'Hierarchy',
        items: [
            {
                label: 'Submenu 1',
                icon: 'pi pi-fw pi-bookmark',
                items: [
                    {
                        label: 'Submenu 1.1',
                        icon: 'pi pi-fw pi-bookmark',
                        items: [
                            { label: 'Submenu 1.1.1', icon: 'pi pi-fw pi-bookmark' },
                            { label: 'Submenu 1.1.2', icon: 'pi pi-fw pi-bookmark' },
                            { label: 'Submenu 1.1.3', icon: 'pi pi-fw pi-bookmark' }
                        ]
                    },
                    {
                        label: 'Submenu 1.2',
                        icon: 'pi pi-fw pi-bookmark',
                        items: [{ label: 'Submenu 1.2.1', icon: 'pi pi-fw pi-bookmark' }]
                    }
                ]
            },
            {
                label: 'Submenu 2',
                icon: 'pi pi-fw pi-bookmark',
                items: [
                    {
                        label: 'Submenu 2.1',
                        icon: 'pi pi-fw pi-bookmark',
                        items: [
                            { label: 'Submenu 2.1.1', icon: 'pi pi-fw pi-bookmark' },
                            { label: 'Submenu 2.1.2', icon: 'pi pi-fw pi-bookmark' }
                        ]
                    },
                    {
                        label: 'Submenu 2.2',
                        icon: 'pi pi-fw pi-bookmark',
                        items: [{ label: 'Submenu 2.2.1', icon: 'pi pi-fw pi-bookmark' }]
                    }
                ]
            }
        ]
    },
    {
        label: 'Get Started',
        items: [
            {
                label: 'Documentation',
                icon: 'pi pi-fw pi-book',
                to: '/documentation'
            },
            {
                label: 'View Source',
                icon: 'pi pi-fw pi-github',
                url: 'https://github.com/primefaces/sakai-vue',
                target: '_blank'
            }
        ]
    }
]);
</script>

<template>
    <ul class="layout-menu">
        <template v-for="(item, i) in menu" :key="item">
            <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
    </ul>
</template>

<style lang="scss" scoped></style>
