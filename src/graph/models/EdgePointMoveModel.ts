import { cloneDeep } from "lodash";
import { EdgeMoveType, EventType, MarkerColor } from "../shape/constant";
import { Shape, SubShapeType } from "../types";
import { ShapeType } from "../types/shapeOption";
import { Point } from "../util/Point";
import { int } from "../util/WaypointUtil";
import { GraphModel } from "./graphModel";
import { useDrawStore } from "../../editor/store";
import { Marker } from "./Marker";
import { Line } from "../shape/Line";
import { shapeUtil } from "../shape/ShapeUtil";
import { Bounds } from "../util/Bounds";
import { UpdateShapeValue, updateShapeService } from "../service";

export class EdgePointMoveModel {
    movingShape: Shape | undefined = undefined;
    startPoint = new Point() // 移动起始时的鼠标的坐标
    endPoint = new Point() // 移动过程中鼠标的坐标
    dx = 0 // 移动的x距离
    dy = 0 // 移动的y距离
    showPreview = false // 是否显示预览
    previewwaypoint: Point[] = [] // 预览线的路径点
    movingOriginWayPoint: Point[] = [] // 原始waypoint线路
    originShape: Shape
    previewPath = '' // 预览线的路径path的d属性
    movePointIndex = -1 // 移动的点是第几个点 从0开始
    moveType: EdgeMoveType | undefined = undefined // 移动类型
    sourceShape?: Shape
    targetShape?: Shape
    moved = false
    marker?: Marker
    store = useDrawStore()
    // 是否连到图形
    isConnectShape = false
    constructor(public graph: GraphModel) {

    }

    get isSourcePoint() {
        return this.moveType === EdgeMoveType.SourcePoint;
    }
    get isTargetPoint() {
        return this.moveType === EdgeMoveType.TargetPoint;
    }

