<script setup lang="ts">
import { provide, computed } from 'vue'
import DiagramShape from './DiagramShape.vue'
import { GraphModel } from './models/graphModel';
import { shapeComps } from './shape/index'
import ShapeMovePreview from './shape/interaction/ShapeMovePreview.vue'
import { EventType } from './shape/constant';
const props = defineProps<{graph:GraphModel}>()
provide('graph', props.graph)
props.graph.registerShapeComps(shapeComps)
const shape = computed(()=> props.graph.graphOption.shape)
function handleClickOut() {


}
function handleMousedownOut(event:MouseEvent) {
  // props.graph.emitter.emit(EventType.SHAPE_MOUSE_DOWN, event, undefined);
}
function handleMouseupOut() {

}
function handleMousemoveOut(event: MouseEvent) {
  props.graph.emitter.emit(EventType.SHAPE_MOUSE_MOVE, event, undefined);
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
        transform-origin="0 0"
        style="min-width: 100%; min-height: 100%;"
        :width="graph.viewModel.bounds.width" :height="graph.viewModel.bounds.height" 
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
    <!-- 交互层 -->
    <svg
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        style="min-width: 100%; min-height: 100%; position: absolute; top: 0; left: 0; pointer-events: none"
        transform-origin="0 0"
        :width="graph.viewModel.bounds.width" :height="graph.viewModel.bounds.height" 
        >
        <g>
          <Shape-move-preview v-if="graph.moveModel.showMovingPreview" :shapes="graph.moveModel.movingShapes" :dx="graph.moveModel.previewDx" :dy="graph.moveModel.previewDy" />
        </g>
      
    </svg>
  </div>
</template>