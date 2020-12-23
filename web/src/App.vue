<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <v-toolbar-title>INDI Control Panel</v-toolbar-title>
      <v-spacer></v-spacer>
    </v-app-bar>

    <v-main>
      <v-tabs v-model="tab" center-active grow>
        <v-tab v-for="(device, name) in devices" :key="name">{{name}}</v-tab>
      </v-tabs>
      <v-tabs-items v-model="tab">
        <v-tab-item v-for="(device, name) in devices" :key="name">
          <INDIDevice v-bind:device="device" />
        </v-tab-item>
      </v-tabs-items>
    </v-main>
  </v-app>
</template>

<script>
import { mapState } from 'vuex'

import INDIDevice from './components/INDIDevice.vue'

export default {
  name: 'App',
  components: {
    INDIDevice
  },
  computed: {
    ...mapState('indi', {
      devices: state => state.devices,
    }),
    ...mapState({
      stompError: state => state.stomp.error,
      connected: state => state.stomp.connected,
      updated: state => (state.updated) ? state.updated.deeper.ts : "NONE",
    })
  },
  data() {
    return {
      tab: 0,
    }
  },
}
</script>

<style>
.v-tab.v-tab--active {
  background-color: rgba(255, 255, 255, 0.1);
}
.v-text-field.v-text-field--solo .v-input__slot {
  background-color: rgba(255, 255, 255, 0.1) !important;
}
</style>