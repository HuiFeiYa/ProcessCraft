import { EventType } from "../shape/constant"
import { Shape } from "../types"
import { Point } from "../util/Point"
import { GraphModel } from "./graphModel"

export class MoveModel {
    movingShapes: Shape[] = [] // 被移动的shapes
    startPoint: Point = new Point() // 移动起始时的鼠标的坐标
    endPoint: Point = new Point() // 移动过程中鼠标的坐标
    mouseDown = false
    moved = false
    clearEvents?: () => void
    constructor(public graph: GraphModel) {

    }
    startMove(event: MouseEvent, mouseDownShape: Shape) {
        this.startPoint.x = event.clientX;
        this.startPoint.y = event.clientY;
        this.endPoint.x = event.clientX;
        this.endPoint.y = event.clientY;
        this.mouseDown = true;
        const onMouseMove = this.onMouseMove.bind(this);
        this.clearEvents = () => {
            this.graph.emitter.off(EventType.SHAPE_MOUSE_MOVE, onMouseMove);
            this.graph.emitter.off(EventType.SHAPE_MOUSE_UP, onMouseUp);
            window.removeEventListener('mouseup', onMouseUp); // 如果移动到了画布或窗口之外
        };
        const onMouseUp = () => {
            this.clearEvents?.();
            this.clearEvents = undefined;
            this.endMove();
        };
        this.graph.emitter.on(EventType.SHAPE_MOUSE_MOVE, onMouseMove);
        this.graph.emitter.on(EventType.SHAPE_MOUSE_UP, onMouseUp);
        window.addEventListener('mouseup', onMouseUp);
    }
    async onMouseMove(event: MouseEvent, shape: Shape) {
        if (!this.mouseDown) return 
        this.moved = true;
        this.endPoint.x = event.clientX;
        this.endPoint.y = event.clientY;
    }
    async endMove() {
        this.mouseDown = false;
        this.clear();
    }
    clear() {
        this.clearEvents?.();
        this.mouseDown = false;
        this.moved = false;
    }
}