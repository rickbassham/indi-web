<template>
  <v-card class="pa-1 ma-4" dense elevation="4">
    <v-card-title>{{ prop.label }}</v-card-title>
    <v-card-subtitle>{{ prop.state }}</v-card-subtitle>
    <v-card-text>
      <v-row v-for="number in prop.numbers" :key="number.name" no-gutters>
        <v-col cols="12" sm="4" class="pl-1 pr-1">
          <label>{{ number.label }}</label>
        </v-col>
        <v-col cols="12" sm="4" class="pl-1 pr-1">
          <v-text-field
            dense
            outlined
            :value="number.formatted"
            readonly
            tabindex="-1"
          />
        </v-col>
        <template
          v-if="showSlider(number)"
        >
          <v-col cols="12" sm="2" class="pl-1 pr-1" v-if="prop.perm == 'rw'">
            <v-slider
              dense
              v-model="sliderValues[number.name]"
              thumb-label
              :max="number.max"
              :min="number.min"
              :step="number.step"
              v-on:input="sliderChanged(number.name, $event)"
              :initial-value="number.formatted"
            ></v-slider>
          </v-col>
          <v-col cols="12" sm="2" class="pl-1 pr-1" v-if="prop.perm == 'rw'">
            <v-text-field
              dense
              v-model="pendingValues[number.name]"
              type="number"
              :max="number.max"
              :min="number.min"
              :step="number.step"
              v-on:input="numberChanged(number.name, $event)"
              :initial-value="number.formatted"
            />
          </v-col>
        </template>
        <template v-else>
          <v-col cols="12" sm="4" class="pl-1 pr-1" v-if="prop.perm == 'rw'">
            <v-text-field
              dense
              v-model="pendingValues[number.name]"
              :type="numberType(number.format)"
              :max="number.max"
              :min="number.min"
              :step="number.step || undefined"
              :initial-value="number.formatted"
              solo
            />
          </v-col>
        </template>
      </v-row>
    </v-card-text>
    <v-card-actions v-if="prop.perm == 'rw'">
      <v-btn block v-on:click="setButtonClicked">Set</v-btn>
    </v-card-actions>
  </v-card>
</template>
<script>
import { mapActions } from "vuex";
import { newNumberVector, oneNumber } from "indi-client";

export default {
  data() {
    return {
      pendingValues: {},
      sliderValues: {},
    };
  },
  props: {
    device: String,
    prop: Object,
  },
  methods: {
    numberType: function (format) {
      return /%(\d+)\.(\d+)m/.test(format) ? undefined : "number";
    },
    showSlider: function(number) {
      return false && number.step && (number.max - number.min) / number.step <= 100;
    },
    sliderChanged: function (item, value) {
      this.pendingValues[item] = value;
    },
    numberChanged: function (item, value) {
      this.sliderValues[item] = value;
    },
    setButtonClicked: function () {
      let payload = {
        type: "newNumberVector",
        data: new newNumberVector(
          this.device,
          this.prop.name,
          null,
          this.prop.numbers
            .filter((item) => this.pendingValues[item.name] !== undefined && this.pendingValues[item.name] !== "")
            .map((item) => {
              return new oneNumber(item.name, this.pendingValues[item.name]);
            })
        ),
      };

      if (payload.data.numbers.length === 0) {
        payload = null;
      }

      if (payload) {
        this.sendCommand(payload);
      }
    },
    ...mapActions("indi", ["sendCommand"]),
  },
};
</script>
