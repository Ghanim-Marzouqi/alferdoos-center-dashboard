<template>
  <q-dialog v-model="isOpen" @before-show="intializeValues">
    <q-card style="width: 400px">
      <q-card-section>
        <div class="text-h6">المادة</div>
        <div class="q-ma-2">
          <q-select filled v-model="subject" :options="groups" label="إختر مادة" />
          <q-input
            class="q-mt-sm"
            filled
            v-model="time"
            label="الوقت"
            type="text"
            :rules="[val => val.length > 0 || 'الرجاء ادخال الوقت']"
          />
        </div>
      </q-card-section>
      <q-card-actions>
        <q-space></q-space>
        <q-btn dense flat color="primary" @click="closeDialog">إلغاء</q-btn>
        <q-btn dense flat color="primary" :loading="GET_LOADING" @click="joinGroup">حفظ</q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { GETTERS, ACTIONS } from "../config/constants";

export default {
  name: "JoinGroupDialog",
  props: {
    isOpen: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      time : "",
      subject: null,
      groups: [],
    };
  },
  async created() {
    await this.FETCH_SUBJECTS();

    if (this.GET_SUBJECTS.length > 0) {
      this.groups = this.GET_GROUPS.map((group) => ({
        label: group.name,
        value: group.id,
      }));
    }
  },
  computed: {
    ...mapGetters({
      GET_SUBJECTS: GETTERS.SUBJECTS.GET_SUBJECTS,
      GET_LOADING: GETTERS.UI.GET_LOADING,
    }),
  },
  methods: {
    ...mapActions({
      FETCH_SUBJECTS: ACTIONS.SUBJECTS.FETCH_SUBJECTS,
      JOIN_STUDENT_TO_GROUP: ACTIONS.STUDNETS.JOIN_STUDENT_TO_GROUP,
    }),
    intializeValues() {},
    joinGroup() {
      this.$emit("input", {
            time: this.time,
            avatar: 'https://cdn.quasar.dev/img/boy-avatar.png',
            subject: 'Meeting with CEO'
     });
     this.time = "",
      this.$emit("close", false); 
    },
    closeDialog() {
      this.time = "",

      this.$emit("close", false);
    },
  },
};
</script>