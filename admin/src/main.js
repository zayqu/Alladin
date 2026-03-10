import "./assets/main.css";

import { createApp } from "vue";
import { createPinia } from "pinia";
import "vue-toastification/dist/index.css";
import Toast from "vue-toastification";
import App from "./App.vue";
import router from "./router";
import piniaPluginPersistedState from "pinia-plugin-persistedstate";

const pinia = createPinia();
pinia.use(piniaPluginPersistedState);

const app = createApp(App);
app.use(pinia);
app.use(router);
app.use(Toast);
app.mount("#app");
