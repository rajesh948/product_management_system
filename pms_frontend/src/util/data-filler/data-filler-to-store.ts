import { getLoginUserData } from "@/services";
import { store } from "@/store";
(async () => {
  try {
    if (localStorage.getItem("token")) {
      const userDataFromToken = await getLoginUserData();

      store.dispatch("auth/setUserData", userDataFromToken.data);
    }
  } catch (error) {
    console.log(error);
  }
})();
