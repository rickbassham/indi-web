<template>
  <v-card class="pa-1 ma-4" dense elevation="4">
    <v-card-title>{{ prop.label }}</v-card-title>
    <v-card-subtitle>{{ prop.state }}</v-card-subtitle>
    <v-card-text>
      <v-row v-for="blob in prop.blobs" :key="blob.name" no-gutters>
        <v-col cols="12" sm="4" class="pl-1 pr-1">
          <label>{{ blob.label }}</label>
        </v-col>
        <v-col cols="12" sm="4" class="pl-1 pr-1">
          INDI DATA STREAM
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions v-if="prop.perm == 'rw'">
      <v-btn block>Set</v-btn>
    </v-card-actions>
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
