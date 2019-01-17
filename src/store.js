import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: ""
  },
  mutations: {
    LOGIN: function (state, payload) {
      state.user = payload
    },
    LOGOUT: function (state) {
      state.user = ""
    }
  },
  actions: {

  }
})