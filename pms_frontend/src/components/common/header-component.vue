<template>
  <v-card v-if="isHeaderVisible">
    <v-banner :elevation="0" class="pa-3 bg-lime-lighten-2" border>
      <v-toolbar class="bg-lime-lighten-2">
        <v-toolbar-title class="cursor-pointer">
          <router-link class="text-h4" :to="{ name: 'home' }"
            >Product Management System</router-link
          >
        </v-toolbar-title>

        <div>
          <v-tab>
            <router-link :to="{ name: 'home' }">Home</router-link>
          </v-tab>
          <v-tab v-if="!userData">
            <router-link :to="{ name: 'login' }">Login</router-link>
          </v-tab>
          <v-tab v-if="!userData">
            <router-link :to="{ name: 'register' }">Register</router-link>
          </v-tab>

          <v-tab v-if="userData">
            <router-link :to="{ name: 'purchaseHistory' }"
              >Order History</router-link
            >
          </v-tab>
          <v-tab v-if="isAdmin && userData">
            <router-link :to="{ name: 'admin' }">Dashboard</router-link>
          </v-tab>

          <v-tab v-if="userData">
            <div class="header-text" @click="onLogout">Logout</div>
          </v-tab>
          <router-link :to="{ name: 'cart' }">
            <v-btn
              class="pa-3"
              icon="mdi-cart-variant"
              size="extra-large"
            ></v-btn>
          </router-link>

          <router-link v-if="userData" :to="{ name: 'profile' }">
            <v-btn
              class="pa-3"
              icon="mdi-account-circle"
              size="extra-large"
            ></v-btn
          ></router-link>
        </div>
      </v-toolbar>
    </v-banner>
  </v-card>
</template>

<script>
import { computed } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
export default {
  setup() {
    const store = useStore();
    const router = useRouter();
    const isHeaderVisible = computed(
      () => store.getters["common/getIsHeaderVisible"]
    );

    const userData = computed(() => store.getters["auth/getUserData"]);
    const isAdmin = computed(() => userData.value?.role?.title !== "user");
    const onLogout = () => {
      localStorage.clear();
      store.dispatch("auth/setUserData", null);
      router.push({ name: "home" });
    };
    return { userData, onLogout, isAdmin, isHeaderVisible };
  },
};
</script>

<style scoped>
a,
.header-text {
  text-decoration: none;
  font-weight: 600;
  font-size: 1.3rem;
  color: black;
}
</style>
