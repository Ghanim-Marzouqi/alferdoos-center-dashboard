<template>
  <q-dialog v-model="isDialogOpen">
    <q-card style="width: 400px">
      <q-form @submit.prevent="addMemorization" @reset="resetMemorization">
        <q-card-section>
          <div class="text-h6">إضافة محفوظ جديد</div>
          <div class="q-ma-2">
            <div class="row q-gutter-2">
              <div class="col">
                <q-input
                  class="q-mt-sm"
                  filled
                  v-model="name"
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
import { mapGetters, mapActions } from "vuex";
import { GETTERS, ACTIONS } from "../config/constants";

export default {
  name: "AddMemorizationDialog",
  props: {
    isDialogOpen: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      name: ""
    };
  },
  computed: {
    ...mapGetters({
      GET_LOADING: GETTERS.UI.GET_LOADING
    })
  },
  methods: {
    ...mapActions({
      ADD_MEMORIZATION: ACTIONS.SETTINGS.ADD_MEMORIZATION
    }),
    closeDialog() {
      this.$emit("closeDialog", false);
    },
    addMemorization() {
      this.ADD_MEMORIZATION({
        name: this.name
      });
    },
    resetMemorization() {
      this.name = "";
    }
  }
};
</script>