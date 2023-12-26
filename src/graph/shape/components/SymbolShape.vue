<script setup lang="ts">
import { inject } from 'vue'
import { Shape } from '../../types/index'
import { createEventHandler } from '../createEventHandler';
import { GraphModel } from '../../models/graphModel';
const props = defineProps<{ shape: Shape }>()
const graph = inject('graph') as GraphModel;
const eventHandler = createEventHandler(graph, props);
</script>
<template>
  <g @click.stop @mousedown.stop @mouseup.stop @mousemove.stop @dragenter.stop dragenter stop @dragleave.stop @drop.stop
    @dragover.stop>

    <!-- 最外层是绝对坐标，要创建相对坐标系需要用<g transform="translate(absX,absY)/> 或foreignObject" -->

    <foreignObject :width="shape.bounds.width" :height="shape.bounds.height" :x="shape.bounds.absX" :y="shape.bounds.absY"
      style="overflow:visible" v-on="eventHandler">
      <div style="user-select: none;">1111</div>
    </foreignObject>
  </g>
</template>