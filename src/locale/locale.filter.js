import store from "../store";

const locales = {
  "ru-Ru": {},
  "en-US": {},
};

export default {
  methods: {
    localizeFilter(key) {
      const locale = store.getters.info.locale || "ru-Ru";
      return locales[locale][key] || `[Localize error] key ${key} not found`;
    },
  },
};
