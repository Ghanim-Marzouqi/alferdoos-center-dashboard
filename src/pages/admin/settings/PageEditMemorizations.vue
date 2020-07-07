<template>
  <q-page padding>
    <p class="text-h6">إعدادات المحفوظات</p>

    <!-- Written Exam Questions Table -->
    <div class="row q-pa-md">
      <div class="fit row wrap justify-between items-center content-start">
        <p class="text-body1 text-weight-bold">المحفوظات</p>
        <q-btn
          class="q-mb-md"
          color="primary"
          @click="isAddMemorizationDialogOpen = true"
        >إضافة محفوظ جديد</q-btn>
      </div>
      <div class="col-12">
        <q-table :columns="columns" :data="data" row-key="text">
          <template v-slot:header="props">
            <q-tr :props="props">
              <q-th auto-width />
              <q-th v-for="col in props.cols" :key="col.name" :props="props">{{ col.label }}</q-th>
            </q-tr>
          </template>

          <template v-slot:body="props">
            <q-tr :props="props">
              <q-td auto-width>
                <q-btn
                  size="sm"
                  color="primary"
                  round
                  dense
                  @click="props.expand = !props.expand"
                  :icon="props.expand ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
                />
              </q-td>
              <q-td auto-width>{{ props.row.name }}</q-td>
              <q-td auto-width class="text-right">
                <q-btn dense flat color="teal" @click="onEditMemorization(props.row)">
                  <q-icon name="o_edit"></q-icon>
                </q-btn>
              </q-td>
              <q-td auto-width class="text-right">
                <q-btn dense flat color="red" @click="onDeleteMemorization(props.row)">
                  <q-icon name="o_delete"></q-icon>
                </q-btn>
              </q-td>
            </q-tr>
            <q-tr v-show="props.expand" :props="props">
              <q-td colspan="100%">
                <div class="text-left"></div>
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  name: "PageEditMemorizations",
  data() {
    return {
      isAddMemorizationDialogOpen: false,
      data: [],
      columns: [
        {
          name: "memorization",
          required: true,
          label: "اسم المحفوظ",
          field: row => row.name,
          align: "left"
        },
        {
          name: "edit",
          required: true,
          label: "تعديل",
          field: "edit",
          align: "right"
        },
        {
          name: "delete",
          required: true,
          label: "حذف",
          field: "delete",
          align: "right"
        }
      ]
    };
  },
  methods: {
    onEditMemorization(memorization) {},
    onDeleteMemorization(memorization) {}
  }
};
</script>

<style>
</style>