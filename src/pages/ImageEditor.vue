<script setup lang="ts">
import { ChromePicker } from 'vue-color'
import { ref } from 'vue'

const colorObj = ref({
  hex: '#000000',
  rgba: { r: 0, g: 0, b: 0, a: 1 },
})
</script>

<template>
  <div>
    <ChromePicker v-model="colorObj" />
  </div>
</template>

<style scoped></style>
