<template>
  <q-dialog v-model="isDialogOpen" @before-show="onShowDialog" @hide="onHideDialog">
    <q-card style="width: 400px">
      <q-form @submit.prevent="addMemorization">
        <q-card-section>
          <div class="text-h6">إضافة محفوظ جديد</div>
          <div class="q-ma-2">
            <div class="row q-gutter-2">
              <div class="col">
                <q-input
                  v-model="name"
                  class="q-mt-sm"
                  filled
                  label="أسم المحفوظ"
                  type="text"
                  :rules="[val => val.length > 0 || 'الرجاء إدخال أسم المحفوظ']"
                />
              </div>
            </div>
          </div>
        </q-card-section>
        <q-card-actions>
          <q-space></q-space>
          <q-btn dense flat color="primary" @click="closeDialog">إلغاء</q-btn>
          <q-btn dense flat color="primary" :loading="GET_LOADING" type="submit">حفظ</q-btn>
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script>
import { uid } from "quasar";
import { mapGetters, mapActions } from "vuex";
import { GETTERS, ACTIONS } from "../config/constants";

export default {
  name: "AddMemorizationDialog",
  props: {
    isDialogOpen: {
      type: Boolean,
      default: false,
    },
    memorization: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      id: "",
      name: "",
    };
  },
  computed: {
    ...mapGetters({
      GET_LOADING: GETTERS.UI.GET_LOADING,
    }),
  },
  methods: {
    ...mapActions({
      ADD_MEMORIZATION: ACTIONS.SETTINGS.ADD_MEMORIZATION,
      EDIT_MEMORIZATION: ACTIONS.SETTINGS.EDIT_MEMORIZATION,
    }),
    closeDialog() {
      this.$emit("closeDialog", false);
    },
    addMemorization() {
      if (Object.keys(this.memorization).length > 0) {
        this.EDIT_MEMORIZATION({
          id: this.id,
          name: this.name,
        });
      } else {
        this.ADD_MEMORIZATION({
          uid: uid(),
          name: this.name,
        });
      }
    },
    onShowDialog() {
      if (Object.keys(this.memorization).length > 0) {
        this.id = this.memorization.id;
        this.name = this.memorization.name;
      }
    },
    onHideDialog() {
      this.id = "";
      this.name = "";
    },
  },
};
</script>