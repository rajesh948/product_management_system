import { createStore } from "vuex";
import { auth } from "./modules/auth";
import { common } from "./modules/common";

export const store = createStore({
  modules: { auth: auth as object, common: common as object },
});
