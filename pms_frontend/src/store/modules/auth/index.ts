interface User {
  address: string;
  birthDate: Date;
  city: string;
  contact: string;
  email: string;
  firstName: string;
  gender: string;
  id: number;
  lastName: string;
  permissions: Array<{ title: string }>;
  role: {
    id: number;
    title: string;
    permissions: Array<{ title: string }>;
  };
}
interface UserDataInterface {
  userData: User | null;
}
export const auth = {
  namespaced: true,
  state() {
    return {
      userData: null,
    };
  },
  getters: {
    getUserData(state: UserDataInterface) {
      return state.userData;
    },
    checkUserPermission: (state: UserDataInterface) => (permission: string) => {
      if (state.userData?.role.title === "admin") {
        return true;
      }

      const isRolePermission = state.userData?.role.permissions.some(
        (item) => item.title === permission
      );
      const isUserPermission = state.userData?.permissions.some(
        (item) => item.title === permission
      );
      return isRolePermission || isUserPermission;
    },
  },
  mutations: {
    SET_USER_DATA(state: UserDataInterface, userData: User | null) {
      state.userData = userData;
    },
  },

  actions: {
    setUserData({ commit }: unknown, userData: object | null) {
      commit("SET_USER_DATA", userData);
    },
  },
};
