<template>
    <div
      v-if="siderBarDropModel.isPointInDiagram"
      :style="`top:${siderBarDropModel.iconPosition.y+2}px;left:${siderBarDropModel.iconPosition.x+4}px;`"
      class="_flow_mouse_icon"
    >
      <img :src="siderBarDropModel.siderbarItem?.showData.icon" alt="" />
      {{iconName}}
    </div>
  </template>
  <script lang="ts" setup>
  import { computed } from "vue";
import { SiderBarDropModel } from "./SiderBarDropModel";
  
  const props = defineProps<{
    siderBarDropModel?:SiderBarDropModel
  }>();
  
  const iconName = computed(() => {
    const name = props.siderBarDropModel?.siderbarItem?.showData.name;
    return name
  });
  
  </script>
  