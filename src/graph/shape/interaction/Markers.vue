<script setup lang="ts">
import { computed, inject } from 'vue';
import { Marker } from '../../models/Marker';
import { GraphModel } from '../../models/graphModel';
import { Shape, SubShapeType } from '../../types';
import { EventType } from '../constant';
import { ShapeType } from '../../types/shapeOption';

const props = defineProps<{ markerMap: Map<string, Marker> }>();

// 模型合并的时候标记了marker图像可以点击跳转到合并模型树
const graph = inject<GraphModel>('graph');
function handleClickMarker(shape: Shape | null) {
    if (shape) {
        graph.emitter.emit(EventType.PROJECT_MERGE_SHAPE_CLICK, shape);
    }
}

const typedMarkers = computed(() => {
    const symbolMarkers: Marker[] = [];
    const edgeMarkers: Marker[] = [];
    const lifelineMarkers: Marker[] = [];
    props.markerMap.forEach(m => {
        if (m.targetShape) {
            if (m.targetShape.shapeType === ShapeType.Edge) {
                edgeMarkers.push(m);
            } else if (m.targetShape.subShapeType === SubShapeType.Lifeline) {
                lifelineMarkers.push(m);
            } else {
                symbolMarkers.push(m);
            }
        }

    });

    return {
        symbolMarkers,
        edgeMarkers,
        lifelineMarkers
    };
});
</script>
<template>
    <g>
        <!-- 根据目标元素绘制对应 rect 边框 -->
        <rect v-for="marker in typedMarkers.symbolMarkers" v-show="marker.visible" :key="marker.id"
            :x="marker.targetShape!.bounds.absX - marker.strokeWidth / 2"
            :y="marker.targetShape!.bounds.absY - marker.strokeWidth / 2"
            :width="marker.targetShape!.bounds.width + marker.strokeWidth"
            :height="marker.targetShape!.bounds.height + marker.strokeWidth" fill="none" :stroke="marker.strokeColor"
            :stroke-width="3" @click="handleClickMarker(marker.targetShape)"></rect>
    </g>
</template>