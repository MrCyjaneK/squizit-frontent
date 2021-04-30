import { createApp } from "vue";
import App from "./App.vue";
import Router from "./router";

import "virtual:windi.css";
import "./assets/global.css";

createApp(App).use(Router).mount("#app");
