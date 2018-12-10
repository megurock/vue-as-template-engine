<template lang="pug">
p.hello-world {{ msg }}
</template>

<script lang="ts">
export default {
  props: {
    msg: { type: String, default: 'Hello, World!' }
  }
}
</script>

<style lang="scss">
.hello-world { color: #42b983; }
</style>
