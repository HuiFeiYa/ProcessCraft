import { reactive, toRaw } from "vue"
import { useDrawStore } from "../../editor/store"
import { Shape } from "../types"
import { Change, ChangeType, Step, stepManager } from "../util/stepManager"
import { getStepId, recursiveOmit, structuralEquality } from "../util"
import { Point } from "../util/Point"
export interface UpdateShapeValue {
    [key: string]: any
}


export interface UpdatePatchItem { newVal: UpdateShapeValue, oldVal: UpdateShapeValue, id: string }
export const patchItemFactory: () => UpdatePatchItem = () => {
    return {
        newVal: {},
        oldVal: {},
        id: ''
    }
}

class CurrentStep {
    hasPrev = false
    hasNext = false
    stepId = '' // 指针指向 step 记录
    stepSize = 0 // 总的 step 数，用于判断是否有 next
    stepIndex = 0 /** 用于判断是否有 prev */
}
export const currentStep = reactive(new CurrentStep())
//@ts-ignore
window.currentStep = currentStep
stepManager.findAll().then((list: Step[]) => {
    const step = list[list.length - 1]
    if (step) {
        currentStep.stepIndex = step.index
        currentStep.stepId = step.stepId
        currentStep.hasPrev = step.index > 0
        currentStep.hasNext = step.index < list.length - 1
    }

})


// service 层，后续可以替代为调用后端接口，目前实现是直接更新 store
let store

setTimeout(() => {
    store = useDrawStore()
}, 0);

function convertToRaw(obj) {
    if (!obj || typeof obj !== 'object') {
        return obj;
    }

    const rawObj = toRaw(obj);

    Object.keys(rawObj).forEach(key => {
        rawObj[key] = convertToRaw(rawObj[key]);
    });

    return rawObj;
}

/** 更新 currentStep 信息 */
const freshCurrentStep = (stepId: string) => {
    /** 回退过，然后再新增 */
    if (currentStep.hasNext) {
        currentStep.hasNext = false
    }
    /** 第一次操作更新 currentStep 状态 */
    if (!currentStep.hasPrev && currentStep.stepIndex === 0) {
        currentStep.hasPrev = true
    }
    currentStep.stepSize++
    currentStep.stepId = stepId
}
type Shapes = (Shape[] | Set<Shape>)
/** 添加多个 shape 到 store，并且存储记录到 stepManager */
export const addShapesService = (shapes: Shapes) => {
    store.addShapes(shapes)
    shapes.forEach(shape => {
        const stepId = getStepId()
        const change = new Change(ChangeType.INSERT, shape.id)
        change.newValue = {
            siderbarKey: shape.siderbarKey,
            point: new Point(shape.bounds.absX, shape.bounds.absY)
        }
        freshCurrentStep(stepId)
        const step = new Step(stepId, currentStep.stepIndex, [convertToRaw(change)])
        stepManager.add(step)
    })
}
/**
 * 更新单个 shape
 * @param shape
 */
export const updateShapeService = (shape: Shape, newValue: UpdateShapeValue) => {
    const oldValue = {}
    for (const key in newValue) {
        oldValue[key] = shape[key]
    }
    if (structuralEquality(oldValue, newValue)) {
        return
    }
    store.updateShape(shape.id, newValue)
    /** 设置单个 change，一次更新，可能包含多个图形的更新 */
    const change = new Change(ChangeType.UPDATE, shape.id)
    change.newValue = newValue
    change.oldValue = oldValue
    /** 生成一个 step 变更 */
    const stepId = getStepId()
    freshCurrentStep(stepId)
    const step = new Step(stepId, currentStep.stepIndex, [convertToRaw(change)])
    stepManager.add(step)
}

/**
 * 批量更新
 * @param effectList 
 */
export const batchUpdateShapesService = (effectList: UpdatePatchItem[]) => {
    /** 判断更新前后的值是否相同，只更新不相同的 */
    const validEffectList = effectList.map(effect => convertToRaw(effect)).filter(effect => {
        return !structuralEquality(effect.newVal, effect.oldVal)
    }).map(effect => {
        const [newVal, oldVal] = recursiveOmit(effect.newVal, effect.oldVal)
        effect.newVal = newVal
        effect.oldVal = oldVal
        return effect
    })
    if (validEffectList.length === 0) return

    store.batchUpdateShapes(validEffectList)
    const changes = validEffectList.map(effect => {
        const change = new Change(ChangeType.UPDATE, effect.id)
        change.newValue = effect.newVal
        change.oldValue = effect.oldVal
        return change
    })
    /** 生成一个 step 变更 */
    const stepId = getStepId()
    freshCurrentStep(stepId)
    const step = new Step(stepId, currentStep.stepIndex, changes)
    stepManager.add(step)
}