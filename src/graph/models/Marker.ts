import { Shape } from "../types"
import { getUid, pathBuilder } from "../util"

/**
 * 一个标亮效果
 */
export class Marker {
    id = getUid()
    targetShape: Shape | null
    // marker 的样式最终会在 src/graph/shape/interaction/Markers.vue:50 进行设置，对应 rect 样式
    strokeColor: string
    strokeWidth: number
    visible = false
    type?: string // marker的类型，用于批量移除某一类的marker
    constructor(targetShape: Shape | null, strokeColor: string, strokeWidth = 2, visible = true) {
        this.targetShape = targetShape;
        this.strokeColor = strokeColor;
        this.strokeWidth = strokeWidth;
        this.visible = visible;
    }
    setTargetShape(shape: Shape) {
        this.targetShape = shape;

    }

    setStrokeColor(color: string) {
        this.strokeColor = color;
    }

    setStrokeWidth(width: number) {
        this.strokeWidth = width;
    }
    setVisible(visible: boolean) {
        this.visible = visible;
    }

    setType(type: string) {
        this.type = type;
    }
    // 根据 waypoint 绘制路径，将各个点通过直线连接
    getSvgPath() {
        const points = this.targetShape?.waypoint;
        if (points?.length) {
            pathBuilder.clear();
            const firstPoint = points[0];
            pathBuilder.MoveTo(firstPoint.x, firstPoint.y);
            points.forEach((pt, index) => {
                if (index === 0) return;
                pathBuilder.LineTo(pt.x, pt.y);

            });
            return pathBuilder.getPath();
        } else {
            return '';
        }
    }
}