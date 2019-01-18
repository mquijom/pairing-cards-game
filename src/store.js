import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: null
  },
  mutations: {
    LOGIN: function (state, payload) {
      state.user = {
        id: payload._id,
        name: payload.name
      }
    },
    LOGOUT: function (state) {
      state.user = null
    }
  },
  actions: {

  }
})