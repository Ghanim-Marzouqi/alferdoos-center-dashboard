<template>
  <q-dialog v-model="isOpen">
    <q-card style="width: 500px">
      <q-card-section>
        <q-time
        v-model="time"
        landscape
      />
      </q-card-section>
      <q-card-actions>
        <q-space></q-space>
        <q-btn dense flat color="primary" @click="$emit('cancel', false)">إلغاء</q-btn>
        <q-btn dense flat color="primary" :loading="GET_LOADING" @click="$emit('saveTime')">حفظ</q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { mapGetters } from "vuex";
import { GETTERS } from "../config/constants";

export default {
  name: "TimePickerDialog",
  props: {
    isOpen: {
      type: Boolean,
      default: false,
    },
    time: {
      type: String,
      required: true,
    },
  },
  computed: mapGetters({ GET_LOADING: GETTERS.UI.GET_LOADING }),
};
</script>