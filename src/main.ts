import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import { router } from './router/index.ts'
//varletUI组件库的pc端鼠标事件适配
import '@varlet/touch-emulator'

createApp(App).use(createPinia()).use(router).mount('#app')