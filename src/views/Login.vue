<template>
  <form class="card auth-card" @submit.prevent="submitHandler">
    <div class="card-content">
      <span class="card-title">Financial accounting CRM</span>
      <div class="input-field">
        <input id="email" type="text" v-model.trim="v$.email.$model" :class="{ invalid: v$.email.$error }" />
        <label for="email">Email</label>
        <small class="helper-text invalid" v-if="v$.email.$dirty && !v$.email.required.$response"> Email field must not be empty </small>
        <small class="helper-text invalid" v-else-if="v$.email.$dirty && !v$.email.email.$response"> Enter E-mail </small>
      </div>
      <div class="input-field">
        <input id="password" type="password" v-model.trim="v$.password.$model" :class="{ invalid: v$.password.$error }" />
        <label for="password">Password</label>
        <small class="helper-text invalid" v-if="v$.password.$dirty && !v$.password.required.$response"> Enter password </small>
        <small class="helper-text invalid" v-else-if="v$.password.$dirty && !v$.password.minLength.$response">
          Password must be at least {{ v$.password.minLength.$params.min }} characters. Now {{ password.length }}
        </small>
      </div>
    </div>
    <div class="card-action">
      <div>
        <button class="btn waves-effect waves-light auth-submit" type="submit">
          Sign in
          <i class="material-icons right">send</i>
        </button>
      </div>

      <p class="center">
        Don't have an account?
        <router-link to="/register">Register</router-link>
      </p>
    </div>
  </form>
</template>

<script>
import useVuelidate from "@vuelidate/core";
import { required, email, minLength } from "@vuelidate/validators";
import messages from "@/utils/messages";
export default {
  setup() {
    return { v$: useVuelidate() };
  },
  name: "login",
  data() {
    return {
      email: "",
      password: "",
    };
  },
  validations: () => ({
    email: { email, required },
    password: { required, minLength: minLength(6) },
  }),
  mounted() {
    if (messages[this.$route.query.message]) {
      this.$message(messages[this.$route.query.message]);
    }
  },
  methods: {
    async submitHandler() {
      const result = await this.v$.$validate();
      if (!result) {
        this.v$.$touch();
        return;
      }
      const formData = {
        email: this.email,
        password: this.password,
      };
      try {
        await this.$store.dispatch("login", formData);
        this.$router.push("/");
      } catch (e) {}
    },
  },
};
</script>
