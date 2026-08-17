<script setup lang="ts">
import { computed, ref } from 'vue'
import { images } from '@/static/images/mapTable.ts'


//死数据
const stillDatas = [
    {
      width: 3000,
      height: 250,
      src: images['bg.png'],
      x: 0,
      b: 4,
    },
    {
      width: 1800,
      height: 165,
      src: images['girl1.png'],
      x: 0,
      b: 0,
    },
    {
      width: 3000,
      height: 250,
      src: images['grassland.png'],
      x: 0,
      b: 1,
    },
    {
      width: 1800,
      height: 160,
      src: images['mushroom.png'],
      x: 0,
      b: 4,
    },
    {
      width: 1800,
      height: 160,
      src: images['spirit.png'],
      x: 0,
      b: 5,
    },
    {
      width: 1950,
      height: 178,
      src: images['leaf.png'],
      x: 0,
      b: 6,
    },
]
//响应式数据
let imgDatas = ref([
  {
    width: 3000,
    height: 250,
    src: images['bg.png'],
    x: 0,
    b: 4,
  },
  {
    width: 1800,
    height: 165,
    src: images['girl1.png'],
    x: 0,
    b: 0,
  },
  {
    width: 3000,
    height: 250,
    src: images['grassland.png'],
    x: 0,
    b: 1,
  },
  {
    width: 1800,
    height: 160,
    src: images['mushroom.png'],
    x: 0,
    b: 4,
  },
  {
    width: 1800,
    height: 160,
    src: images['spirit.png'],
    x: 0,
    b: 5,
  },
  {
    width: 1950,
    height: 178,
    src: images['leaf.png'],
    x: 0,
    b: 6,
  },
])
//鼠标移入时的x
let initX = ref(200)
//实时x
let realTimeX = ref(50)
//模糊度因数
const step = document.documentElement.clientWidth/2/5
//模糊度
let realTimeBlur = computed(() => {
  return (initX.value - realTimeX.value)/step
})
//位移量
let addX = computed(() => {
  return (initX.value - realTimeX.value)/step
})
//是否过度
let isGuodu = ref(false)


//初始化数据
function init() {
  imgDatas.value = stillDatas.map(item => {
    // console.log({...item})
    return {...item}
  })
  // console.log(imgDatas.value)
}
//鼠标离开
function leaveMemory() {
  isGuodu.value = true
  init()
}
//鼠标移入
function enterMemory(e: MouseEvent) {
  isGuodu.value = false
  // console.log(e)
  initX.value = e.clientX
}
function touchStart(e: TouchEvent) {
  const touch = e.touches[0]!
   isGuodu.value = false
  // console.log(e)
  initX.value = touch.clientX
}
//鼠标内部移动
function change(e: MouseEvent) {
  realTimeX.value = e.clientX
  xiugai()
}
function touchChange(e:TouchEvent) {
  const touch = e.touches[0]!
  realTimeX.value = touch.clientX
  xiugai()
}
function xiugai() {
  imgDatas.value = imgDatas.value.map((value, index) => {
    //位移因数
    const factor = (6 - index)*10
    let newValue = {...value}
    //更改数据
    newValue.x = 0-addX.value *200/ factor
    newValue.b = Math.abs(stillDatas[index]!.b + realTimeBlur.value)
    return newValue
  })
}

//眨眼睛
let timeout = 0
let blinkCount = 4
function blink() {
  if (blinkCount === 4) {
    blinkCount = 1
    timeout = 4000
    imgDatas.value[1]!.src = images[`girl${blinkCount}.png`]
  } else {
    blinkCount++
    timeout = 35
    imgDatas.value[1]!.src = images[`girl${blinkCount}.png`]
  }
  setTimeout(() => {
    blink()
  }, timeout);
}
blink()
</script>


<template>
  <div class="banner" 
  @mouseenter="enterMemory($event)" 
  @mouseleave="leaveMemory()" 
  @mousemove="change($event)"
  @touchstart="touchStart($event)"
  @touchend="leaveMemory()"
  @touchmove.prevent="touchChange($event)"
  >
    <div class="image" v-for="(imgData, index) in imgDatas" :key="index">
      <img
      :class="{guodu:isGuodu}"
        :width="imgData.width"
        :height="imgData.height"
        :src="imgData.src"
        :style="{ transform: `translateX(${imgData.x}px)`, filter: `blur(${imgData.b}px)` }"
      />
    </div>
  </div>
</template>


<style scoped>
.banner {
  position: relative;
  width: 100vw;
  height: 155px;
  overflow: hidden;
  background-color: #00b894;
  touch-action: none;
}

.image {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.guodu{
  transition: 0.2s linear;
}

@media (max-width:576px) {
  .banner {
  position: relative;
  width: 100vw;
  height: 20vw;
  overflow: hidden;
  background-color: #00b894;
  }
  .image img{
    scale: 0.5;
  }
}
</style>
