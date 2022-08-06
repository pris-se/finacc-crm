<template>
  <form class="card auth-card" @submit.prevent="submitHandler">
    <div class="card-content">
      <span class="card-title">Financial accounting CRM</span>
      <div class="input-field">
        <input id="email" type="text" v-model.trim="v$.email.$model" :class="{ invalid: v$.email.$error }" />
        <label for="email">Email</label>
        <small class="helper-text invalid" v-if="v$.email.$dirty && !v$.email.required.$response">Email field must not be empty</small>
        <small class="helper-text invalid" v-else-if="v$.email.$dirty && !v$.email.email.$response">Enter E-mail</small>
      </div>
      <div class="input-field">
        <input id="password" type="password" v-model.trim="v$.password.$model" :class="{ invalid: v$.password.$error }" />
        <label for="password">Password</label>
        <small class="helper-text invalid" v-if="v$.password.$dirty && !v$.password.required.$response">Enter password</small>
        <small class="helper-text invalid" v-else-if="v$.password.$dirty && !v$.password.minLength.$response"
          >Password must be at least {{ v$.password.minLength.$params.min }} characters. Now {{ password.length }}</small
        >
      </div>
      <div class="input-field">
        <input id="name" type="text" v-model.trim="v$.name.$model" :class="{ invalid: v$.name.$error }" />
        <label for="name">Name</label>
        <small class="helper-text invalid" v-if="v$.name.$dirty && !v$.name.required.$response">Enter your name</small>
      </div>
      <p>
        <label>
          <input type="checkbox" v-model="agree" />
          <span>I agree with the rules</span>
        </label>
      </p>
    </div>
    <div class="card-action">
      <div>
        <button class="btn waves-effect waves-light auth-submit" type="submit">
          Register
          <i class="material-icons right">send</i>
        </button>
      </div>

      <p class="center">
        Already have an account?
        <router-link to="/login">Sign in!</router-link>
      </p>
    </div>
  </form>
</template>

<script>
import useVuelidate from "@vuelidate/core";
import { required, email, minLength } from "@vuelidate/validators";
export default {
  setup() {
    return { v$: useVuelidate() };
  },
  name: "register",
  data() {
    return {
      email: "",
      password: "",
      name: "",
      agree: false,
    };
  },
  validations: () => ({
    email: { email, required },
    password: { required, minLength: minLength(6) },
    name: { required },
    agree: { checked: (v) => v },
  }),
  name: "login",
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
        name: this.name,
      };
      try {
        await this.$store.dispatch("register", formData);
        this.$router.push("/");
      } catch (e) {}
    },
  },
};
</script>
