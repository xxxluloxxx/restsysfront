<script setup>
import { EmpleadoService } from '@/service/EmpleadoService';
import { FilterMatchMode } from '@primevue/core/api';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';

const toast = useToast();
const dt = ref();
const empleados = ref();
const empleadoDialog = ref(false);
const deleteEmpleadoDialog = ref(false);
const deleteEmpleadosDialog = ref(false);
const empleado = ref({});
const selectedEmpleados = ref();
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});
const submitted = ref(false);

onMounted(() => {
    EmpleadoService.getAll()
        .then((data) => (empleados.value = data))
        .catch((error) => {
            console.error('Error al cargar los empleados:', error);
            toast.add({ severity: 'error', summary: 'Error', detail: 'Error al conectarse al servidor', life: 3000 });
        });
});

function formatCurrency(value) {
    if (value) return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    return;
}

function openNew() {
    empleado.value = {};
    submitted.value = false;
    empleadoDialog.value = true;
}

function hideDialog() {
    empleadoDialog.value = false;
    submitted.value = false;
}

function saveEmpleado() {
    submitted.value = true;

    if (empleado?.value.nombre?.trim()) {
        const empleadoData = {
            nombre: empleado.value.nombre,
            apellido: empleado.value.apellido,
            tipoDocumento: empleado.value.tipoDocumento,
            numeroDocumento: empleado.value.numeroDocumento,
            email: empleado.value.email,
            fechaIngreso: empleado.value.fechaIngreso,
            puesto: empleado.value.puesto,
            salario: empleado.value.salario,
            estado: empleado.value.estado
        };

        if (empleado.value.id) {
            updateEmpleado(empleadoData);
        } else {
            createEmpleado(empleadoData);
        }
    }
}

function createEmpleado(empleadoData) {
    EmpleadoService.create(empleadoData)
        .then((response) => {
            empleados.value.push(response);
            empleadoDialog.value = false;
            empleado.value = {};
            toast.add({ severity: 'success', summary: 'Éxito', detail: 'Empleado Creado', life: 3000 });
        })
        .catch((error) => {
            console.error('Error al crear el empleado:', error);
            toast.add({ severity: 'error', summary: 'Error', detail: 'Error al crear el empleado', life: 3000 });
        });
}

function updateEmpleado(empleadoData) {
    EmpleadoService.update(empleado.value.id, empleadoData)
        .then((response) => {
            const index = findIndexById(empleado.value.id);
            if (index !== -1) {
                empleados.value[index] = response;
            }
            empleadoDialog.value = false;
            empleado.value = {};
            toast.add({ severity: 'success', summary: 'Éxito', detail: 'Empleado Actualizado', life: 3000 });
        })
        .catch((error) => {
            console.error('Error al actualizar el empleado:', error);
            toast.add({ severity: 'error', summary: 'Error', detail: 'Error al actualizar el empleado', life: 3000 });
        });
}

function editEmpleado(empleado) {
    empleado.value = { ...empleado };
    empleadoDialog.value = true;
}

function confirmDeleteEmpleado(prod) {
    empleado.value = prod;
    deleteEmpleadoDialog.value = true;
}

function deleteEmpleado() {
    EmpleadoService.delete(empleado.value.id)
        .then(() => {
            empleados.value = empleados.value.filter((val) => val.id !== empleado.value.id);
            deleteEmpleadoDialog.value = false;
            empleado.value = {};
            toast.add({ severity: 'success', summary: 'Éxito', detail: 'Empleado Eliminado', life: 3000 });
        })
        .catch((error) => {
            console.error('Error al eliminar el empleado:', error);
            toast.add({ severity: 'error', summary: 'Error', detail: 'Error al eliminar el empleado', life: 3000 });
        });
}

function findIndexById(id) {
    let index = -1;
    for (let i = 0; i < empleados.value.length; i++) {
        if (empleados.value[i].id === id) {
            index = i;
            break;
        }
    }

    return index;
}

function exportCSV() {
    dt.value.exportCSV();
}

function confirmDeleteSelected() {
    deleteEmpleadosDialog.value = true;
}

