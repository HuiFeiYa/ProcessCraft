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
    showMovingPreview = false
    previewDx = 0;
    previewDy = 0
    clearEvents?: () => void
    constructor(public graph: GraphModel) {

    }
    startMove(event: MouseEvent, mouseDownShape: Shape) {
        this.startPoint.x = event.clientX;
        this.startPoint.y = event.clientY;
        this.endPoint.x = event.clientX;
        this.endPoint.y = event.clientY;
        this.mouseDown = true;
        this.showMovingPreview = true;
        this.movingShapes = [mouseDownShape];
        this.previewDx = 0;
        this.previewDy = 0;
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
        let dx = this.endPoint.x - this.startPoint.x;
        let dy = this.endPoint.y - this.startPoint.y;
        this.previewDx = dx;
        this.previewDy = dy;
    }
    async endMove() {
        this.graph.selectionModel.setSelection(this.movingShapes)
        this.graph.graphOption.shape.customEndMove(this, this.previewDx, this.previewDy)
        this.mouseDown = false;
        this.clear();
    }
    clear() {
        this.clearEvents?.();
        this.mouseDown = false;
        this.moved = false;
        this.showMovingPreview = false;
    }
}