<template>
  <q-page padding>
    <p class="text-h6">إعدادات المحفوظات</p>

    <!-- Memorization Table -->
    <div class="row q-pa-md">
      <div class="fit row wrap justify-between items-center content-start">
        <p class="text-body1 text-weight-bold">المحفوظات</p>
        <q-btn
          class="q-mb-md"
          color="primary"
          @click="isAddMemorizationDialogOpen = true"
        >إضافة محفوظ جديد</q-btn>
      </div>
      <div class="col-12">
        <q-table :data="GET_MEMORIZATIONS" :columns="columns" row-key="id" :loading="GET_LOADING">
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
              <q-td key="edit" :props="props">
                <q-btn dense flat @click.stop="onEditMemorization(props.row)">
                  <q-icon color="teal" name="o_edit" />
                </q-btn>
              </q-td>
              <q-td key="delete" :props="props">
                <q-btn dense flat @click.stop="onDeleteMemorization(props.row)">
                  <q-icon color="red" name="o_delete" />
                </q-btn>
              </q-td>
              <q-td key="add" :props="props">
                <q-btn dense flat @click.stop="onAddMemorizationDetails(props.row)">
                  <q-icon color="blue" name="add_circle_outline" />
                </q-btn>
              </q-td>
            </q-tr>
            <q-tr v-show="props.expand" :props="props">
              <q-td colspan="100%">
                <div class="text-left">
                  <q-markup-table separator="vertical" flat bordered>
                    <thead>
                      <tr class="bg-primary text-white">
                        <th class="text-center">
                          <strong>الصفحات (من - إلى)</strong>
                        </th>
                        <th class="text-center">
                          <strong>درجة كل صفحة</strong>
                        </th>
                        <th class="text-center">
                          <strong>درجة الخطأ</strong>
                        </th>
                        <th class="text-center">
                          <strong>درجة التنبيه</strong>
                        </th>
                        <th class="text-center">
                          <strong>عدد مرات التكرار</strong>
                        </th>
                        <th class="text-center">
                          <strong>درجة الرسوب</strong>
                        </th>
                        <th class="text-center">
                          <strong>حذف</strong>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(detail, i) in props.row.details" :key="i">
                        <td
                          class="text-center"
                        >{{ detail.pageNumberFrom }} - {{ detail.pageNumberTo}}</td>
                        <td class="text-center">{{ detail.pageMarks }}</td>
                        <td class="text-center">{{ detail.mistakeMarks }}</td>
                        <td class="text-center">{{ detail.cautionMarks }}</td>
                        <td class="text-center">{{ detail.repeatNumber }}</td>
                        <td class="text-center">{{ detail.failMarks }}</td>
                        <td class="text-center">
                          <q-btn dense flat>
                            <q-icon
                              name="o_delete"
                              color="red"
                              @click.stop="onDeleteMemorizationDetails(props.row.id, detail.uid)"
                            />
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

    <!-- Add Memorization Dialog  -->
    <AddMemorizationDialog
      :isDialogOpen="isAddMemorizationDialogOpen"
      :memorization="memorization"
      @closeDialog="closeAddMemorizationDialog"
    />

    <!-- Add Memorization Details Dialog -->
    <AddMemorizationDetailsDialog
      :isDialogOpen="isAddMemorizationDetailsDialogOpen"
      :memorization="memorization"
      @closeDialog="closeAddMemorizationDetailsDialog"
    />

    <!-- Delete Memorization Dialog -->
    <DeleteMemorizationDialog
      :isAlertDialogOpen="isDeleteMemorizationDialogOpen"
      alertTitle="هل أنت متأكد من حذف المحفوظ"
      @alertAction="deleteMemorization"
      @closeAlertDialog="closeDeleteMemorizationDialog"
    />

    <DeleteMemorizationDetailsDialog
      :isAlertDialogOpen="isDeleteMemorizationDetailsDialogOpen"
      alertTitle="هل أنت متأكد من حذف تفاصيل المحفوظ"
      @alertAction="deleteMemorizationDetails"
      @closeAlertDialog="closeDeleteMemorizationDetailsDialog"
    />
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { MESSAGES, ERRORS, GETTERS, ACTIONS } from "../../../config/constants";

