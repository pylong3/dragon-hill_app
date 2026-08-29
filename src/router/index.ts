import { createRouter,createWebHashHistory } from "vue-router";
import Hellow from "@/pages/Hellow.vue";
import CloudRain from "@/pages/CloudRain.vue";
import BilibiliHeard from "@/pages/BilibiliHeard.vue";
import LovePig from "@/pages/LovePig.vue";
import DrawBackground from "@/pages/DrawBackground.vue";

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
    'path': '/biliHeader',
    'component': BilibiliHeard
  },
  {
    'path': '/lovePig',
    'component': LovePig
  },
  {
    'path': '/',
    'redirect': '/biliHeader'
  },
  {
    'path': '/huabu',
    'component':DrawBackground
  }
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes
})