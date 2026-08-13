import { defineStore } from "pinia";
import { ref } from "vue";

export const store = defineStore('store', () => {
  let x = ref(1)
  return {x}
})