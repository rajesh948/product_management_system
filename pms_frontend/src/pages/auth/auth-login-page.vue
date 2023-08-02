<template>
  <div class="title">Login</div>

  <div class="my-5 d-flex justify-center">
    <v-form ref="formRef" class="w-50" lazy-validation>
      <v-alert
        v-if="errorMessage"
        :text="errorMessage"
        class="ma-10"
        type="error"
        variant="tonal"
      ></v-alert>
      <v-text-field
        v-model="user.email"
        :rules="validationRules.email"
        label="E-mail"
      ></v-text-field>

      <v-text-field
        v-model="user.password"
        :counter="8"
        :append-icon="showIcon"
        :type="showPassword"
        @click:append="onDisplayPassword"
        :rules="validationRules.password"
        label="Password"
      ></v-text-field>

      <v-btn class="me-4" @click="onSubmitForm"> submit </v-btn>
      <v-btn class="me-4" @click="onGoToRegisterPage">
        Create New Account</v-btn
      >
    </v-form>
  </div>
</template>

<script>
import { validationSchema } from "@/util/validation/form.validation";
import { userLogin } from "@/services/";
import { computed, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

export default {
  setup() {
    const store = useStore();
    const router = useRouter();

    const user = reactive({
      email: "",
      password: "",
    });
    const errorMessage = ref(null);
    const validationRules = validationSchema;
    const isShowPass = ref(false);
    const formRef = ref(null);

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
        console.log("loginError", error);
        if (error.response?.status === 400)
          errorMessage.value = "Email Or Password is Wrong";
        setTimeout(() => {
          errorMessage.value = null;
        }, 5000);
      }
    };
    const onGoToRegisterPage = () => {
      router.push({ name: "register" });
    };
    const onDisplayPassword = () => {
      isShowPass.value = !isShowPass.value;
    };

    const showIcon = computed(() => {
      return isShowPass.value ? "mdi-eye" : "mdi-eye-off";
    });
    const showPassword = computed(() => {
      return isShowPass.value ? "text" : "password";
    });

    return {
      user,
      errorMessage,
      validationRules,

      showIcon,
      showPassword,
      formRef,
      onSubmitForm,
      onDisplayPassword,
      onGoToRegisterPage,
    };
  },
};
</script>
