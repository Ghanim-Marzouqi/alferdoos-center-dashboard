<template>
  <q-dialog v-model="isOpen" width="400px" persistent>
    <q-card>
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">إضافة عذر</div>
        <q-space />
        <q-btn icon="close" flat round dense @click="$emit('close')" />
      </q-card-section>

      <q-card-section class="q-pt-none">
        <div class="row">
          <div class="col">
            <q-card style="margin:10px;" class="full-height">
              <q-card-section>
                <q-form ref="subjectForm">
                  <div class="text-weight-bold">نوع العذر:</div>
                  <div class="row">
                    <div class="col-12">
                    <q-input
                    dense
                    square
                    outlined
                    clearable
                    v-model="execuse.title"
                    type="text"
                    label="نوع العذر"
                    lazy-rules
                    :rules="[ val => (val && val.length > 0) || 'الرجاء كتابة نوع العذر']"
                  />
                    </div>
                  </div>

                  <div class="text-weight-bold">ملاحظات</div>

                  <q-input
                    dense
                    square
                    outlined
                    :autogrow="false"
                    clearable
                    v-model="execuse.description"
                    :rules="[ val => (val && val.length > 0) || 'أضف بعض الملاحظات الإضافية']"
                    type="textarea"
                    label="ملاحظات"
                  />

                  <div class="text-weight-bold">المرفقات</div>

                  <q-file
                    v-model="execuse.files"
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
  name: "AttendanceAddExecuseDialog",
  props: {
    isOpen: {
      type: Boolean,
      default: false,
    },
    execuse: {
      type: Object,
    },

  },
  data() {
    return {};
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
      ADD_EXECUSE : ACTIONS.STUDNETS.ADD_EXECUSE,
      CLEAR_ERRORS_AND_MESSAGES: ACTIONS.UI.CLEAR_ERRORS_AND_MESSAGES,
    }),

    async onSubmit() {
        
        
        this.ADD_EXECUSE(this.execuse);      

        this.$emit("close");
      }
  },
};
</script>
