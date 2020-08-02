<template>
  <q-dialog v-model="isPromptDialogOpen">
    <q-card style="width: 400px">
      <q-card-section>{{ promptTitle }}</q-card-section>
      <q-card-section>
        <q-input class="textarea" v-model="promptText" filled :label="promptLabel" type="textarea" />
      </q-card-section>
      <q-card-actions>
        <q-space></q-space>
        <q-btn dense flat color="primary" @click="$emit('closePromptDialog', false)">إلغاء</q-btn>
        <q-btn
          dense
          flat
          color="primary"
          :loading="GET_LOADING"
          @click="$emit('promptAction', promptText)"
        >حفظ</q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { mapGetters } from "vuex";
import { GETTERS } from "../config/constants";

export default {
  name: "PromptDialog",
  props: {
    isPromptDialogOpen: {
      type: Boolean,
      default: false,
    },
    promptTitle: {
      type: String,
      required: true,
    },
    promptLabel: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      promptText: "",
    };
  },
  computed: mapGetters({ GET_LOADING: GETTERS.UI.GET_LOADING }),
};
</script>