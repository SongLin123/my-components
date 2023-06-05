import { defineConfig ,loadEnv} from 'vite';
import pluginVue from '@vitejs/plugin-vue';
import pluginVueJsx from '@vitejs/plugin-vue-jsx';
import Checker from 'vite-plugin-checker'
import {visualizer} from 'rollup-plugin-visualizer'
import IconsResolver from 'unplugin-icons/resolver'
import Icons from 'unplugin-icons/vite'
import {ElementPlusResolver} from 'unplugin-vue-components/resolvers'
import tsconfigPaths from 'vite-tsconfig-paths'
import Components from 'unplugin-vue-components/vite'

import dotenv from 'dotenv';



dotenv.config();

export default () => {
  const isDev = process.env.NODE_ENV === 'development'
console.log(isDev)
  return defineConfig({
    plugins: [
      pluginVue(), 
      pluginVueJsx(),
      tsconfigPaths(),
      // visualizer({
      //   gzipSize: true,
      //   brotliSize: true,
      //   emitFile: false,
      //   filename: "test.html", //分析图生成的文件名
      //   open:true //如果存在本地服务端口，将在打包后自动展示
      // }),

      Components({
        dts: './components.d.ts',
        resolvers: [IconsResolver({}), ElementPlusResolver()],
      }),
      Icons({
        compiler:"vue3"
      }),

      Checker({
        typescript: true,
        enableBuild: true,
      }),
    ],

    build: {
      chunkSizeWarningLimit: 500,
      target: 'esnext',
      sourcemap: 'hidden',
      rollupOptions: {
        output: {
          chunkFileNames: `js/[name]-[hash].js`,
          entryFileNames: `js/[name]-[hash].js`,
        },
      },
    },
    optimizeDeps: {
      exclude: [],
    },

    define: {
      // 浏览器环境中标识
      __DEV__: isDev,
    },

    server: {
      // https: true,
      port: 3001,
      proxy: {
        '/api': 'http://localhost:3000',
      }
    },
 
  })
}