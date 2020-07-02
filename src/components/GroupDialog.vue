<template>
  <q-dialog v-model="isGroupDialogOpen" @before-show="intializeValues">
    <q-card style="width: 400px">
      <q-card-section>
        <div class="text-h6">{{ dialogTitle }}</div>
        <div class="q-ma-2">
          <q-input
            class="q-mt-sm"
            filled
            v-model="groupName"
            label="اسم المجموعة"
            type="text"
            :rules="[val => val.length > 0 || 'الرجاء ادخال اسم المجموعة']"
          />
        </div>
      </q-card-section>
      <q-card-actions>
        <q-space></q-space>
        <q-btn dense flat color="primary" @click="closeGroupDialog">إلغاء</q-btn>
        <q-btn dense flat color="primary" :loading="GET_LOADING" @click="editGroup">حفظ</q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { GETTERS, ACTIONS } from "../config/constants";

export default {
  name: "GroupDialog",
  props: {
    isGroupDialogOpen: {
      type: Boolean,
      default: false
    },
    dialogTitle: {
      type: String,
      required: true
    },
    group: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      groupId: "",
      groupName: ""
    };
  },
  computed: {
    ...mapGetters({
      GET_LOADING: GETTERS.UI.GET_LOADING
    })
  },
  methods: {
    ...mapActions({
      ADD_GROUP: ACTIONS.SETTINGS.ADD_GROUP,
      EDIT_GROUP: ACTIONS.SETTINGS.EDIT_GROUP
    }),
    intializeValues() {
      if (this.group && Object.keys(this.group).length > 0) {
        this.groupId = this.group.id;
        this.groupName = this.group.name;
      }
    },
    editGroup() {
      if (this.groupId !== "") {
        this.EDIT_GROUP({
          id: this.groupId,
          name: this.groupName
        });
      } else {
        this.ADD_GROUP({
          name: this.groupName
        });
      }
    },
    closeGroupDialog() {
      this.groupName = "";
      this.$emit("closeGroupDialog", false);
    }
  }
};
</script>