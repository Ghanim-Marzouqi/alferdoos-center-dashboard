<template>
  <q-dialog v-model="isOpen" width="600px" @before-show="setTitle">
    <q-card style="width:600px">
      <q-card-section class="row q-pb-none">
        <div class="text-h6">إضافة نشاط</div>
        <q-space />
        <q-btn icon="close" flat round dense @click="closeDialog" />
      </q-card-section>

      <q-card-section class="q-pt-none">
        <div class="row">
          <div class="col">
            <q-card style="margin: 10px" class="full-height">
              <q-card-section>
                <q-form ref="subjectForm">
                  <div class="text-weight-bold">نوع النشاط:</div>
                  <div class="row">
                    <div v-for="beh in titles" :key="beh.name">
                      <q-chip
                        clickable
                        @click="changeType(beh)"
                        square
                        :outline="!beh.selected"
                        :color="beh.selected ? 'red' : 'green'"
                        text-color="white"
                        :icon="beh.icon"
                        >{{ beh.name }}</q-chip
                      >
                    </div>
                  </div>
                  <div class="text-weight-bold">
                    <p v-if="!isValid" style="font-size:18px; color:red">
                      يجب إختيار عنوان للنشاط
                    </p>
                  </div>
                  <div class="text-weight-bold">المجموعة</div>
                  <div class="row">
                    <div class="col-12 col-md-12">
                      <q-select
                        outlined
                        v-model="activity.group"
                        :options="groups"
                        label="إختر مجموعة"
                      />
                    </div>
                  </div>

                  <div class="text-weight-bold">توصيف</div>

                  <q-input
                    dense
                    square
                    outlined
                    :autogrow="false"
                    clearable
                    v-model="activity.description"
                    :rules="[
                      (val) =>
                        (val && val.length > 0) || 'أضف أضف توصيفا للنشاط',
                    ]"
                    type="textarea"
                    label="توصيف النشاط"
                  />

                  <div class="col-6">
                    <div class="text-weight-bold">تاريخ بدء النشاط</div>
                    <q-input
                      ref="date"
                      dense
                      square
                      outlined
                      clearable
                      v-model="activity.startDate"
                      label="إختر تاريخ"
                      lazy-rules
                      :rules="[
                        (val) =>
                          (val !== null && val !== '') || 'الرجاء إختيار تاريخ',
                      ]"
                      @click="$refs.qDateProxy.show()"
                    >
                      <template v-slot:append>
                        <q-icon name="event" class="cursor-pointer">
                          <q-popup-proxy ref="qDateProxy">
                            <q-date
                              v-model="activity.startDate"
                              mask="DD/MM/YYYY"
                              @input="() => $refs.qDateProxy.hide()"
                            />
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                  </div>
                  <div class="col-6">
                    <div class="text-weight-bold">تاريخ إنتهاء النشاط</div>
                    <q-input
                      ref="date"
                      dense
                      square
                      outlined
                      clearable
                      v-model="activity.endDate"
                      label="إختر تاريخ"
                      lazy-rules
                      :rules="[
                        (val) =>
                          (val !== null && val !== '') || 'الرجاء إختيار تاريخ',
                      ]"
                      @click="$refs.qDateProxy2.show()"
                    >
                      <template v-slot:append>
                        <q-icon name="event" class="cursor-pointer">
                          <q-popup-proxy ref="qDateProxy2">
                            <q-date
                              v-model="activity.endDate"
                              mask="DD/MM/YYYY"
                              @input="() => $refs.qDateProxy2.hide()"
                            />
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
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
    id :{
      type : String,
      default : ""
    },
    isEdit: {
      type: Boolean,
      default: false,
    },
    activity: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      titles: [],
      groups: [],
      isValid : true
    };
  },
  computed: {
    ...mapGetters({
      GET_LOADING: GETTERS.UI.GET_LOADING,
      GET_MESSAGES: GETTERS.UI.GET_MESSAGES,
      GET_ERRORS: GETTERS.UI.GET_ERRORS,
      GET_GROUPS: GETTERS.GROUPS.GET_GROUPS,
      GET_ENTRIES: GETTERS.SETTINGS.GET_ENTRIES,
    }),
    getTitles() {
      if (this.isEdit) {
        this.titles.forEach((b) =>
          b.val == this.activity.title
            ? (b.selected = true)
            : (b.selected = false)
        );
      }
      return this.titles;
    },
  },
  created() {
    this.FETCH_ENTRIES();
  },
  methods: {
    ...mapActions({
      ADD_ACTIVITY: ACTIONS.STUDNETS.ADD_ACTIVITY,
      UPDATE_ACTIVITY: ACTIONS.STUDNETS.UPDATE_ACTIVITY,
      FETCH_ENTRIES: ACTIONS.SETTINGS.FETCH_ENTRIES,
      CLEAR_ERRORS_AND_MESSAGES: ACTIONS.UI.CLEAR_ERRORS_AND_MESSAGES,
    }),
    closeDialog(){
      this.titles.forEach(t => t.selected = false);
      this.$emit('close');
    },
    setTitle()
    {
      if (this.isEdit)
      {
        this.titles.find(tit => tit.name == this.activity.title).selected = true;
      }
    },

    changeType(title) {
      this.isValid = true;
      this.titles.forEach((beh) =>
        beh.name == title.name ? (beh.selected = true) : (beh.selected = false)
      );
    },

    async onSubmit() {
      if (!this.titles.some((beh) => beh.selected)) {
        this.isValid = false;
        return;
      }

      this.activity.title = this.titles.find((beh) => beh.selected).name;
      if (this.isEdit) {
        this.activity.feedback = "";
        console.log(this.activity);
        this.UPDATE_ACTIVITY({ id : this.id , obj : this.activity});
      } else {
        this.activity.createdAt = Date.now();
        this.ADD_ACTIVITY(this.activity);
      }
      this.$emit("close");
    },
  },

  watch: {
    GET_ENTRIES: function (newState) {
      this.groups = this.GET_GROUPS.map((group) => ({
        label: group.name,
        value: group.id,
      }));

      this.titles = newState
        .filter((s) => s.type.val == "نشاط")
        .map((s) => ({
          selected: false,
          name: s.name,
        }));

        
    },
  },
};
</script>
