import { float } from "../util";
import { Bounds } from "../util/Bounds";
import { Point, getPointDistance } from "../util/Point"

type LineLimit = (p: Point) => boolean
type LineLmits = LineLimit[]
/**
 * 用来表达一条线，y=ax+b
 */
export class Line {
    static fromPoints(p1: Point, p2: Point, limits?: LineLmits) {
        // point1
        const x1 = p1.x;
        const y1 = p1.y;
        // point2 
        const x2 = p2.x;
        const y2 = p2.y;
        /***
        *  两个点相连形成一条线, 表达式中的 a、b 都是相同的, 二元二次方程，求出 a、b
        *  y1 = a*x1 + b
        *  y2 = a*x2 + b
        * 
        * (y1 - a*x1 = y2 - a*x2)  (y1 - y2 = a*x1 - a*x2)     (y1 - y2)/(x1-x2) = a
        * 
        * (y1 - b)/x1 = (y2 - b)/x2  (y1-b)*x2 = (y2-b)*x1 
        * y1*x2 + b*x1 = y2*x1 + b*x2    (y1*x2 - y2*x1)/ (x2-x1) = b
        */
        let a = (y1 - y2) / (x1 - x2); // 解出斜率
        let b = float((y1 * x2 - y2 * x1) / (x2 - x1))
        // 垂直线 x 轴交叉点
        let x0: number | undefined;
        if (p2.x === p1.x) {
            x0 = p1.x;
        }
        if (a === -Infinity) {
            a = Infinity;
        }
        return new Line(a, b, x0, limits);

    }
    /**
     * 创建射线
     */
    static createRayLine(startPoint: Point, endPoint: Point) {
        const startLimitHandler = this.createRayLineLimitHandler(startPoint, endPoint)
        const line = this.fromPoints(startPoint, endPoint, [startLimitHandler])
        return line
    }

    /**
     * 创建线段
     * @param startPoint 
     * @param endPoint 
     * @returns 
     */
    static createSegmentLine(startPoint: Point, endPoint: Point) {
        const startLimitHandler = this.createRayLineLimitHandler(startPoint, endPoint)
        const endLimitHandler = this.createRayLineLimitHandler(endPoint, startPoint)
        const line = this.fromPoints(startPoint, endPoint, [startLimitHandler, endLimitHandler])
        return line
    }
    /** 
     * 通过两个点画出一条线
     * @Returns 返回一个函数，判断传入的点是否在这条线上
     */
    static createRayLineLimitHandler(startPoint: Point, endPoint: Point) {
        // x轴 diff，如果是负数说明向左，正数向右
        const toRight = endPoint.x - startPoint.x;
        // y轴 diff，负数向上，正数向下
        const toBottom = endPoint.y - startPoint.y;
        /** 判断传入的点是否在该线上 */
        return (p: Point) => {
            /**
             * 1. 竖线
             * 2. 向右，x轴必须大于起点
             * 3. 向左，x轴必须小于起点
             */
            const compareX = (toRight === 0 && p.x === startPoint.x) || (toRight > 0 && p.x > startPoint.x) || (toRight < 0 && p.x < startPoint.x);
            /**
             * 1. 横线
             * 2. 向下，y轴必须大于起点
             * 3. 向上，y轴必须小于起点
             */
            const compareY = (toBottom === 0 && p.y === startPoint.y) || (toBottom > 0 && p.y > startPoint.y) || (toBottom < 0 && p.y < startPoint.y);

            return compareX && compareY;
        }

    }
    /**
     * 根据一个bounds，创建其4个线段
     */
    static createBoundsSegmentLines(bounds: Bounds) {
        const p1 = { x: bounds.absX, y: bounds.absY };
        const p2 = { x: bounds.absX + bounds.width, y: bounds.absY };
        const p3 = { x: bounds.absX + bounds.width, y: bounds.absY + bounds.height };
        const p4 = { x: bounds.absX, y: bounds.absY + bounds.height };
        const pts = [p1, p2, p3, p4, p1];
        const lines: Line[] = [];
        for (let i = 0; i < pts.length - 1; i++) {
            const line1 = this.createSegmentLine(pts[i], pts[i + 1]);
            lines.push(line1);

        }
        return lines;
    }
    /**
     * 根据线 waypoint 创建线段
     * @param waypoints 
     * @returns 
     */
    static createEdgeSegmentLines(waypoints: Point[]) {
        const lines: Line[] = [];
        for (let i = 0; i < waypoints.length - 1; i++) {
            const line1 = this.createSegmentLine(waypoints[i], waypoints[i + 1]);
            lines.push(line1);

        }
        return lines;
    }
    static getJoinPointBetweenLineAndLines(line: Line, boundsLines?: Line[], multiple = true) {
        let result: Point[] = [];

        if (boundsLines) {
            for (let line1 of boundsLines) {
                const joinPoint = line.getJoinPointWith(line1);
                if (joinPoint) {
                    result.push(joinPoint);
                    if (!multiple) {
                        break;
                    }
                }
            }
        }
        return result;
    }
    /**
     * 获得距离sourcePoint最近的点
     * @param sourcePoint
     * @param pts
     * @returns
     */
    static getClosePoint(sourcePoint: Point, pts: Point[]) {
        if (pts.length <= 1) {
            return pts[0];
        }
        let result: Point = pts[0];
        let distance = Infinity;
        pts.forEach((pt) => {
            const dis = getPointDistance(sourcePoint, pt);
            if (dis < distance) {
                result = pt;
                distance = dis;
            }
        });
        return result;
    }
    /**
    * 斜率，Infinaty表示垂直，也是tan值,如果是负无穷则替换为正无穷
    */
    a = 0
    /**
     * x=0时的y坐标,
     */
    b = 0

