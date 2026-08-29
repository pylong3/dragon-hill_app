<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { images } from '@/static/images/mapTable'

//设置画布像素和大小
let canvasSize = ref({ width: 1080, height: 1920 })
let canvasStyle = ref({
  width: '75vw',
  'aspect-ratio': '1080/1920',
})
//画布相对于屏幕缩放比例
let PXRatio = ref(1080 / (window.innerWidth * 0.75))
//判断设备改变画布大小
if (window.innerWidth >= 768) {
  canvasSize.value.width = 1920
  canvasSize.value.height = 1080
  canvasStyle.value['aspect-ratio'] = '1920/1080'
  PXRatio.value = 1920 / (window.innerWidth * 0.75)
  window.addEventListener('resize', () => {
    PXRatio.value = 1920 / (window.innerWidth * 0.75)
  })
}
//拿到canvas上下文
const huabu = ref<HTMLCanvasElement | null>()
let penci: CanvasRenderingContext2D | null
onMounted(() => {
  penci = huabu.value!.getContext('2d')
})
//画画的三个回调
let isDraw = false
//下笔
function penciDown(e: PointerEvent) {
  console.log(e)
  isDraw = true
  penci?.beginPath()
  penci!.lineWidth = penciSize.value
  penci!.lineCap = 'round'
  penci!.lineJoin = 'round'
  penci?.moveTo(e.offsetX * PXRatio.value, e.offsetY * PXRatio.value)
}
//运笔
function penciMove(e: PointerEvent) {
  e.preventDefault()
  if (isDraw) {
    penci?.lineTo(e.offsetX * PXRatio.value, e.offsetY * PXRatio.value)
    penci!.strokeStyle = penciColor.value
    penci?.stroke()
  }
}
//抬笔
function penciUp(e: PointerEvent) {
  isDraw = false
}
//笔尖颜色
let penciColorList = ref([
  'white',
  'black',
  'gray',
  'red',
  '#e8a30f',
  'yellow',
  'green',
  'blue',
  '#620de8',
  '#900de8',
])
let penciColor = ref('')
//笔尖大小
let sizeParam = ref(30)
let penciSize = computed(() => sizeParam.value / 2)
//菜单栏数据
const value = ref(['1'])
</script>

<template>
  <div
    class="background"
    :style="{
      background: `url(${images['huabuBackground.jpg']}) center/cover`,
      position: 'relative',
    }"
    ref="beijin"
  >
    <var-menu class="shezhi">
      <var-button type="primary">设置</var-button>
      <template #menu>
        <var-collapse v-model="value">
          <var-collapse-item title="颜色" name="1">
            <var-menu-select v-model="penciColor">
              <var-button type="primary">颜色</var-button>
              <template #options>
                <var-menu-option
                  class="option"
                  v-for="value in penciColorList"
                  :label="value"
                  :style="{ 'background-color': `${value}`, color: 'transparent' }"
                />
              </template>
            </var-menu-select>
          </var-collapse-item>
          <var-collapse-item title="画笔大小" name="2">
            <div style="height: 300px">
              <var-slider v-model="sizeParam" min="1" direction="vertical" />
            </div>
          </var-collapse-item>
        </var-collapse>
      </template>
    </var-menu>

    <canvas
      class="canvas"
      :width="canvasSize.width"
      :height="canvasSize.height"
      :style="canvasStyle"
      ref="huabu"
      @pointerdown="penciDown($event)"
      @pointermove="penciMove($event)"
      @pointerup="penciUp($event)"
    >
    </canvas>
  </div>
</template>

<style scoped>
.shezhi {
  position: absolute;
  right: 0;
}
.background {
  width: 100%;
  height: 100%;
  /* position: ; */
  /* color: transparent; */
}
.canvas {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 15px;
  background-color: white;
  touch-action: none;
}
</style>
