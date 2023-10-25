import { createPinia } from "pinia";
import { createApp } from "vue";

import App from "./App.vue";
import router from "./router";

import "vfonts/FiraCode.css"; // Monospace Font
import "vfonts/Lato.css"; // General Font

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount("#app");
