<template>
  <div>
    <v-tabs v-model="tab" center-active grow>
      <v-tab v-for="group in groups" :key="group">
        {{ group }}
      </v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab">
      <v-tab-item v-for="group in groups" :key="group">
        <INDIProperty v-for="prop in properties[group]" :key="prop.name" v-bind:device="device.name" v-bind:prop="prop" />
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>
<script>
import { union } from "lodash";
import INDIProperty from './INDIProperty.vue'

export default {
  components: {
    INDIProperty
  },
  props: {
    device: Object,
  },
  computed: {
    groups: function () {
      return union(
        Object.values(this.device)
          .map((v) => v.group)
          .filter((g) => g)
      );
    },
    properties: function () {
      const grouped = {};
      Object.values(this.device).forEach((prop) => {
        if (!grouped[prop.group]) {
          grouped[prop.group] = [];
        }

        grouped[prop.group].push(prop);
      });

      return grouped;
    },
  },
  data() {
    return {
      tab: 0,
    };
  },
};
</script>
