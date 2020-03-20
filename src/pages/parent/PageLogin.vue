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
              <p
                class="text-red"
                v-if="GET_ERRORS.length > 0"
              >البريد الإلكتروني أو كلمة المرور غير صحيحة</p>
              <q-form @submit="onSubmit" class="q-gutter-md">
                <q-card-section>
                  <q-input
                    class="q-mb-sm"
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
                  <q-input
                    class="q-mt-sm"
                    dense
                    square
                    outlined
                    clearable
                    v-model="formData.password"
                    type="password"
                    label="كلمة المرور"
                    lazy-rules
                    :rules="[
                      val =>
                        (val && val.length > 5) || 'الرجاء كتابة كلمة المرور'
                    ]"
                  />
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
                    to="/parent/register"
                    color="blue"
                    size="lg"
                    class="full-width q-mt-xs text-subtitle2"
                    label="تسجيل جديد"
                  />
                  <q-btn
                    to="/parent/reset-password"
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
        password: ""
      },
      reg: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/
    };
  },
  mounted() {
    this.TRIGGER_PARENT_STATE();
  },
  computed: mapGetters("parents", ["GET_PARENT", "GET_ERRORS", "GET_MESSAGES"]),
  methods: {
    ...mapActions("parents", [
      "TRIGGER_PARENT_STATE",
      "LOGIN_PARENT",
      "CLEAR_ERRORS_AND_MESSAGES"
    ]),
    isEmailValid(email) {
      return email == "" ? "" : this.reg.test(email) ? true : false;
    },
    onSubmit() {
      this.LOGIN_PARENT(this.formData);
      this.CLEAR_ERRORS_AND_MESSAGES();
    }
  },
  watch: {
    GET_PARENT: function(newState, oldState) {
      if (Object.keys(newState).length > 0) {
        this.$router.push("/parent");
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
