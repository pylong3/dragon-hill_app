import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import VueSetupExtend from 'vite-plugin-vue-setup-extend'
//引入自动引入插件和varlet组件
import components from 'unplugin-vue-components/vite'
import autoImport from 'unplugin-auto-import/vite'
import { VarletImportResolver } from '@varlet/import-resolver'

//设置github
const isGitHubActions = process.env.GITHUB_ACTIONS === 'true'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    VueSetupExtend(),
    vueDevTools(), 
    //使用按需引入插件
    components({
      resolvers: [VarletImportResolver()]
    }),
    autoImport({
      resolvers: [VarletImportResolver({ autoImport: true })]
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  base: isGitHubActions ? '/dragon-hill_app/' : '/',
})
