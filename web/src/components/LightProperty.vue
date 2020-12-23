<template>
  <v-card class="pa-1 ma-4" dense elevation="4">
    <v-card-title>{{ prop.label }}</v-card-title>
    <v-card-subtitle>{{ prop.state }}</v-card-subtitle>
    <v-card-text>
      <!-- TODO: if name === "TIME_UTC" use a date/time picker -->
      <v-row v-for="light in prop.lights" :key="light.name" no-gutters>
        <v-col cols="12" sm="4" class="pl-1 pr-1">
          <label>{{ light.label }}</label>
        </v-col>
        <v-col cols="12" sm="4" class="pl-1 pr-1">
          <v-text-field
            dense
            outlined
            :value="light.value"
            readonly
            tabindex="-1"
          />
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>
<script>
export default {
  props: {
    device: String,
    prop: Object,
  },
};
</script>
