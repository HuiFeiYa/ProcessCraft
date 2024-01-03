<template>
  <div v-if="siderBarDropModel.isPointInDiagram"
    :style="`top:${siderBarDropModel.iconPosition.y + 2}px;left:${siderBarDropModel.iconPosition.x + 4}px;`"
    class="_flow_mouse_icon">
    <img :src="siderBarDropModel.siderbarItem?.showData.icon" alt="" />
    {{ iconName }}
  </div>
</template>
<script lang="ts" setup>
import { computed } from "vue";
import { SiderBarDropModel } from "./SiderBarDropModel";
/**
 * 1. 拖动动画流畅度优化
 * 2. 禁用拖动的原始效果
 */
const props = defineProps<{
  siderBarDropModel?: SiderBarDropModel
}>();

const iconName = computed(() => {
  const name = props.siderBarDropModel?.siderbarItem?.showData.name;
  return name
});

</script>
  
<style>
._flow_mouse_icon {
  position: fixed;
    z-index: 999;
    height: 16px;
    display: flex;
    align-items: center;
    background-size: 100% 100%;
    /* 元素不会接收鼠标事件、触摸事件或指针事件，事件会穿透到下面的元素。不影响在画布上 drop 元素事件 */
    pointer-events: none;
}
</style>