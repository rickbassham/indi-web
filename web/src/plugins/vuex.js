import Vue from 'vue'
import Vuex from 'vuex'

import indiStore from '@/plugins/stores/indi'

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    indi: indiStore
  },
  state: {
    socket: {
      connected: false,
      error: null,
      reconnectCount: 0,
    },
  },
  mutations: {
    SOCKET_ONOPEN(state, event) {
      Vue.prototype.$socket = event.currentTarget
      state.socket.isConnected = true
      this.dispatch("indi/subscribe");
    },
    SOCKET_ONCLOSE(state) {
      state.socket.isConnected = false
    },
    SOCKET_ONERROR(state, event) {
      state.socket.error = event;
    },
    // default handler called for all methods
    SOCKET_ONMESSAGE(state, message) {
      // turn this into a dumb object
      message = JSON.parse(JSON.stringify(message));
      state.socket.message = message

      this.commit(`indi/${message.type}`, message.payload);
    },
    // mutations for reconnect methods
    SOCKET_RECONNECT(state, count) {
      state.socket.reconnectCount = count;
      state.socket.isConnected = true
      this.dispatch("indi/subscribe");
    },
    SOCKET_RECONNECT_ERROR(state) {
      state.socket.reconnectError = true;
    },
  },
});
