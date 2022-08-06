<template>
  <div>
    <div class="page-title">
      <h3>New entry</h3>
    </div>

    <Loader v-if="loading" />

    <p class="center" v-else-if="!categories.length">No categories yet. <router-link to="/categories">Add a new category</router-link></p>

    <form v-else class="form" @submit.prevent="submitHandler">
      <div class="input-field">
        <select ref="select" v-model="category">
          <option v-for="c of categories" :key="c.id" :value="c.id">{{ c.title }}</option>
        </select>
        <label>Select a category</label>
      </div>

      <p>
        <label>
          <input class="with-gap" name="type" type="radio" value="income" v-model="type" />
          <span>Income</span>
        </label>
      </p>

      <p>
        <label>
          <input class="with-gap" name="type" type="radio" value="outcome" v-model="type" />
          <span>Outcome</span>
        </label>
      </p>

      <div class="input-field">
        <input id="amount" type="number" v-model.number="v$.amount.$model" :class="{ invalid: v$.amount.$dirty && !v$.amount.minValue.$response }" />
        <label for="amount">Amount</label>
        <span class="helper-text invalid" v-if="v$.amount.$dirty && !v$.amount.minValue.$response"
          >Minimal value {{ v$.amount.minValue.$params.min }}</span
        >
      </div>

      <div class="input-field">
        <input
          id="description"
          type="text"
          v-model.trim="v$.description.$model"
          :class="{ invalid: v$.description.$dirty && !v$.description.required.$response }"
        />
        <label for="description">Description</label>
        <span class="helper-text invalid" v-if="v$.description.$dirty && !v$.description.required.$response"> The field must not be empty </span>
      </div>

      <button class="btn waves-effect waves-light" type="submit">
        Create
        <i class="material-icons right">send</i>
      </button>
    </form>
  </div>
</template>

<script>
import useVuelidate from "@vuelidate/core";
import { required, minValue } from "@vuelidate/validators";
import { mapGetters } from "vuex";
export default {
  setup() {
    return { v$: useVuelidate() };
  },
  name: "record",
  data: () => ({
    loading: true,
    categories: [],
    category: null,
    select: null,
    type: "income",
    amount: 1,
    description: "",
  }),
  validations: () => ({
    description: { required },
    amount: { minValue: minValue(1) },
  }),
  async mounted() {
    this.categories = await this.$store.dispatch("fetchCategories");
    this.loading = false;
    if (this.categories) {
      this.category = this.categories[0].id;
    }
    setTimeout(() => {
      this.select = M.FormSelect.init(this.$refs.select);
      M.updateTextFields();
    }, 0);
  },
  computed: {
    ...mapGetters(["info"]),
    canCreateRecord() {
      if (this.type === "income") {
        return true;
      }
      return this.info.bill >= this.amount;
    },
  },
  methods: {
    async submitHandler() {
      const result = await this.v$.$validate();
      if (!result) {
        this.v$.$touch();
        return;
      }
      if (this.canCreateRecord) {
        const recordData = {
          categoryId: this.category,
          amount: this.amount,
          description: this.description,
          type: this.type,
          date: new Date().toJSON(),
        };
        try {
          await this.$store.dispatch("createRecord", recordData);
          const bill = this.type === "income" ? this.info.bill + this.amount : this.info.bill - this.amount;
          await this.$store.dispatch("updateInfo", { bill });
          this.$message("Entry created successfully");
          this.v$.$reset();
          this.amount = 1;
          this.description = "";
        } catch (e) {}
      } else {
        this.$message(`Insufficient funds on the account ${this.amount - this.info.bill}`);
      }
    },
  },
  beforeUnmount() {
    if (this.select && this.select.destroy) this.select.destroy();
  },
};
</script>
