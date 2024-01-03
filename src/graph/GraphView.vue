<script setup lang="ts">
import { provide, computed, onMounted, ref } from 'vue'
import DiagramShape from './DiagramShape.vue'
import { GraphModel } from './models/graphModel';
import { shapeComps } from './shape/index'
import ShapeMovePreview from './shape/interaction/ShapeMovePreview.vue'
import SelectionVertex from './shape/interaction/SelectionVertex.vue';
import { EventType, VertexType } from './shape/constant';
import { useDrawStore } from '../editor/store';
const props = defineProps<{ graph: GraphModel }>()
const store = useDrawStore()
provide('graph', props.graph)
props.graph.registerShapeComps(shapeComps)
const viewDom = ref<HTMLDivElement | null>(null);
onMounted(() => {
  if (!viewDom.value) return;
  props.graph.viewModel.setViewDom(viewDom.value);
})

const showSelectionVertex = computed(() => {
  return store.selectedShapes.length > 0
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
// 监听画布上点击事件，用于清空选中状态
function handleMousedownOut(event: MouseEvent) {
  props.graph.emitter.emit(EventType.SHAPE_MOUSE_DOWN, event, undefined);
}
function handleMouseupOut() {
  props.graph.emitter.emit(EventType.SHAPE_MOUSE_UP, window.event, props.graph.rootShape);
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
  <div class="graph-view" ref="viewDom">
    <!-- 
          展示层
          * 整个画布的事件监听
        -->
    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" transform-origin="0 0"
      style="min-width: 100%; min-height: 100%;" :width="graph.viewModel.bounds.width"
      :height="graph.viewModel.bounds.height" @click="handleClickOut" @mousedown="handleMousedownOut"
      @mouseup="handleMouseupOut" @mousemove="handleMousemoveOut" @dragover="handleDragOver" @drop.stop="handleDrop">
      <g style="width: 100%;height: 100%;background-color: white;">
        <DiagramShape :graph="graph" :shape="graph.rootShape" />
      </g>
    </svg>
    <!-- 交互层 -->
    <svg version="1.1" xmlns="http://www.w3.org/2000/svg"
      style="min-width: 100%; min-height: 100%; position: absolute; top: 0; left: 200px; pointer-events: none"
      transform-origin="0 0" :width="graph.viewModel.bounds.width" :height="graph.viewModel.bounds.height">
      <g>
        <Shape-move-preview v-if="graph.moveModel.showMovingPreview" :shapes="graph.moveModel.movingShapes"
          :dx="graph.moveModel.previewDx" :dy="graph.moveModel.previewDy" />
        <selection-vertex v-if="showSelectionVertex" :selection="store.selectedShapes"
          @vertex-mousedown="handleVertexMousedown" />
      </g>

    </svg>
  </div>
</template>