function deleteSelectedEmpleados() {
    const deletePromises = selectedEmpleados.value.map((empleado) => EmpleadoService.delete(empleado.id));

    Promise.all(deletePromises)
        .then(() => {
            empleados.value = empleados.value.filter((val) => !selectedEmpleados.value.includes(val));
            deleteEmpleadosDialog.value = false;
            selectedEmpleados.value = null;
            toast.add({ severity: 'success', summary: 'Éxito', detail: 'Empleados Eliminados', life: 3000 });
        })
        .catch((error) => {
            console.error('Error al eliminar los empleados:', error);
            toast.add({ severity: 'error', summary: 'Error', detail: 'Error al eliminar los empleados', life: 3000 });
        });
}
</script>

<template>
    <div>
        <div class="card">
            <Toolbar class="mb-6">
                <template #start>
                    <Button label="New" icon="pi pi-plus" severity="secondary" class="mr-2" @click="openNew" />
                    <Button label="Delete" icon="pi pi-trash" severity="secondary" @click="confirmDeleteSelected" :disabled="!selectedEmpleados || !selectedEmpleados.length" />
                </template>

                <template #end>
                    <Button label="Export" icon="pi pi-upload" severity="secondary" @click="exportCSV($event)" />
                </template>
            </Toolbar>

            <DataTable
                ref="dt"
                v-model:selection="selectedEmpleados"
                :value="empleados"
                dataKey="id"
                :paginator="true"
                :rows="10"
                :filters="filters"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                :rowsPerPageOptions="[5, 10, 25]"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} empleados"
            >
                <template #header>
                    <div class="flex flex-wrap gap-2 items-center justify-between">
                        <h4 class="m-0">Empleados</h4>
                        <IconField>
                            <InputIcon>
                                <i class="pi pi-search" />
                            </InputIcon>
                            <InputText v-model="filters['global'].value" placeholder="Search..." />
                        </IconField>
                    </div>
                </template>

                <Column selectionMode="multiple" style="width: 3rem" :exportable="false"></Column>
                <Column field="nombre" header="Nombre" sortable style="min-width: 5rem"></Column>
                <Column field="apellido" header="Apellido" sortable style="min-width: 5rem"></Column>
                <Column field="numeroDocumento" header="Identificacion" sortable style="min-width: 1rem"></Column>
                <Column field="email" header="Email" sortable style="min-width: 10rem"></Column>
                <Column field="fechaIngreso" header="Fecha ingreso" sortable style="min-width: 10rem"></Column>
                <Column field="estado" header="Estado" style="min-width: 6rem">
                    <template #body="slotProps">
                        <Tag :value="slotProps.data.estado ? 'Activo' : 'Inactivo'" :severity="slotProps.data.estado ? 'success' : 'danger'" />
                    </template>
                </Column>
                <Column field="puesto" header="Puesto" sortable style="min-width: 10rem"></Column>
                <Column field="salario" header="Salario" sortable style="min-width: 8rem">
                    <template #body="slotProps">
                        {{ new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(slotProps.data.salario) }}
                    </template>
                </Column>
                <Column :exportable="false" style="min-width: 12rem">
                    <template #body="slotProps">
                        <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="editEmpleado(slotProps.data)" />
                        <Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDeleteEmpleado(slotProps.data)" />
                    </template>
                </Column>
            </DataTable>
        </div>

        <Dialog v-model:visible="empleadoDialog" :style="{ width: '450px' }" header="Detalles del Empleado" :modal="true">
            <div class="flex flex-col gap-4">
                <div>
                    <label for="tipo_documento" class="block font-bold mb-2">Tipo de Documento</label>
                    <Dropdown
                        id="tipo_documento"
                        v-model="empleado.tipoDocumento"
                        :options="[
                            {label: 'DNI', value: 'DNI'},
                            {label: 'Carnet Extranjería', value: 'CE'},
                            {label: 'Pasaporte', value: 'PAS'}
                        ]"
                        optionLabel="label"
                        optionValue="value"
                        placeholder="Seleccione tipo de documento"
                        :class="{ 'p-invalid': submitted && !empleado.tipoDocumento }"
                        fluid
                    />
                    <small v-if="submitted && !empleado.tipoDocumento" class="text-red-500">El tipo de documento es requerido.</small>
                </div>

                <div>
                    <label for="numeroDocumento" class="block font-bold mb-2">Número de Documento</label>
                    <InputText id="numeroDocumento" v-model.trim="empleado.numeroDocumento" required="true" :invalid="submitted && !empleado.numeroDocumento" fluid />
                    <small v-if="submitted && !empleado.numeroDocumento" class="text-red-500">El número de documento es requerido.</small>
                </div>

                <div>
                    <label for="nombre" class="block font-bold mb-2">Nombre</label>
                    <InputText id="nombre" v-model.trim="empleado.nombre" required="true" :invalid="submitted && !empleado.nombre" fluid />
                    <small v-if="submitted && !empleado.nombre" class="text-red-500">El nombre es requerido.</small>
                </div>

                <div>
                    <label for="apellido" class="block font-bold mb-2">Apellido</label>
                    <InputText id="apellido" v-model.trim="empleado.apellido" required="true" :invalid="submitted && !empleado.apellido" fluid />
                    <small v-if="submitted && !empleado.apellido" class="text-red-500">El apellido es requerido.</small>
                </div>

                <div>
                    <label for="email" class="block font-bold mb-2">Email</label>
                    <InputText id="email" v-model.trim="empleado.email" required="true" type="email" :invalid="submitted && !empleado.email" fluid />
                    <small v-if="submitted && !empleado.email" class="text-red-500">El email es requerido.</small>
                </div>

                <div>
                    <label for="fechaIngreso" class="block font-bold mb-2">Fecha de Ingreso</label>
                    <Calendar id="fechaIngreso" v-model="empleado.fechaIngreso" dateFormat="dd/mm/yy" :invalid="submitted && !empleado.fechaIngreso" fluid />
                    <small v-if="submitted && !empleado.fechaIngreso" class="text-red-500">La fecha de ingreso es requerida.</small>
                </div>

                <div>
                    <label for="puesto" class="block font-bold mb-2">Puesto</label>
                    <InputText id="puesto" v-model.trim="empleado.puesto" required="true" :invalid="submitted && !empleado.puesto" fluid />
                    <small v-if="submitted && !empleado.puesto" class="text-red-500">El puesto es requerido.</small>
                </div>

                <div>
                    <label for="salario" class="block font-bold mb-2">Salario</label>
                    <InputNumber id="salario" v-model="empleado.salario" mode="currency" currency="PEN" locale="es-PE" :invalid="submitted && !empleado.salario" fluid />
                    <small v-if="submitted && !empleado.salario" class="text-red-500">El salario es requerido.</small>
                </div>

                <div>
                    <label for="estado" class="block font-bold mb-2">Estado</label>
                    <ToggleButton
                        v-model="empleado.estado"
                        onLabel="Activo"
                        offLabel="Inactivo"
                        :class="{ 'p-button-success': empleado.estado === true, 'p-button-danger': empleado.estado === false }"
                        fluid
                    />
                </div>
            </div>

            <template #footer>
                <Button label="Cancelar" icon="pi pi-times" text @click="hideDialog" />
                <Button label="Guardar" icon="pi pi-check" @click="saveEmpleado" />
            </template>
        </Dialog>


        <Dialog v-model:visible="deleteEmpleadoDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
            <div class="flex items-center gap-4">
                <i class="pi pi-exclamation-triangle !text-3xl" />
                <span v-if="empleado"
                    >Estas seguro de querer elimminar este empleado <b>{{ empleado.name }}</b
                    >?</span
                >
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" text @click="deleteEmpleadoDialog = false" />
                <Button label="Si" icon="pi pi-check" @click="deleteEmpleado" />
            </template>
        </Dialog>

        <Dialog v-model:visible="deleteEmpleadosDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
            <div class="flex items-center gap-4">
                <i class="pi pi-exclamation-triangle !text-3xl" />
                <span v-if="empleado">¿Estas seguro de querer eliminar los empleados seleccionados?</span>
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" text @click="deleteEmpleadosDialog = false" />
                <Button label="Yes" icon="pi pi-check" text @click="deleteSelectedEmpleados" />
            </template>
        </Dialog>
    </div>
</template>
