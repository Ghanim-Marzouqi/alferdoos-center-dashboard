<template>
  <div>
    <q-dialog v-model="isDialogOpen" @hide="resetValues">
      <q-card style="width: 800px">
        <q-form @submit.prevent="addMemorizationDetails">
          <q-card-section>
            <div class="text-h6">إضافة تفاصيل المحفوظ</div>
            <div class="q-ma-2">
              <div class="row">
                <div class="col q-pa-xs">
                  <q-input
                    filled
                    v-model="name"
                    label="الأسم"
                    :rules="[val => val.length > 0 || 'الرجاء إدخال الأسم']"
                  />
                </div>
              </div>
              <div class="row justify-center">
                <div class="col-6 q-pa-xs">
                  <q-input
                    filled
                    v-model="pageNumberFrom"
                    label="الصفحات (من)"
                    type="number"
                    :rules="[val => val > 0 || 'الرجاء إدخال رقم أكبر من صفر']"
                  />
                </div>
                <div class="col-6 q-pa-xs">
                  <q-input
                    filled
                    v-model="pageNumberTo"
                    label="الصفحات (إلى)"
                    type="number"
                    :rules="[val => val > 0 || 'الرجاء إدخال رقم أكبر من صفر']"
                  />
                </div>
              </div>
              <div class="row justify-center">
                <div class="col-6 q-pa-xs">
                  <q-input
                    filled
                    v-model="pageMarks"
                    label="درجة كل صفحة"
                    mask="#.#"
                    fill-mask="0"
                    reverse-fill-mask
                    :rules="[val => val > 0 || 'الرجاء إدخال رقم أكبر من صفر']"
                  />
                </div>
                <div class="col-6 q-pa-xs">
                  <q-input
                    filled
                    v-model="failMarks"
                    label="درجة الرسوب"
                    mask="#.#"
                    fill-mask="0"
                    reverse-fill-mask
                    :rules="[val => val > 0 || 'الرجاء إدخال رقم أكبر من صفر']"
                  />
                </div>
              </div>
              <div class="row justify-center">
                <div class="col-6 q-pa-xs">
                  <q-input
                    filled
                    v-model="mistakeMarks"
                    label="درجة الخطأ"
                    mask="#.#"
                    fill-mask="0"
                    reverse-fill-mask
                    :rules="[val => val > 0 || 'الرجاء إدخال رقم أكبر من صفر']"
                  />
                </div>
                <div class="col-6 q-pa-xs">
                  <q-input
                    filled
                    v-model="cautionMarks"
                    label="درجة التنبيه"
                    mask="#.#"
                    fill-mask="0"
                    reverse-fill-mask
                    :rules="[val => val > 0 || 'الرجاء إدخال رقم أكبر من صفر']"
                  />
                </div>
              </div>
              <div class="row justify-center items-center">
                <q-btn
                  color="primary"
                  class="q-ma-xs"
                  style="width: 100%"
                  v-if="repeats.length == 0"
                  @click="isAddRepeatsDialogOpen = true"
                >إضافة تكرار</q-btn>
                <p class="text-primary" v-if="repeats.length > 0">تم إضافة التكرار</p>
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

    <!-- Add Repeats Dialog -->
    <AddRepeatsDialog
      :isDialogOpen="isAddRepeatsDialogOpen"
      @closeDialog="closeAddRepeatsDialog"
      @setRepeats="setRepeats"
    />
  </div>
</template>

<script>
import { uid } from "quasar";
import { mapGetters, mapActions } from "vuex";
import { GETTERS, ACTIONS } from "../config/constants";

export default {
  name: "AddMemorizationDetailsDialog",
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
      isAddRepeatsDialogOpen: false,
      name: "",
      pageNumberFrom: "",
      pageNumberTo: "",
      pageMarks: "",
      mistakeMarks: "",
      cautionMarks: "",
      failMarks: "",
      repeats: [],
    };
  },
  computed: {
    ...mapGetters({
      GET_LOADING: GETTERS.UI.GET_LOADING,
    }),
  },
  methods: {
    ...mapActions({
      ADD_MEMORIZATION_DETAILS: ACTIONS.SETTINGS.ADD_MEMORIZATION_DETAILS,
    }),
    closeDialog() {
      this.$emit("closeDialog", false);
    },
    addMemorizationDetails() {
      console.log(this.memorization);
      if (Object.keys(this.memorization).length > 0) {
        this.ADD_MEMORIZATION_DETAILS({
          id: this.memorization.id,
          uid: uid(),
          name: this.name,
          pageNumberFrom: Number.parseInt(this.pageNumberFrom),
          pageNumberTo: Number.parseInt(this.pageNumberTo),
          pageMarks: Number.parseFloat(this.pageMarks),
          mistakeMarks: Number.parseFloat(this.mistakeMarks),
          cautionMarks: Number.parseFloat(this.cautionMarks),
          failMarks: Number.parseFloat(this.failMarks),
          repeats: this.repeats,
        });
      }
    },
    setRepeats(repeats) {
      this.repeats = [...repeats];
      if (this.repeats.length > 0) {
        this.isAddRepeatsDialogOpen = false;
      }
    },
    resetValues() {
      this.name = "";
      this.pageNumberFrom = "";
      this.pageNumberTo = "";
      this.pageMarks = "";
      this.mistakeMarks = "";
      this.cautionMarks = "";
      this.failMarks = "";
      this.repeats = [];
    },
    closeAddRepeatsDialog(value) {
      this.isAddRepeatsDialogOpen = value;
    },
  },
  components: {
    AddRepeatsDialog: () => import("components/AddRepeatDialog.vue"),
  },
};
</script>