    /**
     * 当a为无穷或负无穷，必须有x0， x0表示线与x轴的交点x坐标
     */
    x0?: number
    /**
     * 点位约束，返回false则表示不在线的范围内
     */
    limits?: LineLmits
    constructor(a: number, b: number, x0?: number, limits?: LineLmits) {
        // y=ax+b
        if (a === -Infinity) {
            a = Infinity;
        }
        this.a = a;
        this.b = b;
        this.limits = limits;
        this.x0 = x0;
    }
    /**
     * 是否与另一条线平行
     */
    isParallelWith(line2: Line) {
        return this.a == line2.a;
    }
    /**
     * 获取两条线的交点
     * @param line2 
     * @returns Point | undefined
     */
    getJoinPointWith(line2: Line): Point | undefined {
        if (this.isParallelWith(line2)) return;
        const a1 = this.a;
        const b1 = this.b;
        const a2 = line2.a;
        const b2 = line2.b;
        let x: number;
        let y: number;
        // 当前线为竖线
        if (a1 === Infinity) {
            x = this.x0;
            y = a2 * x + b2;
        } else if (a2 === Infinity) { // line2 为竖线
            x = line2.x0;
            y = a1 * x + b1;
        } else {
            // 线相交，也就是说 x、y 轴相同
            // 他们符合的公式 y=ax+b

            /**
             * 消除相同的 y 求 x
             * a1 * x + b1 = a2 * x + b2
             */
            x = (b2 - b1) / (a1 - a2)

            /**
            * 消除相同的 x 求 y ,y1 y2 相同
            * (y1 - b1) / a1 = (y2 - b2) / a2
            */
            y = (b1 * a2 - b2 * a1) / (a2 - a1);
        }
        if (typeof x === 'number' && typeof y === 'number') {
            const pt = new Point(float(x), float(y));

            if (this.limits) {
                const valid = this.isInLine(pt);
                if (!valid) return undefined;
            }
            if (line2.limits) {
                const valid = line2.isInLine(pt);
                if (!valid) return undefined;
            }
            return pt;
        }
    }
    /**
     * 判断点是否在线上
     * @param p 
     * @returns 
     */
    isInLine(p: Point) {
        if (this.limits?.length) {
            for (let limit of this.limits) {
                if (!limit(p)) {
                    return false;
                }
            }
        }
        return true;
    }

}