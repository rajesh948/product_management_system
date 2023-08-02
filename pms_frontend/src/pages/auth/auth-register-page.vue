<template>
  <v-container class="w-50">
    <v-alert
      v-if="errorMessage"
      :text="errorMessage"
      class="ma-10 w-75"
      type="error"
      variant="tonal"
    ></v-alert>
    <div v-if="!isShowUserForm">
      <registerFormComponent @onSubmitForm="onSubmitForm" />
      <v-banner-actions class="d-flex justify-space-around align-center ma-4">
        <v-card class="pa-2" @click="onGoToLogin">
          Already have an account ?</v-card
        >
        <GoogleLogin :callback="callback" />
      </v-banner-actions>
    </div>
    <div v-else>
      <div class="title">SignUp With Google</div>

      <v-form ref="formRef" @submit.prevent="onRegisterUser">
        <v-text-field
          v-model="user.firstName"
          :rules="validationSchema.name"
          label="FirstName"
        ></v-text-field>
        <v-text-field
          v-model="user.lastName"
          :rules="validationSchema.name"
          label="LastName"
        ></v-text-field>
        <v-text-field
          v-model="user.email"
          :rules="validationSchema.email"
          label="E-mail"
        ></v-text-field>
        <v-text-field
          v-model="user.password"
          :counter="8"
          type="password"
          :rules="validationSchema.password"
          label="Password"
        ></v-text-field>
        <v-btn type="submit" block class="mt-2">Submit</v-btn>
      </v-form>
    </div>
  </v-container>
</template>

<script>
import registerFormComponent from "@/components/common/register-form-component";
import { useRouter } from "vue-router";
import { getLoginUserData, registerUser } from "@/services";
import { decodeCredential } from "vue3-google-login";
import { reactive, ref } from "vue";
import { validationSchema } from "@/util";
import { useStore } from "vuex";

export default {
  components: {
    registerFormComponent,
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const isShowUserForm = ref(false);
    const formRef = ref(null);
    const errorMessage = ref(null);
    const user = reactive({
      firstName: null,
      lastName: null,
      email: null,
      password: null,
    });
    const onSubmitForm = async (user) => {
      try {
        const register = await registerUser(user);
        localStorage.setItem("token", register.data.token);
        const userDataFromToken = await getLoginUserData();
        store.dispatch("auth/setUserData", userDataFromToken.data);
        router.push({ name: "home" });
      } catch (error) {
        console.log(error);
        if (error?.response?.status === 403) {
          errorMessage.value = error.response.data.message;
        }
        setTimeout(() => {
          errorMessage.value = null;
        }, 5000);
      }
    };

    const onGoToLogin = () => {
      router.push({ name: "login" });
    };
    const callback = (response) => {
      const userData = decodeCredential(response.credential);
      user.email = userData.email;
      user.firstName = userData.given_name;
      user.lastName = userData.family_name;
      isShowUserForm.value = true;
    };

    const onRegisterUser = () => {
      if (formRef.value.isValid) {
        onSubmitForm(user);
      }
    };
    return {
      onSubmitForm,
      onGoToLogin,
      callback,
      user,
      formRef,
      isShowUserForm,
      validationSchema,
      onRegisterUser,
      errorMessage,
    };
  },
};
</script>
