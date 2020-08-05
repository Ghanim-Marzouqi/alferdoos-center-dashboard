<template>
  <q-page padding>
    <p class="text-h6 text-weight-bold">المجموعات</p>

    <div class="row q-pa-md">
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
                <q-btn dense flat @click.stop="onShowAddMemorizationDialog(props.row)">
                  <q-icon color="blue" name="o_note_add" />
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
                      </tr>
                    </thead>
                    <tbody></tbody>
                  </q-markup-table>
                </div>
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </div>
    </div>
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { GETTERS, ACTIONS } from "../../../config/constants";
export default {
  name: "PageRegisteredGroups",
  data() {
    return {
      isAddMemorizationDialogOpen: false,
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
      ],
    };
  },
  created() {
    this.FETCH_GROUPS();
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
    }),
    goToRegisteredStudents(group) {},
    goToAssingedTeachers(group) {},
    onShowAddMemorizationDialog() {},
  },
};
</script>
