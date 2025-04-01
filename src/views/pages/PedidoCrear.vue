<script setup>
// Importaciones de servicios y componentes necesarios
import { MesaService } from '@/service/MesaService';
import { MeseroService } from '@/service/MeseroService';
import { ProductoService } from '@/service/ProductoService';
import { PedidoService } from '@/service/PedidoService';

import { FilterMatchMode } from '@primevue/core/api';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref, watch } from 'vue';

const toast = useToast();

const meseroData = ref();
const meseroNombres = ref('');
const productos = ref();
const observaciones = ref('');
const pedidoGuardadoData = ref();
const dropdownValue = ref(null);
const dropdownValues = ref([]);

const pruductosDialog = ref(false);
const productosTabla = ref([]);
const total = ref(0);
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

// Carga inicial de datos al montar el componente
onMounted(() => {
    MeseroService.getMeseroById(JSON.parse(localStorage.getItem('userData'))?.id)
        .then((data) => {
            console.log('🔄 Datos del mesero:', data);
            meseroData.value = data;
            meseroNombres.value = meseroData.value.usuarioNombres;
        })
        .catch((error) => {
            console.error('Error al cargar los meseros:', error);
            toast.add({ severity: 'error', summary: 'Error', detail: 'Error al conectarse al servidor', life: 3000 });
        });

    // Cargar mesas disponibles
    MesaService.getAll()
        .then((data) => {
            console.log('🔄 Mesas disponibles:', data);
            dropdownValues.value = data.map((mesa) => ({
                name: `Mesa ${mesa.numeroMesa} - ${mesa.ubicacion}`,
                value: mesa.id
            }));
        })
        .catch((error) => {
            console.error('Error al cargar las mesas:', error);
            toast.add({ severity: 'error', summary: 'Error', detail: 'Error al cargar las mesas', life: 3000 });
        });

    ProductoService.getAll()
        .then((data) => (productos.value = data))
        .catch((error) => {
            console.error('Error al cargar los productos:', error);
            toast.add({ severity: 'error', summary: 'Error', detail: 'Error al conectarse al servidor', life: 3000 });
        });
});

function deleteProducto(servicio) {
    productosTabla.value = productosTabla.value.filter((s) => s.id !== servicio.id);
}

function addProducto() {
    pruductosDialog.value = true;
}

function onProductoSelect(event) {
    pruductosDialog.value = false;

    // Verificar si el producto ya existe en el array de servicios
    const productoExistente = productosTabla.value.find((servicio) => servicio.id === event.data.id);

    if (!productoExistente) {
        const producto = { ...event.data, cantidad: 1 };
        productosTabla.value.push(producto);
    } else {
        toast.add({
            severity: 'warn',
            summary: 'Advertencia',
            detail: 'Este producto ya se encuentra en el pedido',
            life: 3000
        });
    }
}

const calcularTotal = () => {
    total.value = productosTabla.value.reduce((sum, item) => {
        return sum + item.precio * (item.cantidad || 1);
    }, 0);
};

// Observar cambios en servicios para actualizar el total
watch(
    productosTabla,
    () => {
        calcularTotal();
    },
    { deep: true }
);

function formatCurrency(value) {
    if (value) return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    return;
}

// Función para cancelar la creación de la ficha médica
const LimpiarDatosFormulario = () => {
    // Limpiar todos los campos
    observaciones.value = '';
    productosTabla.value = [];
    dropdownValue.value = null;
};

function guardarPedido() {
    if (!dropdownValue.value) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Debe seleccionar una mesa',
            life: 3000
        });
        return;
    }

    const pedidoDataGuardar = {
        mesa: {
            id: dropdownValue.value.value
        },
        mesero: {
            id: JSON.parse(localStorage.getItem('userData'))?.id
        },
        estado: 'PENDIENTE',
        fecha_pedido: new Date().toISOString().split('T')[0],
        total: total.value,
        observaciones: observaciones.value
    };

    const detallesDataGuardar = productosTabla.value.map((producto) => ({
        producto: {
            id: producto.id
        },
        cantidad: producto.cantidad,
        precioUnitario: producto.precio,
        subtotal: producto.precio * producto.cantidad,
        observaciones: observaciones.value
    }));

    PedidoService.create(pedidoDataGuardar, detallesDataGuardar)
        .then((response) => {
            pedidoGuardadoData.value = response;
            toast.add({ severity: 'success', summary: 'Éxito', detail: 'Pedido creado correctamente', life: 3000 });
        })
        .catch((error) => {
            console.error('Error al crear el pedido:', error);
            toast.add({ severity: 'error', summary: 'Error', detail: 'Error al crear el pedido', life: 3000 });
        });

    // Limpiar el formulario después de guardar
    LimpiarDatosFormulario();
}
</script>

