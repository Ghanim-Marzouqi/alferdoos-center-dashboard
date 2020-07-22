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
                <q-btn dense flat @click.stop="onAddMemorizationDetails(props.row.id)">
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
                      <tr>
                        <td class="text-center">100 - 200</td>
                        <td class="text-center">10</td>
                        <td class="text-center">1.5</td>
                        <td class="text-center">0.5</td>
                        <td class="text-center">3</td>
                        <td class="text-center">5</td>
                        <td class="text-center">
                          <q-btn dense flat>
                            <q-icon name="o_delete" color="red" />
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

    <!-- Delete Memorization Dialog -->
    <DeleteMemorizationDialog
      :isAlertDialogOpen="isDeleteMemorizationDialogOpen"
      alertTitle="هل أنت متأكد من حذف المحفوظ"
      @closeAlertDialog="closeDeleteMemorizationDialog"
      @alertAction="deleteMemorization"
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
      isDeleteMemorizationDialogOpen: false,
      memorization: {},
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
    onAddMemorizationDetails(memorizationId) {},
    closeAddMemorizationDialog(value) {
      this.isAddMemorizationDialogOpen = value;
    },
    closeDeleteMemorizationDialog(value) {
      this.isDeleteMemorizationDialogOpen = value;
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
      }
    },
  },
  components: {
    AddMemorizationDialog: () => import("components/AddMemorizationDialog.vue"),
    DeleteMemorizationDialog: () => import("components/AlertDialog.vue"),
  },
};
</script>

<style>
</style>