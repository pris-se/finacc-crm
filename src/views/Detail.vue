<template>
  <div>
    <Loader v-if="loading" />
    <div v-else-if="record">
      <div class="breadcrumb-wrap">
        <router-link to="/history" class="breadcrumb">History</router-link>
        <a @click.prevent class="breadcrumb"> {{ record.type === "income" ? "Income" : "Outcome" }} </a>
      </div>
      <div class="row">
        <div class="col s12 m6">
          <div class="card" :class="record.type === 'income' ? 'green' : 'red'">
            <div class="card-content white-text">
              <p>Описание: {{ record.description }}</p>
              <p>Сумма: {{ formatedCurrency(record.amount) }}</p>
              <p>Категория: {{ record.categoryName }}</p>

              <small>{{ dateFilter(record.date) }}</small>
            </div>
          </div>
        </div>
      </div>
    </div>
    <p v-else class="center">Entry with id={{ $route.params.id }} not found.</p>
  </div>
</template>

<script>
export default {
  name: "datail",
  data: () => ({
    type: "datetime",
    record: null,
    loading: true,
  }),
  async mounted() {
    const id = this.$route.params.id;
    const record = await this.$store.dispatch("fetchRecordById", id);
    const category = await this.$store.dispatch("fetchCategoryById", record.categoryId);
    this.record = {
      ...record,
      categoryName: category.title,
    };
    this.loading = false;
  },
  methods: {
    dateFilter(value) {
      const options = {};
      if (this.type.includes("date")) {
        options.day = "2-digit";
        options.month = "long";
        options.year = "numeric";
      }
      if (this.type.includes("time")) {
        options.hour = "2-digit";
        options.minute = "2-digit";
        options.second = "2-digit";
      }
      return new Intl.DateTimeFormat("ru-Ru", options).format(new Date(value));
    },
    formatedCurrency(cur) {
      return new Intl.NumberFormat("ru-RU", {
        style: "currency",
        currency: "UAH",
      }).format(cur);
    },
  },
};
</script>
