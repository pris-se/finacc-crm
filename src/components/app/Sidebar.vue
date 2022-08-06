<template>
  <ul class="sidenav app-sidenav" :class="{ open: modelValue }">
    <router-link v-for="link in links" :key="link.url" :to="link.url" custom v-slot="{ isExactActive, href, navigate }">
      <li :class="[isExactActive && 'active']">
        <a :href="href" @click="navigate" class="waves-effect waves-green pointer">{{ link.title }}</a>
      </li>
    </router-link>
  </ul>
</template>

<script>
export default {
  props: ["modelValue"],
  data: () => ({
    links: [
      { title: "Bill", url: "/" },
      { title: "History", url: "/history" },
      { title: "Planning", url: "/planning" },
      { title: "New entry", url: "/record" },
      { title: "Categories", url: "/categories" },
    ],
  }),
};
</script>
