<template>
  <div>
    <div class="page-title">
      <h3>Profile</h3>
    </div>

    <form class="form" @submit.prevent="submitHandler">
      <div class="input-field">
        <input id="description" type="text" v-model.trim="v$.name.$model" :class="{ invalid: v$.name.$error }" />
        <label for="description">Name</label>
        <span class="helper-text invalid" v-if="v$.name.$dirty && !v$.name.required.$response">Enter your name</span>
      </div>
      <button class="btn waves-effect waves-light" type="submit">
        Update
        <i class="material-icons right">send</i>
      </button>
    </form>
  </div>
</template>

<script>
import useVuelidate from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { mapGetters, mapActions } from "vuex";
export default {
  setup() {
    return { v$: useVuelidate() };
  },
  metaInfo: {
    title: "Profile",
  },
  data: () => ({
    name: "",
    isRuLocale: true,
  }),
  validations: () => ({
    name: { required },
  }),
  mounted() {
    this.name = this.info.name;
    this.isRuLocale = this.info.locale === "ru-Ru";
    setTimeout(() => {
      M.updateTextFields();
    }, 0);
  },
  computed: {
    ...mapGetters(["info"]),
  },
  methods: {
    ...mapActions(["updateInfo"]),
    async submitHandler() {
      const result = await this.v$.$validate();
      if (!result) {
        this.v$.$touch();
        return;
      }
      try {
        await this.updateInfo({
          name: this.name,
          locale: this.isRuLocale ? "ru-Ru" : "en-Us",
        });
      } catch (e) {}
    },
  },
};
</script>

<style scoped>
.switch {
  margin-bottom: 2rem;
}
</style>
