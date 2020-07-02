<template>
  <q-dialog v-model="isErrorDialogOpen">
    <q-card style="width: 400px">
      <q-card-section>{{ errorTitle }}</q-card-section>
      <q-card-actions>
        <q-space></q-space>
        <q-btn dense flat color="primary" @click="$emit('closeErrorDialog', false)">حسنا</q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: "ErrorDialog",
  props: {
    isErrorDialogOpen: {
      type: Boolean,
      default: false
    },
    errorTitle: {
      type: String,
      required: true,
      default: ""
    }
  }
};
</script>
