import { Bounds } from "../util/Bounds"
import { Point } from "../util/Point";
import { GraphModel } from "./graphModel";

export class ViewModel {

    viewDom: HTMLDivElement | undefined
    bounds = new Bounds(0, 0, 1000, 1000)
    scale = 1
    constructor(public graph: GraphModel) { }

    setViewDom(dom: HTMLDivElement) {
        this.viewDom = dom;
    }
    /**
     * 转换屏幕坐标为图形的绝对坐标
     * @param point
     * @param diagramViewDom
     * @returns
     */
    translateClientPointToDiagramAbsPoint (point: Point, diagramViewDom = this.viewDom): Point {
        if (!diagramViewDom) {
        throw new Error("no view dom");

        }
        const rect = diagramViewDom.getBoundingClientRect();

        const x = (point.x - rect.left + diagramViewDom.scrollLeft) ;
        const y = (point.y - rect.top + diagramViewDom.scrollTop) ;
        const intPoint = new Point(x, y)
        Point.toInt(intPoint);
        return intPoint
    }
}