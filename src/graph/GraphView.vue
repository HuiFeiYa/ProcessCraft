<script setup lang="ts">
import { provide } from 'vue'
import DiagramShape from './DiagramShape.vue'
import { GraphModel } from './models/graphModel';
import { shapeComps } from './shape/index'

const props = defineProps<{graph:GraphModel}>()
provide('graph', props.graph)
props.graph.registerShapeComps(shapeComps)
function handleClickOut() {


}
function handleMousedownOut() {
}
function handleMouseupOut() {

}
function handleMousemoveOut() {

}
function handleDragOver() {

}

const handleDrop = () => {

};
</script>
<template>
  <div class="graph-view">
        <!-- 展示层 -->
    <svg
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        class="svg-container"
      
        transform-origin="0 0"
        @click="handleClickOut"
        @mousedown="handleMousedownOut"
        @mouseup="handleMouseupOut"
        @mousemove="handleMousemoveOut"
        @dragover="handleDragOver"
        @drop.stop="handleDrop"
        >
        <g>
            <DiagramShape :graph="graph" />
        </g>
    </svg>
  </div>
</template>