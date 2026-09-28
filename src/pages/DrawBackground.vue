<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { images } from '@/static/images/mapTable'

//设置画布像素和大小
let canvasSize = ref({ width: 1080, height: 1920 })
let canvasWidth = ref(75)
let canvasPosition = ref({
  left: window.innerWidth >= 768 ? window.innerWidth * 0.9 * 0.5 : window.innerWidth * 0.5,
  top: window.innerWidth >= 768 ? window.innerHeight * 0.5 : window.innerHeight * 0.9 * 0.5,
})
let canvasRotateAngle = ref(0)
let aspectRatio = ref('1080/1920')
let canvasStyle = computed(() => {
  return {
    width: canvasWidth.value + 'vw',
    aspectRatio: aspectRatio.value,
    left: canvasPosition.value.left + 'px',
    top: canvasPosition.value.top + 'px',
    transition: 'width 0.1s linear',
    transform: `translate(-50%, -50%) rotateZ(${canvasRotateAngle.value}rad)`,
  }
})
//画布相对于屏幕缩放比例
let PXRatio = computed(
  () => canvasSize.value.width / ((window.innerWidth * canvasWidth.value) / 100),
)
//判断设备改变画布大小
if (window.innerWidth >= 768) {
  canvasSize.value.width = 1920
  canvasSize.value.height = 1080
  aspectRatio.value = '1920/1080'
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
let isUsePenci = true
//下笔
let oldX = 0
let oldY = 0
function penciDown(e: PointerEvent) {
  if (isUsePenci !== true) return
  e.preventDefault()
  //重置数据
  isDraw = true
  isDot = true
  //计算画笔相对位置
  ;((oldX = e.offsetX * PXRatio.value),
    (oldY = e.offsetY * PXRatio.value),
    //设置画笔
    (penciMin!.lineCap = 'round'))
  penciMin!.lineJoin = 'round'
  penciMin?.beginPath()
  penciMin!.lineWidth = penciSize.value
  penciMin?.moveTo(oldX, oldY)
  penciMin!.strokeStyle = penciColor.value
}
//运笔
function penciMove(e: PointerEvent) {
  if (isUsePenci !== true) return
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
  if (isUsePenci !== true) return
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
    penciMin!.clearRect(0, 0, canvasSize.value.width, canvasSize.value.height)
    penci!.drawImage(img, 0, 0)
    penci!.globalAlpha = transparency.value
    pathData = []
    //历史记录
    saveState()
  }
}
//透明度
let transparencyPramas = ref(100)
let transparency = computed(() => transparencyPramas.value / 100)
watch(transparency, () => {
  penci!.globalAlpha = transparency.value
  penciMin!.globalAlpha = transparency.value
})
//笔尖颜色
let penciColor = defineModel({
  default: 'rgb(0, 0, 0)',
})
//笔尖大小
let sizeParam = ref(30)
let penciSize = computed(() => sizeParam.value / 2)
//菜单栏数据
const menuData = ref([])
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
//画布变化
//是否空格按下
let isSpaceData: boolean = false
function isSpace(v: boolean, e: KeyboardEvent) {
  e.preventDefault()
  isSpaceData = v
  isUsePenci = !v
}
//挂载后自动获取焦点
const huabuBaba = ref<HTMLDivElement>()
onMounted(() => {
  huabuBaba.value!.focus()
})
//用于实现变化功能的数据
let HCData = {
  //开始移动画布时，指针按下时坐标
  oldMoveDownX: 0,
  oldMoveDownY: 0,
  //用来计算角度增量的初始角度
  oldAngle: 0,
  //存放触摸点ID
  touchID: [] as number[],
  //存放初始触摸点坐标
  oldTouchsXY: [
    { x: 0, y: 0 },
    { x: 0, y: 0 },
  ],
  //触摸旋转时的原点
  spinOrigin: { x: 0, y: 0 },
}
//pc端画布缩放
function changeWidth(x: number) {
  canvasWidth.value += x
  canvasStyle.value.width = canvasWidth.value + 'vw'
}
function scalePC(e: WheelEvent) {
  e.preventDefault()
  if (Math.sign(e.deltaY) === -1) {
    //放大
    changeWidth(4)
  } else {
    //缩小
    changeWidth(-4)
  }
}
//用于移动画布的函数
function huabuPositionChange(x: number, y: number) {
  canvasPosition.value.left += x
  canvasPosition.value.top += y
}
//用于旋转画布的函数
function huabuRotate(positionX: number, positionY: number) {
  let x = positionX - canvasPosition.value.left
  let y = positionY - canvasPosition.value.top
  let newAngle = Math.atan2(y, x)
  let addAngle: number
  if (Math.sign(newAngle) !== Math.sign(HCData.oldAngle)) {
    if (newAngle < Math.PI / 2 || newAngle > -Math.PI / 2) {
      addAngle = newAngle - HCData.oldAngle
    } else {
      addAngle =
        newAngle - HCData.oldAngle < 0
          ? newAngle - HCData.oldAngle + Math.PI * 2
          : Math.PI * 2 - (newAngle - HCData.oldAngle)
    }
  } else {
    addAngle = newAngle - HCData.oldAngle
  }
  canvasRotateAngle.value += addAngle
  HCData.oldAngle = newAngle
}
//指针按下
function downToChange(e: PointerEvent) {
  //pc端
  if (e.pointerType === 'mouse') {
    //空格按下
    if (isSpaceData === true) {
      //鼠标左键移动画布
      if (e.button === 0) {
        HCData.oldMoveDownX = e.clientX
        HCData.oldMoveDownY = e.clientY
      }
      //鼠标右键旋转画布
      else if (e.button === 2) {
        let x = e.clientX - window.innerWidth * 0.1 - canvasPosition.value.left
        let y = e.clientY - canvasPosition.value.top
        HCData.oldAngle = Math.atan2(y, x)
      }
    }
  }
  //移动端
  else if (e.pointerType === 'touch') {
    //增加触摸点
    HCData.touchID.push(e.pointerId)
    //判断当前触摸点数量
    if (HCData.touchID.length >= 2) {
      isUsePenci = false
      isDot = false
      //记录手指初始位置
      if (e.pointerId === HCData.touchID[0]) {
        HCData.oldTouchsXY[0]!.x = e.clientX
        HCData.oldTouchsXY[0]!.y = e.clientY - window.innerHeight * 0.1
      } else if (e.pointerId === HCData.touchID[HCData.touchID.length - 1]) {
        HCData.oldTouchsXY[1]!.x = e.clientX
        HCData.oldTouchsXY[1]!.y = e.clientY - window.innerHeight * 0.1
      }
      //计算旋转原点
      HCData.spinOrigin.x = HCData.oldTouchsXY[1]!.x - HCData.oldTouchsXY[0]!.x
      HCData.spinOrigin.y = HCData.oldTouchsXY[1]!.y - HCData.oldTouchsXY[0]!.y
    }
  }
}
//指针移动
function moveToChange(e: PointerEvent) {
  e.preventDefault()
  //pc端
  if (e.pointerType === 'mouse') {
    if (isSpaceData === true) {
      //移动画布
      if (e.buttons === 1) {
        huabuPositionChange(e.clientX - HCData.oldMoveDownX, e.clientY - HCData.oldMoveDownY)
        HCData.oldMoveDownX = e.clientX
        HCData.oldMoveDownY = e.clientY
      }
      //旋转画布
      else if (e.buttons === 2) {
        huabuRotate(e.clientX - window.innerWidth * 0.1, e.clientY)
      }
    }
  }
  //移动端
  if (e.pointerType === 'touch') {
    if (HCData.touchID.length >= 2) {
      //缩放
      ;(function () {
        //计算初始两点距离
        let oldX = HCData.oldTouchsXY[1]!.x - HCData.oldTouchsXY[0]!.x
        let oldY = HCData.oldTouchsXY[1]!.y - HCData.oldTouchsXY[0]!.y
        let oldDistant = Math.hypot(oldX, oldY)
        //计算更新后距离
        let x = 0
        let y = 0
        if (HCData.touchID.indexOf(e.pointerId) === 0) {
          x = HCData.oldTouchsXY[1]!.x - e.clientX
          y = HCData.oldTouchsXY[1]!.y - e.clientY + window.innerHeight * 0.1
        } else if (HCData.touchID.indexOf(e.pointerId) === 1) {
          x = e.clientX - HCData.oldTouchsXY[0]!.x
          y = e.clientY - window.innerHeight * 0.1 - HCData.oldTouchsXY[0]!.y
        }
        let distant = Math.hypot(x, y)
        //把增加的距离换算成vw的百分比
        canvasWidth.value += (distant - oldDistant) / window.innerWidth
      })()
      //移动
      ;(function () {
        let x = 0
      })()
    }
  }
}

