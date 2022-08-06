<template>
  <table class="grey lighten-5">
    <thead>
      <tr>
        <th>#</th>
        <th>Amount</th>
        <th>Date</th>
        <th>Category</th>
        <th>Type</th>
        <th>Open</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(rec, idx) of records" :key="rec.id">
        <td>{{ idx + 1 }}</td>
        <td>{{ formatedCurrency(rec.amount) }}</td>
        <td>{{ dateFilter(rec.date) }}</td>
        <td>{{ rec.categoryName }}</td>
        <td>
          <span class="white-text badge" :class="rec.typeClass">{{ rec.typeText }}</span>
        </td>
        <td>
          <button class="btn-small btn" @click="$router.push('/detail/' + rec.id)" v-tooltip="'Посмотреть запись'" data-position="top">
            <i class="material-icons">open_in_new</i>
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  props: {
    records: {
      required: true,
      type: Array,
    },
  },
  data: () => ({
    type: "datetime",
  }),
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
