import { createRouter,createWebHashHistory } from "vue-router";
import Hellow from "@/paga/Hellow.vue";
import CloudRain from "@/paga/CloudRain.vue";
import BilibiliHeard from "@/paga/BilibiliHeard.vue";

// 配置路由
const routes = [
  {
    'path': '/cloud',
    'component': CloudRain
  },
  {
    'path': '/hellow',
    'component': Hellow
  },
  {
    'path': '/biliHeard',
    'component': BilibiliHeard
  }
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes
})