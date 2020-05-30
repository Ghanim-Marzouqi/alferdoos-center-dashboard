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
              تسجيل دخول ولي الأمر
            </p>
          </div>
          <div class="row">
            <q-card square bordered class="q-pa-lg shadow-1">
              <q-tabs
                v-model="tab"
                dense
                class="text-grey"
                active-color="primary"
                indicator-color="primary"
                align="justify"
              >
                <q-tab name="email" label="البريد الإلكتروني" />
                <q-tab name="phone" label="رقم الهاتف" />
              </q-tabs>
              <q-tab-panels
                v-model="tab"
                animated
                @before-transition="() => CLEAR_ERRORS_AND_MESSAGES()"
              >
                <q-tab-panel name="email" class="q-pa-none">
                  <p class="text-red q-mt-sm" v-if="GET_ERRORS.length > 0">
                    {{ getErrorMessage }}
                  </p>
                  <q-form
                    ref="emailAndPasswordForm"
                    @submit="onEmailAndPasswordFormSubmit"
                    class="q-gutter-md"
                  >
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
                          val =>
                            isEmailValid(val) || 'البريد الإلكتروني غير صحيح'
                        ]"
                      />
                      <q-input
                        class="q-mt-sm"
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
                            (val && val.length > 5) ||
                            'الرجاء كتابة كلمة المرور'
                        ]"
                      >
                        <template v-slot:append>
                          <q-icon
                            :name="
                              formData.isPassword
                                ? 'visibility_off'
                                : 'visibility'
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
                        class="full-width text-subtitle2"
                        label="تسجيل الدخول"
                        :loading="GET_LOADING"
                      />
                      <q-btn
                        @click="goToRegisterPage"
                        color="grey"
                        size="lg"
                        class="full-width q-mt-xs text-subtitle2"
                        label="تسجيل جديد"
                      />
                      <q-btn
                        @click="goToResetPasswordPage"
                        unelevated
                        class="full-width text-grey-7"
                        label="هل نسيت كلمة المرور؟"
                      />
                    </q-card-actions>
                  </q-form>
                </q-tab-panel>
                <q-tab-panel name="phone" class="q-pa-none">
                  <p class="text-red q-mt-sm" v-if="GET_ERRORS.length > 0">
                    {{ getErrorMessage }}
                  </p>
                  <div id="recaptcha-container" class="q-mt-sm"></div>
                  <q-form
                    ref="phoneForm"
                    @submit="onPhoneFormSubmit"
                    class="q-gutter-md"
                  >
                    <q-card-section>
                      <q-input
                        class="q-mb-sm"
                        dense
                        square
                        outlined
                        clearable
                        v-model="formData.phone"
                        type="number"
                        label="رقم الهاتف"
                        lazy-rules
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
                        v-show="formData.isPhoneAuthChosen"
                        dense
                        square
                        outlined
                        clearable
                        v-model="otpCode"
                        type="number"
                        label="رمز التحقق"
                        lazy-rules
                        :rules="[]"
                      />
                    </q-card-section>
                    <q-card-actions class="q-px-md q-py-none q-my-none">
                      <q-btn
                        v-if="!formData.isPhoneAuthChosen"
                        id="phone-sign-in"
                        type="submit"
                        color="primary"
                        size="lg"
                        class="full-width text-subtitle2"
                        label="تسجيل الدخول"
                        :loading="GET_LOADING"
                      />
                      <q-btn
                        v-if="formData.isPhoneAuthChosen"
                        color="primary"
                        size="lg"
                        class="full-width text-subtitle2"
                        label="تحقق من الرمز"
                        @click.prevent="verifyOTP"
                      />
                      <q-btn
                        @click="goToRegisterPage"
                        color="grey"
                        size="lg"
                        class="full-width q-mt-xs text-subtitle2"
                        label="تسجيل جديد"
                      />
                      <q-btn
                        @click.prevent="sendEmailToAdmin"
                        v-if="appVerifier !== null"
                        unelevated
                        class="full-width text-grey-7"
                        label="لم أحصل على رمز التحقق!"
                      />
                    </q-card-actions>
                  </q-form>
                </q-tab-panel>
              </q-tab-panels>
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
  ADMIN_EMAIL,
  GETTERS,
  ACTIONS,
  ERRORS
} from "../../../config/constants";

