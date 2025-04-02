<script setup>
import { PedidoService } from '@/service/PedidoService';
import { FilterMatchMode } from '@primevue/core/api';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';

const toast = useToast();
const dt = ref();
const pedidos = ref();
const pedidotDialog = ref(false);
const deletePedidoDialog = ref(false);
const deletePedidosDialog = ref(false);
const pedido = ref({});
const selectedPedidos = ref();
const activeTab = ref('0');
const multiple = ref('multiple');
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});
const submitted = ref(false);
const loading = ref(false);
const expandedRows = ref([]);
const options = [
    { label: 'Hoy', value: '0' },
    { label: 'Últimos 7 días', value: '1' },
    { label: 'Todos', value: '2' }
];

onMounted(() => {
    cargarDatos();
});

function cargarDatos() {
    loading.value = true;
    switch (activeTab.value) {
        case '0':
            PedidoService.getAllFecha()
                .then((data) => {
                    pedidos.value = data;
                    expandAll();
                })
                .catch((error) => {
                    console.error('Error al cargar los pedidos:', error);
                    toast.add({ severity: 'error', summary: 'Error', detail: 'Error al conectarse al servidor', life: 3000 });
                })
                .finally(() => {
                    loading.value = false;
                });
            break;
        case '1':
            PedidoService.getAllUltimosDias()
                .then((data) => {
                    pedidos.value = data;
                    expandAll();
                })
                .catch((error) => {
                    console.error('Error al cargar los pedidos:', error);
                    toast.add({ severity: 'error', summary: 'Error', detail: 'Error al conectarse al servidor', life: 3000 });
                })
                .finally(() => {
                    loading.value = false;
                });
            break;
        case '2':
            PedidoService.getAllDetalles()
                .then((data) => {
                    pedidos.value = data;
                    expandAll();
                })
                .catch((error) => {
                    console.error('Error al cargar los pedidos:', error);
                    toast.add({ severity: 'error', summary: 'Error', detail: 'Error al conectarse al servidor', life: 3000 });
                })
                .finally(() => {
                    loading.value = false;
                });
            break;
    }
}

function onOptionChange(event) {
    activeTab.value = event.value;
    cargarDatos();
}

function formatCurrency(value) {
    if (value) return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    return;
}

function hideDialog() {
    pedidotDialog.value = false;
    submitted.value = false;
}

function savePedido() {
    submitted.value = true;

    if (pedido?.value.nombre?.trim()) {
        const productoData = {
            codigo: pedido.value.codigo,
            nombre: pedido.value.nombre,
            descripcion: pedido.value.descripcion,
            precio: pedido.value.precio,
            categoria: pedido.value.categoria
        };

        if (pedido.value.id) {
            updateProduct(productoData);
        } else {
            createProduct(productoData);
        }
    }
}

function createProduct(productoData) {
    PedidoService.createProduct(productoData)
        .then((response) => {
            pedidos.value.push(response);
            pedidotDialog.value = false;
            pedido.value = {};
            toast.add({ severity: 'success', summary: 'Éxito', detail: 'Producto Creado', life: 3000 });
        })
        .catch((error) => {
            console.error('Error al crear el producto:', error);
            toast.add({ severity: 'error', summary: 'Error', detail: 'Error al crear el producto', life: 3000 });
        });
}

function updateProduct(productoData) {
    PedidoService.update(pedido.value.id, productoData)
        .then((response) => {
            const index = findIndexById(pedido.value.id);
            if (index !== -1) {
                pedidos.value[index] = response;
            }
            pedidotDialog.value = false;
            pedido.value = {};
            toast.add({ severity: 'success', summary: 'Éxito', detail: 'Producto Actualizado', life: 3000 });
        })
        .catch((error) => {
            console.error('Error al actualizar el producto:', error);
            toast.add({ severity: 'error', summary: 'Error', detail: 'Error al actualizar el producto', life: 3000 });
        });
}

function editPedido(pedidoData) {
    pedido.value = { ...pedidoData };
    pedidotDialog.value = true;
}

function pagarPedido(pedidoData) {
    const pedidoPagadaData = {
        estado: 'PAGADA'
    };

    PedidoService.update(pedidoData.id, pedidoPagadaData)
        .then(() => {
            toast.add({ severity: 'success', summary: 'Éxito', detail: 'Pedido pagado correctamente', life: 3000 });
            cargarDatos();
        })
        .catch((error) => {
            console.error('Error al pagar el pedido:', error);
            toast.add({ severity: 'error', summary: 'Error', detail: 'Error al pagar el pedido', life: 3000 });
        });
}

