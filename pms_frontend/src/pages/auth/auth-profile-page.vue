<template>
  <showSliderItemComponent>
    <template v-slot:title>
      <v-banner :elevation="0" class="pa-3 bg-lime-lighten-2" border>
        <div class="float-left text-h4 font-weight-black">Profile</div>
        <v-btn class="float-right" @click.stop="onGotoHome" variant="tonal">
          <v-icon icon="mdi-home-import-outline" size="x-large"></v-icon>
        </v-btn>
      </v-banner>
    </template>
    <template v-slot:content>
      <v-container v-if="user" class="w-75 my-5">
        <v-row class="bg-light-green-lighten-4 pa-10">
          <v-col cols="12" class="text-center">
            <v-form ref="formRef" @submit.prevent="onSaveProfile">
              <v-text-field
                class="py-2"
                variant="outlined"
                v-model="user.firstName"
                :rules="validationSchema.name"
                label="FirstName"
                :disabled="isEditMode"
              ></v-text-field>
              <v-text-field
                class="py-2"
                variant="outlined"
                v-model="user.lastName"
                :rules="validationSchema.name"
                label="LastName"
                :disabled="isEditMode"
              ></v-text-field>

              <v-text-field
                class="py-2"
                variant="outlined"
                v-model="user.contact"
                :rules="validationSchema.contact"
                label="Contact"
                :disabled="isEditMode"
              ></v-text-field>

              <v-select
                class="py-2"
                variant="outlined"
                v-model="user.gender"
                :items="['male', 'female', 'other']"
                :rules="validationSchema.isRequired"
                label="Select Gender"
                :disabled="isEditMode"
              ></v-select>

              <v-text-field
                class="py-2"
                variant="outlined"
                v-model="user.email"
                :rules="validationSchema.email"
                label="E-mail"
                :disabled="isEditMode"
              ></v-text-field>

              <v-text-field
                class="py-2"
                variant="outlined"
                v-model="user.birthDate"
                type="date"
                label="Birth Date"
                :rules="validationSchema.isRequired"
                :disabled="isEditMode"
              ></v-text-field>

              <v-text-field
                class="py-2"
                variant="outlined"
                v-model="user.city"
                :rules="validationSchema.name"
                label="City"
                :disabled="isEditMode"
              ></v-text-field>

              <v-text-field
                class="py-2"
                variant="outlined"
                v-model="user.address"
                :rules="validationSchema.address"
                label="Address"
                :disabled="isEditMode"
              ></v-text-field>

              <v-text-field
                class="py-2"
                variant="outlined"
                v-model="user.password"
                :counter="8"
                type="password"
                label="Password"
                :disabled="isEditMode"
              ></v-text-field>
              <v-btn
                v-if="isEditMode"
                variant="outlined"
                @click="onToggleEditMode"
                class="px-10 bg-lime-lighten-2"
                >Edit
              </v-btn>
              <v-btn
                v-else
                type="submit"
                variant="outlined"
                class="px-10 bg-lime-lighten-2"
                >Save
              </v-btn>
            </v-form>
          </v-col>
        </v-row>
      </v-container>
      <loaderComponent v-else />
    </template>
  </showSliderItemComponent>
</template>

<script>
import showSliderItemComponent from "@/components/ui/show-slider-item-component";
import loaderComponent from "@/components/ui/loader-component";
import { computed, reactive, ref } from "vue";
import { validationSchema } from "@/util";
import { useStore } from "vuex";
import { updateUserInfo } from "@/services";
import { useRouter } from "vue-router";

export default {
  components: {
    showSliderItemComponent,
    loaderComponent,
  },
  setup() {
    const store = useStore();
    const isEditMode = ref(true);
    const formRef = ref(null);
    const router = useRouter();
    const user = computed(() => {
      const userFromStore = store.getters["auth/getUserData"];
      if (userFromStore)
        userFromStore.birthDate = userFromStore.birthDate.slice(0, 10);
      return userFromStore;
    });

    const onToggleEditMode = () => {
      isEditMode.value = false;
    };
    const onGotoHome = () => {
      router.push({ name: "home" });
    };

    const onSaveProfile = async () => {
      try {
        if (formRef.value.isValid) {
          const userObject = reactive({
            firstName: null,
            lastName: null,
            contact: null,
            gender: null,
            email: null,
            birthDate: null,
            city: null,
            address: null,
            password: null,
          });

          Object.keys(userObject).forEach((key) => {
            if (!user.value[key]) {
              delete userObject[key];
            } else {
              userObject[key] = user.value[key];
            }
          });
          console.log(userObject, user.value.password);
          const response = await updateUserInfo(user.value.id, userObject);
          console.log(response);
          router.push({ name: "home" });
        }
      } catch (error) {
        console.log(error);
      }
    };

    return {
      user,
      validationSchema,
      isEditMode,
      onToggleEditMode,
      onSaveProfile,
      formRef,
      onGotoHome,
    };
  },
};
</script>

<style></style>
