import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";

import "vfonts/Lato.css"; // General Font
import "vfonts/FiraCode.css"; // Monospace Font

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount("#app");
