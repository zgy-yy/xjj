import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import {fileURLToPath,URL} from 'url'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve:{
    alias:{
      '@':fileURLToPath(new URL('./src',import.meta.url))
    }
  },
  server:{
    open: false,//启动项目自动弹出浏览器
    host:'0.0.0.0',
    port: 3100,//启动端口
    proxy: {
      '/api': {
        // target: 'https://api.kkiik.com',	//实际请求地址
        target:'http://api.qemao.com/api/douyin',
        changeOrigin: true,
         rewrite: path => path.replace(/^\/api_service/, '')
      }
    }
  }
})
