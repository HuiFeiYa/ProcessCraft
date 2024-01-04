# Vue 3 + Vite

This template should help get you started developing with Vue 3 in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).


## pinia
* 添加 store
* 在开始的时候读取 indexDb 数据
* 在关闭时写入indexDb

## 模块

* 图形更新  models/graphModel.ts, 数据都会同步到 store
* siderbarKey 配置项 src/graph/shape/behavior/config.ts
* 模型配置 modelKeyConfig src/graph/shape/shapeOption/commonShapeOption.ts
* 创建图形 src/graph/shape/behavior/SiderbarDropBehavior.ts

### behavior
* siderbarkey 行为配置 src/graph/shape/behavior/config.ts:13

## graph
* 根据 subShapeType 使用对应组件， 注册 components 处 src/graph/GraphView.vue:13
* shapeComps src/graph/shape/index.ts:4