<script setup>
// ============= IMPORTS =============
import { CategoriaService } from '@/service/CategoriaService';
import { FilterMatchMode } from '@primevue/core/api';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';

// ============= ESTADOS Y REFERENCIAS =============
// Servicios
const toast = useToast();

// Referencias para la tabla y datos
const dt = ref();
const categorias = ref();
const loading = ref(true);

// Referencias para diálogos
const categoriaDialog = ref(false);
const deleteCategoriaDialog = ref(false);
const deleteCategoriasDialog = ref(false);
const categoria = ref({});
const selectedCategorias = ref();

// Estado de validación
const submitted = ref(false);

// Configuración de filtros para la tabla
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

// ============= CICLO DE VIDA =============
onMounted(() => {
    loadCategorias();
});

// ============= FUNCIONES DE CARGA DE DATOS =============
/**
 * Carga todas las categorías desde el servidor
 * Maneja estados de carga y errores
 */
function loadCategorias() {
    loading.value = true;
    CategoriaService.getAll()
        .then((data) => (categorias.value = data))
        .catch((error) => {
            console.error('Error al cargar las categorias:', error);
            toast.add({ severity: 'error', summary: 'Error', detail: 'Error al conectarse al servidor', life: 3000 });
        })
        .finally(() => {
            loading.value = false;
        });
}

// ============= FUNCIONES DE GESTIÓN DE DIÁLOGOS =============
/**
 * Abre el diálogo para crear una nueva categoría
 */
function openNew() {
    categoria.value = {};
    submitted.value = false;
    categoriaDialog.value = true;
}

/**
 * Cierra el diálogo de categoría y limpia el estado
 */
function hideDialog() {
    categoriaDialog.value = false;
    submitted.value = false;
}

// ============= FUNCIONES CRUD =============
/**
 * Guarda una categoría nueva o actualiza una existente
 * Valida que el nombre no esté vacío antes de proceder
 */
function saveCategoria() {
    submitted.value = true;

    if (categoria?.value.nombre?.trim()) {
        const categoriaData = {
            nombre: categoria.value.nombre,
            descripcion: categoria.value.descripcion
        };

        if (categoria.value.id) {
            updateCategoria(categoriaData);
        } else {
            createCategoria(categoriaData);
        }
    }
}

/**
 * Crea una nueva categoría en el servidor
 * @param {Object} categoriaData - Datos de la categoría a crear
 */
function createCategoria(categoriaData) {
    CategoriaService.create(categoriaData)
        .then((response) => {
            categorias.value.push(response);
            categoriaDialog.value = false;
            categoria.value = {};
            toast.add({ severity: 'success', summary: 'Éxito', detail: 'Categoria creada', life: 3000 });
        })
        .catch((error) => {
            console.error('Error al crear la categoria:', error);
            toast.add({ severity: 'error', summary: 'Error', detail: 'Error al crear la categoria', life: 3000 });
        });
}

/**
 * Actualiza una categoría existente en el servidor
 * @param {Object} categoriaData - Datos actualizados de la categoría
 */
function updateCategoria(categoriaData) {
    CategoriaService.update(categoria.value.id, categoriaData)
        .then((response) => {
            const index = findIndexById(categoria.value.id);
            if (index !== -1) {
                categorias.value[index] = response;
            }
            categoriaDialog.value = false;
            categoria.value = {};
            toast.add({ severity: 'success', summary: 'Éxito', detail: 'Categoria Actualizada', life: 3000 });
        })
        .catch((error) => {
            console.error('Error al actualizar la categoria:', error);
            toast.add({ severity: 'error', summary: 'Error', detail: 'Error al actualizar la categoria', life: 3000 });
        });
}

/**
 * Prepara el formulario para editar una categoría existente
 * @param {Object} categoriaData - Datos de la categoría a editar
 */
function editCategoria(categoriaData) {
    categoria.value = { ...categoriaData };
    categoriaDialog.value = true;
}

// ============= FUNCIONES DE ELIMINACIÓN =============
/**
 * Abre el diálogo de confirmación para eliminar una categoría
 * @param {Object} categoriaData - Datos de la categoría a eliminar
 */
function confirmDeleteCategoria(categoriaData) {
    categoria.value = categoriaData;
    deleteCategoriaDialog.value = true;
}

/**
 * Elimina una categoría del servidor
 * Actualiza la lista local después de la eliminación exitosa
 */
function deleteCategoria() {
    CategoriaService.delete(categoria.value.id)
        .then(() => {
            categorias.value = categorias.value.filter((val) => val.id !== categoria.value.id);
            deleteCategoriaDialog.value = false;
            categoria.value = {};
            toast.add({ severity: 'success', summary: 'Éxito', detail: 'Categoria eliminada', life: 3000 });
        })
        .catch((error) => {
            console.error('Error al eliminar la categoria:', error);
            toast.add({ severity: 'error', summary: 'Error', detail: 'Error al eliminar la categoria', life: 3000 });
        });
}

/**
 * Abre el diálogo de confirmación para eliminar múltiples categorías
 */
function confirmDeleteSelected() {
    deleteCategoriasDialog.value = true;
}

/**
 * Elimina múltiples categorías seleccionadas del servidor
 * Utiliza Promise.all para manejar múltiples eliminaciones simultáneas
 */