export default {
  name: "PageLogin",
  data() {
    return {
      tab: "email",
      splitterModel: 20,
      formData: {
        email: "",
        password: "",
        phone: "",
        isPassword: true,
        isPhoneAuthChosen: false,
        collection: COLLECTIONS.PARENTS
      },
      loginMethod: "email",
      appVerifier: null,
      otpCode: "",
      reg: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/
    };
  },
  created() {
    this.TRIGGER_USER_STATE(COLLECTIONS.PARENTS);
    this.CLEAR_ERRORS_AND_MESSAGES();
  },
  computed: {
    ...mapGetters({
      GET_USER: GETTERS.AUTH.GET_USER,
      GET_LOADING: GETTERS.UI.GET_LOADING,
      GET_MESSAGES: GETTERS.UI.GET_MESSAGES,
      GET_ERRORS: GETTERS.UI.GET_ERRORS
    }),
    getErrorMessage() {
      if (this.GET_ERRORS.length > 0) {
        if (this.GET_ERRORS[0].code === ERRORS.AUTH.USER_NOT_FOUND) {
          return "المستخدم غير مسجل";
        } else if (this.GET_ERRORS[0].code === ERRORS.AUTH.PHONE_NOT_FOUND) {
          return "رقم الهاتف غير مسجل";
        } else if (this.GET_ERRORS[0].code === ERRORS.AUTH.WRONG_PASSWORD) {
          return "كلمة المرور غير صحيحة";
        } else if (this.GET_ERRORS[0].code === ERRORS.DATABASE.USER_INACTIVE) {
          return "حساب المستخدم موقوف";
        } else if (this.GET_ERRORS[0].code === ERRORS.AUTH.EMAIL_NOT_VERIFIED) {
          return "لم يتم التحقق من البريد الإلكتروني للمستخدم";
        } else if (
          this.GET_ERRORS[0].code === ERRORS.AUTH.EMAIL_OR_PHONE_INACTIVE
        ) {
          return "لم يتم تفعيل البريد الإلكتروني / رقم الهاتف";
        } else {
          return "حدث خطأ اثناء تسجيل الدخول";
        }
      }
    }
  },
  methods: {
    ...mapActions({
      TRIGGER_USER_STATE: ACTIONS.AUTH.TRIGGER_USER_STATE,
      LOGIN: ACTIONS.AUTH.LOGIN,
      SET_LOADING: ACTIONS.UI.SET_LOADING,
      SET_ERROR: ACTIONS.UI.SET_ERROR,
      CLEAR_ERRORS_AND_MESSAGES: ACTIONS.UI.CLEAR_ERRORS_AND_MESSAGES
    }),
    isEmailValid(email) {
      return email == "" ? "" : this.reg.test(email) ? true : false;
    },
    async onEmailAndPasswordFormSubmit() {
      this.loginMethod = "email";

      let valid = await this.$refs["emailAndPasswordForm"].validate();

      this.CLEAR_ERRORS_AND_MESSAGES();

      if (valid) {
        this.LOGIN(this.formData);
      }
    },
    async onPhoneFormSubmit() {
      console.log("Phone Form Submitted");
      this.loginMethod = "phone";

      let valid = await this.$refs["phoneForm"].validate();

      this.CLEAR_ERRORS_AND_MESSAGES();

      console.log(valid);

      if (valid) {
        // Activate Loader
        this.SET_LOADING(true);

        // Check If Phone Is Registered
        let querySnapShot = await firestore()
          .collection(COLLECTIONS.PARENTS)
          .get();

        let docs = querySnapShot.docs;

        let found = docs.find(
          doc => doc.data().phone === `+968${this.formData.phone}`
        );

        if (found) {
          // Enable Phone Authetication
          this.formData.isPhoneAuthChosen = true;

          // Enable This to Test Your App
          // auth().settings.appVerificationDisabledForTesting = true;

          // Set Language Code
          FirebaseAuth.languageCode = "ar";

          // Verify App
          this.appVerifier = new auth.RecaptchaVerifier("recaptcha-container", {
            size: "normal"
          });

          if (this.appVerifier !== null) {
            // Send OTP SMS
            this.sendOTP(this.formData.phone);
          }

          // Deactivate Loading
          this.SET_LOADING(false);
        } else {
          // Deactivate Loading
          this.SET_LOADING(false);
          this.SET_ERROR({
            code: ERRORS.AUTH.PHONE_NOT_FOUND
          });
        }
      }
    },
    goToRegisterPage() {
      this.CLEAR_ERRORS_AND_MESSAGES();
      this.$router.push("/parent-register");
    },
    goToResetPasswordPage() {
      this.CLEAR_ERRORS_AND_MESSAGES();
      this.$router.push("/parent-reset-password");
    },
    sendOTP(phone) {
      var phoneNumber = `+968${phone}`;
      var appVerifier = this.appVerifier;

      FirebaseAuth.signInWithPhoneNumber(phoneNumber, appVerifier)
        .then(function(confirmationResult) {
          // SMS sent. Prompt user to type the code from the message, then sign the
          window.confirmationResult = confirmationResult;
        })
        .catch(function(error) {
          // Error; SMS not sent
          console.log(error);
        });
    },
    async verifyOTP() {
      // Activate Loading
      this.SET_LOADING(true);

      try {
        // Verify OTP
        await window.confirmationResult.confirm(this.otpCode);

        // Deactivate Loading
        this.SET_LOADING(false);
      } catch (error) {
        console.log(error);

        // Deactivate Loading
        this.SET_LOADING(false);
        this.SET_ERROR({
          code: ERRORS.AUTH.OTP_NOT_VERIFIED
        });
      }
    },
    sendEmailToAdmin() {
      let adminEmail = ADMIN_EMAIL;
      let subject = "لم يتم إستلام رمز التحقق";
      let body = `لم يصلني رمز التحقق الخاص برقم هاتفي ${this.formData.phone}`;
      window.open(`mailto:${adminEmail}?subject=${subject}&body=${body}`);
    }
  },
  watch: {
    GET_USER: function(newState, oldState) {
      if (Object.keys(newState).length > 0) {
        if (newState.isEmailVerified && this.loginMethod === "email") {
          this.$router.replace("/parent");
        } else if (newState.isPhoneVerified && this.loginMethod === "phone") {
          this.$router.replace("/parent");
        } else {
          console.log("ParentPageLogin: watch(GET_USER) error");
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
.g-recaptcha {
  width: 150px;
  border-radius: 4px;
  border-right: 1px solid #d8d8d8;
  overflow: hidden;
}
.q-tab {
  width: 100%;
}
</style>
