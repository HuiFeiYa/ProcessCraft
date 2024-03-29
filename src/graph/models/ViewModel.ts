import { Bounds } from "../util/Bounds"
import { Point } from "../util/Point";
import { GraphModel } from "./graphModel";

export class ViewModel {

    viewDom: HTMLDivElement | undefined
    bounds = new Bounds(0, 0, 1000, 1000)
    scale = 1
    paddingRight = 300
    paddingBottom = 300
    minWidth = 600
    minHeight = 400
    translate = new Point() // 画布的整体的平移量，为了让所有图形都能显示出来，如果出现坐标的x，y为负数的图形则需要调整这个平移量
    constructor(public graph: GraphModel) { }

    setViewDom(dom: HTMLDivElement) {
        this.viewDom = dom;
    }
    /**
     * 更新视图的大小，画布大小变化时需要调用此方法,调整视图的大小
     */
    updateBounds() {
        const diagramBounds = this.graph.rootShape?.bounds;
        if (!diagramBounds) return;

        this.bounds.width = Math.max(diagramBounds.absX + diagramBounds.width + this.paddingRight + this.translate.x, this.minWidth);
        this.bounds.height = Math.max(diagramBounds.absY + diagramBounds.height + this.paddingBottom + this.translate.y, this.minHeight);

    }
    /**
     * 转换屏幕坐标为图形的绝对坐标
     * @param point
     * @param diagramViewDom
     * @returns
     */
    translateClientPointToDiagramAbsPoint(point: Point, diagramViewDom = this.viewDom): Point {
        if (!diagramViewDom) {
            throw new Error("no view dom");

        }
        const rect = diagramViewDom.getBoundingClientRect();
        const rootShape = this.graph.rootShape
        // 此处坐标是相对于 svg 的相对位置，svg 父级div有 12px 的padding。 point 是鼠标相对于浏览器左上角的位置。需要减去 padding 和 sidebar 的宽度
        const x = (point.x - rect.left + diagramViewDom.scrollLeft - rootShape.bounds.absX);
        const y = (point.y - rect.top + diagramViewDom.scrollTop - rootShape.bounds.absY);
        // 相对于画布的距离
        const intPoint = new Point(x, y)
        Point.toInt(intPoint);
        return intPoint
    }
}