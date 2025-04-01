<script setup>
import { CustomerService } from '@/service/CustomerService';
import { onBeforeMount, ref } from 'vue';

const customers2 = ref(null);

onBeforeMount(() => {
    CustomerService.getProductsData2().then((data) => (customers2.value = data));
});

</script>

<template>
    <div class="card">
        <div class="font-semibold text-xl mb-4">Frozen Columns</div>

        <DataTable :value="customers2" scrollable scrollHeight="500px" class="mt-6">
            <Column field="nombre" header="nombre" style="min-width: 200px" frozen class="font-bold"></Column>
            <Column field="descripcion" header="descripcion" style="min-width: 200px" frozen class="font-bold"></Column>
            <Column field="precioUnitario" header="precio" style="min-width: 200px" frozen class="font-bold"></Column>
            <Column field="categoria" header="categoria" style="min-width: 200px" frozen class="font-bold"></Column>
            <Column field="stockDisponible" header="stock" style="min-width: 200px" frozen class="font-bold"></Column>
            <Column field="createdAt" header="createdAt" style="min-width: 200px" frozen class="font-bold"></Column>
            <Column field="updatedAt" header="updatedAt" style="min-width: 200px" frozen class="font-bold"></Column>

        </DataTable>
    </div>

</template>

<style scoped lang="scss">
:deep(.p-datatable-frozen-tbody) {
    font-weight: bold;
}

:deep(.p-datatable-scrollable .p-frozen-column) {
    font-weight: bold;
}
</style>
