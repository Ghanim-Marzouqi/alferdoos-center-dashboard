<template>
  <q-layout>
    <q-page-container>
      <q-page class="bg-primary window-height window-width flex flex-center">
        <div class="column text-center">
          <div class="col">
            <router-link :to="{ path: '/' }" exact>
              <img
                src="~assets/images/logo_white.png"
                width="300px"
                height="auto"
              />
            </router-link>
            <p class="text-white text-h6 text-weight-bold">
              تسجيل ولي أمر جديد
            </p>
          </div>
          <div class="row">
            <q-card square bordered class="q-pa-lg shadow-1">
              <p class="text-red" v-if="GET_ERRORS.length > 0">
                {{ getErrorMessage }}
              </p>
              <p class="text-green" v-if="GET_MESSAGES.length > 0">
                {{ GET_MESSAGES[0] }}
              </p>
              <div id="recaptcha-container"></div>
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
                        :name="
                          formData.isPassword ? 'visibility_off' : 'visibility'
                        "
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
                        :name="
                          formData.isPassword ? 'visibility_off' : 'visibility'
                        "
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
                    :loading="GET_LOADING"
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
                    lazy-rules
                    :rules="[
                      val =>
                        (val && val.length === 6) || 'الرجاء كتابة رمز التحقق'
                    ]"
                  />
                </q-card-section>
                <q-card-actions class="q-px-md q-py-none q-my-none">
                  <q-btn
                    type="submit"
                    color="primary"
                    size="lg"
                    class="full-width text-weight-medium"
                    label="تحقق من الرمز"
                    :loading="GET_LOADING"
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
import { auth, firestore } from "firebase";
import { FirebaseAuth } from "boot/firebase";
import {
  COLLECTIONS,
  GETTERS,
  ERRORS,
  ACTIONS
} from "../../../config/constants";

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
    this.TRIGGER_USER_REGISTRATION_STATE();
  },
  computed: {
    ...mapGetters({
      GET_USER_REGISTRATION_STATE: GETTERS.AUTH.GET_USER_REGISTRATION_STATE,
      GET_LOADING: GETTERS.UI.GET_LOADING,
      GET_MESSAGES: GETTERS.UI.GET_MESSAGES,
      GET_ERRORS: GETTERS.UI.GET_ERRORS
    }),
    getErrorMessage() {
      if (this.GET_ERRORS.length > 0) {
        if (this.GET_ERRORS[0].code === ERRORS.AUTH.EMAIL_ALREADY_IN_USE) {
          return "المستخدم مسجل بالفعل";
        } else if (this.GET_ERRORS[0].code === ERRORS.AUTH.OTP_NOT_SENT) {
          return "لا يمكن إرسال رمز التحقق";
        } else if (this.GET_ERRORS[0].code === ERRORS.AUTH.OTP_NOT_VERIFIED) {
          return "لم يتم التحقق من الرمز";
        } else {
          return "حدث خطأ أثناء التسجيل";
        }
      }
    }
  },
  methods: {
    ...mapActions({
      REGISTER: ACTIONS.AUTH.REGISTER,
      TRIGGER_USER_REGISTRATION_STATE:
        ACTIONS.AUTH.TRIGGER_USER_REGISTRATION_STATE,
      SET_LOADING: ACTIONS.UI.SET_LOADING,
      SET_MESSAGE: ACTIONS.UI.SET_MESSAGE,
      SET_ERROR: ACTIONS.UI.SET_ERROR,
      CLEAR_ERRORS_AND_MESSAGES: ACTIONS.UI.CLEAR_ERRORS_AND_MESSAGES
    }),
    isEmailValid(email) {
      return email == "" ? "" : this.reg.test(email) ? true : false;
    },
    async onSubmit() {
      this.CLEAR_ERRORS_AND_MESSAGES();

      this.REGISTER({
        name: this.formData.name.trim(),
        email: this.formData.email.trim(),
        password: this.formData.password.trim()
      });
    },
    async sendOTP(phone) {
      try {
        window.confirmationResult = await FirebaseAuth.signInWithPhoneNumber(
          `+968${phone}`,
          this.appVerifier
        );
      } catch (error) {
        this.SET_ERROR({
          code: ERRORS.AUTH.OTP_NOT_SENT
        });
      }
    },
    async verifyOTP() {
      try {
        // Clear Messages And Errors
        this.CLEAR_ERRORS_AND_MESSAGES();

        // Activate Loader
        this.SET_LOADING(true);

        // Set Language Code
        FirebaseAuth.languageCode = "ar";

        // Verify User
        let credential = auth.PhoneAuthProvider.credential(
          window.confirmationResult.verificationId,
          this.otpCode
        );

        if (credential) {
          // Get Current Registered User
          let user = FirebaseAuth.currentUser;

          if (user) {
            // Update User Phone Number
            await user.updatePhoneNumber(credential);
            await firestore()
              .collection(COLLECTIONS.PARENTS)
              .doc(user.uid)
              .update({
                phone: user.phoneNumber
              });

            // Sign Out User
            await FirebaseAuth.signOut();

            // Deactivate Loading
            this.SET_LOADING(false);

            // Display Success Massage
            this.SET_MESSAGE("تم التسجيل بنجاح");

            // Go To Login Page
            setTimeout(() => this.goToLoginPage(), 3000);
          }
        } else {
          console.log("Credentail Is Not Defined");
          this.SET_ERROR({
            code: ERRORS.AUTH.OTP_NOT_VERIFIED
          });
        }
      } catch (error) {
        console.log(error);
        // Deactivate Loading
        this.SET_LOADING(false);
        this.SET_ERROR({
          code: ERRORS.AUTH.OTP_NOT_VERIFIED
        });
      }
    },
    goToLoginPage() {
      this.CLEAR_ERRORS_AND_MESSAGES();

      if (FirebaseAuth.currentUser) {
        // Sign Out User
        FirebaseAuth.signOut();
      }

      this.$router.replace("/parent-login");
    }
  },
  watch: {
    GET_USER_REGISTRATION_STATE: function(newState, oldState) {
      console.log("User Registered", JSON.stringify(newState));
      if (newState) {
        // Enable OTP SMS Sending
        this.isOTPEnabled = true;

        // Set Language Code
        FirebaseAuth.languageCode = "ar";

        // Verify App Using reCAPTCHA
        this.appVerifier = new auth.RecaptchaVerifier("recaptcha-container", {
          size: "normal"
        });

        if (this.appVerifier !== null) {
          // Send OTP SMS
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
