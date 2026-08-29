<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { images } from '@/static/images/mapTable'
import type { NavBar } from '@femessage/vant'

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
//拿到主画布上下文
const huabu = ref<HTMLCanvasElement | null>()
let penci: CanvasRenderingContext2D | null
onMounted(() => {
  penci = huabu.value!.getContext('2d')
  penci!.globalAlpha = 1
  penci!.fillStyle = '#ffffff'
  penci!.fillRect(0, 0, canvasSize.value.width, canvasSize.value.height)
})
//拿到小画布上下文
const huabuMin = ref<HTMLCanvasElement | null>()
let penciMin: CanvasRenderingContext2D | null
onMounted(() => {
  penciMin = huabuMin.value!.getContext('2d')
  penciMin!.globalAlpha = 1
  penciMin!.clearRect(0, 0, canvasSize.value.width, canvasSize.value.height)
})
//画画的三个回调
//数据
let isDraw = false
let isDot = false
let pathData: Array<[number, number]> = []
//下笔
let oldX = 0
let oldY = 0
function penciDown(e: PointerEvent) {
  e.preventDefault()
  //重置数据
  isDraw = true
  isDot = true
  //计算画笔相对位置
  oldX = e.offsetX * PXRatio.value
  oldY = e.offsetY * PXRatio.value
  //设置画笔
  penciMin!.lineCap = 'round'
  penciMin!.lineJoin = 'round'
  penciMin?.beginPath()
  penciMin!.lineWidth = penciSize.value
  penciMin?.moveTo(oldX, oldY)
  penciMin!.strokeStyle = penciColor.value
}
//运笔
function penciMove(e: PointerEvent) {
  e.preventDefault()
  isDot = false
  if (isDraw) {
    //添加最新一步的坐标
    pathData.push([e.offsetX * PXRatio.value, e.offsetY * PXRatio.value])
    penciMin!.clearRect(0, 0, canvasSize.value.width, canvasSize.value.height)
    //重头连接描边
    penciMin!.beginPath()
    penciMin!.moveTo(oldX, oldY)
    pathData.forEach((value) => {
      penciMin?.lineTo(value[0], value[1])
    })
    penciMin!.stroke()
  }
}
//抬笔
function penciUp(e: PointerEvent) {
  e.preventDefault()
  isDraw = false
  //若只点击
  if (isDot) {
    penciMin?.lineTo(e.offsetX * PXRatio.value, e.offsetY * PXRatio.value)
    penciMin?.stroke()
    isDot = false
  }
  //渲染到主画布
  const url = huabuMin.value?.toDataURL()
  const img = document.createElement('img')
  img.src = url!
  img.onload = () => {
    penci!.globalAlpha = 1
    penciMin!.clearRect(0,0,canvasSize.value.width, canvasSize.value.height)
    penci!.drawImage(img, 0, 0)
    penci!.globalAlpha = transparency.value
  }
  pathData = []
  //历史记录
  saveState()
}
//透明度
let transparencyPramas = ref(100)
let transparency = computed(() => transparencyPramas.value / 100)
watch(transparency, () => {
  penci!.globalAlpha = transparency.value
  penciMin!.globalAlpha = transparency.value
})
//笔尖颜色
let penciColorList = [
  `rgba(255,255,255)`,
  `rgba(0,0,0)`,
  `rgba(128,128,128)`,
  `rgba(255,0,0)`,
  `rgba(232,163,15)`,
  `rgba(255,255,0)`,
  `rgba(0,128,0)`,
  `rgba(0,0,255)`,
  `rgba(98,13,232)`,
  `rgba(144,13,232)`,
]
let penciColor = ref('')
//笔尖大小
let sizeParam = ref(30)
let penciSize = computed(() => sizeParam.value / 2)
//菜单栏数据
const menuData = ref(['1'])
//重置画布
function resetHuabu() {
  penci!.clearRect(0, 0, canvasSize.value.width, canvasSize.value.height)
  penci!.fillStyle = '#ffffff'
  penci!.globalAlpha = 1
  penci!.fillRect(0, 0, canvasSize.value.width, canvasSize.value.height)
  penci!.globalAlpha = transparency.value
  saveState()
}
//下载
function download() {
  huabu.value!.toBlob((blob) => {
    const url = URL.createObjectURL(blob!)
    const a = document.createElement('a')
    a.href = url
    a.download = '你的画作.png'
    a.click()
    URL.revokeObjectURL(url)
  }, 'image/png')
}
//触发上传文件操作
let uploadElement = ref()
function uploadImage() {
  uploadElement.value.click()
}
//处理上传图片
function handleImage() {
  //获取图片
  const file = uploadElement.value.files[0]
  const fileUrl = URL.createObjectURL(file)
  const picture = document.createElement('img')
  picture.src = fileUrl
  //绘制
  picture.onload = () => {
    //缩放与居中
    const scaleX = huabu.value!.width / picture.width
    const scaleY = huabu.value!.height / picture.height
    const scale = Math.max(scaleX, scaleY)
    const dx = (huabu.value!.width - picture.width * scale) / 2
    const dy = (huabu.value!.height - picture.height * scale) / 2
    //绘制图片
    penci!.drawImage(picture, dx, dy, picture.width * scale, picture.height * scale)
    //删除url
    URL.revokeObjectURL(fileUrl)
    //记录
    saveState()
  }
  //加载失败
  picture.onerror = () => {
    URL.revokeObjectURL(fileUrl)
    console.error('图片加载失败')
  }
}
//撤销功能
//数据
function arr() {
  const url = localStorage.getItem('canvasUrl')
  if (!url) return []
  return [JSON.parse(url)]
}
let canvasUrlList = ref<string[]>(arr())
onMounted(() => {
  console.log(canvasUrlList.value)
  if (canvasUrlList.value.length > 0) {
    rander()
  }
})
//渲染
function rander() {
  const img = document.createElement('img')
  img.src = canvasUrlList.value[0]!
  img.onload = () => {
    penci!.clearRect(0, 0, canvasSize.value.width, canvasSize.value.height)
    penci!.globalAlpha = 1
    penci?.drawImage(img, 0, 0)
    penci!.globalAlpha = transparency.value
  }
}
//撤销
function back() {
  if (canvasUrlList.value.length > 1) {
    console.log('撤销')
    canvasUrlList.value.shift()
    rander()
    console.log('撤销完成')
  }
}
//记录
function saveState() {
  if (canvasUrlList.value.length >= 30) {
    canvasUrlList.value.pop()
  }
  const url = huabu.value!.toDataURL()
  canvasUrlList.value.unshift(url)
}
//保存
function save() {
  localStorage.setItem('canvasUrl', JSON.stringify(canvasUrlList.value[0]))
}
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
        <var-collapse v-model="menuData">
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
            <div style="height: 100px">
              <var-slider v-model="sizeParam" min="1" direction="vertical" />
            </div>
          </var-collapse-item>
          <var-collapse-item title="重置" name="3">
            <var-button type="primary" @click="resetHuabu()">重置</var-button>
          </var-collapse-item>
          <var-collapse-item title="下载" name="4">
            <var-button type="primary" @click="download()">下载</var-button>
          </var-collapse-item>
          <var-collapse-item title="透明度" name="5">
            <div style="height: 100px">
              <var-slider v-model="transparencyPramas" min="0" max="100" direction="vertical" />
            </div>
          </var-collapse-item>
          <var-collapse-item title="上传" name="6">
            <input
              type="file"
              accept="image/*"
              style="display: none"
              @change="handleImage()"
              ref="uploadElement"
            />
            <var-button type="primary" @click="uploadImage()">上传</var-button>
          </var-collapse-item>
          <var-collapse-item title="撤销" name="7">
            <var-button type="primary" @click="back()">撤销</var-button>
          </var-collapse-item>
          <var-collapse-item title="保存" name="8">
            <var-button type="primary" @click="save()">保存</var-button>
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
    >
    </canvas>
    <canvas
      class="canvas canvasMin"
      :width="canvasSize.width"
      :height="canvasSize.height"
      :style="canvasStyle"
      ref="huabuMin"
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
  left: 0;
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
  touch-action: none;
}
.canvasMin {
  z-index: 2;
  pointer-events: auto;
}
</style>