export default {
  name: "PageEditMemorizations",
  data() {
    return {
      isAddMemorizationDialogOpen: false,
      isAddMemorizationDetailsDialogOpen: false,
      isDeleteMemorizationDialogOpen: false,
      isDeleteMemorizationDetailsDialogOpen: false,
      memorization: {},
      memorizationId: "",
      memorizationDetailId: "",
      columns: [
        {
          name: "name",
          required: true,
          label: "اسم المحفوظ",
          field: (row) => row.name,
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
        {
          name: "add",
          required: true,
          label: "إضافة",
          field: "add",
          align: "right",
        },
      ],
    };
  },
  created() {
    this.FETCH_MEMORIZATIONS();
  },
  computed: {
    ...mapGetters({
      GET_MEMORIZATIONS: GETTERS.SETTINGS.GET_MEMORIZATIONS,
      GET_MESSAGES: GETTERS.UI.GET_MESSAGES,
      GET_ERRORS: GETTERS.UI.GET_ERRORS,
      GET_LOADING: GETTERS.UI.GET_LOADING,
    }),
  },
  methods: {
    ...mapActions({
      FETCH_MEMORIZATIONS: ACTIONS.SETTINGS.FETCH_MEMORIZATIONS,
      DELETE_MEMORIZATION: ACTIONS.SETTINGS.DELETE_MEMORIZATION,
      DELETE_MEMORIZATION_DETAILS: ACTIONS.SETTINGS.DELETE_MEMORIZATION_DETAILS,
      CLEAR_ERRORS_AND_MESSAGES: ACTIONS.UI.CLEAR_ERRORS_AND_MESSAGES,
    }),
    onEditMemorization(memorization) {
      this.memorization = memorization;
      this.isAddMemorizationDialogOpen = true;
    },
    onDeleteMemorization(memorization) {
      this.memorization = memorization;
      this.isDeleteMemorizationDialogOpen = true;
    },
    deleteMemorization() {
      if (Object.keys(this.memorization).length > 0) {
        this.DELETE_MEMORIZATION(this.memorization.id);
      }
    },
    onAddMemorizationDetails(memorization) {
      this.memorization = memorization;
      this.isAddMemorizationDetailsDialogOpen = true;
    },
    onDeleteMemorizationDetails(id, uid) {
      this.memorizationId = id;
      this.memorizationDetailId = uid;
      this.isDeleteMemorizationDetailsDialogOpen = true;
    },
    deleteMemorizationDetails() {
      if (this.memorizationId !== "" && this.memorizationDetailId !== "") {
        this.DELETE_MEMORIZATION_DETAILS({
          id: this.memorizationId,
          uid: this.memorizationDetailId,
        });
      }
    },
    closeAddMemorizationDialog(value) {
      this.memorization = {};
      this.isAddMemorizationDialogOpen = value;
    },
    closeAddMemorizationDetailsDialog(value) {
      this.memorization = {};
      this.isAddMemorizationDetailsDialogOpen = value;
    },
    closeDeleteMemorizationDialog(value) {
      this.memorization = {};
      this.isDeleteMemorizationDialogOpen = value;
    },
    closeDeleteMemorizationDetailsDialog(value) {
      this.memorizationId = "";
      this.memorizationDetailId = "";
      this.isDeleteMemorizationDetailsDialogOpen = value;
    },
  },
  watch: {
    GET_MESSAGES: function (newState, oldState) {
      if (newState.length > 0) {
        let messageCode = newState[0].code;

        if (messageCode === MESSAGES.DATABASE.MEMORIZATION_ADDED) {
          this.FETCH_MEMORIZATIONS();
          this.CLEAR_ERRORS_AND_MESSAGES();
          this.isAddMemorizationDialogOpen = false;
          this.$q.dialog({
            title: "تمت العملية بنجاح",
            message: "تم إضافة محفوظ جديد بنجاح",
          });
        }

        if (messageCode === MESSAGES.DATABASE.MEMORIZATION_UPDATED) {
          this.FETCH_MEMORIZATIONS();
          this.CLEAR_ERRORS_AND_MESSAGES();
          this.memorization = {};
          this.isAddMemorizationDialogOpen = false;
          this.$q.dialog({
            title: "تمت العملية بنجاح",
            message: "تم تحديث المحفوظ بنجاح",
          });
        }

        if (messageCode === MESSAGES.DATABASE.MEMORIZATION_DELETED) {
          this.FETCH_MEMORIZATIONS();
          this.CLEAR_ERRORS_AND_MESSAGES();
          this.memorization = {};
          this.isDeleteMemorizationDialogOpen = false;
          this.$q.dialog({
            title: "تمت العملية بنجاح",
            message: "تم حذف المحفوظ بنجاح",
          });
        }

        if (messageCode === MESSAGES.DATABASE.MEMORIZATION_DETAILS_ADDED) {
          this.FETCH_MEMORIZATIONS();
          this.CLEAR_ERRORS_AND_MESSAGES();
          this.memorization = {};
          this.isAddMemorizationDetailsDialogOpen = false;
          this.$q.dialog({
            title: "تمت العملية بنجاح",
            message: "تم إضافة تفاصيل المحفوظ بنجاح",
          });
        }

        if (messageCode === MESSAGES.DATABASE.MEMORIZATION_DETAILS_DELETED) {
          this.FETCH_MEMORIZATIONS();
          this.CLEAR_ERRORS_AND_MESSAGES();
          this.memorizationId = "";
          this.memorizationDetailId = "";
          this.isDeleteMemorizationDetailsDialogOpen = false;
          this.$q.dialog({
            title: "تمت العملية بنجاح",
            message: "تم حذف تفاصيل المحفوظ بنجاح",
          });
        }
      }
    },
    GET_ERRORS: function (newState, oldState) {
      if (newState.length > 0) {
        let errorCode = newState[0].code;

        if (errorCode === ERRORS.DATABASE.ADD_MEMORIZATION_ERROR) {
          this.CLEAR_ERRORS_AND_MESSAGES();
          this.$q.dialog({
            title: "خطأ",
            message: "حدث خطأ أثناء إضافة محفوظ جديد",
          });
        }

        if (errorCode === ERRORS.DATABASE.EDIT_MEMORIZATION_ERROR) {
          this.CLEAR_ERRORS_AND_MESSAGES();
          this.$q.dialog({
            title: "خطأ",
            message: "حدث خطأ أثناء تحديث المحفوظ",
          });
        }

        if (errorCode === ERRORS.DATABASE.DELETE_MEMORIZATION_ERROR) {
          this.CLEAR_ERRORS_AND_MESSAGES();
          this.$q.dialog({
            title: "خطأ",
            message: "حدث خطأ أثناء حذف المحفوظ",
          });
        }

        if (errorCode === ERRORS.DATABASE.DELETE_MEMORIZATION_DETAILS_ERROR) {
          this.CLEAR_ERRORS_AND_MESSAGES();
          this.$q.dialog({
            title: "خطأ",
            message: "حدث خطأ أثناء حذف تفاصيل المحفوظ",
          });
        }
      }
    },
  },
  components: {
    AddMemorizationDialog: () => import("components/AddMemorizationDialog.vue"),
    AddMemorizationDetailsDialog: () =>
      import("components/AddMemorizationDetailsDialog.vue"),
    DeleteMemorizationDialog: () => import("components/AlertDialog.vue"),
    DeleteMemorizationDetailsDialog: () => import("components/AlertDialog.vue"),
  },
};
</script>

<style>
</style>