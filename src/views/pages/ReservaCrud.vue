<script setup>
import { MesaService } from '@/service/MesaService';
import { ReservaService } from '@/service/ReservaService';
import { FilterMatchMode } from '@primevue/core/api';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';

const toast = useToast();
const multiple = ref('multiple');
const dt = ref();
const reservas = ref();
const reservaDialog = ref(false);
const deleteReservaDialog = ref(false);
const reserva = ref({});
const selectedProducts = ref();
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});
const submitted = ref(false);
const loading = ref(false);
const dropdownValues = ref([]);

const loadData = async () => {
    loading.value = true;
    try {
        const [reservasData, mesasData] = await Promise.all([ReservaService.getAll(), MesaService.getAll()]);

        reservas.value = reservasData;
        dropdownValues.value = mesasData.map((mesa) => ({
            name: mesa.numeroMesa,
            value: mesa.id
        }));
    } catch (error) {
        console.error('Error al cargar los datos:', error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al cargar los datos', life: 3000 });
    } finally {
        loading.value = false;
    }
};

onMounted(() => {
    loadData();
});

function openNew() {
    reserva.value = {
        mesaId: null,
        nombreCliente: '',
        observaciones: '',
        fechaReserva: null,
        horaReserva: null,
        estado: 'PENDIENTE',
        numeroPersonas: 1
    };
    submitted.value = false;
    reservaDialog.value = true;
}

function hideDialog() {
    reservaDialog.value = false;
    submitted.value = false;
}

function saveReserva() {
    submitted.value = true;
    console.log('🚀 Iniciando guardado de reserva...');
    console.log('📦 Datos de la reserva a guardar:', reserva.value);

    if (!reserva.value.mesaId) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Por favor seleccione una mesa', life: 3000 });
        return;
    }

    // Formatear la fecha y hora
    let fechaHoraCompleta = null;
    let horaFormateada = null;

    if (reserva.value.fechaReserva && reserva.value.horaReserva) {
        if (reserva.value.id) {
            // Para actualización, mantener el formato original
            fechaHoraCompleta = `${reserva.value.fechaReserva}T00:00:00`;
            horaFormateada = `${reserva.value.horaReserva}:00`;
        } else {
            // Para creación, formatear la fecha a YYYY-MM-DD
            const fecha = new Date(reserva.value.fechaReserva);
            fechaHoraCompleta = fecha.toISOString().split('T')[0];

            // Formatear la hora a HH:mm
            const hora = new Date(reserva.value.horaReserva);
            horaFormateada = hora.toLocaleTimeString('es-ES', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            });

            fechaHoraCompleta = `${fechaHoraCompleta}T00:00:00`;
            horaFormateada = `${horaFormateada}:00`;
        }
    }

    const reservaData = {
        mesa: {
            id: reserva.value.mesaId
        },
        nombreCliente: reserva.value.nombreCliente,
        telefono: reserva.value.telefono,
        fechaReserva: fechaHoraCompleta,
        horaReserva: horaFormateada,
        numeroPersonas: reserva.value.numeroPersonas,
        estado: reserva.value.estado,
        observaciones: reserva.value.observaciones
    };

    console.log('🚀 Datos de la reserva formateados:', reservaData);

    if (reserva.value.id) {
        updateReserva(reservaData);
    } else {
        createReserva(reservaData);
    }
}

function createReserva(productoData) {
    ReservaService.create(productoData)
        .then(() => {
            reservaDialog.value = false;
            reserva.value = {};
            toast.add({ severity: 'success', summary: 'Éxito', detail: 'Reserva Creada', life: 3000 });
            loadData(); // Recargar datos después de crear
        })
        .catch((error) => {
            console.error('Error al crear la reserva:', error);
            toast.add({ severity: 'error', summary: 'Error', detail: 'Error al crear la reserva', life: 3000 });
        });
}

function updateReserva(reservaData) {
    ReservaService.update(reserva.value.id, reservaData)
        .then(() => {
            reservaDialog.value = false;
            reserva.value = {};
            toast.add({ severity: 'success', summary: 'Éxito', detail: 'Reserva Actualizada', life: 3000 });
            loadData(); // Recargar datos después de actualizar
        })
        .catch((error) => {
            console.error('Error al actualizar la reserva:', error);
            toast.add({ severity: 'error', summary: 'Error', detail: 'Error al actualizar la reserva', life: 3000 });
        });
}

function editProduct(prod) {
    reserva.value = { ...prod };
    reservaDialog.value = true;
}

function confirmDeleteProduct(prod) {
    reserva.value = prod;
    deleteReservaDialog.value = true;
}

function deleteReserva(reserva) {
    ReservaService.delete(reserva.id)
        .then(() => {
            reservas.value = reservas.value.filter((val) => val.id !== reserva.id);
            deleteReservaDialog.value = false;
            reserva.value = {};
            toast.add({ severity: 'success', summary: 'Éxito', detail: 'Reserva Eliminada', life: 3000 });
            loadData(); // Recargar datos después de actualizar
        })
        .catch((error) => {
            console.error('Error al eliminar la reserva:', error);
            toast.add({ severity: 'error', summary: 'Error', detail: 'Error al eliminar la reserva', life: 3000 });
        });
}

