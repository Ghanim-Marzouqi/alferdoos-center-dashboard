<template>
  <q-page padding>
    <p class="text-h6 text-weight-bold">الإختبارات</p>
    <div class="fit row wrap justify-center items-center q-gutter-xl">
      <div class="col-auto justify-center items-center text-center">
        <q-card
          class="column justify-center items-center"
          @click="goToRoute('/admin/take-exam')"
        >
          <q-icon
            style="font-size: 100px"
            color="primary"
            name="o_create"
          ></q-icon>
          <h4>تقديم الإختبار</h4>
        </q-card>
      </div>
      <div class="col-auto justify-center items-center text-center">
        <q-card
          class="column justify-center items-center"
          @click="goToRoute('/admin/exam-results')"
        >
          <q-icon
            style="font-size: 100px"
            color="primary"
            name="o_bar_chart"
          ></q-icon>
          <h4>نتائج الإختبار</h4>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  name: "PageStudentExams",
  methods: {
    goToRoute(route) {
      this.$router.push(route);
    }
  }
};
</script>

<style lang="scss" scoped>
.q-card {
  width: 290px;
  height: 290px;
  cursor: pointer;
}
</style>
