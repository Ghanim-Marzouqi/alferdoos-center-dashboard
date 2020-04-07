<template>
  <q-layout>
    <q-page-container>
      <q-page class="bg-primary window-height window-width flex flex-center">
        <div class="column text-center">
          <div class="col">
            <img src="~assets/images/logo_white.png" width="300px" height="auto" />
            <p class="text-white text-h6 text-weight-bold">تسجيل ولي أمر جديد</p>
          </div>
          <div class="row">
            <q-card square bordered class="q-pa-lg shadow-1">
              <div id="recaptcha-container"></div>
              <p class="text-red" v-if="GET_ERRORS.length > 0">{{ getErrorMessage }}</p>
              <p
                class="text-green"
                v-if="GET_MESSAGES.length > 0"
              >تم التسجيل بنجاح. الرجاء إستكمال التحقق عن طريق النقر على الرابط في بريدك الإلكتروني</p>
              <q-form v-if="!isOTPEnabled" @submit="onSubmit">
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
                    :loading="GET_LOADER"
                  />
                  <q-btn
                    unelevated
                    class="full-width text-grey-7 text-weight-medium"
                    label="هل أنت مسجل مسبقا"
                    @click="goToLoginPage"
                  />
                </q-card-actions>
              </q-form>
              <q-form v-if="isOTPEnabled" @submit="verifyOTP">
                <q-card-section>
                  <q-input
                    class="q-my-sm"
                    dense
                    square
                    outlined
                    clearable
                    v-model="otpCode"
                    type="number"
                    label="رمز التحقق"
                  />
                </q-card-section>
                <q-card-actions class="q-px-md q-py-none q-my-none">
                  <q-btn
                    type="submit"
                    color="primary"
                    size="lg"
                    class="full-width text-weight-medium"
                    label="تحقق"
                    lazy-rules
                    :rules="[
                      val => (val && val.length === 6) || 'الرجاء كتابة رمز التحقق'
                    ]"
                  />
                  <q-btn
                    unelevated
                    class="full-width text-grey-7 text-weight-medium"
                    label="الرجوع لصفحة تسجيل الدخول"
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
import firebase from "firebase";

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
      appVerifier: null,
      otpCode: "",
      isOTPEnabled: false,
      reg: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/
    };
  },
  created() {
    this.TRIGGER_USER_REGISTRATION();
  },
  mounted() {
    // setTimeout(() => {
    //   this.appVerifier = new firebase.auth.RecaptchaVerifier(
    //     "recaptcha-container",
    //     { size: "invisible" }
    //   );
    // }, 5000);
  },
  computed: {
    ...mapGetters("parents", [
      "GET_ERRORS",
      "GET_MESSAGES",
      "GET_LOADER",
      "GET_USER_REGISTRATION"
    ]),
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
    ...mapActions("parents", [
      "REGISTER",
      "CLEAR_ERRORS_AND_MESSAGES",
      "LOG_ERROR",
      "TRIGGER_USER_REGISTRATION"
    ]),
    isEmailValid(email) {
      return email == "" ? "" : this.reg.test(email) ? true : false;
    },
    async onSubmit() {
      this.CLEAR_ERRORS_AND_MESSAGES();

      this.REGISTER({
        name: this.formData.name.trim(),
        email: this.formData.email.trim(),
        phone: `+968${this.formData.phone}`,
        password: this.formData.password
      });
    },
    sendOTP(phone) {
      firebase
        .auth()
        .signInWithPhoneNumber(`+968${phone}`, this.appVerifier)
        .then(function(confirmationResult) {
          window.confirmationResult = confirmationResult;
        })
        .catch(function(error) {
          // Error; SMS not sent
          console.log(error);
        });
    },
    async verifyOTP() {
      var credential = firebase.auth.PhoneAuthProvider.credential(
        window.confirmationResult.verificationId,
        this.otpCode
      );

      if (credential) {
        let user = firebase.auth().currentUser;

        if (user) {
          // Update User Phone Number
          await user.updatePhoneNumber(credential);

          // Sign Out User
          await firebase.auth().signOut();

          // Go To Login Page
          this.goToLoginPage();
        }
      }
    },
    goToLoginPage() {
      this.CLEAR_ERRORS_AND_MESSAGES();

      if (firebase.auth().currentUser) {
        // Sign Out User
        firebase.auth().signOut();
      }

      this.$router.replace("/parent/login");
    }
  },
  watch: {
    GET_USER_REGISTRATION: function(newState, oldState) {
      console.log("USER Registration State", JSON.stringify(newState));
      if (newState) {
        this.isOTPEnabled = true;

        this.appVerifier = new firebase.auth.RecaptchaVerifier(
          "recaptcha-container",
          {
            size: "invisible"
          }
        );

        if (this.appVerifier !== null) {
          // Send OTP
          this.sendOTP(this.formData.phone);
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
