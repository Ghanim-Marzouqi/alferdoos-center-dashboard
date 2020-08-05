<template>
  <q-page padding>
    <p class="text-h6">إعدادات المجموعات</p>

    <!-- Groups Table -->
    <div class="row q-pa-md">
      <div class="fit row wrap justify-between items-center content-start">
        <p class="text-body1 text-weight-bold">المجموعات</p>
        <q-btn
          class="q-mb-md"
          color="primary"
          @click="isAddGroupDialogOpen = true"
        >إضافة مجموعة جديدة</q-btn>
      </div>
      <div class="col-12">
        <q-table :data="GET_GROUPS" :columns="columns" row-key="name" :loading="GET_LOADING">
          <template v-slot:body="props">
            <q-tr :props="props">
              <q-td key="name" :props="props">{{ props.row.name }}</q-td>
              <q-td key="edit" :props="props">
                <q-btn dense flat @click.stop="showEditGroupDialog(props.row)">
                  <q-icon color="teal" name="o_edit" />
                </q-btn>
              </q-td>
              <q-td key="delete" :props="props">
                <q-btn dense flat @click.stop="showDeleteGroupDialog(props.row)">
                  <q-icon color="red" name="o_delete" />
                </q-btn>
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </div>
    </div>

    <!-- Add Group Dialog -->
    <AddGroupDialog
      :isGroupDialogOpen="isAddGroupDialogOpen"
      dialogTitle="إضافة مجموعة"
      @closeGroupDialog="isAddGroupDialogOpen = false"
    />

    <!-- Edit Group Dialog -->
    <EditGroupDialog
      :isGroupDialogOpen="isEditGroupDialogOpen"
      dialogTitle="تعديل مجموعة"
      :group="selectedGroup"
      @closeGroupDialog="closeEditGroupDialog"
    />

    <!-- Delete Group Dialog -->
    <DeleteGroupDialog
      :isAlertDialogOpen="isDeleteGroupDialogOpen"
      alertTitle="هل أنت متأكد من حذف المجموعة؟"
      @alertAction="deleteGroup"
      @closeAlertDialog="closeDeleteGroupDialog"
    />
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { GETTERS, ACTIONS, MESSAGES, ERRORS } from "../../../config/constants";

export default {
  name: "PageEditGroups",
  data() {
    return {
      isAddGroupDialogOpen: false,
      isEditGroupDialogOpen: false,
      isDeleteGroupDialogOpen: false,
      selectedGroup: {},
      columns: [
        {
          name: "name",
          label: "اسم المجموعة",
          field: "name",
          required: true,
          align: "left",
        },
        {
          name: "edit",
          required: true,
          label: "تعديل",
          field: "edit",
          align: "right",
        },
        {
          name: "delete",
          required: true,
          label: "حذف",
          field: "delete",
          align: "right",
        },
      ],
    };
  },
  created() {
    this.FETCH_GROUPS();
  },
  computed: {
    ...mapGetters({
      GET_GROUPS: GETTERS.GROUPS.GET_GROUPS,
      GET_MESSAGES: GETTERS.UI.GET_MESSAGES,
      GET_ERRORS: GETTERS.UI.GET_ERRORS,
      GET_LOADING: GETTERS.UI.GET_LOADING,
    }),
  },
  methods: {
    ...mapActions({
      ADD_GROUP: ACTIONS.GROUPS.ADD_GROUP,
      EDIT_GROUP: ACTIONS.GROUPS.EDIT_GROUP,
      DELETE_GROUP: ACTIONS.GROUPS.DELETE_GROUP,
      FETCH_GROUPS: ACTIONS.GROUPS.FETCH_GROUPS,
      CLEAR_ERRORS_AND_MESSAGES: ACTIONS.UI.CLEAR_ERRORS_AND_MESSAGES,
    }),
    showEditGroupDialog(group) {
      this.selectedGroup = group;
      this.isEditGroupDialogOpen = true;
    },
    showDeleteGroupDialog(group) {
      this.selectedGroup = group;
      this.isDeleteGroupDialogOpen = true;
    },
    deleteGroup() {
      if (Object.keys(this.selectedGroup).length > 0) {
        this.DELETE_GROUP(this.selectedGroup.id);
      }
    },
    closeEditGroupDialog(value) {
      this.selectedGroup = {};
      this.isEditGroupDialogOpen = false;
    },
    closeDeleteGroupDialog() {
      this.selectedGroup = {};
      this.isDeleteGroupDialogOpen = false;
    },
  },
  watch: {
    GET_MESSAGES: function (newState, oldState) {
      if (newState.length > 0) {
        let messageCode = newState[0].code;

        if (messageCode === MESSAGES.DATABASE.GROUP_ADDED) {
          this.CLEAR_ERRORS_AND_MESSAGES();
          this.FETCH_GROUPS();
          this.isAddGroupDialogOpen = false;
          this.$q.dialog({
            title: "تمت العملية بنجاح",
            message: "تم إضافة مجموعة جديدة بنجاح",
          });
        }

        if (messageCode === MESSAGES.DATABASE.GROUP_UPDATED) {
          this.CLEAR_ERRORS_AND_MESSAGES();
          this.FETCH_GROUPS();
          this.isEditGroupDialogOpen = false;
          this.$q.dialog({
            title: "تمت العملية بنجاح",
            message: "تم تحديث اسم المجموعة بنجاح",
          });
        }

        if (messageCode === MESSAGES.DATABASE.GROUP_DELETED) {
          this.CLEAR_ERRORS_AND_MESSAGES();
          this.FETCH_GROUPS();
          this.isDeleteGroupDialogOpen = false;
          this.$q.dialog({
            title: "تمت العملية بنجاح",
            message: "تم حذف المجموعة بنجاح",
          });
        }
      }
    },
    GET_ERRORS: function (newState, oldState) {
      if (newState.length > 0) {
        let errorCode = newState[0].code;

        if (errorCode === ERRORS.DATABASE.ADD_GROUP_ERROR) {
          this.CLEAR_ERRORS_AND_MESSAGES();
          this.$q.dialog({
            title: "خطأ",
            message: "حدث خطأ أثناء إضافة مجموعة جديدة",
          });
        }

        if (errorCode === ERRORS.DATABASE.EDIT_GROUP_ERROR) {
          this.CLEAR_ERRORS_AND_MESSAGES();
          this.$q.dialog({
            title: "خطأ",
            message: "حدث خطأ أثناء تحديث اسم المجموعة",
          });
        }

        if (errorCode === ERRORS.DATABASE.DELETE_GROUP_ERROR) {
          this.CLEAR_ERRORS_AND_MESSAGES();
          this.$q.dialog({
            title: "خطأ",
            message: "حدث خطأ أثناء حذف المجموعة",
          });
        }
      }
    },
  },
  components: {
    AddGroupDialog: () => import("components/GroupDialog.vue"),
    EditGroupDialog: () => import("components/GroupDialog.vue"),
    DeleteGroupDialog: () => import("components/AlertDialog.vue"),
  },
};
</script>