//指针抬起
function upToChange(e: PointerEvent) {
  e.preventDefault()
  //pc端
  if (e.pointerType === 'mouse') {
    if (e.button === 0) {
    }
  }
  //移动端
  if (e.pointerType === 'touch') {
    isUsePenci = true
    isDot = true
    //抬起时删除对应触摸点id
    let index = HCData.touchID.indexOf(e.pointerId)
    HCData.touchID.splice(index, 1)
  }
}
</script>

<template>
  <div
    :style="{
      background: `url(${images['huabuBackground.jpg']}) center/cover`,
      position: 'relative',
      overflow: 'hidden',
    }"
    tabindex="0"
    @wheel="scalePC($event)"
    @keydown.space.prevent="isSpace(true, $event)"
    @keyup.space.prevent="isSpace(false, $event)"
    @pointerdown="downToChange($event)"
    @pointermove="moveToChange($event)"
    @pointerup="upToChange($event)"
    @contextmenu.prevent
    ref="huabuBaba"
  >
    <var-menu class="shezhi">
      <var-button type="primary">设置</var-button>
      <template #menu>
        <var-collapse v-model="menuData">
          <var-collapse-item title="画笔颜色" name="1">
            <el-color-picker v-model="penciColor" show-alpha style="z-index: 5" />
          </var-collapse-item>
          <var-collapse-item title="画笔大小" name="2">
            <div class="slider-demo-block">
              <el-slider v-model="sizeParam" vertical height="100px" />
            </div>
          </var-collapse-item>
          <var-collapse-item title="重置" name="3">
            <var-button type="primary" @click="resetHuabu()">重置</var-button>
          </var-collapse-item>
          <var-collapse-item title="下载" name="4">
            <var-button type="primary" @click="download()">下载</var-button>
          </var-collapse-item>
          <var-collapse-item title="全局透明度" name="5">
            <div class="slider-demo-block">
              <el-slider v-model="transparencyPramas" vertical height="100px" />
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
  z-index: 4;
}

.canvas {
  position: absolute;
  border-radius: 15px;
  touch-action: none;
  z-index: 2;
}
.canvasMin {
  z-index: 3;
  pointer-events: auto;
}
.slider-demo-block {
  max-width: 600px;
  display: flex;
  align-items: center;
}
.slider-demo-block .el-slider {
  margin-top: 0;
  margin-left: 12px;
}
</style>
