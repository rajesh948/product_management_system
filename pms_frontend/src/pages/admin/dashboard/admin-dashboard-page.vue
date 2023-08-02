<template>
  <div v-if="userName">
    <v-layout>
      <v-navigation-drawer
        :width="200"
        v-model="drawer"
        :rail="rail"
        permanent
        @click="rail = false"
        location="left"
      >
        <v-list-item
          prepend-avatar="https://randomuser.me/api/portraits/men/85.jpg"
          :title="userName"
          nav
        >
          <template v-slot:append>
            <v-btn
              variant="text"
              icon="mdi-chevron-left"
              @click.stop="rail = !rail"
            ></v-btn>
          </template>
        </v-list-item>

        <v-divider></v-divider>

        <v-list density="compact" nav>
          <router-link :to="{ name: 'admin' }">
            <v-list-item
              prepend-icon="mdi-home-city"
              title="Home"
              value="home"
            ></v-list-item>
          </router-link>
          <router-link
            v-if="isUserAccessible('showUser')"
            :to="{ name: 'userPanel' }"
          >
            <v-list-item
              prepend-icon="mdi-account"
              title="Users"
              value="user"
            ></v-list-item>
          </router-link>
          <router-link
            v-if="isUserAccessible('showRole')"
            :to="{ name: 'rolePanel' }"
          >
            <v-list-item
              prepend-icon="mdi-account-group-outline"
              title="Roles"
              value="Role"
            ></v-list-item>
          </router-link>
          <router-link :to="{ name: 'productPanel' }">
            <v-list-item
              prepend-icon="mdi-package-variant-closed"
              title="Product"
              value="product"
            ></v-list-item>
          </router-link>
          <router-link :to="{ name: 'categoryPanel' }">
            <v-list-item
              prepend-icon="mdi-shape-plus"
              title="Category"
              value="category"
            ></v-list-item>
          </router-link>
          <router-link :to="{ name: 'home' }">
            <v-list-item
              prepend-icon="mdi-arrow-left"
              title="Back"
              value="back"
            ></v-list-item>
          </router-link>
        </v-list>
      </v-navigation-drawer>
      <v-main>
        <div v-if="isShowHome">Home Page</div>
        <router-view></router-view>
      </v-main>
    </v-layout>
  </div>
</template>
<script>
import { computed, onBeforeUpdate, onMounted, onUnmounted, ref } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import { isUserAccessible } from "@/util";

export default {
  setup() {
    const store = useStore();
    const isShowHome = ref(true);
    const route = useRoute();
    const drawer = ref(true);
    const rail = ref(false);

    const userName = computed(() => {
      const user = store.getters["auth/getUserData"];
      return user?.firstName + " " + user?.lastName;
    });

    onMounted(() => {
      store.dispatch("common/setIsHeaterVisible", false);
      isShowHome.value = route.name === "admin" ? true : false;
    });
    onUnmounted(() => {
      store.dispatch("common/setIsHeaterVisible", true);
    });

    onBeforeUpdate(() => {
      isShowHome.value = route.name === "admin" ? true : false;
    });

    return { drawer, rail, isShowHome, isUserAccessible, userName };
  },
};
</script>
<style scoped>
a {
  text-decoration: none;
  color: black;
}
</style>
