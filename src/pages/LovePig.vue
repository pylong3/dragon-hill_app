<script setup lang="ts">

import { ref } from 'vue'
import { images } from '@/static/images/mapTable';

//#region爱心小猪
let isShowPig = ref(true)
function setShowPig() {
  isShowPig.value = !isShowPig.value
}
//#endregion

</script>


<template>
  <div>
    <img class="lovePig" :class="{isShowPig:isShowPig}" :src="images['lovePig.png']">
  </div>
</template>


<style scoped>
.lovePig{
  display: none;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);
  animation: huxi 2s linear infinite ;
}
.isShowPig{
  display: block;
}
@keyframes huxi {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.1;
  }
  100% {
    opacity: 1;
  }
}
</style>