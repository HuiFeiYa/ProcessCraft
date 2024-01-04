<script setup lang="ts">
import { computed, inject } from 'vue';
import { Shape } from '../../types';
import { GraphModel } from '../../models/graphModel';
import { createEventHandler } from '../createEventHandler';
import { waypointUtil } from '../../util/WaypointUtil';
import { arrowMap } from './common/arrows/ArrowMap'
const props = defineProps<{
    shape: Shape
}>();

const graph = inject<GraphModel>('graph');
const eventHandler = createEventHandler(graph, props);

const computedData = computed(() => {
    const svgPath = waypointUtil.getSvgPath(props.shape)
    const style = props.shape.style
    return {
        svgPath,
        style
    }
})
</script>
<template>
    <g @click.stop @mousedown.stop @mouseup.stop @mousemove.stop @dragenter.stop @dragleave.stop @drop.stop @dragover.stop
        v-on="eventHandler">
        <div>line</div>
        <!-- 展示线 -->
        <path :d="computedData.svgPath" :stroke="computedData.style.strokeColor"
            :stroke-dasharray="computedData.style.strokeDasharray || (computedData.style.dashed ? '10 8' : '')"
            :stroke-width="computedData.style.strokeWidth" fill="none" stroke-linejoin="round" />

        <!-- 箭头 -->
        <component :is="arrowMap[computedData.style.targetArrow]" v-if="computedData.style.targetArrow" :edge="shape"
            :style="computedData.style" position="end" />
        <!-- 操作线，设置宽度为10，透明方便拖拽 -->
        <path :d="computedData.svgPath" fill="none" :stroke-width="10" stroke="rgba(0,0,0,0)" stroke-linejoin="round" />
    </g>
</template>