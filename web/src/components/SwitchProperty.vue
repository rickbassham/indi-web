<template>
  <v-card class="pa-1 ma-4" dense elevation="4">
    <v-card-title>{{ prop.label }}</v-card-title>
    <v-card-subtitle>{{ prop.state }}</v-card-subtitle>
    <v-card-text v-if="prop.propType == 'switch'">
      <template v-if="prop.rule == 'AtMostOne' || prop.rule == 'OneOfMany'">
        <v-btn
          v-for="s in prop.switches"
          :key="s.name"
          class="mr-2"
          :outlined="s.value == 'On'"
          v-on:click="switchButtonClicked(s.name, s.value)"
          >{{ s.label }}</v-btn
        >
      </template>
      <template v-if="prop.rule == 'AnyOfMany'">
        <v-layout row wrap>
          <v-flex v-for="s in prop.switches" :key="s.name" shrink>
            <v-checkbox
              dense
              class="flex mr-2"
              :label="s.label"
              :input-value="s.value"
              true-value="On"
              false-value="Off"
              v-on:click="switchButtonClicked(s.name, s.value)"
            ></v-checkbox>
          </v-flex>
        </v-layout>
      </template>
    </v-card-text>
  </v-card>
</template>
<script>
import { mapActions } from "vuex";
import { newSwitchVector, oneSwitch } from "indi-client";

export default {
  props: {
    device: String,
    prop: Object,
  },
  methods: {
    switchButtonClicked: function (item, value) {
      const data = new newSwitchVector(this.device, this.prop.name, null, [
        new oneSwitch(item, value == "Off" ? "On" : "Off"),
      ]);

      this.sendCommand({ type: "newSwitchVector", data });
    },
    ...mapActions("indi", ["sendCommand"]),
  },
};
</script>
