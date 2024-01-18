import { toRaw } from "vue"
import { useDrawStore } from "../../editor/store"
import { Shape } from "../types"
import { Change, ChangeType, Step, stepManager } from "../util/stepManager"
import { getStepId } from "../util"
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
let stepIndex = 0;

stepManager.findAll().then((list: Step[]) => {
    const index = list[0] ? list[0].index : 0
    stepIndex = index
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

type Shapes = (Shape[] | Set<Shape>)
/** 添加多个 shape 到 store，并且存储记录到 stepManager */
export const addShapesService = (shapes: Shapes) => {
    store.addShapes(shapes)
    shapes.forEach(shape => {
        const stepId = getStepId()
        const change = new Change(ChangeType.INSERT, shape.id)
        const step = new Step(stepId, stepIndex++, [convertToRaw(change)])
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
    store.updateShape(shape.id, newValue)
    /** 设置单个 change，一次更新，可能包含多个图形的更新 */
    const change = new Change(ChangeType.UPDATE, shape.id)
    change.newValue = newValue
    change.oldValue = oldValue
    /** 生成一个 step 变更 */
    const stepId = getStepId()
    const step = new Step(stepId, stepIndex++, [convertToRaw(change)])
    stepManager.add(step)
}

export const batchUpdateShapesService = (effectList: UpdatePatchItem[]) => {
    store.batchUpdateShapes(effectList)
    const changes = effectList.map(effect => {
        const change = new Change(ChangeType.UPDATE, effect.id)
        change.newValue = effect.newVal
        change.oldValue = effect.oldVal
        return change
    })
    /** 生成一个 step 变更 */
    const stepId = getStepId()
    const step = new Step(stepId, stepIndex++, convertToRaw(changes))
    stepManager.add(step)
}