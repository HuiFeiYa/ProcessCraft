<script setup lang="ts">
import { computed, inject } from 'vue'
import { Shape } from '../../types';
import { GraphModel } from '../../models/graphModel';
import { VertexType } from '../constant';
import { useDrawStore } from '../../../editor/store';
const store = useDrawStore()
const props = defineProps<{
    selection: Shape[]
}>();
const emit = defineEmits<{
    (event: 'vertex-mousedown', evt:MouseEvent, index:VertexType): void
}>()
const graph = inject<GraphModel>('graph');

const shapeGroup = computed(() => {
    let commonShapes:Shape[] = store.selectedShapes;
    return {
        commonShapes
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
      <rect
        :x="shape.bounds.absX - 6"
        :y="shape.bounds.absY - 6"
        width="6"
        height="6"
        fill="#000"
        :style="{cursor: resizable?'nw-resize':''}"
        @mousedown="handleMouseDown($event, 1)"
      />
      <rect
        :x="shape.bounds.absX + shape.bounds.width"
        :y="shape.bounds.absY - 6"
        width="6"
        height="6"
        fill="#000"
        :style="{cursor: resizable?'ne-resize':''}"
        @mousedown="handleMouseDown($event, 2)"
      />
      <rect
        :x="shape.bounds.absX + shape.bounds.width"
        :y="shape.bounds.absY + shape.bounds.height"
        width="6"
        height="6"
        fill="#000"
        :style="{cursor: resizable?'se-resize':''}"
        @mousedown="handleMouseDown($event, 3)"
      />
      <rect
        :x="shape.bounds.absX - 6"
        :y="shape.bounds.absY + shape.bounds.height"
        width="6"
        height="6"
        fill="#000"
        :style="{cursor: resizable?'sw-resize':''}"
        @mousedown="handleMouseDown($event, 4)"
      />
      </g>
  </g>
</template>