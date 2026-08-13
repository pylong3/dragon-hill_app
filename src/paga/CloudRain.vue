<template>
  <div class="container" :style="coord">
    <span style="color: white">雨量：</span>
    <input
      class="block"
      type="range"
      min="0"
      max="100"
      v-model="progress"
      step="1"
      @pointerup.stop
      @pointerdown.stop
    />
    <div
      class="cloud"
      @mousedown="isDown = true"
      @mouseup="isDown = false"
      @mousemove="cloudMove($event)"
    ></div>
  </div>
  <div class="rain" v-for="item in items" :key="item.id" :style="item.style"></div>
</template>

<script setup lang="ts">
import { reactive, onUnmounted, type CSSProperties, watch, ref, computed } from 'vue'
//定义接口
interface message {
  id: number
  style: CSSProperties
}

//移动云朵坐标
let leftCoord = ref(100)
let topCoord = ref(100)
let coord = computed<CSSProperties>(() => {
  return {
    left: leftCoord.value + 'px',
    top: topCoord.value + 'px',
  }
})
//移动云朵回调
let isDown = ref(false)
function cloudMove(e: MouseEvent) {
  if (isDown.value) {
    leftCoord.value += e.movementX
    topCoord.value += e.movementY
  }
}

//雨滴数据
let items = reactive<message[]>([])
let id = 1
//添加雨滴数据
function addRain() {
  const h = Math.floor(Math.random() * 30 + 5)
  const rain = {
    id: id++,
    style: {
      left: Math.floor(Math.random() * 270 + leftCoord.value + 20) + 'px',
      top: Math.floor(Math.random() * 100 + topCoord.value + 150) + 'px',
      height: h + 'px',
      width: (h / 7 >= 3 ? h / 7 : 3) + 'px',
    },
  }
  items.unshift(rain)
  setTimeout(() => {
    const index = items.findIndex((i) => i.id === rain.id)
    items.splice(index, 1)
  }, 1500)
}
//设置雨滴动作
let time = setInterval(() => {
  addRain()
}, 20)
//调整雨量
let progress = ref(50)
watch(progress, function (value) {
  clearInterval(time)
  if (value != 0) {
    time = setInterval(() => {
      addRain()
    }, 1000 / value)
  }
})
//取消定时器
onUnmounted(() => {
  clearInterval(time)
})
</script>

<style scoped>
.container {
  position: absolute;
  left: 100px;
  top: 100px;
  margin: 0 auto;
  width: 300px;
  height: 500px;
  /* border: 1px solid rgba(128, 128, 128, 0.5); */
}
.cloud {
  position: absolute;
  left: 50%;
  top: 150px;
  transform: translate(-50%, -50%);
  width: 300px;
  height: 100px;
  margin: 10px auto;
  background-color: white;
  border-radius: 50px;
  filter: drop-shadow(7px 7px 0 gray);
  animation: blinkCloud 2s steps(1) infinite;
  z-index: 1;
}
.cloud::before {
  content: '';
  position: absolute;
  left: 50px;
  top: -40px;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: white;
  animation: blinkCloud 2s steps(1) infinite;
}
.cloud::after {
  content: '';
  position: absolute;
  left: 110px;
  top: -70px;
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background-color: white;
  animation: blinkCloud 2s steps(1) infinite;
}
@keyframes blinkCloud {
  0% {
    background-color: rgb(40, 40, 45);
  }
  95% {
    background-color: white;
  }
}
.rain {
  position: absolute;
  left: 0px;
  top: 150px;
  width: 2px;
  height: 6px;
  background-color: rgb(70, 130, 180);
  animation: downRain 0.8s ease-in 1 forwards;
}
@keyframes downRain {
  0% {
    transform: translateY(0) scaleY(1) scaleX(1);
  }
  70% {
    transform: translateY(300px) scaleY(1) scaleX(1);
  }
  80% {
    transform: translateY(300px) scaleY(0.2) scaleX(1);
  }
  100% {
    transform: translateY(300px) scaleY(0) scaleX(15);
  }
}
.block {
  display: block;
  margin: 0 auto;
}
</style>
