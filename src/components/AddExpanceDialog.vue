<template>
  <q-dialog v-model="isOpen" full-width persistent>
    <q-card>
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">إضافة معاملة مالية</div>
        <q-space />
        <q-btn icon="close" flat round dense @click="$emit('close')" />
      </q-card-section>

      <q-card-section class="q-pt-none">
        <div class="row">
          <div class="col">
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
                        clearable
                        v-model="expanse.name"
                        type="text"
                        label="عنوان"
                        lazy-rules
                        :rules="[ val => (val && val.length > 0) || 'الرجاء كتابة عنوان']"
                      />
                    </div>
                  </div>
                  <div class="text-weight-bold">قيمة المعاملة:</div>
                  <div class="row">
                    <div class="col-12">
                      <q-input
                        dense
                        square
                        outlined
                        clearable
                        v-model="expanse.name"
                        type="number"
                        label="قيمة المعاملة"
                        lazy-rules
                        :rules="[ val => (val && val > 0) || 'الرجاء كتابة قيمة المعاملة']"
                      />
                    </div>
                  </div>

                  <div class="text-weight-bold">تاريخ المعاملة أو تاريخ بدء الدفع</div>
                  <q-input
                    ref="date"
                    dense
                    square
                    outlined
                    clearable
                    v-model="expence.date"
                    label="إختر تاريخ"
                    lazy-rules
                    :rules="[ val => val !== null && val !== '' || 'الرجاء إختيار تاريخ']"
                    @click="$refs.qDateProxy.show()"
                  >
                    <template v-slot:append>
                      <q-icon name="event" class="cursor-pointer">
                        <q-popup-proxy ref="qDateProxy">
                          <q-date
                            v-model="expence.date"
                            mask="DD/MM/YYYY"
                            @input="() => $refs.qDateProxy.hide()"
                          />
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
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
          <div class="col">
            <q-card style="margin:10px;" class="full-height">
              <q-card-section>
                <q-form ref="subjectForm">
                  <div class="text-weight-bold">تكرار المعاملة</div>
                  <div class="row">
                    <q-checkbox :disable="isDebit" v-model="expanse.isRepeated" label="هل المعاملة متكررة ؟" />
                  </div>
                  <div class="row">
                  <q-radio
                    
                    v-for="(option, i) in paymentsOptions"
                    :key="i"
                    v-model="expanse.repeatation"
                    :val="option.text"
                    :label="option.text"
                    :disable="!expanse.isRepeated"
                  />
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
  name: "SubjectAddSubjectDialog",
  props: {
    isOpen: {
      type: Boolean,
      default: false,
    },
    expanse: {
      type: Object,
    },
  },
  data() {
    return {
      paymentsOptions: [
        { text: "Annully" },
        { text: "Monthly" },
        { text: "Weekly" },
      ],
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
      UPDATE_EXPANCE: ACTIONS.SETTINGS.UPDATE_EXPANCE,
      CLEAR_ERRORS_AND_MESSAGES: ACTIONS.UI.CLEAR_ERRORS_AND_MESSAGES,
    }),

    async onSubmit() {
      if (this.expanse.isREPEATED) {
        let repeated = {
          amount = this.expanse.amount,
          repeatation = this.expanse.repeatation,
          title = this.expanse.title,
          description = this.expanse.description,
          startDate = this.expanse.date
        }
        this.ADD_REPEATED_EXPANCE(repeated);
      } else {
          let expence = {
          amount = this.expanse.amount,
          files : this.expanse.files,
          isCredit : this.expanse.isCredit,
          isDebit : this.expanse.isCredit,
          title = this.expanse.title,
          description = this.expanse.description,
          date = this.expanse.date
        }
        this.ADD_EXPANCE(expence);
      }

      this.$emit("close");
    },
  },
};
</script>
