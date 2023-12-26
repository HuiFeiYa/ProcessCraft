<script setup lang="ts">
import { provide, computed } from 'vue'
import DiagramShape from './DiagramShape.vue'
import { GraphModel } from './models/graphModel';
import { shapeComps } from './shape/index'
import ShapeMovePreview from './shape/interaction/ShapeMovePreview.vue'
import SelectionVertex from './shape/interaction/SelectionVertex.vue';
import { EventType, VertexType } from './shape/constant';
const props = defineProps<{graph:GraphModel}>()
provide('graph', props.graph)
props.graph.registerShapeComps(shapeComps)
const shape = computed(()=> props.graph.graphOption.shape)

const showSelectionVertex = computed(()=> {
  const { selectionModel } = props.graph
  return selectionModel.selection.length > 0
})

function handleVertexMousedown(event: MouseEvent, index: VertexType) {
  const graph = props.graph
  if (graph.selectionModel.selection.length === 0) return;
  if (graph.selectionModel.selection.length > 1) {
    graph.selectionModel.clearSelection();
  } 
}
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
          <selection-vertex v-if="showSelectionVertex" :selection="graph.selectionModel.selection" @vertex-mousedown="handleVertexMousedown" />
        </g>
      
    </svg>
  </div>
</template>