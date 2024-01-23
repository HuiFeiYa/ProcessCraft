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
    <foreignObject :width="shape.bounds.width" :height="shape.bounds.height" :x="shape.bounds.absX" :y="shape.bounds.absY"
      :fill="shape.style.background" style="pointer-events:none">
      <div class="background"></div>
    </foreignObject>
    <g>
      <component v-for="childShape in data.children" :key="childShape.id"
        :is="graph.getShapeComp(childShape.subShapeType)" :shape="childShape"></component>
    </g>
    <component v-for="edge in data.edges" :key="edge.id" :is="graph.getShapeComp(edge.subShapeType)" :shape="edge">
    </component>
  </g>
</template>

<style scoped>
.background {
  background-image: linear-gradient(to right, #eee 1px, transparent 1px, transparent 40px), linear-gradient(to bottom, #eee 1px, transparent 1px, transparent 40px);
  background-size: 20px 20px;
  width: 100%;
  height: 100%;
}
</style>