<template>
  <v-card class="pa-1 ma-4" dense elevation="4">
    <v-card-title>{{ prop.label }}</v-card-title>
    <v-card-subtitle>{{ prop.state }}</v-card-subtitle>
    <v-card-text>
      <!-- TODO: if name === "TIME_UTC" use a date/time picker -->
      <v-row v-for="text in prop.texts" :key="text.name" no-gutters>
        <v-col cols="12" sm="4" class="pl-1 pr-1">
          <label class="text-h6">{{ text.label }}</label>
        </v-col>
        <v-col cols="12" sm="4" class="pl-1 pr-1">
          <v-text-field
            dense
            outlined
            :value="text.value"
            readonly
            tabindex="-1"
          />
        </v-col>
        <v-col cols="12" sm="4" class="pl-1 pr-1" v-if="prop.perm == 'rw'">
          <v-text-field dense v-model="pendingValues[text.name]" solo />
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions v-if="prop.perm == 'rw'">
      <v-btn block v-on:click="setButtonClicked">Set</v-btn>
    </v-card-actions>
  </v-card>
</template>
<script>
import { mapActions } from "vuex";
import { newTextVector, oneText } from "indi-client";

export default {
  data() {
    return {
      pendingValues: {},
    };
  },
  props: {
    device: String,
    prop: Object,
  },
  mounted: function() {
    this.prop.texts.forEach((item) => {
      if (this.pendingValues[item.name] === undefined) {
        console.log([item])
        this.pendingValues[item.name] = item.value;
      }
    });
  },
  updated: function () {
    this.prop.texts.forEach((item) => {
      if (this.pendingValues[item.name] === undefined) {
        console.log([item])
        this.pendingValues[item.name] = item.value;
      }
    });
  },
  methods: {
    setButtonClicked: function () {
      const payload = {
        type: "newTextVector",
        data: new newTextVector(
          this.device,
          this.prop.name,
          null,
          this.prop.texts.map((item) => {
            return new oneText(item.name, this.pendingValues[item.name] || "");
          })
        ),
      };

      this.sendCommand(payload);
    },
    ...mapActions("indi", ["sendCommand"]),
  },
};
</script>
