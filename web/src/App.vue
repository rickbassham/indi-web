<template>
  <v-app>
    <v-app-bar app>
      <v-toolbar-title>INDI Control Panel</v-toolbar-title>
      <v-spacer></v-spacer>
    </v-app-bar>
    <v-main>
      <v-card
        v-if="status !== 'connected'"
        class="pa-1 ma-4"
        dense
        elevation="4"
      >
        <v-card-title>{{ status }}</v-card-title>
        <v-card-text><SocketError v-bind:error="error" /></v-card-text>
      </v-card>
      <template v-else>
        <v-tabs v-model="tab" center-active grow>
          <v-tab v-for="(device, name) in devices" :key="name">{{
            name
          }}</v-tab>
        </v-tabs>
        <v-tabs-items v-model="tab">
          <v-tab-item v-for="(device, name) in devices" :key="name">
            <INDIDevice v-bind:device="device" />
          </v-tab-item>
        </v-tabs-items>
      </template>
    </v-main>
  </v-app>
</template>

<script>
import { mapState } from "vuex";

import INDIDevice from "./components/INDIDevice.vue";
import SocketError from "./components/SocketError.vue";

export default {
  name: "App",
  components: {
    INDIDevice,
    SocketError,
  },
  computed: {
    ...mapState("indi", {
      devices: (state) => state.devices,
      status: (state) => state.status,
      error: (state) => state.error,
    }),
  },
  data() {
    return {
      tab: 0,
    };
  },
};
</script>

<style>
.v-tab.v-tab--active {
  background-color: rgba(255, 255, 255, 0.1);
}
.v-text-field.v-text-field--solo .v-input__slot {
  background-color: rgba(255, 255, 255, 0.1) !important;
}
</style>
