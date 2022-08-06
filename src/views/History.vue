<template>
  <div>
    <div class="page-title">
      <h3>Recording history</h3>
    </div>

    <div class="history-chart">
      <canvas id="myChart"></canvas>
    </div>
    <Loader v-if="loading" />
    <p v-else-if="!records.length" class="center white-text">
      No entries yet.
      <router-link to="/record">Add a new entry.</router-link>
    </p>
    <section v-else>
      <HistoryTable :records="items" />
      <Paginate
        v-model="page"
        :page-count="pageCount"
        :click-handler="pageChangeHandler"
        :prev-text="'Back'"
        :prev-class="'waves-effect'"
        :next-class="'waves-effect'"
        :next-text="'Forward'"
        :container-class="'pagination'"
        :page-class="'waves-effect'"
      />
    </section>
  </div>
</template>

<script>
import paginationMixin from "@/mixins/pagination.mixin.js";
import HistoryTable from "@/components/HistoryTable.vue";
import Paginate from "vuejs-paginate-next";
import { Pie } from "vue-chartjs";
import Chart from "chart.js/auto";
export default {
  name: "history",
  extends: Pie,
  mixins: [paginationMixin],
  data() {
    return {
      loading: true,
      records: [],
    };
  },
  async mounted() {
    this.records = await this.$store.dispatch("fetchRecords");
    const categories = await this.$store.dispatch("fetchCategories");
    this.setup(categories);
    this.loading = false;
  },
  methods: {
    setup(categories) {
      this.setupPaginations(
        this.records.map((record) => {
          return {
            ...record,
            categoryName: categories.find((c) => c.id === record.categoryId).title,
            typeClass: record.type === "income" ? "green" : "red",
            typeText: record.type === "income" ? "Income" : "Outcome",
          };
        })
      );
      const data = {
        labels: categories.map((c) => c.title),
        datasets: [
          {
            label: "Costs by category",
            data: categories.map((c) => {
              return this.records.reduce((total, r) => {
                if (r.categoryId === c.id && r.type === "outcome") {
                  total += +r.amount;
                }
                return total;
              }, 0);
            }),
            backgroundColor: ["rgb(255, 99, 132)", "rgb(75, 192, 192)", "rgb(255, 205, 86)", "rgb(201, 203, 207)", "rgb(54, 162, 235)"],
            hoverOffset: 4,
          },
        ],
      };
      const chartData = {
        type: "pie",
        data: data,
      };
      const myChart = new Chart(document.getElementById("myChart"), chartData);
    },
  },
  components: {
    HistoryTable,
    Paginate,
  },
};
</script>
