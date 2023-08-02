import { createApp } from "vue";
import App from "./App.vue";
import { vuetify } from "./plugins/vuetify/vuetify.plugin";
import { router } from "@/router";
import { store } from "./store";
import "@/css/style.css";
import vue3GoogleLogin from "vue3-google-login";

const app = createApp(App);
app.use(vue3GoogleLogin, {
  clientId: process.env.VUE_APP_GOOGLE_CLIENT_ID,
});

app.use(router);
app.use(store);
app.use(vuetify);

app.mount("#app");