<template>
    <Fluid>
        <div class="flex mt-8">
            <div class="card flex flex-col gap-4 w-full">
                <div class="font-semibold text-xl">Datos del pedido</div>
                <div class="flex flex-col md:flex-row gap-4">
                    <div class="flex flex-wrap gap-2 w-full">
                        <label for="nombre">Mesero</label>
                        <InputText id="nombre" v-model="meseroNombres" type="text" :disabled="true" />
                    </div>
                </div>

                <div class="flex flex-wrap">
                    <div class="flex flex-wrap gap-2 w-full">
                        <label for="lastname2">Mesas</label>
                        <Select v-model="dropdownValue" :options="dropdownValues" optionLabel="name" placeholder="Seleccionar mesa" />
                    </div>
                </div>

                <div class="flex flex-wrap">
                    <label for="address">Observaciones</label>
                    <Textarea id="observaciones" v-model="observaciones" rows="4" />
                </div>
            </div>
        </div>

        <div class="flex mt-8">
            <div class="card flex flex-col gap-4 w-full">
                <div class="font-semibold text-xl">Detalles del pedido</div>
                <DataTable ref="dt" :value="productosTabla" dataKey="id">
                    <template #header>
                        <div class="flex flex-wrap gap-1 items-center justify-end">
                            <Button icon="pi pi-plus" rounded @click="addProducto" />
                        </div>
                    </template>
                    <Column field="nombre" header="Producto" sortable style="min-width: 5rem"></Column>
                    <Column header="Observaciones" style="min-width: 8rem">
                        <template #body="slotProps">
                            <InputText v-model="slotProps.data.observaciones" :min="1" :max="99" />
                        </template>
                    </Column>
                    <Column field="precio" header="Precio" sortable style="min-width: 8rem">
                        <template #body="slotProps">
                            {{ formatCurrency(slotProps.data.precio) }}
                        </template>
                    </Column>
                    <Column header="Cantidad" style="min-width: 5rem">
                        <template #body="slotProps">
                            <InputNumber v-model="slotProps.data.cantidad" :min="1" :max="99" />
                        </template>
                    </Column>
                    <Column header="Total" style="min-width: 5rem">
                        <template #body="slotProps">
                            {{ formatCurrency(slotProps.data.precio * (slotProps.data.cantidad || 1)) }}
                        </template>
                    </Column>
                    <Column :exportable="false" style="min-width: 12rem">
                        <template #body="slotProps">
                            <Button icon="pi pi-trash" outlined rounded severity="danger" @click="deleteProducto(slotProps.data)" />
                        </template>
                    </Column>
                </DataTable>

                <Dialog v-model:visible="pruductosDialog" :style="{ width: '90vw', maxWidth: '650px' }" :breakpoints="{ '960px': '75vw', '641px': '90vw' }" :modalStyle="{ width: '90vw', maxWidth: '950px' }" header="Product Details" :modal="true">
                    <DataTable :value="productos" selectionMode="single" :paginator="true" :rows="5" @row-select="onProductoSelect" :filters="filters" responsiveLayout="scroll">
                        <template #header>
                            <div class="flex flex-wrap gap-2 items-center justify-between">
                                <IconField>
                                    <InputIcon>
                                        <i class="pi pi-search" />
                                    </InputIcon>
                                    <InputText v-model="filters['global'].value" placeholder="Buscar..." />
                                </IconField>
                            </div>
                        </template>

                        <Column field="nombre" header="Nombre" sortable style="min-width: 10rem"></Column>
                        <Column field="categoria.nombre" header="Categoria" sortable style="min-width: 5rem"></Column>
                        <Column field="descripcion" header="Descripcion" sortable style="min-width: 12rem"></Column>
                        <Column field="precio" header="Precio" sortable style="min-width: 3rem"></Column>
                    </DataTable>
                </Dialog>
            </div>
        </div>

        <div class="flex mt-8 justify-end">
            <div class="card flex flex-col gap-4">
                <div class="flex flex-wrap gap-1 items-center">
                    <label for="total">Total</label>
                </div>
                <div class="flex flex-wrap gap-1 items-center">
                    <InputText id="total" v-model="total" type="text" :disabled="true" />
                </div>
                <div class="flex flex-wrap gap-1 items-center">
                    <Button type="button" label="Guardar" @click="guardarPedido" />
                </div>
            </div>
        </div>
    </Fluid>
</template>
