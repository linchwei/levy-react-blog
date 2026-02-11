import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages 部署配置
  // 如果使用自定义域名，可以设置为 '/'
  base: process.env.NODE_ENV === 'production' ? '/levy-react-blog/' : '/',
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
    // 添加时间戳到文件名，确保每次构建都不同
    rollupOptions: {
      output: {
        // 入口文件添加哈希
        entryFileNames: 'assets/[name]-[hash]-[hash:8].js',
        // 代码分割文件添加哈希
        chunkFileNames: 'assets/[name]-[hash]-[hash:8].js',
        // 资源文件添加哈希
        assetFileNames: () => {
          return `assets/[name]-[hash][extname]`
        },
        manualChunks: {
          // 将第三方库单独打包
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: [
            'framer-motion',
            '@radix-ui/react-dialog',
            '@radix-ui/react-tabs',
          ],
          animation: ['gsap', '@gsap/react', 'three', '@react-three/fiber'],
        },
      },
    },
  },
  // 开发服务器配置
  server: {
    // 禁用缓存
    headers: {
      'Cache-Control': 'no-store',
    },
  },
})
