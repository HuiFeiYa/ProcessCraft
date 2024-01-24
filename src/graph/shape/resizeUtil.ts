import { useDrawStore } from "../../editor/store";
import { Shape, ShapeType } from "../types";
import { Change, ChangeType } from "../util/stepManager";

/**
 * 图形大小调整工具类
 */
export class ResizeUtil {
    affectedShapes: Set<Change> = new Set()
    store = useDrawStore()
    /**
     * 画布的撑开
     * 画布只能向右边或下边撑开
     * @param shape
     */
    expandParent(shape: Shape) {
        const parent = this.store.shapeMap[shape.parentId]
        const bounds = shape.bounds;
        const parentBounds = parent.bounds;
        // 超出当前画布 x 轴方向
        const dWidth = parentBounds.absX + parentBounds.width - (bounds.absX + bounds.width) - (parent.style.paddingRight || 0);
        if (dWidth < 0) {
            const change = new Change(ChangeType.UPDATE, parent.id)
            change.oldValue = {
                ...parentBounds
            }
            parentBounds.width -= dWidth;
            change.newValue = parentBounds
            this.affectedShapes.add(change);
        }
        // 超出当前画布 y 轴方向
        const dHeight = parentBounds.absY + parentBounds.height - (bounds.absY + bounds.height) - (parent.style.paddingBottom || 0);
        if (dHeight < 0) {
            const change = new Change(ChangeType.UPDATE, parent.id)
            change.oldValue = {
                ...parentBounds
            }
            parentBounds.height -= dHeight;
            change.newValue = parentBounds
            this.affectedShapes.add(change);
        }
    }
}