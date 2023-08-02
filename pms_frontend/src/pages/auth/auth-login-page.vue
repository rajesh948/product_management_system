<template>
  <div v-if="!isShowLoader">
    <div class="title w-100">{{ formTitle }}</div>
    <div class="my-5 d-flex justify-center" v-if="!isShowForgotPasswordDialog">
      <v-form ref="formRef" class="w-50" lazy-validation>
        <v-alert
          v-if="alertMessage"
          :text="alertMessage"
          class="ma-10"
          :type="alertType"
          variant="tonal"
        ></v-alert>
        <v-text-field
          v-model="user.email"
          :rules="validationSchema.email"
          label="E-mail"
        ></v-text-field>

        <v-text-field
          v-model="user.password"
          :counter="8"
          :append-icon="showIcon"
          :type="showPassword"
          @click:append="onDisplayPassword"
          :rules="validationSchema.password"
          label="Password"
        ></v-text-field>

        <v-btn class="me-4" @click="onSubmitForm"> {{ formTitle }} </v-btn>
        <v-btn class="me-4" @click="onGoToRegisterPage">
          Create New Account</v-btn
        >
        <v-btn class="me-4" @click="onShowForgotPasswordDialog">
          Forgot Password</v-btn
        >
      </v-form>
    </div>
    <!-- forgot password dialog -->
    <div class="my-5 d-flex justify-center" v-else>
      <v-form class="w-50" ref="dialogFormRef" @submit.prevent="onSubmitAction">
        <v-alert
          v-if="alertMessage"
          :text="alertMessage"
          class="ma-10"
          :type="alertType"
          variant="tonal"
        ></v-alert>
        <v-text-field
          v-model="user.email"
          :rules="validationSchema.name"
          label="Enter Email"
        ></v-text-field>
        <v-text-field
          v-if="isCreateNewPasswordForm"
          v-model="user.password"
          :rules="validationSchema.name"
          label="Enter New Password"
        ></v-text-field>
        <v-text-field
          v-if="isCreateNewPasswordForm"
          v-model="otpText"
          :rules="validationSchema.name"
          label="Enter OTP"
        ></v-text-field>

        <v-btn type="submit" block class="mt-2">{{ formTitle }}</v-btn>
      </v-form>
    </div>
  </div>
  <loaderComponent v-else />
</template>

<script>
import { validationSchema } from "@/util/validation/form.validation";
import { forgetPassword, sendEmailWithOTP, userLogin } from "@/services/";
import loaderComponent from "@/components/ui/loader-component";
import { computed, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
export default {
  components: { loaderComponent },
  setup() {
    const store = useStore();
    const router = useRouter();
    const otpText = ref(null);
    const alertMessage = ref(null);
    const alertType = ref("error");
    const isShowPass = ref(false);
    const isShowForgotPasswordDialog = ref(false);
    const isCreateNewPasswordForm = ref(false);
    const formRef = ref(null);
    const dialogFormRef = ref(null);
    const isShowLoader = ref(false);
    const user = reactive({
      email: "",
      password: "",
    });

    const onSubmitForm = async () => {
      try {
        const form = await formRef.value.validate();
        if (form.valid) {
          const loginUserData = await userLogin(user);
          store.dispatch("auth/setUserData", loginUserData.data.user);
          localStorage.setItem("token", loginUserData.data.token);
          router.push({ name: "home" });
        }
      } catch (error) {
        alertType.value = "error";
        if (error.response?.status === 400)
          alertMessage.value = "Email Or Password is Wrong";
      }
    };

    const onGoToRegisterPage = () => {
      router.push({ name: "register" });
    };

    const onDisplayPassword = () => {
      isShowPass.value = !isShowPass.value;
    };

    const onShowForgotPasswordDialog = () => {
      isShowForgotPasswordDialog.value = true;
    };

    const onSendEmailWithOTP = async () => {
      try {
        if (dialogFormRef.value.isValid) {
          isShowLoader.value = true;
          alertMessage.value = null;
          await sendEmailWithOTP({ email: user.email });
          alertMessage.value = "OTP Send Successfully ! Check your Email";
          alertType.value = "success";
          isCreateNewPasswordForm.value = true;
          isShowLoader.value = false;
        }
      } catch (error) {
        isShowLoader.value = false;
        alertType.value = "error";
        if (error?.response?.status === 404) {
          alertMessage.value = "Please Enter Valid Email";
        }
      }
    };

    const onForgotPassword = async () => {
      try {
        if (dialogFormRef.value.isValid) {
          await forgetPassword({
            ...user,
            otp: +otpText.value,
          });

          alertMessage.value = "Password Change Successfully";
          alertType.value = "success";

          isShowForgotPasswordDialog.value = false;
          isCreateNewPasswordForm.value = false;
        }
      } catch (error) {
        alertType.value = "error";
        if (error?.response?.status === 410) {
          alertMessage.value = "Resend OTP";
          isCreateNewPasswordForm.value = false;
        }
        if (error?.response?.status === 409) {
          alertMessage.value = "OTP Not Match";
        }
      }
    };

    const showIcon = computed(() => {
      return isShowPass.value ? "mdi-eye" : "mdi-eye-off";
    });
    const showPassword = computed(() => {
      return isShowPass.value ? "text" : "password";
    });

    const formTitle = computed(() => {
      if (!isShowForgotPasswordDialog.value) {
        return "login";
      }
      return isCreateNewPasswordForm.value
        ? "Create New Password"
        : "Forgot Password";
    });

    const onSubmitAction = computed(() =>
      isCreateNewPasswordForm.value ? onForgotPassword : onSendEmailWithOTP
    );

    return {
      user,
      alertMessage,
      validationSchema,
      showIcon,
      showPassword,
      formRef,
      dialogFormRef,
      onSubmitForm,
      onDisplayPassword,
      onGoToRegisterPage,
      onShowForgotPasswordDialog,
      isShowForgotPasswordDialog,
      onSubmitAction,
      isCreateNewPasswordForm,
      formTitle,
      otpText,
      alertType,
      isShowLoader,
    };
  },
};
</script>
