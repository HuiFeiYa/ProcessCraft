<script setup lang="ts">
import { inject, computed } from 'vue'
const graph = inject('graph') as any;
const data = computed(() => {
  
  return {
    children: [graph.graphOption.shape],
    edges: []
  }
})
</script>
<template>
  <g
    @click.stop
    @mousedown.stop
    @mouseup.stop
    @mousemove.stop
    @dragenter.stop
    @dragleave.stop
    @dragover.stop
  >
    <g>
      <component 
      v-for="childShape in data.children" :key="childShape.id"
      :is="graph.getShapeComp(childShape.subShapeType)"
      :shape="childShape"
      ></component>
    </g>
    <component 
      v-for="edge in data.edges" :key="edge.id"
      :is="graph.getShapeComp(edge.subShapeType)"
      :shape="edge"
      ></component>
  </g>
</template>