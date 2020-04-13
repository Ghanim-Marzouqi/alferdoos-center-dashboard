<template>
  <q-layout>
    <q-page-container>
      <q-page class="bg-primary window-height window-width flex flex-center">
        <div class="column text-center">
          <div class="col">
            <router-link :to="{ path: '/' }" exact>
              <img src="~assets/images/logo_white.png" width="300px" height="auto" />
            </router-link>
            <p class="text-white text-h6 text-weight-bold">إعادة تعيين كلمة المرور</p>
          </div>
          <div class="row">
            <q-card square bordered class="q-pa-lg shadow-1">
              <p
                class="text-red"
                v-if="GET_ERRORS.length > 0"
              >لم يتم العثور على البريد الإلكتروني المدخل</p>
              <p class="text-green" v-if="GET_MESSAGES.length > 0">
                تم الإرسال بنجاح. الرجاء تفقد البريد الخاص بك لإعادة تعيين كلمة
                المرور
              </p>
              <q-form @submit="onSubmit">
                <q-card-section>
                  <q-input
                    dense
                    square
                    outlined
                    clearable
                    v-model="formData.email"
                    type="email"
                    label="البريد الإلكتروني"
                    lazy-rules
                    :rules="[
                      val =>
                        (val && val.length > 0) ||
                        'الرجاء كتابة البريد الإلكتروني',
                      val => isEmailValid(val) || 'البريد الإلكتروني غير صحيح'
                    ]"
                  />
                </q-card-section>
                <q-card-actions class="q-px-md">
                  <q-btn
                    type="submit"
                    color="primary"
                    size="lg"
                    class="full-width"
                    label="إرسال"
                    :loading="GET_LOADER"
                  />
                  <q-btn
                    @click="goToLoginPage"
                    unelevated
                    class="full-width text-grey-7"
                    label="الرجوع لصفحة تسجيل الدخول"
                  />
                </q-card-actions>
              </q-form>
            </q-card>
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  name: "PageResetPassword",
  data() {
    return {
      formData: {
        email: ""
      },
      reg: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/
    };
  },
  computed: mapGetters("parents", ["GET_ERRORS", "GET_MESSAGES", "GET_LOADER"]),
  methods: {
    ...mapActions("parents", ["RESET_PASSWORD", "CLEAR_ERRORS_AND_MESSAGES"]),
    isEmailValid(email) {
      return email == "" ? "" : this.reg.test(email) ? true : false;
    },
    onSubmit() {
      this.RESET_PASSWORD(this.formData);
      this.CLEAR_ERRORS_AND_MESSAGES();
    },
    goToLoginPage() {
      this.CLEAR_ERRORS_AND_MESSAGES();
      this.$router.replace("/parent-login");
    }
  }
};
</script>

<style lang="scss" scoped>
.q-card {
  width: 360px;
}
</style>
