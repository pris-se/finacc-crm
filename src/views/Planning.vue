<template>
  <div>
    <div class="page-title">
      <h3>Planning</h3>
      <h4>{{ formatedCurrency(info.bill) }}</h4>
    </div>

    <Loader v-if="loading" />
    <p class="center" v-else-if="!categories.length">
      No categories yet.
      <router-link to="/categories"> Add a new category </router-link>
    </p>

    <section v-else>
      <div v-for="cat of categories" :key="cat.id">
        <p>
          <strong>{{ cat.title }}:</strong>
          {{ formatedCurrency(cat.spend) }} из {{ formatedCurrency(cat.limit) }}
        </p>
        <div class="progress" v-tooltip="cat.tooltip">
          <div class="determinate" :class="[cat.progressColor]" :style="{ width: cat.progressPersent + '%' }"></div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "planning",
  data: () => ({
    loading: true,
    categories: [],
  }),
  computed: {
    ...mapGetters(["info"]),
  },
  async mounted() {
    const records = await this.$store.dispatch("fetchRecords");
    const categories = await this.$store.dispatch("fetchCategories");
    this.categories = categories.map((cat) => {
      let spend;
      if (records != null) {
        spend = records
          .filter((r) => r.categoryId === cat.id)
          .filter((r) => r.type === "outcome")
          .reduce((total, record) => {
            return (total += +record.amount);
          }, 0);
      } else {
        spend = 0;
      }
      const persent = (100 * spend) / cat.limit;
      const progressPersent = persent > 100 ? 100 : persent;
      const progressColor = persent < 60 ? "green" : persent < 100 ? "yellow" : "red";
      const tooltipValue = cat.limit - spend;
      const tooltip = `${tooltipValue < 0 ? "Exceeding" : "Left"} ${this.formatedCurrency(Math.abs(tooltipValue))}`;
      return {
        ...cat,
        progressPersent,
        progressColor,
        spend,
        tooltip,
      };
    });
    this.loading = false;
  },
  methods: {
    formatedCurrency(cur) {
      return new Intl.NumberFormat("ru-RU", {
        style: "currency",
        currency: "UAH",
      }).format(cur);
    },
  },
};
</script>
