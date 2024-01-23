<script setup lang="ts">
import { inject, computed } from 'vue'
import { useDrawStore } from '../editor/store';
import { Shape } from './types';
const props = defineProps<{
  shape: Shape
}>();
const graph = inject('graph') as any;
const store = useDrawStore()
const data = computed(() => {
  return {
    children: store.sortedShapes,
    edges: []
  }
})
</script>
<template>
  <g @click.stop @mousedown.stop @mouseup.stop @mousemove.stop @dragenter.stop @dragleave.stop @dragover.stop>
    <defs>
      <!-- 定义一个用于创建阴影的滤镜 -->
      <filter id="myShadow">
        <!-- 创建模糊效果 -->
        <feGaussianBlur in="SourceAlpha" stdDeviation="6" />
        <!-- 偏移阴影位置 -->
        <feOffset dx="0" dy="2" result="offsetblur" />
        <!-- 设置阴影颜色和透明度 -->
        <feFlood flood-color="rgba(0,0,0,0.1)" flood-opacity="1" result="coloredShadow" />
        <!-- 将阴影与源图形合并 -->
        <feComposite in2="offsetblur" operator="in" in="coloredShadow" result="shadow" />
        <!-- 将阴影置于源图形之下 -->
        <feMerge>
          <feMergeNode in="SourceGraphic" />
          <feMergeNode in="shadow" />
        </feMerge>
      </filter>
    </defs>
    <!-- 阴影 -->
    <rect :width="shape.bounds.width" :height="shape.bounds.height" :x="shape.bounds.absX" :y="shape.bounds.absY"
      style="pointer-events:none" filter="url(#myShadow)" />
    <!-- 白色背景色 -->
    <rect :width="shape.bounds.width" :height="shape.bounds.height" :x="shape.bounds.absX" :y="shape.bounds.absY"
      fill="#fff" style="pointer-events:none" />
    <defs>
      <pattern id="flow_canvas_grid_item" width="61" height="61" patternUnits="userSpaceOnUse">
        <path id="flow_canvas_grid_path1" stroke-width="1" fill="none"
          d="M0 15L60 15M15 0L15 60M0 30L60 30M30 0L30 60M0 45L60 45M45 0L45 60" stroke="rgb(242,242,242)"></path>
        <path id="flow_canvas_grid_path2" stroke-width="1" fill="none" d="M0 60L60 60M60 0L60 60"
          stroke="rgb(229,229,229)"></path>
      </pattern>
      <pattern xmlns="http://www.w3.org/2000/svg" patternUnits="userSpaceOnUse" id="flow_canvas_watermark_item"
        width="300" height="300">
        <text x="150" y="100" font-size="18" transform="rotate(-45, 150, 150)"
          style="dominant-baseline: middle; text-anchor: middle;"></text>
      </pattern>
    </defs>
    <!-- 网格背景色 -->
    <rect :width="shape.bounds.width" :height="shape.bounds.height" :x="shape.bounds.absX" :y="shape.bounds.absY"
      fill="url(#flow_canvas_grid_item)" style="pointer-events:none">
    </rect>
    <g>
      <component v-for="childShape in data.children" :key="childShape.id"
        :is="graph.getShapeComp(childShape.subShapeType)" :shape="childShape"></component>
    </g>
    <component v-for="edge in data.edges" :key="edge.id" :is="graph.getShapeComp(edge.subShapeType)" :shape="edge">
    </component>
  </g>
</template>

<style scoped></style>