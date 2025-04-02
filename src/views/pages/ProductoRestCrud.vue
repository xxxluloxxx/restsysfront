<script setup>
import { CategoriaService } from '@/service/CategoriaService';
import { ProductoService } from '@/service/ProductoService';
import { FilterMatchMode } from '@primevue/core/api';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';

const toast = useToast();
const dt = ref();
const products = ref();
const categories = ref([]);
const productDialog = ref(false);
const deleteProductDialog = ref(false);
const deleteProductsDialog = ref(false);
const producto = ref({});
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});
const submitted = ref(false);
const loading = ref(true);
const multiple = ref('multiple');

onMounted(() => {
    loading.value = true;
    Promise.all([ProductoService.getAll(), CategoriaService.getAll()])
        .then(([productosData, categoriasData]) => {
            products.value = productosData;
            categories.value = categoriasData;
        })
        .catch((error) => {
            console.error('Error al cargar los datos:', error);
            toast.add({ severity: 'error', summary: 'Error', detail: 'Error al conectarse al servidor', life: 3000 });
        })
        .finally(() => {
            loading.value = false;
        });
});

function formatCurrency(value) {
    if (value) return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    return;
}

function openNew() {
    producto.value = {};
    submitted.value = false;
    productDialog.value = true;
}

function hideDialog() {
    productDialog.value = false;
    submitted.value = false;
}

function saveProduct() {
    submitted.value = true;

    if (producto?.value.nombre?.trim()) {
        const productoData = {
            codigo: producto.value.codigo,
            nombre: producto.value.nombre,
            descripcion: producto.value.descripcion,
            precio: producto.value.precio,
            categoria: producto.value.categoria
        };

        if (producto.value.id) {
            updateProduct(productoData);
        } else {
            createProduct(productoData);
        }
    }
}

function createProduct(productoData) {
    ProductoService.create(productoData)
        .then((response) => {
            products.value.push(response);
            productDialog.value = false;
            producto.value = {};
            toast.add({ severity: 'success', summary: 'Éxito', detail: 'Producto Creado', life: 3000 });
        })
        .catch((error) => {
            console.error('Error al crear el producto:', error);
            toast.add({ severity: 'error', summary: 'Error', detail: 'Error al crear el producto', life: 3000 });
        });
}

function updateProduct(productoData) {
    ProductoService.update(producto.value.id, productoData)
        .then((response) => {
            const index = findIndexById(producto.value.id);
            if (index !== -1) {
                products.value[index] = response;
            }
            productDialog.value = false;
            producto.value = {};
            toast.add({ severity: 'success', summary: 'Éxito', detail: 'Producto Actualizado', life: 3000 });
        })
        .catch((error) => {
            console.error('Error al actualizar el producto:', error);
            toast.add({ severity: 'error', summary: 'Error', detail: 'Error al actualizar el producto', life: 3000 });
        });
}

function editProduct(prod) {
    producto.value = { ...prod };
    productDialog.value = true;
}

function confirmDeleteProduct(prod) {
    producto.value = prod;
    deleteProductDialog.value = true;
}

function deleteProduct() {
    ProductoService.delete(producto.value.id)
        .then(() => {
            products.value = products.value.filter((val) => val.id !== producto.value.id);
            deleteProductDialog.value = false;
            producto.value = {};
            toast.add({ severity: 'success', summary: 'Éxito', detail: 'Producto Eliminado', life: 3000 });
        })
        .catch((error) => {
            console.error('Error al eliminar el producto:', error);
            toast.add({ severity: 'error', summary: 'Error', detail: 'Error al eliminar el producto', life: 3000 });
        });
}

function findIndexById(id) {
    let index = -1;
    for (let i = 0; i < products.value.length; i++) {
        if (products.value[i].id === id) {
            index = i;
            break;
        }
    }
    return index;
}

function exportCSV() {
    dt.value.exportCSV();
}
</script>

