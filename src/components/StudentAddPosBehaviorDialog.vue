<template>
  <q-dialog v-model="isOpen" width="400px" persistent>
    <q-card>
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">{{ title }}</div>
        <q-space />
        <q-btn icon="close" flat round dense @click="$emit('close')" />
      </q-card-section>

      <q-card-section class="q-pt-none">
        <div class="row">
          <div class="col">
            <q-card style="margin: 10px" class="full-height">
              <q-card-section>
                <q-form ref="subjectForm">
                  <div class="text-weight-bold">نوع السلوك:</div>
                  <div class="row">
                    <div v-for="beh in getTitles" :key="beh.name">
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

                  <div class="text-weight-bold">توصيف</div>

                  <q-input
                    dense
                    square
                    outlined
                    :autogrow="false"
                    clearable
                    v-model="behavior.description"
                    :rules="[
                      (val) =>
                        (val && val.length > 0) || 'أضف أضف توصيفا للسلوك',
                    ]"
                    type="textarea"
                    label="توصيف السلوك"
                  />

                  <div class="col-6">
                    <div class="text-weight-bold">تاريخ السلوك</div>
                    <q-input
                      ref="date"
                      dense
                      square
                      outlined
                      clearable
                      v-model="behavior.date"
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
                              v-model="behavior.date"
                              mask="DD/MM/YYYY"
                              @input="() => $refs.qDateProxy.hide()"
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
    title: {
      type: String,
      required: true,
    },
    isEdit: {
      type: Boolean,
      default: false,
    },
    behavior: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      behaviors: [],
      BadBehaviors: [],
    };
  },
  computed: {
    ...mapGetters({
      GET_LOADING: GETTERS.UI.GET_LOADING,
      GET_MESSAGES: GETTERS.UI.GET_MESSAGES,
      GET_ERRORS: GETTERS.UI.GET_ERRORS,
      GET_ENTRIES: GETTERS.SETTINGS.GET_ENTRIES,
    }),
    getTitles() {
      this.behaviors = this.GET_ENTRIES
        .filter((s) => s.type.val == "سلوك إيجابي")
        .map((s) => ({
          selected: false,
          name: s.name,
        }));

      this.BadBehaviors = this.GET_ENTRIES
        .filter((s) => s.type.val == "سلوك سلبي")
        .map((s) => ({
          selected: false,
          name : s.name,
        }));

      let behaviors =
        this.behavior.type == "P" ? this.behaviors : this.BadBehaviors;

      if (this.isEdit) {
        behaviors.forEach((b) =>
          b.name  == this.behavior.title
            ? (b.selected = true)
            : (b.selected = false)
        );
      }

      return behaviors;
    },
  },

  methods: {
    ...mapActions({
      ADD_BEHAVIOR: ACTIONS.STUDNETS.ADD_BEHAVIOR,
      UPDATE_BEHAVIOR: ACTIONS.STUDNETS.UPDATE_BEHAVIOR,
      CLEAR_ERRORS_AND_MESSAGES: ACTIONS.UI.CLEAR_ERRORS_AND_MESSAGES,
    }),

    changeType(behavior) {
      this.behavior.type == "P"
        ? this.behaviors.forEach((beh) =>
            beh.name == behavior.name
              ? (beh.selected = true)
              : (beh.selected = false)
          )
        : this.BadBehaviors.forEach((beh) =>
            beh.name == behavior.name
              ? (beh.selected = true)
              : (beh.selected = false)
          );
    },

    async onSubmit() {
      if (
        !this.behaviors.some((beh) => beh.selected) &&
        !this.BadBehaviors.some((beh) => beh.selected)
      ) {
        return;
      }

      console.log(this.behavior);

      this.behavior.title =
        this.behavior.type == "P"
          ? this.behaviors.find((beh) => beh.selected).name
          : this.BadBehaviors.find((beh) => beh.selected).name;
      if (this.isEdit) {
        this.UPDATE_BEHAVIOR(this.behavior);
      } else {
        this.ADD_BEHAVIOR(this.behavior);
      }

      this.$emit("close");
    },
  },
};
</script>
