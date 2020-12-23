<template>
  <div>
    {{ calculateTotal() }}
    <q-dialog v-model="isDialogOpen" @hide="resetValues">
      <q-card style="width: 800px">
        <q-form @submit.prevent="addMemorizationDetails">
          <q-card-section>
            <div class="text-h6">إضافة درجة المحفوظ</div>
            
             
            <div class="q-ma-2">
              <div class="row">
                <q-list style="width: 100%">
                  
                  <q-item>
                    <q-item-section class="justify-start" avatar>
                      <div class="text-h6">الدرجة : {{ result }}</div>
                    </q-item-section>
                    <q-item-section > 
                      <div class="text-h6" :color="getStatus() ? 'red' : 'black'">الحالة : {{ getStatus() ? "ناجح" : "راسب"}}</div>
                       </q-item-section>
                    <q-item-section side>
                     تكرار {{ repeat }}
                    </q-item-section>
                  </q-item>


                  <q-item>
                    <q-item-section class="justify-start" avatar>
                      <q-btn
                        dense
                        round
                        size="sm"
                        color="primary"
                        @click="addMistake(1)"
                      >
                        <q-icon name="o_add" />
                      </q-btn>
                      <q-btn
                        dense
                        round
                        size="sm"
                        color="red"
                        class="q-mt-s"
                        @click="addMistake(-1)"
                      >
                        <q-icon name="o_remove" />
                      </q-btn>
                    </q-item-section>
                    <q-item-section > أخطاء </q-item-section>
                    <q-item-section side>
                      {{ mistake }}
                    </q-item-section>
                  </q-item>

                  <q-item>
                    <q-item-section class="justify-start" avatar>
                      <q-btn
                        dense
                        round
                        size="sm"
                        color="primary"
                        @click="addNotification(1)"
                      >
                        <q-icon name="o_add" />
                      </q-btn>
                      <q-btn
                        dense
                        round
                        size="sm"
                        color="red"
                        @click="addNotification(-1)"
                      >
                        <q-icon name="o_remove" />
                      </q-btn>
                    </q-item-section>
                    <q-item-section> تنبيه </q-item-section>
                    <q-item-section side>
                      {{ notifications }}
                    </q-item-section>
                  </q-item>
                </q-list>
              </div>
            </div>
          </q-card-section>
          <q-card-actions>
            <q-space></q-space>
            <q-btn dense flat color="primary" @click="closeDialog">إلغاء</q-btn>
            <q-btn
              dense
              flat
              color="primary"
              :loading="GET_LOADING"
              type="submit"
              >حفظ</q-btn
            >
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { uid } from "quasar";
import { mapGetters, mapActions } from "vuex";
import { GETTERS, ACTIONS } from "../config/constants";

export default {
  name: "AddMemoMarksDialog",
  props: {
    isDialogOpen: {
      type: Boolean,
      default: false,
    },
    detail: {
      type: Object,
      default: () => {},
    },
    student: {
      type: String,
      required: true,
    },
    memoId: {
      type: String,
      required: true,
    },
    page: {
      type: Number,
      required: true,
    },
    repeat: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      isAddRepeatsDialogOpen: false,
      mistake: 0,
      result: 0,
      notifications: 0,
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
      ADD_MEMORIZATION_MARK: ACTIONS.SETTINGS.ADD_MEMORIZATION_MARK,
    }),
    addNotification(num) {
      if (this.notifications == 0 && num < 0)
        return;
      this.notifications = this.notifications + num;
      this.calculateTotal();
    },
    getStatus(){
      return this.result >= this.detail.failMarks;
    },
    addMistake(num) {
      if (this.mistake == 0 && num < 0)
        return;
      
      this.mistake = this.mistake + num;
      this.calculateTotal();
    },
    calculateTotal() {
      let pageMark = this.detail.pageMarks;
      this.result =
        pageMark -
        this.mistake * this.detail.mistakeMarks -
        this.notifications * this.detail.cautionMarks;
    },
    closeDialog() {
      this.resetValues();
      this.$emit("closeDialog", false);
    },
    async addMemorizationDetails() {
      await this.ADD_MEMORIZATION_MARK({
        uid: uid(),
        studentId: this.student,
        detailsId: this.detail.uid,
        memoId: this.memoId,
        page: this.page,
        mistakes: this.mistake,
        notifications: this.notifications,
        result: this.result,
        status : this.getStatus(),
        repeat : this.repeat
      });

      this.closeDialog();
    },
    resetValues() {
      (this.mistake = 0), (this.notifications = 0);
    },
  },
};
</script>