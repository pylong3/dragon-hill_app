<script setup lang="ts">
import { router } from '@/router'
import { ref } from 'vue'
import { nanoid } from 'nanoid'

// #region 路由跳转
//#region定义数据
//提示
let tipData = ref<{ id: string, name: string }[]>([])
//响应式标题
let routeTitle = ref('')
//路由选择数据
let routeOption = ref([
  { name: 'b站头部', path: '/biliHeader' },
  { name: '乌云', path: '/cloud' },
  { name: '你好', path: '/hellow' },
  { name: '可爱小猪', path: '/lovePig' },
])
//#endregion
//#region定义方法
//跳转时触发
function tipAnima(routePath: string, name: string) {
  router.push(routePath)
  routeTitle.value = name
  tipData.value.push({
    id: nanoid(),
    name: name,
  })
}
//后退
function houtui() {
  router.go(-1)
}
//#endregion
// #endregion
</script>

<template>
  <div class="container">
    <var-app-bar :title="routeTitle">
      <template #left>
        <var-button color="transparent" text-color="#fff" round text @click="houtui()">
          <var-icon name="chevron-left" :size="24" />
        </var-button>
      </template>
      <template #right>
        <var-menu>
          <var-button color="transparent" text-color="#fff" round text>
            <var-icon name="menu" :size="24" />
          </var-button>
          <template #menu>
            <var-cell ripple v-for="item in routeOption" @click="tipAnima(item.path, item.name)">
              {{ item.name }}
            </var-cell>
          </template>
        </var-menu>
      </template>
    </var-app-bar>
    <div class="tip" v-for="item in tipData" :key="item.id">已跳转至“{{ item.name }}”</div>
    <router-view></router-view>
  </div>
</template>

<style scoped>
.container {
  position: relative;
  width: 100vw;
  height: 100vh;
  background-color: rgb(237, 242, 250);
  overflow: hidden;
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
