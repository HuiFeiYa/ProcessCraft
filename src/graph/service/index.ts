import { useDrawStore } from "../../editor/store"
import { Shape, getUid } from "../types"
import { Change, ChangeType, Step, stepManager } from "../util/stepManager"
export interface UpdateShapeValue {
    [key: string]: any
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

/** 添加多个 shape 到 store，并且存储记录到 stepManager */
export const addShapesService = (shapes: (Shape[] | Set<Shape>)) => {
    store.addShapes(shapes)
    shapes.forEach(shape => {
        const stepId = getUid()
        const change = new Change(ChangeType.INSERT, shape.id)
        const step = new Step(stepId, stepIndex++, [change])
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
    store.updateShape(shape.id, Object.assign(shape, newValue))
    const change = new Change(ChangeType.UPDATE, shape.id)
    const stepId = getUid()
    const step = new Step(stepId, stepIndex++, [change])
    stepManager.add(step)
}