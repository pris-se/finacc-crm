import { getDatabase, push, ref, get, child } from "firebase/database";

export default {
  actions: {
    async createRecord({ dispatch, commit }, recordData) {
      try {
        const uid = await dispatch("getUid");
        const path = ref(getDatabase(), `/users/${uid}/records`);
        return await push(path, recordData);
      } catch (e) {
        commit("setError", e);
        throw e;
      }
    },
    async fetchRecords({ dispatch, commit }) {
      try {
        const uid = await dispatch("getUid");
        const path = ref(getDatabase(), `/users/${uid}/records`);
        const records = (await get(path)).val() || [];
        return records ? Object.keys(records).map((key) => ({ ...records[key], id: key })) : null;
      } catch (e) {
        commit("setError", e);
        throw e;
      }
    },
    async fetchRecordById({ dispatch, commit }, id) {
      try {
        const uid = await dispatch("getUid");
        const path = ref(getDatabase(), `/users/${uid}/records/${id}`);
        const record = (await get(path)).val();
        return { ...record, id };
      } catch (e) {
        commit("setError", e);
        throw e;
      }
    },
  },
};
