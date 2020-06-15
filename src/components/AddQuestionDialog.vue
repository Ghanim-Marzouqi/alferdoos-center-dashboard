<template>
  <q-dialog v-model="isAddQuestionDialogOpen">
    <q-card style="width: 400px">
      <q-card-section>
        <div class="text-h6">إضافة سؤال</div>
        <div class="q-ma-2">
          <q-input
            class="q-mt-sm"
            filled
            v-model="question.text"
            label="نص السؤال"
            type="text"
            :rules="[val => val.length > 0 || 'الرجاء إدخال نص السؤال']"
          />
          <q-input
            class="q-mt-sm"
            filled
            v-model="question.marks"
            label="درجة السؤال"
            type="number"
            :rules="[val => val > 0 || 'الرجاء إدخال رقم أكبر من صفر']"
          />
          <div class="row q-my-sm">
            <q-list style="width: 100%">
              <q-form @submit.prevent="addQuestionOption" @reset="resetQuestionOptions">
                <q-item>
                  <q-item-section avatar>
                    <q-btn dense round size="sm" color="primary" type="submit">
                      <q-icon name="o_add" />
                    </q-btn>
                  </q-item-section>
                  <q-item-section style="margin-top: 21px">
                    <q-input
                      v-model="option.text"
                      label="إضف خيار للسؤال"
                      dense
                      filled
                      lazy-rules
                      :rules="[val => val && val.length > 0 || 'اضف خيار للسؤال']"
                    ></q-input>
                  </q-item-section>
                  <q-item-section side>
                    <q-select
                      v-model="option.isCorrect"
                      :value="option.isCorrect"
                      :options="questionOptions"
                      dense
                      filled
                    ></q-select>
                  </q-item-section>
                </q-item>
              </q-form>
              <q-item v-for="(option, i) in question.options" :key="i">
                <q-item-section avatar>
                  <q-btn dense round size="sm" color="red" @click="removeQuestionOption(i)">
                    <q-icon name="o_remove" />
                  </q-btn>
                </q-item-section>
                <q-item-section>{{ option.text }}</q-item-section>
                <q-item-section class="text-center" style="width: 100%">{{ option.isCorrect.label }}</q-item-section>
              </q-item>
            </q-list>
          </div>
        </div>
      </q-card-section>
      <q-card-actions>
        <q-space></q-space>
        <q-btn dense flat color="primary" @click="closeAddQuestionDialog">إلغاء</q-btn>
        <q-btn dense flat color="primary" :loading="GET_LOADING" @click="addQuestion">حفظ</q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { GETTERS, ACTIONS } from "../config/constants";

export default {
  name: "AddQuestionDialog",
  props: {
    isAddQuestionDialogOpen: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      question: {
        text: "",
        marks: "",
        options: []
      },
      option: {
        text: "",
        isCorrect: {
          label: "لا",
          value: false
        }
      },
      questionOptions: [
        {
          label: "لا",
          value: false
        },
        {
          label: "نعم",
          value: true
        }
      ]
    };
  },
  computed: {
    ...mapGetters({
      GET_LOADING: GETTERS.UI.GET_LOADING,
      GET_MESSAGES: GETTERS.UI.GET_MESSAGES,
      GET_ERRORS: GETTERS.UI.GET_ERRORS
    })
  },
  methods: {
    ...mapActions({
      SET_QUESTION: ACTIONS.SETTINGS.SET_QUESTION
    }),
    addQuestion() {
      this.SET_QUESTION({
        text: this.question.text,
        marks: Number.parseInt(this.question.marks),
        options: this.question.options
      });
    },
    addQuestionOption() {
      this.question.options.push({
        text: this.option.text,
        isCorrect: this.option.isCorrect
      });

      // Reset Option
      this.option = {
        text: "",
        isCorrect: {
          label: "لا",
          value: false
        }
      };
    },
    removeQuestionOption(index) {
      this.question.options.splice(index, 1);
    },
    resetQuestionOptions() {
      // Reset Option
      this.option = {
        text: "",
        isCorrect: {
          label: "لا",
          value: false
        }
      };
    },
    closeAddQuestionDialog() {
      this.question = {
        text: "",
        marks: "",
        options: []
      };

      this.$emit("closeAddQuestionDialog", false);
    }
  }
};
</script>