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
        style="height: calc(100% - 150px); margin-top: 150px; border-right: 1px solid #ddd"
      >
        <q-list>
          <q-item class="q-ma-xs" clickable exact to="/teacher">
            <q-item-section avatar>
              <q-icon name="o_home" />
            </q-item-section>
            <q-item-section>
              <q-item-label>الرئيسية</q-item-label>
            </q-item-section>
          </q-item>

          <q-separator />
          <q-item clickable @click="logout">
            <q-item-section avatar>
              <q-icon name="exit_to_app" />
            </q-item-section>

            <q-item-section>
              <q-item-label>تسجيل الخروج</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>

      <q-img class="absolute-top" src="statics/images/bg.png" style="height: 150px">
        <div style="width: 100%" class="text-center bg-transparent">
          <q-avatar size="80px" class="q-mb-sm">
            <img src="statics/images/avatar.jpg" />
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

export default {
  name: "Layout",
  data() {
    return {
      rightDrawerOpen: false,
      links: [
        {
          title: "الرئيسية",
          icon: "o_home",
          link: "/teacher"
        }
      ]
    };
  },
  created() {
    if (Object.keys(this.GET_USER).length === 0) {
      this.$router.replace("/teacher/login");
    }
  },
  computed: mapGetters("teachers", ["GET_USER"]),
  methods: {
    ...mapActions("teachers", ["LOGOUT"]),
    logout() {
      this.LOGOUT();
    }
  },
  watch: {
    GET_USER: function(newState, oldState) {
      if (Object.keys(newState).length === 0) {
        this.$router.replace("/teacher/login");
      }
    }
  },
  components: {
    DrawerLink: () => import("components/DrawerLink")
  }
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