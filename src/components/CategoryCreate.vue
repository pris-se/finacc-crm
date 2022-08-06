<template>
  <div class="col s12 m6">
    <div>
      <div class="page-subtitle">
        <h4>Create</h4>
      </div>

      <form @submit.prevent="submitHandler">
        <div class="input-field">
          <input id="name" type="text" v-model.trim="v$.title.$model" :class="{ invalid: v$.title.$dirty && !v$.title.required.$response }" />
          <label for="name">Name</label>
          <span class="helper-text invalid" v-if="v$.title.$dirty && !v$.title.required.$response">Enter category name</span>
        </div>

        <div class="input-field">
          <input id="limit" type="number" v-model.number="v$.limit.$model" :class="{ invalid: v$.limit.$dirty && !v$.limit.minValue.$response }" />
          <label for="limit">Limit</label>
          <span class="helper-text invalid" v-if="v$.limit.$dirty && !v$.limit.minValue.$response"
            >Minimal value {{ v$.limit.minValue.$params.min }}</span
          >
        </div>

        <button class="btn waves-effect waves-light" type="submit">
          Create
          <i class="material-icons right">send</i>
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import useVuelidate from "@vuelidate/core";
import { required, minValue } from "@vuelidate/validators";
export default {
  setup() {
    return { v$: useVuelidate() };
  },
  data() {
    return {
      title: "",
      limit: 1000,
    };
  },
  validations: () => ({
    title: { required },
    limit: { minValue: minValue(1000) },
  }),
  mounted() {
    M.updateTextFields();
  },
  methods: {
    async submitHandler() {
      const result = await this.v$.$validate();
      if (!result) {
        this.v$.$touch();
        return;
      }
      try {
        const category = await this.$store.dispatch("createCategory", {
          title: this.title,
          limit: this.limit,
        });
        this.title = "";
        this.limit = 1000;
        this.v$.$reset();
        this.$message("Category has been created");
        this.$emit("created", category);
      } catch (e) {}
    },
  },
};
</script>
