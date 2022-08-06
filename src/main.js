import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./registerServiceWorker";
import "materialize-css/dist/js/materialize.min";
import messagePlugin from "@/utils/message.plagin";
import Loader from "@/components/app/Loader";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import tooltipDirective from "@/directives/tooltip.directive";

const firebase = initializeApp({
  apiKey: "AIzaSyAyhpK6gmAhsL0gPImS5GgcpqmbwaV5648",
  authDomain: "finacc-crm.firebaseapp.com",
  projectId: "finacc-crm",
  storageBucket: "finacc-crm.appspot.com",
  messagingSenderId: "511664017097",
  appId: "1:511664017097:web:5735ca69fed279a8abc718",
  measurementId: "G-R4FJFFZGN8",
  databaseURL: "https://finacc-crm-default-rtdb.europe-west1.firebasedatabase.app",
});
const auth = getAuth(firebase);
getDatabase(firebase);

const app = createApp(App);
app.use(messagePlugin).directive("tooltip", tooltipDirective).component("Loader", Loader);
let appMounted;

auth.onAuthStateChanged(() => {
  if (!appMounted) {
    appMounted = app.use(store).use(router).mount("#app");
  }
});