function findIndexById(id) {
    let index = -1;
    for (let i = 0; i < reservas.value.length; i++) {
        if (reservas.value[i].id === id) {
            index = i;
            break;
        }
    }

    return index;
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
</script>

<template>
    <div>
        <div class="card">
            <Toolbar class="mb-6">
                <template #start>
                    <Button label="Crear Reserva" icon="pi pi-plus" severity="secondary" class="mr-2" @click="openNew" />
                </template>
                <template #end>
                    <Button label="Export" icon="pi pi-upload" severity="secondary" @click="exportCSV($event)" />
                </template>
            </Toolbar>

            <DataTable
                ref="dt"
                v-model:selection="selectedProducts"
                :value="reservas"
                dataKey="id"
                :paginator="true"
                :rows="10"
                :filters="filters"
                :sortMode="multiple"
                :multiSortMeta="[
                    { field: 'fechaReserva', order: 1 },
                    { field: 'horaReserva', order: -1 }
                ]"
                :loading="loading"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                :rowsPerPageOptions="[5, 10, 25]"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} reservas"
            >
                <template #header>
                    <div class="flex flex-wrap gap-2 items-center justify-between">
                        <h4 class="m-0">Reservas</h4>
                        <IconField>
                            <InputIcon>
                                <i class="pi pi-search" />
                            </InputIcon>
                            <InputText v-model="filters['global'].value" placeholder="Search..." />
                        </IconField>
                    </div>
                </template>

                <Column field="nombreCliente" header="Nombre cliente" sortable style="min-width: 12rem"></Column>
                <Column field="telefono" header="Telefono" sortable style="min-width: 10rem"></Column>
                <Column field="fechaReserva" header="Fecha" sortable style="min-width: 13rem"></Column>
                <Column field="horaReserva" header="Hora" sortable style="min-width: 10rem"></Column>
                <Column field="numeroPersonas" header="Numero de personas" sortable style="min-width: 10rem"></Column>
                <Column field="numeroMesa" header="Numero de Mesa" sortable style="min-width: 12rem"></Column>
                <Column field="observaciones" header="Observaciones" sortable style="min-width: 12rem"></Column>
                <Column header="Estado" sortable style="min-width: 12rem" sortField="estado" :sortFunction="(a, b) => a.estado.localeCompare(b.estado)">
                    <template #body="slotProps">
                        <Tag :value="slotProps.data.estado" :severity="getEstadoSeverity(slotProps.data.estado)" />
                    </template>
                </Column>
                <Column :exportable="false" style="min-width: 12rem">
                    <template #body="slotProps">
                        <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="editProduct(slotProps.data)" />
                        <Button icon="pi pi-trash" outlined rounded severity="danger" @click="deleteReserva(slotProps.data)" />
                    </template>
                </Column>
            </DataTable>
        </div>

        <Dialog v-model:visible="reservaDialog" :style="{ width: '450px' }" header="Detalles reserva" :modal="true">
            <div class="flex flex-col gap-6">
                <img v-if="reserva.image" :src="`https://primefaces.org/cdn/primevue/images/product/${reserva.image}`" :alt="reserva.image" class="block m-auto pb-4" />
                <div>
                    <label for="nombre" class="block font-bold mb-3">Nombre</label>
                    <InputText id="nombre" v-model.trim="reserva.nombreCliente" required="true" autofocus :invalid="submitted && !reserva.nombreCliente" fluid />
                    <small v-if="submitted && !reserva.nombreCliente" class="text-red-500">El cliente es requerido.</small>
                </div>
                <div>
                    <label for="description" class="block font-bold mb-3">Observaciones</label>
                    <Textarea id="description" v-model="reserva.observaciones" required="true" rows="3" cols="20" fluid />
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label for="telefono" class="block font-bold mb-3">Teléfono</label>
                        <InputText id="telefono" v-model.trim="reserva.telefono" required="true" autofocus :invalid="submitted && !reserva.telefono" fluid />
                        <small v-if="submitted && !reserva.telefono" class="text-red-500">El teléfono es requerido.</small>
                    </div>
                    <div>
                        <label for="mesa" class="block font-bold mb-3">Mesa</label>
                        <Select id="mesa" v-model="reserva.mesaId" :options="dropdownValues" optionLabel="name" optionValue="value" placeholder="Seleccionar mesa" class="w-full" :class="{ 'p-invalid': submitted && !reserva.mesaId }" />
                        <small v-if="submitted && !reserva.mesaId" class="text-red-500">La mesa es requerida.</small>
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label for="fechaReserva" class="block font-bold mb-3">Fecha de Reserva</label>
                        <Calendar id="fechaReserva" v-model="reserva.fechaReserva" dateFormat="yy-mm-dd" :showIcon="true" class="w-full" />
                    </div>
                    <div>
                        <label for="horaReserva" class="block font-bold mb-3">Hora de Reserva</label>
                        <Calendar id="horaReserva" v-model="reserva.horaReserva" timeOnly hourFormat="24" :showIcon="true" :stepMinute="30" :stepHour="1" class="w-full" />
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label for="estado" class="block font-bold mb-3">Estado</label>
                        <Dropdown id="estado" v-model="reserva.estado" :options="['CONFIRMADA', 'CANCELADA', 'PENDIENTE']" placeholder="Seleccionar estado" class="w-full" />
                    </div>
                    <div>
                        <label for="numeroPersonas" class="block font-bold mb-3">Número de Personas</label>
                        <InputText id="telefono" v-model.trim="reserva.numeroPersonas" required="true" autofocus :invalid="submitted && !reserva.numeroPersonas" fluid />
                        <small v-if="submitted && !reserva.numeroPersonas" class="text-red-500">El numeroPersonas es requerido.</small>
                    </div>
                </div>
            </div>

            <template #footer>
                <Button label="Cancelar" icon="pi pi-times" text @click="hideDialog" />
                <Button label="Guardar" icon="pi pi-check" @click="saveReserva" />
            </template>
        </Dialog>

    </div>
</template>