function confirmDeletePedido(pedidoData) {
    pedido.value = pedidoData;
    deletePedidoDialog.value = true;
}

function deleteProduct() {
    PedidoService.deleteProduct(pedido.value.id)
        .then(() => {
            pedidos.value = pedidos.value.filter((val) => val.id !== pedido.value.id);
            deletePedidoDialog.value = false;
            pedido.value = {};
            toast.add({ severity: 'success', summary: 'Éxito', detail: 'Producto Eliminado', life: 3000 });
        })
        .catch((error) => {
            console.error('Error al eliminar el producto:', error);
            toast.add({ severity: 'error', summary: 'Error', detail: 'Error al eliminar el producto', life: 3000 });
        });
}

function findIndexById(id) {
    let index = -1;
    for (let i = 0; i < pedidos.value.length; i++) {
        if (pedidos.value[i].id === id) {
            index = i;
            break;
        }
    }
    return index;
}

function exportCSV() {
    dt.value.exportCSV();
}

function deleteSelectedProducts() {
    const deletePromises = selectedPedidos.value.map((product) => PedidoService.deleteProduct(product.id));

    Promise.all(deletePromises)
        .then(() => {
            pedidos.value = pedidos.value.filter((val) => !selectedPedidos.value.includes(val));
            deletePedidosDialog.value = false;
            selectedPedidos.value = null;
            toast.add({ severity: 'success', summary: 'Éxito', detail: 'Productos Eliminados', life: 3000 });
        })
        .catch((error) => {
            console.error('Error al eliminar los productos:', error);
            toast.add({ severity: 'error', summary: 'Error', detail: 'Error al eliminar los productos', life: 3000 });
        });
}

function getEstadoSeverity(estado) {
    switch (estado) {
        case 'PAGADA':
            return 'success';
        case 'PENDIENTE':
            return 'warn';
        case 'CANCELADA':
            return 'danger';
        default:
            return null;
    }
}

function expandAll() {
    expandedRows.value = pedidos.value.reduce((acc, p) => (acc[p.id] = true) && acc, {});
}

function collapseAll() {
    expandedRows.value = {};
}
</script>