<template>
    <div>
        <div class="card">
            <DataTable
                ref="dt"
                :value="products"
                dataKey="id"
                :paginator="true"
                scrollable scrollHeight="600px"
                :rows="10"
                :filters="filters"
                :loading="loading"
                :sortMode="multiple"
                :multiSortMeta="[
                    { field: 'categoria.nombre', order: 1 },
                    { field: 'nombre', order: -1 }
                ]"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                :rowsPerPageOptions="[5, 10, 25]"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} productos"
            >
                <template #header>
                    <div class="flex flex-col gap-y-4">
                        <div class="flex flex-wrap gap-2 items-center justify-start">
                            <h4 class="m-0">Productos</h4>
                        </div>
                        <div class="flex flex-wrap gap-2 items-center justify-between">
                            <Button label="Nuevo" icon="pi pi-plus" severity="secondary" class="mr-2" @click="openNew" />
                            <Button label="Exportar" icon="pi pi-upload" severity="secondary" @click="exportCSV($event)" />
                        </div>
                        <div class="flex flex-wrap gap-2 items-center justify-end">
                            <IconField>
                                <InputIcon>
                                    <i class="pi pi-search" />
                                </InputIcon>
                                <InputText v-model="filters['global'].value" placeholder="Search..." />
                            </IconField>
                        </div>
                    </div>
                </template>

                <Column field="categoria.nombre" header="Categoria" sortable style="min-width: 5%"></Column>
                <Column field="nombre" header="Nombre" sortable style="min-width: 8%"></Column>
                <Column field="descripcion" header="Descripcion" sortable style="min-width: 10rem"></Column>
                <Column field="precio" header="Precio" sortable style="min-width: 5%">
                    <template #body="slotProps">
                        {{ formatCurrency(slotProps.data.precio) }}
                    </template>
                </Column>
                <Column field="disponible" header="Disponibilidad" sortable style="min-width: 5%">
                    <template #body="slotProps">
                        <Tag :severity="slotProps.data.disponible ? 'success' : 'danger'" :value="slotProps.data.disponible ? 'Disponible' : 'No Disponible'" />
                    </template>
                </Column>

                <Column :exportable="false" style="min-width: 8rem">
                    <template #body="slotProps">
                        <Button icon="pi pi-pencil" outlined rounded class="mr-2" severity="warn" @click="editProduct(slotProps.data)" />
                        <Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDeleteProduct(slotProps.data)" />
                    </template>
                </Column>
            </DataTable>
        </div>

        <Dialog v-model:visible="productDialog" :style="{ width: '450px' }" header="Product Details" :modal="true">
            <div class="flex flex-col gap-6">
                <img v-if="producto.image" :src="`https://primefaces.org/cdn/primevue/images/product/${producto.image}`" :alt="producto.image" class="block m-auto pb-4" />
                <div>
                    <label for="nombre" class="block font-bold mb-3">Nombre</label>
                    <InputText id="nombre" v-model.trim="producto.nombre" required="true" autofocus :invalid="submitted && !producto.nombre" fluid />
                    <small v-if="submitted && !producto.nombre" class="text-red-500">El nombre es requerido.</small>
                </div>
                <div>
                    <label for="description" class="block font-bold mb-3">Descripción</label>
                    <Textarea id="description" v-model="producto.descripcion" required="true" rows="3" cols="20" fluid />
                </div>

                <div>
                    <label for="categoria" class="block font-bold mb-3">Categoria</label>
                    <Dropdown id="categoria" v-model="producto.categoria" :options="categories" optionLabel="nombre" placeholder="Seleccionar categoría" class="w-full" />
                    <small v-if="submitted && !producto.categoria" class="text-red-500">La categoría es requerida.</small>
                </div>

                <div class="grid grid-cols-12 gap-4">
                    <div class="col-span-6">
                        <div class="font-semibold text-xl mb-3">Disponibilidad</div>
                        <ToggleSwitch v-model="producto.disponible" />
                    </div>
                    <div class="col-span-6">
                        <label for="price" class="block font-bold mb-3">Precio</label>
                        <InputNumber id="price" v-model="producto.precio" mode="currency" currency="USD" locale="en-US" fluid />
                    </div>
                </div>
            </div>

            <template #footer>
                <Button label="Cancelar" icon="pi pi-times" text @click="hideDialog" />
                <Button label="Guardar" icon="pi pi-check" @click="saveProduct" />
            </template>
        </Dialog>

        <Dialog v-model:visible="deleteProductDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
            <div class="flex items-center gap-4">
                <i class="pi pi-exclamation-triangle !text-3xl" />
                <span v-if="producto"
                    >Estas seguro de querer elimminar este producto <b>{{ producto.name }}</b
                    >?</span
                >
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" text @click="deleteProductDialog = false" />
                <Button label="Si" icon="pi pi-check" @click="deleteProduct" />
            </template>
        </Dialog>

        <Dialog v-model:visible="deleteProductsDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
            <div class="flex items-center gap-4">
                <i class="pi pi-exclamation-triangle !text-3xl" />
                <span v-if="producto">Are you sure you want to delete the selected products?</span>
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" text @click="deleteProductsDialog = false" />
                <Button label="Yes" icon="pi pi-check" text @click="deleteSelectedProducts" />
            </template>
        </Dialog>
    </div>
</template>
