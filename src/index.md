

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
* 图形关系绑定 src/graph/models/EdgePointMoveModel.ts:113