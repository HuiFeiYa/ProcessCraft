<script setup lang="ts">
import { computed, inject } from 'vue'
import { Shape, SubShapeType } from '../../types';
import { GraphModel } from '../../models/graphModel';
import { VertexType } from '../constant';
import { ResizeModel } from '../../models/ResizeModel';
const props = defineProps<{
  selection: Shape[],
  resizeModel?: ResizeModel
}>();
const emit = defineEmits<{
  (event: 'vertex-mousedown', evt: MouseEvent, index: VertexType): void
}>()
const graph = inject<GraphModel>('graph');

const shapeGroup = computed(() => {
  let commonShapes: Shape[] = []
  let edgeShapes: Shape[] = []
  props.selection.forEach(shape => {
    if (shape.subShapeType === SubShapeType.CommonEdge) {
      edgeShapes.push(shape)
    } else {
      commonShapes.push(shape)
    }
  })
  return {
    commonShapes,
    edgeShapes
  }
})
const resizable = computed(() => {
  const selection = props.selection;

  if (selection.length !== 1) return false;
  const item = selection[0];
  if (item.style?.resizable) {
    return true;
  }
  return false;
});

function handleMouseDown(event: MouseEvent, index: VertexType) {
  (event as Event).stopPropagation();
  if (graph.disabled) {
    return;
  }
  emit('vertex-mousedown', event, index);

}
</script>
<template>
  <g style="pointer-events:all">
    <!-- symbol 图形 -->
    <g v-for="shape in shapeGroup.commonShapes" :key="shape.id">
      <rect :x="shape.bounds.absX" :y="shape.bounds.absY" width="6" height="6" fill="#000"
        :style="{ cursor: resizable ? 'nw-resize' : '', transform: 'translate(-3px,-3px)' }"
        @mousedown="handleMouseDown($event, 1)" />
      <rect :x="shape.bounds.absX + shape.bounds.width" :y="shape.bounds.absY" width="6" height="6" fill="#000"
        :style="{ cursor: resizable ? 'ne-resize' : '', transform: 'translate(-3px,-3px)' }"
        @mousedown="handleMouseDown($event, 2)" />
      <rect :x="shape.bounds.absX + shape.bounds.width" :y="shape.bounds.absY + shape.bounds.height" width="6" height="6"
        fill="#000" :style="{ cursor: resizable ? 'se-resize' : '', transform: 'translate(-3px,-3px)' }"
        @mousedown="handleMouseDown($event, 3)" />
      <rect :x="shape.bounds.absX" :y="shape.bounds.absY + shape.bounds.height" width="6" height="6" fill="#000"
        :style="{ cursor: resizable ? 'sw-resize' : '', transform: 'translate(-3px,-3px)' }"
        @mousedown="handleMouseDown($event, 4)" />
    </g>
    <!-- edge 图形 -->
    <g v-for="shape in shapeGroup.edgeShapes" :key="shape.id">
      <g v-if="shape.waypoint">
        <rect v-for="(point, index) in (shape).waypoint" :key="index" :x="point.x - 3" :y="point.y - 3" width="6"
          height="6" fill="#000" style="cursor: crosshair" @mousedown="handleMouseDown($event, index)" />
      </g>
    </g>
  </g>
</template>