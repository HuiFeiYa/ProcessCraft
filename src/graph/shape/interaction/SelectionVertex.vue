<script setup lang="ts">
import { computed, inject } from 'vue'
import { Shape } from '../../types';
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
  return {
    commonShapes: props.selection
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
    <g v-for="shape in shapeGroup.commonShapes" :key="shape.id">
      <!-- 预览控制点渲染 -->
      <template v-if="resizeModel?.showResizePreview && shape.id === resizeModel?.resizeShape.id">
        <rect :x="resizeModel.previewBounds.absX" :y="resizeModel.previewBounds.absY" width="6" height="6" fill="#000"
          :style="{ cursor: resizable ? 'nw-resize' : '', transform: 'translate(-3px,-3px)' }"
          @mousedown="handleMouseDown($event, 1)" />
        <rect :x="resizeModel.previewBounds.absX + resizeModel.previewBounds.width" :y="resizeModel.previewBounds.absY"
          width="6" height="6" fill="#000"
          :style="{ cursor: resizable ? 'ne-resize' : '', transform: 'translate(-3px,-3px)' }"
          @mousedown="handleMouseDown($event, 2)" />
        <rect :x="resizeModel.previewBounds.absX + resizeModel.previewBounds.width"
          :y="resizeModel.previewBounds.absY + resizeModel.previewBounds.height" width="6" height="6" fill="#000"
          :style="{ cursor: resizable ? 'se-resize' : '', transform: 'translate(-3px,-3px)' }"
          @mousedown="handleMouseDown($event, 3)" />
        <rect :x="resizeModel.previewBounds.absX" :y="resizeModel.previewBounds.absY + resizeModel.previewBounds.height"
          width="6" height="6" fill="#000"
          :style="{ cursor: resizable ? 'sw-resize' : '', transform: 'translate(-3px,-3px)' }"
          @mousedown="handleMouseDown($event, 4)" />
      </template>
      <!-- 移动选中控制点渲染 -->
      <template v-else>
        <rect :x="shape.bounds.absX" :y="shape.bounds.absY" width="6" height="6" fill="#000"
          :style="{ cursor: resizable ? 'nw-resize' : '', transform: 'translate(-3px,-3px)' }"
          @mousedown="handleMouseDown($event, 1)" />
        <rect :x="shape.bounds.absX + shape.bounds.width" :y="shape.bounds.absY" width="6" height="6" fill="#000"
          :style="{ cursor: resizable ? 'ne-resize' : '', transform: 'translate(-3px,-3px)' }"
          @mousedown="handleMouseDown($event, 2)" />
        <rect :x="shape.bounds.absX + shape.bounds.width" :y="shape.bounds.absY + shape.bounds.height" width="6"
          height="6" fill="#000" :style="{ cursor: resizable ? 'se-resize' : '', transform: 'translate(-3px,-3px)' }"
          @mousedown="handleMouseDown($event, 3)" />
        <rect :x="shape.bounds.absX" :y="shape.bounds.absY + shape.bounds.height" width="6" height="6" fill="#000"
          :style="{ cursor: resizable ? 'sw-resize' : '', transform: 'translate(-3px,-3px)' }"
          @mousedown="handleMouseDown($event, 4)" />
      </template>
    </g>
  </g>
</template>