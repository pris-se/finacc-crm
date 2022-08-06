<template>
  <div class="col s12 m6 l8">
    <div class="card light-green lighten-2 bill-card">
      <div class="card-content white-text">
        <div class="card-header">
          <span class="card-title">Exchange Rates</span>
        </div>
        <table>
          <thead>
            <tr>
              <th>Currency</th>
              <th>Course</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="cur of currencies" :key="cur">
              <td>{{ cur }}</td>
              <td>{{ rates[cur].toFixed(5) }}</td>
              <td>{{ dateFilter(date) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["rates", "date"],
  data: () => ({
    currencies: ["UAH", "USD", "EUR"],
    type: "datetime",
  }),
  methods: {
    dateFilter(date) {
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
      return new Intl.DateTimeFormat("ru-Ru", options).format(new Date(date));
    },
  },
};
</script>
