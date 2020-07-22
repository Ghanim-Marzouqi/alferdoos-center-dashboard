<template>
  <q-dialog v-model="isAlertDialogOpen">
    <q-card style="width: 400px">
      <q-card-section>{{ alertTitle }}</q-card-section>
      <q-card-actions>
        <q-space></q-space>
        <q-btn dense flat color="primary" @click="$emit('closeAlertDialog', false)">إلغاء</q-btn>
        <q-btn dense flat color="primary" :loading="GET_LOADING" @click="$emit('alertAction')">نعم</q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { mapGetters } from "vuex";
import { GETTERS } from "../config/constants";

export default {
  name: "AlertDialog",
  props: {
    isAlertDialogOpen: {
      type: Boolean,
      default: false,
    },
    alertTitle: {
      type: String,
      required: true,
      default: "",
    },
  },
  computed: mapGetters({ GET_LOADING: GETTERS.UI.GET_LOADING }),
};
</script>