<template>
  <div class="col s12 m6">
    <div>
      <div class="page-subtitle">
        <h4>Edit</h4>
      </div>

      <form @submit.prevent="submitHandler">
        <div class="input-field">
          <select ref="select" v-model="current">
            <option v-for="c of categories" :key="c.id" :value="c.id">{{ c.title }}</option>
          </select>
          <label>Select a category</label>
        </div>

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
          Update
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
  props: {
    categories: {
      type: Array,
      required: true,
    },
  },
  setup() {
    return { v$: useVuelidate() };
  },
  data() {
    return {
      select: null,
      title: "",
      limit: 1000,
      current: null,
    };
  },
  validations: () => ({
    title: { required },
    limit: { minValue: minValue(1000) },
  }),
  watch: {
    current(catID) {
      const { title, limit } = this.categories.find((c) => c.id === catID);
      this.title = title;
      this.limit = limit;
    },
  },
  created() {
    const { id, title, limit } = this.categories[0];
    this.title = title;
    this.limit = limit;
    this.current = id;
  },
  methods: {
    async submitHandler() {
      const result = await this.v$.$validate();
      if (!result) {
        this.v$.$touch();
        return;
      }
      try {
        const categoryData = {
          id: this.current,
          title: this.title,
          limit: this.limit,
        };
        await this.$store.dispatch("updateCategory", categoryData);
        this.$message("Category updated successfully");
        this.$emit("updated", categoryData);
      } catch (e) {}
    },
  },
  mounted() {
    M.updateTextFields();
    this.select = M.FormSelect.init(this.$refs.select);
  },
  beforeUnmount() {
    if (this.select && this.select.destroy) this.select.destroy();
  },
};
</script>
