import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Login from './views/Login.vue'
import MatchCard from './views/MatchCard.vue'
import store from "./store";

Vue.use(Router)

export default new Router({
  routes: [{
      path: '/login',
      name: 'login',
      component: Login,
      beforeEnter: (to, from, next) => {
        if (store.state.user) {
          next("/");
        } else {
          next();
        }
      }
    },
    {
      path: '/',
      name: 'home',
      component: Home,
      beforeEnter: (to, from, next) => {
        if (!store.state.user) {
          next("/login");
        } else {
          next();
        }
      }
    },
    {
      path: '/match',
      name: 'Match Cards',
      component: MatchCard,
      beforeEnter: (to, from, next) => {
        if (!store.state.user) {
          next("/login");
        } else {
          next();
        }
      }
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import( /* webpackChunkName: "about" */ './views/About.vue')
    }
  ]
})