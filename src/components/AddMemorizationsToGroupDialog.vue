<template>
  <q-dialog v-model="isAddMemorizationToGroupDialogOpen" @before-show="intializeValues">
    <q-card style="width: 400px">
      <q-card-section>
        <div class="text-h6">إضافة محفوظات إلى مجموعة</div>
        <div class="q-ma-md">
          <q-option-group :options="options" label="Notifications" type="checkbox" v-model="group" />
        </div>
      </q-card-section>
      <q-card-actions>
        <q-space></q-space>
        <q-btn dense flat color="primary" @click="closeGroupDialog">إلغاء</q-btn>
        <q-btn dense flat color="primary" :loading="GET_LOADING" @click="editGroup">حفظ</q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: "AddMemorizationToGroupDialog.vue",
  props: {
    isAddMemorizationToGroupDialogOpen: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {};
  },
  methods: {
    intializeValues() {},
  },
};
</script>