<template>
  <div class="col s12 m6 l4">
    <div class="card light-green darken-1 bill-card">
      <div class="card-content white-text">
        <span class="card-title">Currency account</span>

        <p v-for="cur of currencies" :key="cur" class="currency-line">
          <span>{{ currencyFilter(cur) }}</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["rates"],
  data: () => ({
    currencies: ["UAH", "USD", "EUR"],
  }),
  computed: {
    base() {
      return this.$store.getters.info.bill;
    },
  },
  methods: {
    currencyFilter(currency) {
      const value = Math.floor(this.base * this.rates[currency]);
      return new Intl.NumberFormat("ru-RU", {
        style: "currency",
        currency,
      }).format(value);
    },
  },
};
</script>
