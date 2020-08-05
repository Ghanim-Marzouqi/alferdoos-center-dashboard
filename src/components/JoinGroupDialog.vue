<template>
  <q-dialog v-model="isJoinGroupDialogOpen" @before-show="intializeValues">
    <q-card style="width: 400px">
      <q-card-section>
        <div class="text-h6">إضافة الطالب إلى مجموعة</div>
        <div class="q-ma-2">
          <q-select filled v-model="group" :options="groups" label="إختر مجموعة" />
        </div>
      </q-card-section>
      <q-card-actions>
        <q-space></q-space>
        <q-btn dense flat color="primary" @click="closeJoinGroupDialog">إلغاء</q-btn>
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
    isJoinGroupDialogOpen: {
      type: Boolean,
      default: false,
    },
    student: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      group: "",
      groups: [],
    };
  },
  async created() {
    await this.FETCH_GROUPS();

    if (this.GET_GROUPS.length > 0) {
      this.groups = this.GET_GROUPS.map((group) => ({
        label: group.name,
        value: group.id,
      }));
    }
  },
  computed: {
    ...mapGetters({
      GET_GROUPS: GETTERS.GROUPS.GET_GROUPS,
      GET_LOADING: GETTERS.UI.GET_LOADING,
    }),
  },
  methods: {
    ...mapActions({
      FETCH_GROUPS: ACTIONS.GROUPS.FETCH_GROUPS,
      JOIN_STUDENT_TO_GROUP: ACTIONS.STUDNETS.JOIN_STUDENT_TO_GROUP,
    }),
    intializeValues() {},
    joinGroup() {
      this.JOIN_STUDENT_TO_GROUP({
        studentId: this.student.id,
        groupId: this.group.value,
      });
    },
    closeJoinGroupDialog() {
      this.group = "";
      this.groups = [];
      this.$emit("closeJoinGroupDialog", false);
    },
  },
};
</script>