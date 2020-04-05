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
      content-class="bg-grey-9 text-white"
    >
      <q-scroll-area
        style="height: calc(100% - 150px); margin-top: 150px; border-right: 1px solid #ddd"
      >
        <q-list>
          <DrawerLink v-for="link in links" :key="link.title" v-bind="link" />
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

      <q-img class="absolute-top" src="statics/images/drawer_bg.jpg" style="height: 150px">
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
          title: "تسجيل طالب جديد",
          icon: "o_create",
          link: "/parent"
        }
      ]
    };
  },
  created() {
    if (Object.keys(this.GET_USER).length === 0) {
      this.$router.replace("/parent/login");
    }
  },
  computed: mapGetters("parents", ["GET_USER"]),
  methods: {
    ...mapActions("parents", ["LOGOUT"]),
    logout() {
      this.LOGOUT();
    }
  },
  watch: {
    GET_USER: function(newState, oldState) {
      if (Object.keys(newState).length === 0) {
        this.$router.replace("/parent/login");
      }
    }
  },
  components: {
    DrawerLink: () => import("components/DrawerLink")
  }
};
</script>