<template>
    <div>
        <div class="card">
            <DataTable
                v-model:expandedRows="expandedRows"
                :value="pedidos"
                dataKey="id"
                :paginator="true"
                :rows="10"
                :filters="filters"
                :sortMode="multiple"
                :multiSortMeta="[
                    { field: 'fechaPedido', order: 1 },
                    { field: 'horaPedido', order: -1 }
                ]"
                :loading="loading"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                :rowsPerPageOptions="[5, 10, 25]"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} pedidos"
                tableStyle="min-width: 60rem"
            >
                <template #header>
                    <div class="flex flex-wrap gap-2 items-center justify-between">
                        <h4 class="m-0">Pedidos</h4>
                    </div>
                    <div class="flex flex-wrap gap-2 items-center justify-between">
                        <SelectButton v-model="activeTab" :options="options" optionLabel="label" optionValue="value" @change="onOptionChange" />
                        <div class="flex flex-wrap justify-end gap-2">
                            <Button text icon="pi pi-plus" label="Expand All" @click="expandAll" />
                            <Button text icon="pi pi-minus" label="Collapse All" @click="collapseAll" />
                        </div>
                        <div class="flex align-items-center gap-3">
                            <IconField>
                                <InputIcon>
                                    <i class="pi pi-search" />
                                </InputIcon>
                                <InputText v-model="filters['global'].value" placeholder="Search..." />
                            </IconField>
                            <Button label="Export" icon="pi pi-upload" severity="secondary" @click="exportCSV($event)" />
                        </div>
                    </div>
                </template>

                <Column expander style="width: 5rem" />
                <Column field="numeroMesa" header="Mesa" sortable style="min-width: 3rem"></Column>
                <Column field="nombreMesero" header="Mesero" sortable style="min-width: 8rem"></Column>
                <Column field="fechaPedido" header="Fecha" sortable style="min-width: 8rem"></Column>
                <Column field="horaPedido" header="Hora" sortable style="min-width: 5rem"></Column>
                <Column field="observaciones" header="Observaciones" sortable style="min-width: 12rem"></Column>
                <Column header="Estado" sortable style="min-width: 12rem" sortField="estado" :sortFunction="(a, b) => a.estado.localeCompare(b.estado)">
                    <template #body="slotProps">
                        <Tag :value="slotProps.data.estado" :severity="getEstadoSeverity(slotProps.data.estado)" />
                    </template>
                </Column>
                <Column field="total" header="Total" sortable style="min-width: 5rem">
                    <template #body="slotProps">
                        {{ formatCurrency(slotProps.data.total) }}
                    </template>
                </Column>
                <Column :exportable="false" style="min-width: 12rem">
                    <template #body="slotProps">
                        <Button icon="pi pi-money-bill" outlined rounded class="mr-2" severity="success" @click="pagarPedido(slotProps.data)" />
                        <Button icon="pi pi-eye" outlined rounded class="mr-2" @click="pagarPedido(slotProps.data)" />
                        <Button icon="pi pi-pencil" outlined rounded class="mr-2" severity="warn" @click="editPedido(slotProps.data)" />
                        <Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDeletePedido(slotProps.data)" />
                    </template>
                </Column>
                <template #expansion="slotProps">
                    <div class="p-4 bg-gray-50 dark:bg-gray-800">
                        <h5 class="text-gray-900 dark:text-gray-100">Productos del pedido</h5>
                        <DataTable :value="slotProps.data.detalles" class="bg-gray-50 dark:bg-gray-800">
                            <Column field="nombreProducto" header="Producto" sortable></Column>
                            <Column field="precioUnitario" header="Precio" sortable>
                                <template #body="slotProps">
                                    {{ formatCurrency(slotProps.data.precioUnitario) }}
                                </template>
                            </Column>
                            <Column field="cantidad" header="Cantidad" sortable></Column>
                            <Column field="subtotal" header="Subtotal" sortable>
                                <template #body="slotProps">
                                    {{ formatCurrency(slotProps.data.subtotal) }}
                                </template>
                            </Column>
                        </DataTable>
                    </div>
                </template>
            </DataTable>
        </div>

        <Dialog v-model:visible="pedidotDialog" :style="{ width: '450px' }" header="Product Details" :modal="true">
            <div class="flex flex-col gap-6">
                <img v-if="pedido.image" :src="`https://primefaces.org/cdn/primevue/images/product/${pedido.image}`" :alt="pedido.image" class="block m-auto pb-4" />
                <div>
                    <label for="nombre" class="block font-bold mb-3">Nombre</label>
                    <InputText id="nombre" v-model.trim="pedido.nombre" required="true" autofocus :invalid="submitted && !pedido.nombre" fluid />
                    <small v-if="submitted && !pedido.nombre" class="text-red-500">El nombre es requerido.</small>
                </div>
                <div>
                    <label for="description" class="block font-bold mb-3">Descripción</label>
                    <Textarea id="description" v-model="pedido.descripcion" required="true" rows="3" cols="20" fluid />
                </div>

                <div>
                    <label for="categoria" class="block font-bold mb-3">Categoria</label>
                    <InputText id="categoria" v-model.trim="pedido.categoria.nombre" required="true" autofocus :invalid="submitted && !pedido.categoria" fluid />
                    <small v-if="submitted && !pedido.categoria" class="text-red-500">La categoría es requerida.</small>
                </div>

                <div class="grid grid-cols-12 gap-4">
                    <div class="col-span-6">
                        <div class="font-semibold text-xl">Disponibilidad</div>
                        <ToggleSwitch v-model="pedido.disponible" />
                    </div>
                    <div class="col-span-6">
                        <label for="price" class="block font-bold mb-3">Precio</label>
                        <InputNumber id="price" v-model="pedido.precio" mode="currency" currency="USD" locale="en-US" fluid />
                    </div>
                </div>
            </div>

            <template #footer>
                <Button label="Cancelar" icon="pi pi-times" text @click="hideDialog" />
                <Button label="Guardar" icon="pi pi-check" @click="savePedido" />
            </template>
        </Dialog>

        <Dialog v-model:visible="deletePedidoDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
            <div class="flex items-center gap-4">
                <i class="pi pi-exclamation-triangle !text-3xl" />
                <span v-if="pedido"> Estas seguro de querer eliminar este pedido ?</span>
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" text @click="deletePedidoDialog = false" />
                <Button label="Si" icon="pi pi-check" @click="deleteProduct" />
            </template>
        </Dialog>

        <Dialog v-model:visible="deletePedidosDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
            <div class="flex items-center gap-4">
                <i class="pi pi-exclamation-triangle !text-3xl" />
                <span v-if="pedido">Are you sure you want to delete the selected products?</span>
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" text @click="deletePedidosDialog = false" />
                <Button label="Yes" icon="pi pi-check" text @click="deleteSelectedProducts" />
            </template>
        </Dialog>
    </div>
</template>
