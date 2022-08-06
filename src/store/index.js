import { createStore } from "vuex";
import auth from "./auth";
import info from "./info";
import category from "./category";
import record from "./record";

export default createStore({
  state: {
    error: null,
  },
  mutations: {
    setError(state, error) {
      state.error = error;
    },
    clearError(state) {
      state.error = null;
    },
  },
  getters: {
    error: (s) => s.error,
  },
  actions: {
    async fetchCurrency() {
      // const key = process.env.VUE_APP_FIXER;
      // const myHeaders = new Headers();
      // myHeaders.append("apikey", key);
      // const requestOptions = {
      //   method: "GET",
      //   redirect: "follow",
      //   headers: myHeaders,
      // };
      // const res = await fetch("https://api.apilayer.com/fixer/latest?symbols=USD,EUR,UAH&base=UAH", requestOptions);
      // return await res.json();
      return {
        rates: {
          UAH: 1,
          USD: 0.034,
          EUR: 0.034,
        },
        date: new Date(),
      };
    },
  },
  modules: {
    auth,
    info,
    category,
    record,
  },
});
