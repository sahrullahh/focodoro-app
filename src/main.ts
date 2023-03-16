import { createApp } from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import { createHead } from "@vueuse/head";
import "./assets/tailwind.css";
createApp(App).use(createHead()).use(store).use(router).mount("#app");
