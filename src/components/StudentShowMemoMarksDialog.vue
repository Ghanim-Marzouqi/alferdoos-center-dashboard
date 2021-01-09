<template>
  <q-dialog
  @before-show="getAbsenceRecords"
    v-model="isOpen"
    persistent
    full-height
    :maximized="maximizedToggle"
    transition-show="slide-up"
    transition-hide="slide-down"
  >
    <q-card class="bg-primary text-white">
      <q-bar>
        <q-space />

        <q-btn dense flat icon="close" @click="$emit('close')">
          <q-tooltip content-class="bg-white text-primary">إغلاق</q-tooltip>
        </q-btn>
      </q-bar>

      <q-card-section>
        <div class="text-h6"></div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <p class="text-h6 text-weight-bold">محفوظات الطالب</p>

        <div class="row q-pa-md">
          <div class="col-12">
        <q-table :data="getStudentsMarks" :columns="columns" row-key="id" :loading="GET_LOADING">
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
            </q-tr>
            <q-tr v-show="props.expand" :props="props">
              <q-td colspan="100%">
                <div class="text-left">
                  <q-markup-table separator="vertical" flat bordered>
                    <thead>
                      <tr class="bg-primary text-white">
                        <th class="text-center">
                          <strong>الأسم</strong>
                        </th>
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
                        <td class="text-center">{{ detail.name }}</td>
                        <td
                          class="text-center"
                        >{{ detail.pageNumberFrom }} - {{ detail.pageNumberTo}}</td>
                        <td class="text-center">{{ detail.pageMarks }}</td>
                        <td class="text-center">{{ detail.mistakeMarks }}</td>
                        <td class="text-center">{{ detail.cautionMarks }}</td>
                        <td class="text-center">{{ detail.repeats.length }}</td>
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
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { GETTERS, ACTIONS, MESSAGES, ERRORS } from "../config/constants";
import groups from "src/store/modules/groups";
import { storage } from "firebase";
export default {
  name: "StudentShowMemoMarksDialog",
  props: {
    groupId: {
      type: String,
      default: "",
    },
    studentId: {
      type: String,
      default: "",
    },
    isOpen: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      maximizedToggle: true,
      data : [],
      records : [],
       columns: [
        {
          name: "name",
          required: true,
          label: "المحفوظ",
          field: "name",
          align: "center",
        }
      ],
    
      };
  },
  created() {},
  computed: {
    ...mapGetters({
      GET_LOADING: GETTERS.UI.GET_LOADING,
      GET_MEMORIZATIONS: GETTERS.SETTINGS.GET_MEMORIZATIONS,
      GET_MEMO_MARKS: GETTERS.SETTINGS.GET_MEMO_MARKS,
      GET_GROUPS: GETTERS.GROUPS.GET_GROUPS,
    }),
    async getStudentsMarks(){
      await this.FETCH_MEMORIZATIONS();
      await this.FETCH_MEMO_MARKS({ year: "2020" });
      let groupMemo = this.GET_GROUPS.find(x => x.id == this.groupId).memorizations;
      let memorizations = groupMemo?.map(x => {
      let temp = this.GET_MEMORIZATIONS.find(y => y.id == x.memorizationId);
        return {
          name : temp.name,
          details : x.memorizationDetailsUID.map(y => temp.details.find(t => t.uid == y))
        }
      });
      console.log(memorizations);
      return memorizations;

    }
  },
  methods: {
    ...mapActions({
     FETCH_MEMO_MARKS: ACTIONS.SETTINGS.FETCH_MEMO_MARKS,
     FETCH_MEMORIZATIONS: ACTIONS.SETTINGS.FETCH_MEMORIZATIONS,
     FETCH_GROUPS: ACTIONS.GROUPS.FETCH_GROUPS,
    }),

    async getAbsenceRecords() {
      // TODO change this year
      await this.FETCH_MEMORIZATIONS();
      await this.FETCH_MEMO_MARKS({ year: "2020" });
    },

  },
};
</script>

<style lang="scss" scoped>
.q-card {
  height: 200px;
}
</style>
