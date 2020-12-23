import Vue from 'vue'
import App from './App.vue'
import store from '@/plugins/vuex';
import vuetify from './plugins/vuetify';
import VueNativeSock from 'vue-native-websocket'

Vue.use(VueNativeSock, 'ws://' + window.location.hostname + ':8081/ws', {
  reconnection: true,
  store: store,
  format: 'json',
});

Vue.config.productionTip = false

new Vue({
  el: "#app",
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app');
