<template>
  <q-dialog v-model="isOpen" width="600px" persistent>
    <q-card>
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">إغلاق نشاط</div>
        <q-space />
        <q-btn icon="close" flat round dense @click="$emit('close')" />
      </q-card-section>

      <q-card-section class="q-pt-none">
        <div class="row">
          <div class="col">
            <q-card style="margin:10px;" class="full-height">
              <q-card-section>
                <q-form ref="subjectForm">
                  <div class="text-weight-bold">نوع النشاط:</div>
                  <div class="row">
                    <div v-for="beh in getTitles" :key="beh.name">
                      <q-chip
                        square
                        :outline="!beh.selected"
                        :color="beh.selected ? 'red' : 'green'"
                        text-color="white"
                        :icon="beh.icon"
                      >{{ beh.name }}</q-chip>
                    </div>
                  </div>

                  <div class="text-weight-bold q-mt-md">توصيف</div>

                  <q-input
                    dense
                    square
                    outlined
                    disable
                    :autogrow="false"
                    clearable
                    v-model="activity.description"
                    type="textarea"
                    label="توصيف النشاط"
                  />

                      <div class="col-6">
                  <div class="text-weight-bold q-mt-md">تقرير الآداء</div>

                  <q-input
                    dense
                    square
                    outlined
                    :autogrow="false"
                    clearable
                    v-model="activity.feedback"
                    :rules="[ val => (val && val.length > 0) || 'أضف تقرير للآداء']"
                    type="textarea"
                    label="تقرير الآداء"
                  />
                    </div>
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
    activity: {
      type: Object,
      required : true
    },
  },
  data() {
    return {
      titles : [
        {name : "تميز", selected : false, icon : "event"},
        {name : "حل للأنشطة", selected : false, icon : "event"},
        {name : "إلتزام", selected : false, icon : "event"},
      ],
    };
  },
  computed: {
    ...mapGetters({
      GET_LOADING: GETTERS.UI.GET_LOADING,
      GET_MESSAGES: GETTERS.UI.GET_MESSAGES,
      GET_ERRORS: GETTERS.UI.GET_ERRORS,
    }),
      getTitles(){
      this.titles.forEach(b => b.name == this.activity.title ? b.selected = true : b.selected = false)
      return this.titles;
    },
  },
  methods: {
    ...mapActions({
      UPDATE_ACTIVITY: ACTIONS.STUDNETS.UPDATE_ACTIVITY,
      CLEAR_ERRORS_AND_MESSAGES: ACTIONS.UI.CLEAR_ERRORS_AND_MESSAGES,
    }),
    changeType(title){
      this.titles.forEach( beh => beh.name == title.name ? beh.selected = true : beh.selected = false);
    },

    async onSubmit() {
      this.activity.isDone = true;
      this.UPDATE_ACTIVITY(this.activity);
      this.$emit("close");
    },
  },
};
</script>
