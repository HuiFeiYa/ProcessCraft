import { cloneDeep } from "lodash";
import { EventType } from "../shape/constant";
import { Shape } from "../types";
import { Bounds } from "../util/Bounds";
import { Point } from "../util/Point";
import { GraphModel } from "./graphModel";

export enum VertexType {
    leftTop = 1,
    rightTop = 2,
    rightBottom = 3,
    leftBottom = 4
}

export class ResizeModel {
    resizeShape: Shape | undefined;
    startPoint: Point = new Point() // 移动起始时的鼠标的坐标
    endPoint: Point = new Point() // 移动过程中鼠标的坐标
    showResizePreview = false
    widthOnly = false
    heightOnly = false
    mouseDown = false
    resizeIndex = VertexType.leftTop // 1,2 3,4 代表 leftTop， rightTop，rightBottom，leftBottom
    minWidth = 0
    minHeight = 0
    minimumBounds = new Bounds()
    previewBounds = new Bounds()
    clearEvents?: () => void
    constructor(public graph: GraphModel) {

    }
    clear() {
        this.showResizePreview = false;
        this.clearEvents?.();
    }
    async startResize(event: MouseEvent, resizeShape: Shape, resizeIndex: VertexType) {
        // const res: Bounds | undefined = await this.graph.graphOption.getMinimumBounds?.(resizeShape, resizeIndex);
        const res = new Bounds(0, 0, 100, 100, 0, 0)
        // absX x轴移动的最大移动量， absY 是Y轴的最大值， height 是最小高度， width 是最小宽度
        if (res) {
            this.minimumBounds = new Bounds(res.x, res.y, res.width, res.height, res.absX, res.absY);
        }
        this.resizeIndex = resizeIndex;
        this.previewBounds = cloneDeep(resizeShape.bounds);

        this.resizeShape = resizeShape;
        this.mouseDown = true;
        this.showResizePreview = true;

        this.startPoint.x = event.clientX;
        this.startPoint.y = event.clientY;
        this.endPoint.x = event.clientX;
        this.endPoint.y = event.clientY;

        const onMouseMove = this.onMouseMove.bind(this);
        this.clearEvents?.();
        this.clearEvents = () => {
            this.graph.emitter.off(EventType.SHAPE_MOUSE_MOVE, onMouseMove);
            this.graph.emitter.off(EventType.SHAPE_MOUSE_UP, onMouseUp);
            window.removeEventListener('mouseup', onMouseUp);
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
    onMouseMove(event: MouseEvent) {
        this.endPoint.x = event.clientX;
        this.endPoint.y = event.clientY;
        let dx = this.endPoint.x - this.startPoint.x;
        let dy = this.endPoint.y - this.startPoint.y;
        if (this.resizeShape) {
            const originBounds = this.resizeShape.bounds;
            const previewBounds = this.previewBounds;
            // 图形最小宽高
            const MIN_HEIGHT = 50
            const MIN_WIDTH = 100
            switch (this.resizeIndex) {
                case VertexType.leftTop: {
                    // 最小 x 轴坐标为0
                    dx = originBounds.absX + dx < 0 ? (0 - originBounds.absX) : dx;
                    dy = originBounds.absY + dy < 0 ? (0 - originBounds.absY) : dy;
                    // 最大 x 坐标 宽度不小于 MIN_WIDTH
                    dx = originBounds.width - dx < MIN_WIDTH ? (originBounds.width - MIN_WIDTH) : dx;
                    dy = originBounds.height - dy < MIN_HEIGHT ? (originBounds.height - MIN_HEIGHT) : dy;
                    previewBounds.absX = originBounds.absX + dx
                    previewBounds.absY = originBounds.absY + dy;
                    previewBounds.width = originBounds.width - dx;
                    previewBounds.height = originBounds.height - dy;
                    break
                }

                case VertexType.rightTop: {
                    dy = originBounds.height - dy > MIN_HEIGHT ? dy : originBounds.height - MIN_HEIGHT
                    dx = originBounds.width + dx > MIN_WIDTH ? dx : MIN_WIDTH - originBounds.width
                    // 只改变 absY，不会影响 x 轴方向
                    previewBounds.absY = originBounds.absY + dy;
                    previewBounds.width = originBounds.width + dx;
                    previewBounds.height = originBounds.height - dy;
                    break
                }
                case VertexType.rightBottom: {
                    // 不需要改变 absX 和 absY 坐标
                    dx = originBounds.width + dx < MIN_WIDTH ? (MIN_WIDTH - originBounds.width) : dx;
                    dy = originBounds.height + dy < MIN_HEIGHT ? (MIN_HEIGHT - originBounds.height) : dy
                    previewBounds.width = originBounds.width + dx;
                    previewBounds.height = originBounds.height + dy;
                    break
                }

                case VertexType.leftBottom: {
                    // 需要改变 absX 坐标（向左负数，宽度增加），不需要改变 absY 坐标
                    dx = originBounds.absX + dx < 0 ? (0 - originBounds.absX) : dx;
                    dx = originBounds.width - dx < MIN_WIDTH ? (originBounds.width - MIN_WIDTH) : dx;
                    dy = originBounds.height + dy < MIN_HEIGHT ? (MIN_HEIGHT - originBounds.height) : dy;
                    previewBounds.absX = originBounds.absX + dx;
                    previewBounds.width = originBounds.width - dx;
                    previewBounds.height = originBounds.height + dy;
                    break
                }
            }
        }
    }
    async endMove() {
        this.mouseDown = false;
        if (this.resizeShape) {
            console.log('previewBounds: ', JSON.stringify(this.previewBounds))
            this.graph.graphOption.onShapeResized?.(this.resizeShape, this.resizeIndex, this.previewBounds)
            this.showResizePreview = false;
        }
    }
}