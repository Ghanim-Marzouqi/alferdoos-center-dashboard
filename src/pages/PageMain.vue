<template>
  <q-layout>
    <q-page-container>
      <q-page class="window-height window-width row justify-center items-center">
        <div class="q-pa-md">
          <div class="column items-center">
            <div class="col">
              <img src="~assets/images/logo.png" width="300px" height="auto" />
            </div>
            <div class="col q-pa-md">
              <div class="row justify-between items-center">
                <div
                  v-for="item in items"
                  :key="item.title"
                  class="col-12 col-xs-12 col-sm-12 col-md-4 col-lg-3 q-ma-md"
                >
                  <q-card @click="goToPage(item.link)" class="q-pa-md">
                    <q-img :src="item.image" />
                    <q-card-actions align="center">
                      <div class="text-h6">{{ item.title }}</div>
                    </q-card-actions>
                  </q-card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  name: "PageMain",
  data() {
    return {
      items: [
        {
          image: "statics/images/admin_logo.png",
          title: "بوابة الإدارة",
          link: "/admin"
        },
        {
          image: "statics/images/teacher_logo1.png",
          title: "بوابة المعلمين",
          link: "/teacher"
        },
        {
          image: "statics/images/parent_logo.png",
          title: "بوابة أولياء الأمور",
          link: "/parent"
        }
      ]
    };
  },
  methods: {
    goToPage(link) {
      this.$router.push(link);
    }
  }
};
</script>

<style lang="scss" scoped>
.q-card {
  width: 300px;
  cursor: pointer;
}
</style>