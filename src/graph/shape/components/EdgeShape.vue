<script setup lang="ts">
import { computed, inject } from 'vue';
import { Shape } from '../../types';
import { GraphModel } from '../../models/graphModel';
import { createEventHandler } from '../createEventHandler';
import { waypointUtil } from '../../util/WaypointUtil';

const props = defineProps<{
  shape:Shape
}>();

const graph = inject<GraphModel>('graph');
const eventHandler = createEventHandler(graph, props);

const computedData = computed(()=> {
    const svgPath = waypointUtil.getSvgPath(props.shape)
    const style = props.shape.style
    return {
        svgPath,
        style
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
    @drop.stop
    @dragover.stop
    v-on="eventHandler"
  >
  <div>line</div>
  <path
      :d="computedData.svgPath"
      :stroke="computedData.style.strokeColor"
      :stroke-dasharray="computedData.style.strokeDasharray || (computedData.style.dashed?'10 8':'')"
      :stroke-width="computedData.style.strokeWidth"
      fill="none"
      stroke-linejoin="round"
    />
  </g>
</template>