import { getDatabase, ref, push, get, update, child } from "firebase/database";
export default {
  actions: {
    async fetchCategories({ commit, dispatch }) {
      try {
        const uid = await dispatch("getUid");
        const path = ref(getDatabase(), `/users/${uid}/categories`);
        const categories = (await get(path)).val() || [];
        return Object.keys(categories).map((key) => ({ ...categories[key], id: key }));
      } catch (e) {
        commit("setError", e);
        throw e;
      }
    },
    async fetchCategoryById({ commit, dispatch }, id) {
      try {
        const uid = await dispatch("getUid");
        const path = ref(getDatabase(), `/users/${uid}/categories/${id}`);
        const category = (await get(path)).val();
        return { ...category, id };
      } catch (e) {
        commit("setError", e);
        throw e;
      }
    },
    async updateCategory({ commit, dispatch }, { title, limit, id }) {
      try {
        const uid = await dispatch("getUid");
        const path = ref(getDatabase(), `/users/${uid}/categories/${id}`);
        await update(path, { title, limit });
      } catch (e) {
        commit("setError", e);
        throw e;
      }
    },
    async createCategory({ commit, dispatch }, { title, limit }) {
      try {
        const uid = await dispatch("getUid");
        const category = await push(ref(getDatabase(), `/users/${uid}/categories`), { title, limit });
        return { title, limit, id: category.key };
      } catch (e) {
        commit("setError", e);
        throw e;
      }
    },
  },
};
