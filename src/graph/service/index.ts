import { reactive, toRaw } from "vue";
import { useDrawStore } from "../../editor/store";
import { Shape } from "../types";
import { Change, ChangeType, Step, stepManager } from "../util/stepManager";
import { getStepId, recursiveOmit, structuralEquality } from "../util";
import { Point } from "../util/Point";
export interface UpdateShapeValue {
  [key: string]: any;
}

export interface UpdatePatchItem {
  newVal: UpdateShapeValue;
  oldVal: UpdateShapeValue;
  id: string;
}
export const patchItemFactory: () => UpdatePatchItem = () => {
  return {
    newVal: {},
    oldVal: {},
    id: "",
  };
};

class CurrentStep {
  hasPrev = false;
  hasNext = false;
  stepId = ""; // 指针指向 step 记录
  stepSize = 0; // 总的 step 数，用于判断是否有 next
  nextStepIndex = 0; /** 用于判断是否有 prev */
  /** 更新 currentStep 信息 */
  freshCurrentStep(stepId: string, operation = StepOperation.add) {
    /** 第一次操作更新 currentStep 状态 */
    if (!this.hasPrev && this.nextStepIndex === 0) {
      this.hasPrev = true;
    }
    this.stepId = stepId;
    /**
     * 回退过新增删除之前的 nextStepIndex 之后的
     * 从 nextStepIndex + 1  重新创建新的 step
     */
    switch (operation) {
      case StepOperation.add: {
        if (this.hasNext) {
          this.nextStepIndex++;
          this.stepSize = this.nextStepIndex;
          this.hasNext = this.nextStepIndex !== this.stepSize;
          this.hasPrev = this.nextStepIndex !== 0;
        } else {
          this.stepSize++;
          this.nextStepIndex++;
          this.hasNext = this.nextStepIndex !== this.stepSize;
          this.hasPrev = this.nextStepIndex !== 0;
        }
        break;
      }
      case StepOperation.redo: {
        this.nextStepIndex++;
        this.hasNext = this.nextStepIndex !== this.stepSize;
        this.hasPrev = true;
        break;
      }
      case StepOperation.undo: {
        // undo stepSize 不变，数据会在 undo 时候使用
        this.nextStepIndex--;
        this.hasNext = true;
        this.hasPrev = this.nextStepIndex !== 0;
        break;
      }
    }
  }
  /**
   * 更新时调用，如何更新前发现有 next 需要清空 next 之后的记录
   */
  deleteAfterIndex() {
    if (this.hasNext) {
      stepManager.deleteAfterIndex(this.nextStepIndex - 1);
    }
  }
  reset() {
    this.hasNext = false;
    this.hasPrev = false;
    this.stepId = "";
    this.stepSize = 0;
    this.nextStepIndex = 0;
  }
}
export const currentStep = reactive(new CurrentStep());
//@ts-ignore
window.currentStep = currentStep;
stepManager.findAll().then((list: Step[]) => {
  const step = list[list.length - 1];
  if (step) {
    currentStep.nextStepIndex = step.index;
    currentStep.stepId = step.stepId;
    currentStep.hasPrev = step.index > 0;
    currentStep.hasNext = step.index < list.length - 1;
  }
});

// service 层，后续可以替代为调用后端接口，目前实现是直接更新 store
let store;

setTimeout(() => {
  store = useDrawStore();
}, 0);

function convertToRaw(obj) {
  if (!obj || typeof obj !== "object") {
    return obj;
  }

  const rawObj = toRaw(obj);

  Object.keys(rawObj).forEach((key) => {
    rawObj[key] = convertToRaw(rawObj[key]);
  });

  return rawObj;
}
export enum StepOperation {
  add = "add",
  update = "update",
  undo = "undo",
  redo = "redo",
}

type Shapes = Shape[] | Set<Shape>;
/** 添加多个 shape 到 store，并且存储记录到 stepManager */
export const addShapesService = (createdShapes: Set<Shape> | Shape[], affectedShapes?: Set<Change> | Change[]) => {
  store.addShapes(createdShapes);
  let changes = []
  createdShapes.forEach((shape: Shape) => {
    const change = new Change(ChangeType.INSERT, shape.id);
    change.newValue = {
      siderbarKey: shape.siderbarKey,
      bounds: shape.bounds,
      waypoint: shape.waypoint,
      shapeId: shape.id,
    };
    changes.push(convertToRaw(change))
  });

  affectedShapes?.forEach((change: Change) => {
    changes.push(convertToRaw(change))
  })
  const stepId = getStepId();
  const step = new Step(stepId, currentStep.nextStepIndex, changes);
  currentStep.deleteAfterIndex();
  stepManager.add(step);
  currentStep.freshCurrentStep(stepId);
};

/**
 * 更新 shape
 * @param id
 * @param newValue
 * @param oldValue
 * @param isInitStep 是否要生成一个 step 记录
 * @returns
 */
export const updateShapeService = (
  id: string,
  newValue: UpdateShapeValue,
  oldValue: UpdateShapeValue,
  isInitStep = true
) => {
  if (isInitStep) {
    if (structuralEquality(oldValue, newValue)) {
      return;
    }
    store.updateShape(id, newValue);
    /** 设置单个 change，一次更新，可能包含多个图形的更新 */
    const change = new Change(ChangeType.UPDATE, id);
    change.newValue = newValue;
    change.oldValue = oldValue;
    /** 生成一个 step 变更 */
    const stepId = getStepId();
    const step = new Step(stepId, currentStep.nextStepIndex, [
      convertToRaw(change),
    ]);
    currentStep.deleteAfterIndex();
    stepManager.add(step);
    currentStep.freshCurrentStep(stepId);
  } else {
    store.updateShape(id, newValue);
  }
};

/**
 * 批量更新
 * @param effectList
 */
export const batchUpdateShapesService = (effectList: UpdatePatchItem[]) => {
  /** 判断更新前后的值是否相同，只更新不相同的 */
  const validEffectList = effectList
    .map((effect) => convertToRaw(effect))
    .filter((effect) => {
      return !structuralEquality(effect.newVal, effect.oldVal);
    });
  if (validEffectList.length === 0) return;

  store.batchUpdateShapes(validEffectList);
  const changes = validEffectList.map((effect) => {
    const change = new Change(ChangeType.UPDATE, effect.id);
    change.newValue = effect.newVal;
    change.oldValue = effect.oldVal;
    return change;
  });
  /** 生成一个 step 变更 */
  const stepId = getStepId();
  const step = new Step(stepId, currentStep.nextStepIndex, changes);
  currentStep.deleteAfterIndex();
  stepManager.add(step);
  currentStep.freshCurrentStep(stepId);
};
