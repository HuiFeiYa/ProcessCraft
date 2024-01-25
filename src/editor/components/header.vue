<script setup lang="ts">
import { computed } from "vue";
import { GraphModel } from "../../graph/models/graphModel";
import { useDrawStore } from "../store";
import { SubShapeType } from "../../graph/types";
import {
  StepOperation,
  UpdateShapeValue,
  currentStep,
} from "../../graph/service";
import {
  Change,
  ChangeType,
  Step,
  stepManager,
} from "../../graph/util/stepManager";
import { Point } from "../../graph/util/Point";
import { CreateType, rootShape, shapeUtil } from "../../graph/shape/ShapeUtil";
import { HeaderHeight } from "../../graph/shape/constant";
const store = useDrawStore();
const props = defineProps<{ graph: GraphModel }>();
const selectedShapes = computed(() => {
  return props.graph.selectionModel.selectedShapes;
});
const hasSelectedShape = computed(() => {
  return selectedShapes.value.length > 0;
});


const deleteHandler = () => {
  if (hasSelectedShape) {
    const deleteIds = [];
    const endEdgeShapes = new Map();
    store.shapes.forEach((shape) => {
      /** 筛选处连接图形的 shape */
      if (shape.subShapeType === SubShapeType.CommonEdge) {
        if (shape.sourceId) {
          endEdgeShapes.set(shape.sourceId, shape);
        }
        if (shape.targetId) {
          endEdgeShapes.set(shape.targetId, shape);
        }
      }
    });
    selectedShapes.value.map((shape) => {
      switch (shape.subShapeType) {
        case SubShapeType.Block: {
          if (endEdgeShapes.has(shape.id)) {
            const edgeShape = endEdgeShapes.get(shape.id);
            deleteIds.push(edgeShape.id);
          }
          break;
        }
        default: {
        }
      }
      deleteIds.push(shape.id);
    });
    store.deleteShapes(deleteIds);
    props.graph.selectionModel.clearSelection();
  }
};
const restoreShape = async (value: UpdateShapeValue) => {
  const { siderbarKey, bounds, shapeId, waypoint, sourceId, targetId } = value;
  const shape = shapeUtil.createShape(siderbarKey, {
    point: new Point(bounds.absX, bounds.absY),
    waypoint,
    parentId: rootShape.id,
    sourceId, targetId
  }, CreateType.quick);
  shape.id = shapeId;
  return shape;
};
const undoHandler = () => {
  /** 可以回退的情况下 */
  if (currentStep.hasPrev) {
    stepManager
      .findPre(currentStep.stepId)
      .then(async (result: { step: Step; prevStepId: string }) => {
        const { prevStepId, step } = result;
        /** 回退到之前修改 */
        const changes = step.changes;
        // 最后的变更最先回退
        changes.reverse();
        const executePromisesSequentially = async (changes: Change[]) => {
          for (const change of changes) {
            await new Promise(async (resolve) => {
              switch (change.type) {
                /** 之前是新增，回退这边要删除 */
                case ChangeType.INSERT: {
                  store.deleteShape(change.shapeId);
                  resolve(null)
                  break;
                }
                case ChangeType.DELETE: {
                  const { oldValue } = change;
                  const shape = await restoreShape(oldValue);
                  store.addShapes([shape]);
                  resolve(null)
                  break;
                }
                case ChangeType.UPDATE: {
                  const { oldValue, shapeId } = change;
                  store.updateShape(shapeId, oldValue);
                  resolve(null)
                  break
                }
              }
            })
          }
        }
        await executePromisesSequentially(changes)
        currentStep.freshCurrentStep(prevStepId, StepOperation.undo);
      });
  }
};

const redoHandler = () => {
  if (currentStep.hasNext) {
    stepManager.findNext(currentStep.stepId).then(async (step: Step) => {
      const changes = step.changes;
      /** 每个 change 需要链式去更新，后面的 change 可能依赖前面的结果 */
      const executePromisesSequentially = async (changes: Change[]) => {
        for (const change of changes) {
          await new Promise(async (resolve) => {
            switch (change.type) {
              case ChangeType.INSERT: {
                const { newValue } = change;
                const shape = await restoreShape(newValue);
                store.addShapes([shape]);
                resolve(null);
                break;
              }
              case ChangeType.DELETE: {
                store.deleteShape(change.shapeId);
                resolve(null);
                break;
              }
              case ChangeType.UPDATE: {
                const { newValue, shapeId } = change;
                store.updateShape(shapeId, newValue);
                resolve(null);
              }
            }
          });
        }
      };
      await executePromisesSequentially(changes)
      currentStep.freshCurrentStep(step.stepId, StepOperation.redo);
    });
  }
};

const resetHandler = () => {
  store.$reset();
  stepManager.clear();
  currentStep.reset();
  store.shapeMap[rootShape.id] = rootShape
};
</script>

<template>
  <div class="toolbar" :style="{ height: HeaderHeight + 'px' }">
    <el-tooltip effect="dark" content="删除元素" placement="top-start">
      <el-button text @click="resetHandler">清空画布</el-button>
    </el-tooltip>
    <el-tooltip effect="dark" content="撤销" placement="top-start">
      <el-button text @click="undoHandler" :disabled="!currentStep.hasPrev">
        <el-image src="src/assets/undo.svg" :style="currentStep.hasPrev ? {} : { filter: 'grayscale(85%)' }"></el-image>
      </el-button>
    </el-tooltip>
    <el-tooltip effect="dark" content="重做" placement="top-start">
      <el-button text :disabled="!currentStep.hasNext" @click="redoHandler">
        <el-image src="src/assets/redo.svg" :style="currentStep.hasNext ? {} : { filter: 'grayscale(85%)' }"></el-image>
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
  width: 100%;
  border-bottom: 1px solid #dadce0;
  padding: 0 10px;
  box-sizing: border-box;
}

.undo img {
  color: #c1c5cb;
}
</style>
