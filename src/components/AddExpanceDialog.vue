<template>
  <q-dialog v-model="isOpen" persistent>
    <q-card style="width: 1000px">
      <!-- {{ expanse }} -->
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">إضافة معاملة مالية</div>
        <q-space />
        <q-btn icon="close" flat round dense @click="$emit('close')" />
      </q-card-section>

      <q-card-section class="q-pt-none">
        <div class="row">
          <div class="col-12">
            <q-card style="margin:10px;" class="full-height">
              <q-card-section>
                <q-form ref="subjectForm">
                  <div class="text-weight-bold">عنوان:</div>
                  <div class="row">
                    <div class="col-12">
                      <q-input
                        dense
                        square
                        outlined
                        :disable="expanse.ref !=''"
                        clearable
                        v-model="expanse.title"
                        type="text"
                        label="عنوان"
                        lazy-rules
                        :rules="[ val => (val && val.length > 0) || 'الرجاء كتابة عنوان']"
                      />
                    </div>
                  </div>

                  <div class="row">
                    <div class="col-5">
                      <div class="text-weight-bold">قيمة المعاملة:</div>
                      <q-input
                        dense
                        square
                        outlined
                        clearable
                        @change="changeNumber('amount')"
                        v-model="expanse.amount"
                        type="number"
                        label="قيمة المعاملة"
                        lazy-rules
                        :rules="[ val => (val && val > 0) || 'الرجاء كتابة قيمة المعاملة']"
                      />
                    </div>
                    <div class="col-1"></div>
                    <div class="col-6">
                      <div class="text-weight-bold">تاريخ المعاملة أو تاريخ بدء الدفع</div>
                      <q-input
                        ref="date"
                        dense
                        square
                        outlined
                        clearable
                        v-model="expanse.date"
                        label="إختر تاريخ"
                        lazy-rules
                        :rules="[ val => val !== null && val !== '' || 'الرجاء إختيار تاريخ']"
                        @click="$refs.qDateProxy.show()"
                      >
                        <template v-slot:append>
                          <q-icon name="event" class="cursor-pointer">
                            <q-popup-proxy ref="qDateProxy">
                              <q-date
                                v-model="expanse.date"
                                mask="DD/MM/YYYY"
                                @input="() => $refs.qDateProxy.hide()"
                              />
                            </q-popup-proxy>
                          </q-icon>
                        </template>
                      </q-input>
                    </div>
                  </div>

                  <div class="row">
                    <div class="col-4">
                      <q-checkbox
                        :disable="expanse.isDebit || isEdit || expanse.ref !=''"
                        v-model="expanse.isReapted"
                        label="تكرار ؟"
                      />
                    </div>
                    <div class="col-2"></div>
                    <div class="col-2">
                      <q-input
                        dense
                        square
                        outlined
                        :disable="expanse.isDebit || !expanse.isReapted"
                        @change="changeNumber('months')"
                        v-model="expanse.months"
                        type="number"
                        label="الأشهر"
                        lazy-rules
                        :rules="[ val => (val && val > 0) || 'الرجاء كتابة عدد الأشهر']"
                      />
                    </div>
                    <div class="col-1"></div>
                    <div class="col-3">
                      <q-input
                        dense
                        square
                        outlined
                        @change="changeNumber('total')"
                        :disable="expanse.isDebit || !expanse.isReapted"
                        v-model="totalAmount"
                        type="number"
                        label="المجموع"
                        lazy-rules
                      />
                    </div>
                  </div>

                  <div class="text-weight-bold">أضف المزيد من التفاصيل ؟</div>
                  <q-input
                    dense
                    square
                    outlined
                    :autogrow="false"
                    clearable
                    v-model="expanse.description"
                    :rules="[ val => (val && val.length > 0) || 'تفاصيل']"
                    type="textarea"
                    label="مختصر بسيط للمعاملة"
                  />

                  <div class="text-weight-bold">المرفقات</div>

                  <q-file
                    v-model="expanse.files"
                    label="المرفقات"
                    dense
                    outlined
                    use-chips
                    multiple
                    accept=".pdf"
                  >
                    <template v-slot:prepend>
                      <q-icon name="attach_file" />
                    </template>
                  </q-file>
                </q-form>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </q-card-section>

      <q-card-actions align="right" class="text-primary">
        <q-btn flat label="حسنا" @click="onSubmit" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { ACTIONS, ERRORS, STUDENT_GRADE, GETTERS } from "../config/constants";

export default {
  name: "AddExpenseDialog",
  props: {
    isOpen: {
      type: Boolean,
      default: false,
    },
    isEdit: {
      type: Boolean,
      default: false,
    },
    expanse: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      totalAmount: 0,
      paymentsOptions: [{ text: "سنوي" }, { text: "شهري" }, { text: "إسبوعي" }],
    };
  },
  computed: {
    ...mapGetters({
      GET_LOADING: GETTERS.UI.GET_LOADING,
      GET_MESSAGES: GETTERS.UI.GET_MESSAGES,
      GET_ERRORS: GETTERS.UI.GET_ERRORS,
    }),
  },
  methods: {
    ...mapActions({
      ADD_EXPANCE: ACTIONS.SETTINGS.ADD_EXPANCE,
      ADD_REPEATED_EXPANCE: ACTIONS.SETTINGS.ADD_REPEATED_EXPANCE,
      EDIT_REPEATED_EXPANCE: ACTIONS.SETTINGS.EDIT_REPEATED_EXPANCE,
      EDIT_EXPANCE: ACTIONS.SETTINGS.EDIT_EXPANCE,
      CLEAR_ERRORS_AND_MESSAGES: ACTIONS.UI.CLEAR_ERRORS_AND_MESSAGES,
    }),
    changeNumber(type) {},
    async onSubmit() {
      if (this.expanse.isReapted) {
        let repeated = {
          amount: this.expanse.amount,
          months: this.expanse.months,
          repeatation: this.expanse.repeatation,
          files: this.isEdit ? this.expanse.filesUrl : this.expanse.files,
          title: this.expanse.title,
          description: this.expanse.description,
          startDate: this.expanse.date,
          lastPayment: "",
        };    
        
        if (this.isEdit) {
          this.EDIT_REPEATED_EXPANCE({ id : this.expanse.id,  data : repeated , files : this.expanse.files});
        } else {
          this.ADD_REPEATED_EXPANCE(repeated);
        }
      } else {
        let expanse = {
          ref : this.expanse.ref,
          amount: this.expanse.amount,
          files: this.isEdit ? this.expanse.filesUrl : this.expanse.files,
          isCredit: this.expanse.isCredit,
          isDebit: this.expanse.isDebit,
          title: this.expanse.title,
          description: this.expanse.description,
          date: this.expanse.date,
        };
        if (this.isEdit){
          this.EDIT_EXPANCE({ id : this.expanse.id,  data : expanse , files : this.expanse.files})
        }else{
          this.ADD_EXPANCE(expanse);
        }
        
      }

      this.$emit("close");
    },
  },
};
</script>
