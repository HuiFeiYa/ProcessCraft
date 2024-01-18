<script setup lang="ts">
import { computed } from 'vue';
import { GraphModel } from '../../graph/models/graphModel';
import { useDrawStore } from '../store';
import { SubShapeType } from '../../graph/types';
import { currentStep } from '../../graph/service';
import { Change, ChangeType, Step, stepManager } from '../../graph/util/stepManager';
import { SiderBarDropBehavior } from '../../graph/shape/behavior/SiderbarDropBehavior';
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

const undoHandler = () => {
    /** 可以回退的情况下 */
    if (currentStep.hasPrev) {
        stepManager.findPre(currentStep.stepId).then((result: { step: Step, prevStepId: string }) => {
            const { prevStepId, step } = result
            currentStep.hasNext = true
            currentStep.stepIndex--
            currentStep.hasPrev = currentStep.stepIndex > 0
            currentStep.stepId = prevStepId
            /** 回退到之前修改 */
            const changes = step.changes;
            changes.reverse()
            changes.forEach((change: Change) => {
                switch (change.type) {
                    /** 之前是新增，回退这边要删除 */
                    case ChangeType.INSERT: {
                        store.deleteShape(change.shapeId)
                        break;
                    }
                    case ChangeType.DELETE: {
                        const { oldValue: { siderBarKey, point } } = change
                        const shape = SiderBarDropBehavior.createShapeUtil(siderBarKey, point)
                        store.addShapes([shape])
                        break;
                    }
                    case ChangeType.UPDATE: {
                        const { oldValue, shapeId } = change
                        store.updateShape(shapeId, oldValue)
                    }
                }
            })
        })
    }
}

const redoHandler = () => {

}

const resetHandler = () => {
    store.$reset()
}
</script>
<template>
    <div class="toolbar">

        <el-tooltip effect="dark" content="删除元素" placement="top-start">
            <el-button text @click="resetHandler">清空画布</el-button>
        </el-tooltip>
        <el-tooltip effect="dark" content="撤销" placement="top-start">
            <el-button text @click="undoHandler" :disabled="!currentStep.hasPrev">
                <el-image src="src/assets/undo.svg"
                    :style="currentStep.hasPrev ? {} : { filter: 'grayscale(85%)' }"></el-image>
            </el-button>
        </el-tooltip>
        <el-tooltip effect="dark" content="重做" placement="top-start">
            <el-button text :disabled="!currentStep.hasNext" @click="redoHandler">
                <el-image src="src/assets/redo.svg"
                    :style="currentStep.hasNext ? {} : { filter: 'grayscale(85%)' }"></el-image>
            </el-button>
        </el-tooltip>
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

.redo img {
    color: #c1c5cb;
}
</style>