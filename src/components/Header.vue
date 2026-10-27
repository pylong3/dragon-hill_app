<script setup lang="ts">
import { router } from '@/router'
import { ref } from 'vue'

// #region 路由跳转
//#region定义数据
//提示
// let tipData = ref<{ id: string; name: string }[]>([])
//响应式标题
// let routeTitle = ref('')
//路由选择数据
let routeOption = ref([
  { name: 'b站头部', path: '/biliHeader' },
  { name: '乌云', path: '/cloud' },
  { name: '你好', path: '/hellow' },
  { name: '可爱小猪', path: '/lovePig' },
  { name: '画布', path: '/huabu' },
  { name: '敬请期待~', path: '/editor' },
])
//#endregion
//#region定义方法
//跳转时触发
function tipAnima(routePath: string, name: string) {
  router.push(routePath)
  // routeTitle.value = name
  // tipData.value.push({
  //   id: nanoid(),
  //   name: name,
  // })
}
//后退
// function houtui() {
//   router.go(-1)
// }
//#endregion
// #endregion
//选项卡默认
const active = ref(0)
//判断设备
let isPC = false
let viewClass = 'zhanshi'
if (window.innerWidth >= 768) {
  isPC = true
  viewClass = 'zhanshiPC'
}
</script>

<template>
  <div class="container">
    <var-tabs
      v-if="!isPC"
      elevation
      color="var(--color-primary)"
      active-color="var(--color-on-primary)"
      inactive-color="var(--color-on-info)"
      v-model:active="active"
      style="height: 10vh;"
    >
      <var-tab v-for="item in routeOption" @click="tipAnima(item.path, item.name)" style="width: 18vw;font-size: 4vw;">
        {{ item.name }}
      </var-tab>
    </var-tabs>
    <var-tabs
      v-if="isPC"
      class="tabs-example-vertical"
      elevation
      layout-direction="vertical"
      color="var(--color-primary)"
      active-color="var(--color-on-primary)"
      inactive-color="var(--color-on-info)"
      v-model:active="active"
    >
      <var-tab v-for="item in routeOption" @click="tipAnima(item.path, item.name)">
        {{ item.name }}
      </var-tab>
    </var-tabs>
    <router-view :class="viewClass"></router-view>
  </div>
</template>

<style scoped>
.tabs-example-vertical {
  float: left;
  width: 10vw !important;
  height: 100vh !important;
}
.zhanshi {
  width: 100vw;
  height: 90vh;
  /* background-color: white; */
}
.zhanshiPC {
  float: left;
  width: 90vw;
  height: 100vh;
}
.container {
  position: relative;
  width: 100vw;
  height: 100vh;
  background-color: rgb(237, 242, 250);
  overflow: hidden;
  touch-action: none;
  /*禁止浏览器的一些行为 */
  user-select: none;
  -webkit-user-select: none; /* 兼容 Safari */
  /* 关键：针对 iOS 的杀手锏 */
  /* 阻止长按弹出“复制/共享”等系统菜单 */
  -webkit-touch-callout: none;
}
.tip {
  width: 32vmin;
  height: 6vmin;
  position: absolute;
  left: 50vw;
  top: 0;
  background-color: white;
  border-radius: 0 0 1vmin 1vmin;
  font-size: 2.5vmin;
  text-align: center;
  line-height: 6vmin;
  transform: translate(-50%, -100%);
  box-shadow: 0 0px 0px rgba(0, 0, 0, 0.5);
  z-index: +3;
  animation: enter 2s ease;
}
@keyframes enter {
  0% {
    transform: translate(-50%, -100%);
    box-shadow: 0 0px 0px rgba(0, 0, 0, 0.5);
  }
  30% {
    transform: translate(-50%, 0%);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
  }
  70% {
    transform: translate(-50%, 0%);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
  }
  100% {
    transform: translate(-50%, -100%);
    box-shadow: 0 0px 0px rgba(0, 0, 0, 0.5);
  }
}
@media (max-width: 576px) {
  .tip {
    width: 40vmin;
    height: 10vmin;
    font-size: 3.5vmin;
    line-height: 10vmin;
  }
}
</style>
