/// <reference types="vite/client" />

declare module 'process' {
  global {
    // eslint-disable-next-line no-var
    var process: NodeJS.Process;
    namespace NodeJS {
      interface ProcessEnv extends Dict<string> {
        NODE_ENV: 'development' | 'production';
        VITE_APP_PUBLIC_URL: string;
      }
    }
  }
}

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  // 更多环境变量...
}
interface ImportMeta {
  readonly env: ImportMetaEnv
}
