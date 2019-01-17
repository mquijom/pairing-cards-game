import Vue from "vue";
import Vuetify from "vuetify";
import 'vuetify/dist/vuetify.min.css'
// import "vuetify/src/stylus/app.styl";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./registerServiceWorker";
import "roboto-fontface/css/roboto/roboto-fontface.css";
import "material-design-icons-iconfont/dist/material-design-icons.css";
import axios from "axios";

Vue.use(Vuetify);

const instance = axios.create({
  baseURL: "https://ccci-cards.herokuapp.com"
  // baseURL: "http://localhost:3000"
});

Vue.prototype.$http = instance;

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");