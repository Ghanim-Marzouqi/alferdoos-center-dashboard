<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="rightDrawerOpen = !rightDrawerOpen"
        />

        <q-toolbar-title>مركز الفردوس الأعلى</q-toolbar-title>

        <div>v1.0</div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="rightDrawerOpen"
      show-if-above
      bordered
      :width="280"
      :breakpoint="767"
      color="drawer"
      content-style="background-color: #fff; color: #ccae62"
    >
      <q-scroll-area
        style="
          height: calc(100% - 150px);
          margin-top: 150px;
          border-right: 1px solid #ddd;
        "
      >
        <q-list>
          <q-item class="q-ma-xs" clickable exact to="/admin/home">
            <q-item-section avatar>
              <q-icon name="o_home" />
            </q-item-section>
            <q-item-section>
              <q-item-label>الرئيسية</q-item-label>
            </q-item-section>
          </q-item>
          <q-expansion-item
            class="q-ma-xs"
            expand-separator
            icon="o_school"
            label="الطلاب"
          >
            <q-item
              class="q-ma-xs"
              clickable
              exact
              to="/admin/student-registration-forms"
            >
              <q-item-section avatar>
                <q-icon name="o_assignment" />
              </q-item-section>
              <q-item-section>
                <q-item-label>طلبات التسجيل</q-item-label>
              </q-item-section>
            </q-item>

            <q-item class="q-ma-xs" clickable exact to="/admin/exams-dashboard">
              <q-item-section avatar>
                <q-icon name="o_description" />
              </q-item-section>
              <q-item-section>
                <q-item-label>الإختبارات</q-item-label>
              </q-item-section>
            </q-item>

            <q-item class="q-ma-xs" clickable exact to="/admin/student-list">
              <q-item-section avatar>
                <q-icon name="o_people" />
              </q-item-section>
              <q-item-section>
                <q-item-label>الطلاب المقبولين</q-item-label>
              </q-item-section>
            </q-item>
          </q-expansion-item>
          <q-expansion-item
            class="q-ma-xs"
            expand-separator
            icon="o_supervisor_account"
            label="المعلمين"
          >
            <q-item class="q-ma-xs" clickable exact to="/admin/teachers">
              <q-item-section avatar>
                <q-icon name="o_person" />
              </q-item-section>
              <q-item-section>
                <q-item-label>المعلمين المسجلين</q-item-label>
              </q-item-section>
            </q-item>
          </q-expansion-item>
          <q-expansion-item
            class="q-ma-xs"
            expand-separator
            icon="o_bubble_chart"
            label="المجموعات"
          >
            <q-item class="q-ma-xs" clickable exact to="/admin/groups">
              <q-item-section avatar>
                <q-icon name="o_view_quilt" />
              </q-item-section>
              <q-item-section>
                <q-item-label>المجموعات المسجلة</q-item-label>
              </q-item-section>
            </q-item>
            <q-item class="q-ma-xs" clickable exact to="group-activities">
              <q-item-section avatar>
                <q-icon name="o_today" />
              </q-item-section>
              <q-item-section>
                <q-item-label>الأنشطة</q-item-label>
              </q-item-section>
            </q-item>

            <q-item class="q-ma-xs" clickable exact to="/admin/group-schedule">
              <q-item-section avatar>
                <q-icon name="o_today" />
              </q-item-section>
              <q-item-section>
                <q-item-label>جدول الحصص الدراسية</q-item-label>
              </q-item-section>
            </q-item>
            <q-item
              class="q-ma-xs"
              clickable
              exact
              to="/admin/absence-records-report"
            >
              <q-item-section avatar>
                <q-icon name="o_today" />
              </q-item-section>
              <q-item-section>
                <q-item-label>تقارير الحضور و الانصراف</q-item-label>
              </q-item-section>
            </q-item>
            <q-item class="q-ma-xs" clickable exact to="/admin/absence-records">
              <q-item-section avatar>
                <q-icon name="o_today" />
              </q-item-section>
              <q-item-section>
                <q-item-label>سجلات الغياب</q-item-label>
              </q-item-section>
            </q-item>
          </q-expansion-item>
          <q-expansion-item
            class="q-ma-xs"
            expand-separator
            icon="o_settings"
            label="الإعدادات"
          >
            <q-item
              class="q-ma-xs"
              clickable
              exact
              to="/admin/settings-year-info"
            >
              <q-item-section avatar>
                <q-icon name="o_date_range" />
              </q-item-section>
              <q-item-section>
                <q-item-label>السنة الدراسية</q-item-label>
              </q-item-section>
            </q-item>
            <q-item
              class="q-ma-xs"
              clickable
              exact
              to="/admin/settings-prepare-exams"
            >
              <q-item-section avatar>
                <q-icon name="o_description" />
              </q-item-section>
              <q-item-section>
                <q-item-label>إعداد الإختبارات</q-item-label>
              </q-item-section>
            </q-item>
            <q-item
              class="q-ma-xs"
              clickable
              exact
              to="/admin/admin-message-page"
            >
              <q-item-section avatar>
                <q-icon name="o_description" />
              </q-item-section>
              <q-item-section>
                <q-item-label>الرسائل</q-item-label>
              </q-item-section>
            </q-item>
            <q-item
              class="q-ma-xs"
              clickable
              exact
              to="/admin/add-entries-page"
            >
              <q-item-section avatar>
                <q-icon name="o_menu_book" />
              </q-item-section>
              <q-item-section>
                <q-item-label>إعدادات المدخلات</q-item-label>
              </q-item-section>
            </q-item>

            <q-item
              class="q-ma-xs"
              clickable
              exact
              to="/admin/settings-edit-memorizations"
            >
              <q-item-section avatar>
                <q-icon name="o_menu_book" />
              </q-item-section>
              <q-item-section>
                <q-item-label>إعداد المحفوظات</q-item-label>
              </q-item-section>
            </q-item>
            <q-item class="q-ma-xs" clickable exact to="/admin/edit-meetings">
              <q-item-section avatar>
                <q-icon name="o_receipt" />
              </q-item-section>
              <q-item-section>
                <q-item-label>محاضر الإجتماعات</q-item-label>
              </q-item-section>
            </q-item>
            <q-item class="q-ma-xs" clickable exact to="/admin/edit-expance">
              <q-item-section avatar>
                <q-icon name="o_attach_money" />
              </q-item-section>
              <q-item-section>
                <q-item-label>إدارة المصروفات</q-item-label>
              </q-item-section>
            </q-item>
            <q-item
              class="q-ma-xs"
              clickable
              exact
              to="/admin/settings-edit-subjects"
            >
              <q-item-section avatar>
                <q-icon name="o_book" />
              </q-item-section>
              <q-item-section>
                <q-item-label>إعداد المواد الدراسية</q-item-label>
              </q-item-section>
            </q-item>
          </q-expansion-item>
          <q-separator />
          <q-item clickable @click="logout">
            <q-item-section avatar>
              <q-icon name="power_settings_new" />
            </q-item-section>

            <q-item-section>
              <q-item-label>تسجيل الخروج</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>

      <q-img class="absolute-top" :src="backgroundImage" style="height: 150px">
        <div style="width: 100%" class="text-center bg-transparent">
          <q-avatar size="80px" class="q-mb-sm">
            <img :src="avatarImage" />
          </q-avatar>
          <div class="text-weight-bold">{{ GET_USER.name }}</div>
        </div>
      </q-img>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { GETTERS, ACTIONS } from "../config/constants";

export default {
  name: "Layout",
  data() {
    return {
      rightDrawerOpen: false,
      backgroundImage: "./images/bg.png",
      avatarImage: "./images/avatar.jpg",
    };
  },
  created() {
    if (Object.keys(this.GET_USER).length === 0) {
      this.$router.replace("/admin-login");
    }
  },
  computed: mapGetters({
    GET_USER: GETTERS.AUTH.GET_USER,
  }),
  methods: {
    ...mapActions({
      LOGOUT: ACTIONS.AUTH.LOGOUT,
    }),
    logout() {
      this.LOGOUT();
    },
  },
  watch: {
    GET_USER: function (newState, oldState) {
      if (Object.keys(newState).length === 0) {
        this.$router.replace("/admin-login");
      }
    },
  },
  components: {
    DrawerLink: () => import("components/DrawerLink"),
  },
};
</script>

<style lang="scss" scoped>
.q-item.q-router-link--active {
  color: #fff;
  background-color: #ccae62;
  letter-spacing: 0.01785714em;
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1.25rem;
}
</style>
