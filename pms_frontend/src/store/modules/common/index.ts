interface CommonInterface {
  isHeaderVisible: boolean;
}
export const common = {
  namespaced: true,
  state() {
    return {
      isHeaderVisible: true,
    };
  },
  getters: {
    getIsHeaderVisible(state: CommonInterface) {
      return state.isHeaderVisible;
    },
  },
  mutations: {
    SET_IS_HEADER_VISIBLE(state: CommonInterface, isHeaderShow: boolean) {
      state.isHeaderVisible = isHeaderShow;
    },
  },
  actions: {
    setIsHeaterVisible({ commit }: unknown, isHeaderShow: boolean) {
      commit("SET_IS_HEADER_VISIBLE", isHeaderShow);
    },
  },
};
