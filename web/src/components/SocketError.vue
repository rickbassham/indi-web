<template>
  <div>
    {{ formattedError }}
  </div>
</template>
<script>
export default {
  props: {
    error: Object,
  },
  computed: {
    formattedError: function () {
      if (!this.error) {
        return "";
      }

      switch (this.error.code) {
        case "ECONNREFUSED":
          return `Connection refused: ${this.error.address}:${this.error.port}`;
      }

      return JSON.stringify(this.error);
    },
  },
};
</script>
