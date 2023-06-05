# vue 组件库

使用 pnpm workspace 组织的 vue 组件库

### 安装依赖

```sh
# 使用 pnpm 来管理项目
pnpm i
```



## 其他

### 物料组件开发


独立开发 `packages/material-banner-slides`

```sh
npm run dev:banner
```


独立开发 `packages/material-product-list`
```sh
npm run dev:products
```

> 注意：开发完后，需要将对应组件提升版本，然后再执行 npm run build:materials 来重新构建新版本物料。


### 组件库开发

### 基础组件开发模式

```sh
# 开发模式
npm run dev:components
```

### 业务组件开发模式

```sh
# 开发模式
npm run dev:business
```


 