<template>
  <q-layout>
    <q-page-container>
      <q-page class="bg-primary window-height window-width flex flex-center">
        <div class="column">
          <div class="row flex-center">
            <h4 class="text-white">مركز الفردوس الأعلى</h4>
          </div>
          <div class="row">
            <q-card square bordered class="q-pa-lg shadow-1">
              <q-card-section>
                <q-form class="q-gutter-md">
                  <q-input
                    square
                    filled
                    clearable
                    v-model="email"
                    type="email"
                    label="البريد الإلكتروني"
                  />
                  <q-input
                    square
                    filled
                    clearable
                    v-model="password"
                    type="password"
                    label="كلمة المرور"
                  />
                </q-form>
              </q-card-section>
              <q-card-actions class="q-px-md">
                <q-btn to="/" color="grey" size="lg" class="full-width" label="تسجيل الدخول" />
                <q-btn
                  to="/reset-password"
                  flat
                  unelevated
                  class="full-width text-blue"
                  label="هل نسيت كلمة المرور؟"
                />
              </q-card-actions>
            </q-card>
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  name: "PageLogin",
  data() {
    return {
      email: "",
      password: ""
    };
  }
};
</script>

<style lang="scss" scoped>
.q-card {
  width: 360px;
}
</style>