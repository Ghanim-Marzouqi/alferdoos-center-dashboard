<template>
  <q-layout>
    <q-page-container>
      <q-page class="bg-primary window-height window-width flex flex-center">
        <div class="column text-center">
          <div class="col">
            <img src="~assets/images/logo.png" width="300px" height="auto" />
            <p class="text-white text-h6 text-weight-bold">تسجيل ولي أمر جديد</p>
          </div>
          <div class="row">
            <q-card square bordered class="q-pa-lg shadow-1">
              <p class="text-red" v-if="GET_ERRORS.length > 0">{{ getErrorMessage }}</p>
              <p class="text-green" v-if="GET_MESSAGES.length > 0">تم التسجيل بنجاح</p>
              <q-form @submit="onSubmit">
                <q-card-section>
                  <q-input
                    class="q-mb-sm"
                    dense
                    square
                    outlined
                    clearable
                    v-model="formData.name"
                    type="text"
                    label="الأسم الثلاثي"
                    lazy-rules
                    :rules="[
                      val =>
                        (val && val.length > 0) || 'الرجاء كتابة الأسم الثلاثي'
                    ]"
                  />
                  <q-input
                    class="q-my-sm"
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
                    class="q-my-sm"
                    dense
                    square
                    outlined
                    clearable
                    v-model="formData.phone"
                    type="number"
                    label="رقم الهاتف"
                    :rules="[
                      val =>
                        (val !== null && val !== '') ||
                        'الرجاء كتابة رقم الهاتف',
                      val => val.length === 8 || 'رقم الهاتف غير صحيح',
                      val =>
                        val.substring(0, 1) === '9' ||
                        val.substring(0, 1) == '7' ||
                        'رقم الهاتف غير صحيح'
                    ]"
                  />
                  <q-input
                    class="q-my-sm"
                    dense
                    square
                    outlined
                    clearable
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
                        color="primary"
                        @click="formData.isPassword = !formData.isPassword"
                      />
                    </template>
                  </q-input>
                  <q-input
                    class="q-mt-sm"
                    dense
                    square
                    outlined
                    clearable
                    v-model="formData.confirmPassword"
                    :type="formData.isPassword ? 'password' : 'text'"
                    label="تأكيد كلمة المرور"
                    lazy-rules
                    :rules="[
                      val =>
                        (val && val.length > 5) || 'الرجاء تأكيد كلمة المرور',
                      val =>
                        val === formData.password || 'كلمة المرور غير متطابقة'
                    ]"
                  >
                    <template v-slot:append>
                      <q-icon
                        :name="formData.isPassword ? 'visibility_off' : 'visibility'"
                        class="cursor-pointer"
                        color="primary"
                        @click="formData.isPassword = !formData.isPassword"
                      />
                    </template>
                  </q-input>
                </q-card-section>
                <q-card-actions class="q-px-md q-py-none q-my-none">
                  <q-btn
                    type="submit"
                    color="primary"
                    size="lg"
                    class="full-width text-weight-medium"
                    label="تسجيل جديد"
                  />
                  <q-btn
                    unelevated
                    class="full-width text-grey-7 text-weight-medium"
                    label="هل أنت مسجل مسبقا"
                    @click="goToLoginPage"
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
  name: "PageRegister",
  data() {
    return {
      formData: {
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        isPassword: true
      },
      reg: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/
    };
  },
  computed: {
    ...mapGetters("parents", ["GET_ERRORS", "GET_MESSAGES"]),
    getErrorMessage() {
      if (this.GET_ERRORS.length > 0) {
        if (this.GET_ERRORS[0].code === "auth/email-already-in-use") {
          return "المستخدم مسجل بالفعل";
        } else {
          return "حدث خطأ أثناء التسجيل";
        }
      }
    }
  },
  methods: {
    ...mapActions("parents", ["REGISTER", "CLEAR_ERRORS_AND_MESSAGES"]),
    isEmailValid(email) {
      return email == "" ? "" : this.reg.test(email) ? true : false;
    },
    onSubmit() {
      this.CLEAR_ERRORS_AND_MESSAGES();
      this.REGISTER({
        name: this.formData.name,
        email: this.formData.email,
        phone: `+968${this.formData.phone}`,
        password: this.formData.password
      });
    },
    goToLoginPage() {
      // clear state
      this.CLEAR_ERRORS_AND_MESSAGES();
      this.$router.replace("/parent/login");
    }
  }
};
</script>

<style lang="scss" scoped>
.q-card {
  width: 360px;
}
</style>