    // 鼠标按下线段的转折点时触发（即按下selectionVertex）
    onEdgePointMouseDown(event: MouseEvent, shape: Shape, index: number) {

        if (shape.shapeType !== ShapeType.Edge) return;
        this.startMoveEdgePoint(event, shape, index);
    }
    startMoveEdgePoint(event: MouseEvent, shape: Shape, index: number) {
        this.movingShape = shape;
        this.movingOriginWayPoint = shape.waypoint.map((n) => { return new Point(n.x, n.y); });
        this.originShape = cloneDeep(shape)
        this.movePointIndex = index;

        if (index === 0) {
            this.moveType = EdgeMoveType.SourcePoint;
        } else if (index === this.movingShape.waypoint.length - 1) {
            this.moveType = EdgeMoveType.TargetPoint;
        } else {
            this.moveType = EdgeMoveType.Waypoint;
        }

        const points = this.movingShape.waypoint;
        this.previewwaypoint = points.map(p => ({ ...p }));

        this.startPoint.x = event.clientX;
        this.startPoint.y = event.clientY;
        this.endPoint.x = event.clientX;
        this.endPoint.y = event.clientY;
        this.dx = 0;
        this.dy = 0;
        this.showPreview = true;

        const onMouseMove = this.onMouseMove.bind(this);
        const onMouseUp = () => {
            this.graph.emitter.off(EventType.SHAPE_MOUSE_MOVE, onMouseMove);
            this.graph.emitter.off(EventType.SHAPE_MOUSE_UP, onMouseUp);
            window.removeEventListener('mouseup', onMouseUp); // 如果移动到了画布或窗口之外

            this.endMove();
        };
        this.graph.emitter.on(EventType.SHAPE_MOUSE_MOVE, onMouseMove);
        this.graph.emitter.on(EventType.SHAPE_MOUSE_UP, onMouseUp);
        window.addEventListener('mouseup', onMouseUp);
    }
    initPreviewState() {
        this.showPreview = false;
        this.startPoint = new Point();
        this.endPoint = new Point();
        this.dx = 0;
        this.dy = 0;
        this.previewwaypoint = [];
        this.previewPath = '';
        this.sourceShape = undefined;
        this.targetShape = undefined;
        this.movePointIndex = -1;
        this.moved = false;
        this.showPreview = false;
        this.movingShape = undefined
        this.isConnectShape = false
        this.removeMarker();
    }
    async onMouseMove(event: MouseEvent, shape?: Shape) {
        this.endPoint.x = event.clientX;
        this.endPoint.y = event.clientY;
        this.moved = true;
        this.dx = this.endPoint.x - this.startPoint.x;
        this.dy = this.endPoint.y - this.startPoint.y;
        // 获取当前鼠标点在画布上的坐标
        const edgeShape = this.movingShape;
        const newEdgeShape = cloneDeep(edgeShape)
        /**
         * 当前悬浮的元素, 过滤掉悬浮在线元素上的图形
         * 如果已经绘制过则跳过
         */
        if (shape && shape.subShapeType !== SubShapeType.CommonEdge && shape.id !== this.movingShape.id) {
            this.connectShape(shape) // mousemove 移动到对应图形上，会 emit move 事件出来，此时监听到进入某个图形，进行图形之间关系绑定
        } else if (!shape) {
            // 移动时未连接图形，则情况 marker
            this.removeMarker()
        }
        if (this.isTargetPoint) {
            this.targetShape = shape || undefined
        }
        if (this.isSourcePoint) {
            this.sourceShape = shape || undefined
        }
        // TODO 目前只考虑两个点的情况，后续考虑折线
        if (this.isTargetPoint) {
            const lastPoint = newEdgeShape.waypoint[1]
            lastPoint.x = lastPoint.x + this.dx
            lastPoint.y = lastPoint.y + this.dy
        } else if (this.isSourcePoint) {
            const firstPoint = newEdgeShape.waypoint[0]
            firstPoint.x = firstPoint.x + this.dx
            firstPoint.y = firstPoint.y + this.dy
        }
        this.previewwaypoint = newEdgeShape.waypoint
        this.updatePreviewPath();
    }
    endMove() {
        if (!this.movingShape) {
            console.error('缺失 movingShape');
            this.initPreviewState();
            return;
        }
        let changes: UpdateShapeValue = {}
        if (this.isSourcePoint && this.sourceShape || this.isTargetPoint && this.targetShape) {
            // 剪切元素上多余的线，找到最近的点，更新waypoint
            const newPoints = this.updateClosestWaypoint(this.previewwaypoint)
            // 更新，vertex 渲染最新控制点
            changes.waypoint = this.previewwaypoint = newPoints
        } else {
            changes.waypoint = this.previewwaypoint
        }
        /** 更新 edgeShape 的sourceId、targetId */
        if (this.movingShape.subShapeType === SubShapeType.CommonEdge) {
            if (this.isSourcePoint) {
                if (this.sourceShape) {
                    changes.sourceId = this.sourceShape.id
                } else {
                    changes.sourceId = undefined
                }
                changes.bounds = {
                    ...this.movingShape.bounds,
                    absX: changes.waypoint[0].x,
                    absY: changes.waypoint[0].y
                }
            }

            if (this.isTargetPoint) {
                if (this.targetShape) {
                    changes.targetId = this.targetShape.id
                } else {
                    changes.targetId = undefined
                }
            }
        }

        // 数据存储，持久化数据同步
        updateShapeService(this.movingShape, changes)
        this.initPreviewState()
    }
    updatePreviewPath() {
        let points = this.previewwaypoint;
        if (!this.moved) {
            points = this.movingShape?.waypoint || [];
        }
        if (!points?.length) {
            this.previewPath = '';
            return;
        }

        let path = `M ${int(points[0].x)} ${int(points[0].y)}`;
        for (let i = 1; i < points.length; i++) {
            const p = points[i];
            path += (' L ' + int(p.x) + ' ' + int(p.y));
        }
        this.previewPath = path;
    }
    /** 更新 edge 的 wayPoint */
    updateClosestWaypoint(pts: Point[]) {
        if (this.isTargetPoint && this.targetShape) {
            // 根据倒数第二个点和最后一个点生成一条射线
            const rayline = Line.createRayLine(pts[pts.length - 2], pts[pts.length - 1]);
            const targetBoundsLines = Line.createBoundsSegmentLines(this.targetShape.bounds);
            // 计算射线和目标元素的 BoundsLines 的相交点
            const joinPoints = Line.getJoinPointBetweenLineAndLines(rayline, targetBoundsLines, true);
            if (joinPoints.length) {
                // 计算两个点 (x1,y1) 倒数第二个点 和 [(x2,y2),(x3,y3)] 相交点 的距离最短的
                const closePoint = Line.getClosePoint(pts[pts.length - 2], joinPoints);
                if (!Point.isSame(pts[pts.length - 1], closePoint)) {
                    pts[pts.length - 1] = closePoint; // 更新最后的点为最近点
                }
            }
        } else if (this.isSourcePoint && this.sourceShape) {
            // 根据最后一个点和倒数第二个点生成一条射线
            const rayline = Line.createRayLine(pts[pts.length - 1], pts[pts.length - 2]);
            const sourceBoundsLines = Line.createBoundsSegmentLines(this.sourceShape.bounds);
            // 计算射线和目标元素的 BoundsLines 的相交点
            const joinPoints = Line.getJoinPointBetweenLineAndLines(rayline, sourceBoundsLines, true);
            if (joinPoints.length) {
                // 计算第二个点距离起始点最近的距离
                const closePoint = Line.getClosePoint(pts[1], joinPoints);
                if (!Point.isSame(pts[pts.length - 1], closePoint)) {
                    pts[pts.length - 2] = closePoint; // 更新最后的点为最近点
                }
            }
        }
        return pts
    }
    connectShape(shape: Shape) {
        // 创建 marker
        if (!this.marker) {
            this.marker = new Marker(shape, 'blue', 2);
            this.graph.markerModel.addMarker(this.marker);
        }
        this.marker.setTargetShape(shape);
        this.marker.setVisible(true);
        this.marker.setStrokeColor(MarkerColor.valid);
        this.isConnectShape = true
    }
    removeMarker() {
        if (this.marker) {
            // 清除 markerModel 管理器中对应的 marker
            this.graph.markerModel.removeMarker(this.marker.id);
            this.marker = undefined;
        }
    }
}