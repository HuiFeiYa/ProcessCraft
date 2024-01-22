<script setup lang="ts">
import { provide, computed, onMounted, ref } from "vue";
import DiagramShape from "./DiagramShape.vue";
import { GraphModel } from "./models/graphModel";
import { shapeComps } from "./shape/index";
import ShapeMovePreview from "./shape/interaction/ShapeMovePreview.vue";
import SelectionVertex from "./shape/interaction/SelectionVertex.vue";
import ShapeResizePreview from "./shape/interaction/ShapeResizePreview.vue";
import EdgeMovePreview from "./shape/interaction/EdgeMovePreview.vue";
import Markers from "./shape/interaction/Markers.vue";
import {
  EventType,
  VertexType,
  CreatePointType,
  SiderbarItemKey,
} from "./shape/constant";
import { Shape, ShapeType } from "./types";
import { useDrawStore } from "../editor/store";
import QuickCreatePoint from "./shape/interaction/QuickCreatePoint.vue";
import ShapeDashboard from "./shape/interaction/shapeDashboard.vue";
import { SubShapeType } from "./types/index";
import { Point } from "./util/Point";
const store = useDrawStore();
const props = defineProps<{ graph: GraphModel }>();
provide("graph", props.graph);
props.graph.registerShapeComps(shapeComps);
const viewDom = ref<HTMLDivElement | null>(null);
/** 快速创建 edge ，的重点，用于 shapeDashboard 定位 */
const quickCreateEdgeShape = ref<Shape>(null)
/** 快速创建线的方向 */
const edgeIndex = ref();
onMounted(() => {
  if (!viewDom.value) return;
  props.graph.viewModel.setViewDom(viewDom.value);
});
/**
 * store 中是最新的样式， model 中存储的是历史的，@todo，如何同步？
 */
const selectedShapes = computed(() => {
  const ids = props.graph.selectionModel.selectedShapes.map(
    (shape) => shape.id
  );
  return store.shapes.filter((shape) => ids.includes(shape.id));
});
const showSelectionVertex = computed(() => {
  return (
    selectedShapes.value.length > 0 &&
    !props.graph.moveModel.showMovingPreview &&
    !props.graph.resizeModel.showResizePreview &&
    !props.graph.edgePointMoveModel.showPreview
  );
});

const edgeEndPoint = computed(() => {
  if (quickCreateEdgeShape) {
    const waypoint = quickCreateEdgeShape.value.waypoint
    return waypoint[waypoint.length - 1]
  } else {
    return {
      x: 0,
      y: 0
    }
  }
})
const showQuickCreatePoint = computed(() => {
  if (
    selectedShapes.value.length === 1 &&
    selectedShapes.value[0].subShapeType === SubShapeType.Block
  ) {
    return true;
  }
  return false;
});

function handleVertexMousedown(event: MouseEvent, index: VertexType) {
  const graph = props.graph;
  if (graph.selectionModel.selection.length === 0) return;
  if (graph.selectionModel.selection.length > 1) {
    graph.selectionModel.clearSelection();
  } else {
    const targetShape = selectedShapes.value[0];
    if (targetShape.shapeType === ShapeType.Symbol) {
      graph.resizeModel.startResize(event, selectedShapes.value[0], index);
    } else if (targetShape.shapeType === ShapeType.Edge) {
      graph.edgePointMoveModel.onEdgePointMouseDown(event, targetShape, index);
    }
  }
}
function handleClickOut() { }
// 监听画布上点击事件，用于清空选中状态
function handleMousedownOut(event: MouseEvent) {
  props.graph.emitter.emit(EventType.SHAPE_MOUSE_DOWN, event, undefined);
}
function handleMouseupOut() {
  props.graph.emitter.emit(
    EventType.SHAPE_MOUSE_UP,
    window.event,
    props.graph.rootShape
  );
}
function handleMousemoveOut(event: MouseEvent) {
  props.graph.emitter.emit(EventType.SHAPE_MOUSE_MOVE, event, undefined);
}
function handleDragOver() { }

const handleDrop = () => { };

/** 快速创建线 */
const handleQuickCreate = async (index: CreatePointType) => {
  const edgeShape = await props.graph.quickCreateEdge(
    selectedShapes.value[0],
    index
  );
  edgeIndex.value = index;
  quickCreateEdgeShape.value = edgeShape
  // 弹框，选择继续要创建的元素
  props.graph.isShowShapeDashboard = true
};

/** 快速创建指定图形 */
const handleCreateShape = async (siderBarkey: SiderbarItemKey) => {
  const edge = quickCreateEdgeShape.value
  const waypoint = edge.waypoint
  const shape = await props.graph.quickCreateSymbol(
    siderBarkey,
    waypoint[waypoint.length - 1],
    edgeIndex.value,
    edge
  );
  edgeIndex.value = "";
  quickCreateEdgeShape.value = null;
  props.graph.isShowShapeDashboard = false
};
</script>
<template>
  <div class="graph-view" ref="viewDom">
    <!-- 
          展示层
          * 整个画布的事件监听
        -->
    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" transform-origin="0 0" style="min-width: 100%; min-height: 100%"
      :width="graph.viewModel.bounds.width" :height="graph.viewModel.bounds.height" @click="handleClickOut"
      @mousedown="handleMousedownOut" @mouseup="handleMouseupOut" @mousemove="handleMousemoveOut"
      @dragover="handleDragOver" @drop.stop="handleDrop">
      <g style="width: 100%; height: 100%; background-color: white">
        <DiagramShape :graph="graph" :shape="graph.rootShape" />
      </g>
    </svg>
    <!-- 
      交互层
      * 设置了pointer-events， 元素永远不会成为鼠标事件的target (en-US)。其后端元素可以捕获
     -->
    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" style="
        min-width: 100%;
        min-height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        pointer-events: none;
      " transform-origin="0 0" :width="graph.viewModel.bounds.width" :height="graph.viewModel.bounds.height">
      <g>
        <Shape-move-preview v-if="graph.moveModel.showMovingPreview" :shapes="graph.moveModel.movingShapes"
          :dx="graph.moveModel.previewDx" :dy="graph.moveModel.previewDy" />
        <Shape-resize-preview v-if="graph.resizeModel.showResizePreview" :bounds="graph.resizeModel.previewBounds" />
        <selection-vertex v-if="showSelectionVertex" :selection="selectedShapes" :resize-model="graph.resizeModel"
          @vertex-mousedown="handleVertexMousedown" />
        <edge-move-preview v-if="graph.edgePointMoveModel.showPreview" :shape="graph.edgePointMoveModel.movingShape"
          :previewPath="graph.edgePointMoveModel.previewPath" />
        <Markers v-if="graph.markerModel.markerMap.size" :markerMap="graph.markerModel.markerMap" />
        <!-- <LabelEditor v-if="graph.labelEditorModel.showPreview" :editor-model="graph.labelEditorModel" /> -->
        <QuickCreatePoint v-if="showQuickCreatePoint" :bounds="selectedShapes[0].bounds" @create="handleQuickCreate">
        </QuickCreatePoint>
        <ShapeDashboard v-if="graph.isShowShapeDashboard" :x="edgeEndPoint.x" :y="edgeEndPoint.y"
          @create-shape="handleCreateShape" />
      </g>
    </svg>
  </div>
</template>
<style>
.graph-view {
  position: relative;
}
</style>
