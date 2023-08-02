import { createVuetify } from "vuetify/lib/framework.mjs";
import "vuetify/dist/vuetify.min.css";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import "@mdi/font/css/materialdesignicons.css";

export const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: "light",
  },
});
