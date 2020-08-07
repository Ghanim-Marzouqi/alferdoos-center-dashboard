<template>
  <q-page padding>
    <p class="text-h6 text-weight-bold">المجموعات</p>

    <div class="row q-pa-md">
      <div class="fit row wrap justify-between items-center content-start">
        <p class="text-body1 text-weight-bold">قائمة المجموعات</p>
        <q-btn
          class="q-mb-md"
          color="primary"
          @click="isAddGroupDialogOpen = true"
        >إضافة مجموعة جديدة</q-btn>
      </div>
      <div class="col-12">
        <q-table :data="GET_GROUPS" :columns="columns" row-key="id" :loading="GET_LOADING">
          <template v-slot:header="props">
            <q-tr :props="props">
              <q-th auto-width />
              <q-th v-for="col in props.cols" :key="col.name" :props="props">{{ col.label }}</q-th>
            </q-tr>
          </template>
          <template v-slot:body="props">
            <q-tr :props="props">
              <q-td auto-width>
                <q-btn
                  size="sm"
                  color="primary"
                  round
                  dense
                  @click="props.expand = !props.expand"
                  :icon="props.expand ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
                />
              </q-td>
              <q-td key="name" :props="props">{{ props.row.name }}</q-td>
              <q-td key="students" :props="props">
                <q-btn dense flat @click.stop="goToRegisteredStudents(props.row)">
                  <q-icon color="teal" name="o_people" />
                </q-btn>
              </q-td>
              <q-td key="teachers" :props="props">
                <q-btn dense flat @click.stop="goToAssingedTeachers(props.row)">
                  <q-icon color="red" name="o_school" />
                </q-btn>
              </q-td>
              <q-td key="add" :props="props">
                <q-btn dense flat @click.stop="showAddMemorizationDialog(props.row)">
                  <q-icon color="blue" name="o_note_add" />
                </q-btn>
              </q-td>
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
            <q-tr v-show="props.expand" :props="props">
              <q-td colspan="100%">
                <div class="text-left">
                  <q-markup-table flat bordered>
                    <thead>
                      <tr class="bg-primary text-white">
                        <th class="text-left">
                          <strong>المحفوظات</strong>
                        </th>
                        <th class="text-center">
                          <strong>حذف</strong>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(memorization, i) in getGroupMemorization(props.row)" :key="i">
                        <td class="text-left">{{ memorization.name }}</td>
                        <td class="text-center">
                          <q-btn
                            dense
                            flat
                            @click.stop="showDeleteMemorizationFromGroupDialog(props.row, memorization)"
                          >
                            <q-icon color="red" name="o_delete" />
                          </q-btn>
                        </td>
                      </tr>
                    </tbody>
                  </q-markup-table>
                </div>
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

    <!-- Add Memorization To Group Dialog -->
    <AddMemorizationToGroupDialog
      :isAddMemorizationToGroupDialogOpen="isAddMemorizationToGroupDialogOpen"
      :group="selectedGroup"
      @closeAddMemorizationToGroupDialog="closeAddMemorizationToGroupDialog"
    />

    <!-- Delete Group Dialog -->
    <DeleteMemorizationFromGroupDialog
      :isAlertDialogOpen="isDeleteMemorizationFromGroupDialogOpen"
      alertTitle="هل أنت متأكد من حذف المحفوظ من المجموعة؟"
      @alertAction="deleteMemorizationFromGroup"
      @closeAlertDialog="closeDeleteMemorizationFromGroupDialog"
    />
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { GETTERS, ACTIONS, MESSAGES, ERRORS } from "../../../config/constants";
import groups from "src/store/modules/groups";
export default {
  name: "PageRegisteredGroups",
  data() {
    return {
      isAddGroupDialogOpen: false,
      isEditGroupDialogOpen: false,
      isDeleteGroupDialogOpen: false,
      isAddMemorizationToGroupDialogOpen: false,
      isDeleteMemorizationFromGroupDialogOpen: false,
      selectedGroup: {},
      selectedMemorization: {},
      filter: "",
      columns: [
        {
          name: "name",
          required: true,
          label: "اسم المجموعة",
          field: (row) => row.name,
          align: "left",
        },
        {
          name: "students",
          required: true,
          label: "عرض الطلاب",
          field: "students",
          align: "center",
        },
        {
          name: "teachers",
          required: true,
          label: "عرض المعلمين",
          field: "teachers",
          align: "center",
        },
        {
          name: "add",
          required: true,
          label: "إضافة محفوظ",
          field: "add",
          align: "center",
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
    this.FETCH_MEMORIZATIONS();
  },
  computed: {
    ...mapGetters({
      GET_GROUPS: GETTERS.GROUPS.GET_GROUPS,
      GET_MEMORIZATIONS: GETTERS.SETTINGS.GET_MEMORIZATIONS,
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
      FETCH_MEMORIZATIONS: ACTIONS.SETTINGS.FETCH_MEMORIZATIONS,
      DELETE_MEMORIZATION_FROM_GROUP:
        ACTIONS.GROUPS.DELETE_MEMORIZATION_FROM_GROUP,
      CLEAR_ERRORS_AND_MESSAGES: ACTIONS.UI.CLEAR_ERRORS_AND_MESSAGES,
    }),
    goToRegisteredStudents(group) {},
    goToAssingedTeachers(group) {},
    getGroupMemorization(group) {
      let memorizations = [];
      let groupMemorizationIds = group.memorizations;

      if (groupMemorizationIds && groupMemorizationIds.length > 0) {
        groupMemorizationIds.forEach((id) => {
          let memo = this.GET_MEMORIZATIONS.find((m) => m.id === id);
          if (memo) memorizations.push(memo);
        });
        return memorizations;
      } else {
        return [];
      }
    },
    showAddMemorizationDialog(group) {
      this.selectedGroup = group;
      this.isAddMemorizationToGroupDialogOpen = true;
    },
    showEditGroupDialog(group) {
      this.selectedGroup = group;
      this.isEditGroupDialogOpen = true;
    },
    showDeleteGroupDialog(group) {
      this.selectedGroup = group;
      this.isDeleteGroupDialogOpen = true;
    },
    showDeleteMemorizationFromGroupDialog(group, memorization) {
      this.selectedGroup = group;
      this.selectedMemorization = memorization;
      this.isDeleteMemorizationFromGroupDialogOpen = true;
    },
    deleteGroup() {
      if (Object.keys(this.selectedGroup).length > 0) {
        this.DELETE_GROUP(this.selectedGroup.id);
      }
    },
    deleteMemorizationFromGroup() {
      if (
        Object.keys(this.selectedGroup).length > 0 &&
        Object.keys(this.selectedMemorization).length > 0
      ) {
        this.DELETE_MEMORIZATION_FROM_GROUP({
          groupId: this.selectedGroup.id,
          memorizationId: this.selectedMemorization.id,
        });
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
    closeAddMemorizationToGroupDialog(value) {
      this.isAddMemorizationToGroupDialogOpen = value;
    },
    closeDeleteMemorizationFromGroupDialog(value) {
      this.selectedGroup = {};
      this.selectedMemorization = {};
      this.isDeleteMemorizationFromGroupDialogOpen = value;
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

        if (messageCode === MESSAGES.DATABASE.GROUP_MEMORIZATIONS_ADDED) {
          this.CLEAR_ERRORS_AND_MESSAGES();
          this.FETCH_GROUPS();
          this.isAddMemorizationToGroupDialogOpen = false;
          this.$q.dialog({
            title: "تمت العملية بنجاح",
            message: "تم إضافة المحفوظات إلى المجموعة بنجاح",
          });
        }

        if (messageCode === MESSAGES.DATABASE.GROUP_MEMORIZATIONS_DELETED) {
          this.CLEAR_ERRORS_AND_MESSAGES();
          this.FETCH_GROUPS();
          this.isDeleteMemorizationFromGroupDialogOpen = false;
          this.$q.dialog({
            title: "تمت العملية بنجاح",
            message: "تم حذف المحفوظ من المجموعة بنجاح",
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

        if (errorCode === ERRORS.DATABASE.ADD_MEMORIZATION_TO_GROUP_ERROR) {
          this.CLEAR_ERRORS_AND_MESSAGES();
          this.$q.dialog({
            title: "خطأ",
            message: "حدث خطأ أثناء إضافة المحفوظات إلى المجموعة",
          });
        }

        if (
          errorCode === ERRORS.DATABASE.DELETE_MEMORIZATION_FROM_GROUP_ERROR
        ) {
          this.CLEAR_ERRORS_AND_MESSAGES();
          this.$q.dialog({
            title: "خطأ",
            message: "حدث خطأ أثناء حذف المحفوظ من المجموعة",
          });
        }
      }
    },
  },
  components: {
    AddGroupDialog: () => import("components/GroupDialog.vue"),
    EditGroupDialog: () => import("components/GroupDialog.vue"),
    DeleteGroupDialog: () => import("components/AlertDialog.vue"),
    AddMemorizationToGroupDialog: () =>
      import("components/AddMemorizationsToGroupDialog.vue"),
    DeleteMemorizationFromGroupDialog: () =>
      import("components/AlertDialog.vue"),
  },
};
</script>
