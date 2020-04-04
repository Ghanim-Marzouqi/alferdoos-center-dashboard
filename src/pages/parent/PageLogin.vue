<template>
  <q-layout>
    <q-page-container>
      <q-page class="bg-primary window-height window-width flex flex-center">
        <div class="column text-center">
          <div class="col">
            <img src="~assets/images/logo.png" width="300px" height="auto" />
            <p class="text-white text-h6 text-weight-bold">تسجيل دخول ولي الأمر</p>
          </div>
          <div class="row">
            <q-card square bordered class="q-pa-lg shadow-1">
              <p class="text-red" v-if="GET_ERRORS.length > 0">{{ getErrorMessage }}</p>
              <q-form @submit="onSubmit" class="q-gutter-md">
                <q-card-section>
                  <q-input
                    class="q-mb-sm"
                    dense
                    square
                    outlined
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
                  <q-input
                    class="q-mt-sm"
                    dense
                    square
                    outlined
                    v-model="formData.password"
                    :type="formData.isPassword ? 'password' : 'text'"
                    label="كلمة المرور"
                    lazy-rules
                    :rules="[
                      val =>
                        (val && val.length > 5) || 'الرجاء كتابة كلمة المرور'
                    ]"
                  >
                    <template v-slot:append>
                      <q-icon
                        :name="formData.isPassword ? 'visibility_off' : 'visibility'"
                        class="cursor-pointer"
                        @click="formData.isPassword = !formData.isPassword"
                      />
                    </template>
                  </q-input>
                </q-card-section>
                <q-card-actions class="q-px-md q-py-none q-my-none">
                  <q-btn
                    type="submit"
                    color="grey"
                    size="lg"
                    class="full-width text-subtitle2"
                    label="تسجيل الدخول"
                  />
                  <q-btn
                    @click="goToRegisterPage"
                    color="blue"
                    size="lg"
                    class="full-width q-mt-xs text-subtitle2"
                    label="تسجيل جديد"
                  />
                  <q-btn
                    @click="goToResetPasswordPage"
                    unelevated
                    class="full-width text-blue"
                    label="هل نسيت كلمة المرور؟"
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
  name: "PageLogin",
  data() {
    return {
      formData: {
        email: "",
        password: "",
        isPassword: true
      },
      reg: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/
    };
  },
  mounted() {
    this.TRIGGER_USER_STATE();
  },
  computed: {
    ...mapGetters("parents", ["GET_USER", "GET_ERRORS", "GET_MESSAGES"]),
    getErrorMessage() {
      if (this.GET_ERRORS.length > 0) {
        if (this.GET_ERRORS[0].code === "auth/user-not-found") {
          return "البريد الإلكتروني غير مسجل";
        } else if (this.GET_ERRORS[0].code === "auth/wrong-password") {
          return "كلمة المرور غير صحيحة";
        } else if (this.GET_ERRORS[0].code === "databse/user-inactive") {
          return "حساب المستخدم موقوف";
        } else {
          return "حدث خطأ اثناء تسجيل الدخول";
        }
      }
    }
  },
  methods: {
    ...mapActions("parents", [
      "TRIGGER_USER_STATE",
      "LOGIN",
      "LOG_ERROR",
      "CLEAR_ERRORS_AND_MESSAGES"
    ]),
    isEmailValid(email) {
      return email == "" ? "" : this.reg.test(email) ? true : false;
    },
    onSubmit() {
      this.CLEAR_ERRORS_AND_MESSAGES();
      this.LOGIN(this.formData);
    },
    goToRegisterPage() {
      this.CLEAR_ERRORS_AND_MESSAGES();
      this.$router.push("/parent/register");
    },
    goToResetPasswordPage() {
      this.CLEAR_ERRORS_AND_MESSAGES();
      this.$router.push("/parent/reset-password");
    }
  },
  watch: {
    GET_USER: function(newState, oldState) {
      if (Object.keys(newState).length > 0) {
        if (newState.isActive) {
          this.$router.replace("/parent");
        } else {
          this.LOG_ERROR({
            code: "databse/user-inactive"
          });
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.q-card {
  width: 360px;
}
</style>
