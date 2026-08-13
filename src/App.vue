<script setup lang="ts">
import { Location } from '@element-plus/icons-vue';
import {router} from '@/router' 
import { ref, useId } from 'vue'
import { images } from './static/images/mapTable';

//#region爱心小猪
let isShowPig = ref(true)
function setShowPig() {
  isShowPig.value = !isShowPig.value
}
//#endregion

// #region设计路由
function tpRoute(path: string) {
  router.push(path)
}
// #endregion

// #region 路由跳转提示
//定义数据
let tipData = ref([
  {
    id: useId(),
    style: 'transform: translate(-50%,-100%);box-shadow: 0 0 0px px rgba(0, 0 , 0, 0.5)'
  }
])
//跳转时触发动画效果
function tipAnima(routePath: string) {
  router.push(routePath)
  const id = useId()
  tipData.value.push({id,style: 'transform: translate(-50%,-100%);box-shadow: 0 0 0px px rgba(0, 0 , 0, 0.5)'})
  // tipData.value[tipData.value.findIndex((v) => v.id === id)]?.style = 'transform: translate(-50%,0);box-shadow: 0 0 0px px rgba(0, 0 , 0, 0.5)'
}
// #endregion

</script>

<template>
  <div class="container">
    <div class="tip" v-for="item in tipData" :key="item.id" :style="item.style">
      你跳转路由了
    </div>
  <router-view></router-view>
  <img class="lovePig" :class="{isShowPig:isShowPig}" :src="images['lovePig.png']">
  </div>
</template>

<style>
*{
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
.container{
  position: relative;
}
.tac{
  width: 400px;
}
.tip{
  width: 150px;
  height: 50px;
  position: absolute;
  left: 50%;
  /* transform: translate(-50%,-100%); */
  border-radius: 3px;
  text-align: center;
  line-height: 50px;
  transition: all 0.5s ease;
}
.box{
  background-color: black;
  height: 100vw;
  position: relative;
}
.lovePig{
  display: none;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%,50%);
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
