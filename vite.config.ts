import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages 部署配置
  // 如果使用自定义域名，可以设置为 '/'
  base: process.env.NODE_ENV === 'production' ? '/my-react-app/' : '/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    // 输出目录
    outDir: 'dist',
    // 生成 source map
    sourcemap: true,
    // 代码分割配置
    rollupOptions: {
      output: {
        manualChunks: {
          // 将第三方库单独打包
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['framer-motion', '@radix-ui/react-dialog', '@radix-ui/react-tabs'],
          animation: ['gsap', '@gsap/react', 'three', '@react-three/fiber'],
        },
      },
    },
  },
})
