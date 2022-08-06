import { getDatabase, get, ref, update } from "firebase/database";

export default {
  state: {
    info: {},
  },
  mutations: {
    setInfo(state, info) {
      state.info = info;
    },
    clearInfo(state) {
      state.info = {};
    },
  },
  actions: {
    async updateInfo({ dispatch, commit, getters }, toUpdate) {
      try {
        const uid = await dispatch("getUid");
        const path = ref(getDatabase(), `/users/${uid}/info`);
        const updateData = { ...getters.info, ...toUpdate };
        await update(path, updateData);
        commit("setInfo", updateData);
      } catch (e) {
        commit("setError", e);
        throw e;
      }
    },
    async fetchInfo({ dispatch, commit }) {
      try {
        const uid = await dispatch("getUid");
        const path = ref(getDatabase(), `/users/${uid}/info`);
        const info = (await get(path)).val();
        commit("setInfo", info);
      } catch (e) {
        throw e;
      }
    },
  },
  getters: {
    info: (s) => s.info,
  },
};
