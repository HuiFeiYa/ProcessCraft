<script setup lang="ts">
import { computed } from 'vue';
import { GraphModel } from '../../graph/models/graphModel';
import { useDrawStore } from '../store';
import { SubShapeType } from '../../graph/types';
const store = useDrawStore()
const props = defineProps<{ graph: GraphModel }>()
const selectedShapes = computed(() => {
    return props.graph.selectionModel.selectedShapes
})
const hasSelectedShape = computed(() => {
    return selectedShapes.value.length > 0
})
const deleteHandler = () => {
    if (hasSelectedShape) {
        const deleteIds = []
        const endEdgeShapes = new Map()
        store.shapes.forEach(shape => {
            /** 筛选处连接图形的 shape */
            if (shape.subShapeType === SubShapeType.CommonEdge) {
                if (shape.sourceId) {
                    endEdgeShapes.set(shape.sourceId, shape)
                }
                if (shape.targetId) {
                    endEdgeShapes.set(shape.targetId, shape)
                }
            }
        })
        selectedShapes.value.map(shape => {
            switch (shape.subShapeType) {
                case SubShapeType.Block: {
                    if (endEdgeShapes.has(shape.id)) {
                        const edgeShape = endEdgeShapes.get(shape.id)
                        deleteIds.push(edgeShape.id)
                    }
                    break
                }
                default: {

                }
            }
            deleteIds.push(shape.id)
        })
        store.deleteShapes(deleteIds)
        props.graph.selectionModel.clearSelection()
    }
}
</script>
<template>
    <div class="toolbar">
        <el-tooltip effect="dark" content="删除元素" placement="top-start">
            <el-button :disabled="!hasSelectedShape" icon="delete" text @click="deleteHandler"></el-button>
        </el-tooltip>

    </div>
</template>
<style>
.close {
    width: 20px;
    height: 20px;

}

.common-item {
    cursor: pointer;
    text-align: center;
    user-select: none;
}

.toolbar {
    display: flex;
    align-items: center;
    height: 38px;
    width: 100%;
    border-bottom: 1px solid #dadce0;
    padding: 0 10px;
}
</style>