<template>
  <TextProperty v-if="prop.propType == 'text'" v-bind:device="device" v-bind:prop="prop" />
  <NumberProperty v-else-if="prop.propType == 'number'" v-bind:device="device" v-bind:prop="prop" />
  <SwitchProperty v-else-if="prop.propType == 'switch'" v-bind:device="device" v-bind:prop="prop" />
  <BlobProperty v-else-if="prop.propType == 'blob'" v-bind:device="device" v-bind:prop="prop" />
  <LightProperty v-else-if="prop.propType == 'light'" v-bind:device="device" v-bind:prop="prop" />
  <div v-else>
    UNKNOWN PROPERTY TYPE - {{JSON.stringify(prop)}}
  </div>
</template>
<script>
import TextProperty from './TextProperty'
import SwitchProperty from './SwitchProperty'
import NumberProperty from './NumberProperty'
import BlobProperty from './BlobProperty'
import LightProperty from './LightProperty'

export default {
  components: {
    TextProperty,
    SwitchProperty,
    NumberProperty,
    BlobProperty,
    LightProperty,
  },
  props: {
    device: String,
    prop: Object,
  },
}
</script>
