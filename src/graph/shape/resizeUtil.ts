import { graph } from "../../editor/graphEditor";
import { useDrawStore } from "../../editor/store";
import { Bounds, Shape, ShapeType, SubShapeType } from "../types";
import { Change, ChangeType } from "../util/stepManager";

/**
 * 图形大小调整工具类
 */
export class ResizeUtil {
    affectedShapes: Set<Change> = new Set()
    /**
     * 画布的撑开
     * 画布只能向右边或下边撑开
     * @param shape
     */
    expandParent(shape: Shape) {
        const store = useDrawStore()
        const parent = store.shapeMap[shape.parentId]
        const parentBounds = parent.bounds;

        let dWidth: number;
        let dHeight: number;
        if (shape.subShapeType === SubShapeType.CommonEdge) {
            const xList = shape.waypoint.map(point => point.x)
            const maxX = Math.max(...xList)
            const maxY = Math.max(...shape.waypoint.map(point => point.y))
            dWidth = parentBounds.absX + parentBounds.width - maxX - (parent.style.paddingRight || 0);
            dHeight = parentBounds.absY + parentBounds.height - maxY - (parent.style.paddingBottom || 0);
        } else {
            const bounds = shape.bounds;
            dWidth = parentBounds.absX + parentBounds.width - (bounds.absX + bounds.width) - (parent.style.paddingRight || 0);
            dHeight = parentBounds.absY + parentBounds.height - (bounds.absY + bounds.height) - (parent.style.paddingBottom || 0);

        }
        // 超出当前画布 x 轴方向
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
        if (dHeight < 0) {
            const change = new Change(ChangeType.UPDATE, parent.id)
            change.oldValue = {
                ...parentBounds
            }
            parentBounds.height -= dHeight;
            change.newValue = parentBounds
            this.affectedShapes.add(change);
        }
        if (this.affectedShapes.size > 0) {
            graph.viewModel.updateBounds()
        }
    }
}
export const resizeUtil = new ResizeUtil();