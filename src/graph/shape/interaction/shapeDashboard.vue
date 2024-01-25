<script setup lang="ts">
import { siderBarList, SiderbarItemKey, showDashboardList } from "../constant";
const props = defineProps<{ x: number; y: number }>();
const emit = defineEmits<{
  (e: "createShape", siderBarkey: SiderbarItemKey);
}>();
// 事件，点击创建元素
const handleCreateShape = (siderBarkey: SiderbarItemKey) => {
  emit("createShape", siderBarkey);
};
// 过滤模块
const symbolShapes = siderBarList.filter((item) => {
  return showDashboardList.includes(item.showData.siderBarkey);
});
</script>
<template>
  <foreignObject width="120" height="100" :x="x + 6" :y="y" class="shape-dashboard" @click.stop @mousedown.stop>
    <div>
      <img v-for="item of symbolShapes" class="shape" :src="item.showData.icon"
        @click="handleCreateShape(item.showData.siderBarkey)" />
    </div>
  </foreignObject>
</template>
<style scoped>
.shape-dashboard {
  padding: 6px 2px 2px 6px;
  width: 100px;
  cursor: default;
  background: #fff;
  box-shadow: 0 8px 20px 1px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  border: 1px solid #e9edf2;
  pointer-events: all;
}

.shape-dashboard img {
  width: 26px;
}

.shape {
  margin-right: 10px;
  padding: 4px;
}

.shape:hover {
  background-color: #eee;
}
</style>