function deleteSelectedCategorias() {
    const deletePromises = selectedCategorias.value.map((product) => CategoriaService.deleteProduct(product.id));

    Promise.all(deletePromises)
        .then(() => {
            categorias.value = categorias.value.filter((val) => !selectedCategorias.value.includes(val));
            deleteCategoriasDialog.value = false;
            selectedCategorias.value = null;
            toast.add({ severity: 'success', summary: 'Éxito', detail: 'Categorias Eliminadas', life: 3000 });
        })
        .catch((error) => {
            console.error('Error al eliminar las categorias:', error);
            toast.add({ severity: 'error', summary: 'Error', detail: 'Error al eliminar las categorias', life: 3000 });
        });
}

// ============= FUNCIONES DE UTILIDAD =============
/**
 * Encuentra el índice de una categoría en el array por su ID
 * @param {number} id - ID de la categoría a buscar
 * @returns {number} Índice de la categoría o -1 si no se encuentra
 */
function findIndexById(id) {
    let index = -1;
    for (let i = 0; i < categorias.value.length; i++) {
        if (categorias.value[i].id === id) {
            index = i;
            break;
        }
    }
    return index;
}

// ============= FUNCIONES DE EXPORTACIÓN =============
/**
 * Exporta los datos de la tabla a formato CSV
 */
function exportCSV() {
    dt.value.exportCSV();
}
</script>

<template>
    <div>
        <div class="card">
            <Toolbar class="mb-6">
                <template #start>
                    <Button label="New" icon="pi pi-plus" severity="secondary" class="mr-2" @click="openNew" />
                    <Button label="Delete" icon="pi pi-trash" severity="secondary" @click="confirmDeleteSelected" :disabled="!selectedCategorias || !selectedCategorias.length" />
                </template>

                <template #end>
                    <Button label="Export" icon="pi pi-upload" severity="secondary" @click="exportCSV($event)" />
                </template>
            </Toolbar>

            <DataTable
                ref="dt"
                v-model:selection="selectedCategorias"
                :value="categorias"
                dataKey="id"
                :paginator="true"
                :rows="10"
                :filters="filters"
                :loading="loading"
                sortField="nombre"
                :sortOrder="1"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            >
                <template #header>
                    <div class="flex flex-wrap gap-2 items-center justify-between">
                        <h4 class="m-0">Categorias</h4>
                        <IconField>
                            <InputIcon>
                                <i class="pi pi-search" />
                            </InputIcon>
                            <InputText v-model="filters['global'].value" placeholder="Search..." />
                        </IconField>
                    </div>
                </template>

                <Column selectionMode="multiple" style="width: 3rem" :exportable="false"></Column>
                <Column field="nombre" header="Nombre" sortable style="min-width: 16rem"></Column>
                <Column field="descripcion" header="Descripción" sortable style="min-width: 10rem"></Column>
                <Column :exportable="false" style="min-width: 12rem">
                    <template #body="slotProps">
                        <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="editCategoria(slotProps.data)" />
                        <Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDeleteCategoria(slotProps.data)" />
                    </template>
                </Column>
            </DataTable>
        </div>

        <Dialog v-model:visible="categoriaDialog" :style="{ width: '450px' }" header="Product Details" :modal="true">
            <div class="flex flex-col gap-6">
                <img v-if="categoria.image" :src="`https://primefaces.org/cdn/primevue/images/product/${categoria.image}`" :alt="categoria.image" class="block m-auto pb-4" />
                <div>
                    <label for="nombre" class="block font-bold mb-3">Nombre</label>
                    <InputText id="nombre" v-model.trim="categoria.nombre" required="true" autofocus :invalid="submitted && !categoria.nombre" fluid />
                    <small v-if="submitted && !categoria.nombre" class="text-red-500">El nombre es requerido.</small>
                </div>
                <div>
                    <label for="description" class="block font-bold mb-3">Descripción</label>
                    <Textarea id="description" v-model="categoria.descripcion" required="true" rows="3" cols="20" fluid />
                </div>
            </div>

            <template #footer>
                <Button label="Cancelar" icon="pi pi-times" text @click="hideDialog" />
                <Button label="Guardar" icon="pi pi-check" @click="saveCategoria" />
            </template>
        </Dialog>

        <Dialog v-model:visible="deleteCategoriaDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
            <div class="flex items-center gap-4">
                <i class="pi pi-exclamation-triangle !text-3xl" />
                <span v-if="categoria"
                    >Estas seguro de querer eliminar este producto <b>{{ categoria.name }}</b
                    >?</span
                >
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" text @click="deleteCategoriaDialog = false" />
                <Button label="Si" icon="pi pi-check" @click="deleteCategoria" />
            </template>
        </Dialog>

        <Dialog v-model:visible="deleteCategoriasDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
            <div class="flex items-center gap-4">
                <i class="pi pi-exclamation-triangle !text-3xl" />
                <span v-if="categoria">¿Estas seguro de querer eliminar las categorias seleccionadas?</span>
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" text @click="deleteCategoriasDialog = false" />
                <Button label="Si" icon="pi pi-check" text @click="deleteSelectedCategorias" />
            </template>
        </Dialog>
    </div>
</template>
