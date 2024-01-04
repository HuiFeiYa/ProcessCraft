import { Shape } from "../types";
import { Point } from "../util/Point";

export class ShapeUtil {
    getShapeKey(shape: Shape) {
        return shape.shapeKey;
    }
    initShape(shape: Shape, point: Point) {
        shape.bounds.absX = point.x;
        shape.bounds.absY = point.y;
        // shape.bounds.x = shape.bounds.absX - parentShape.bounds.absX;
        // shape.bounds.y = shape.bounds.absY - parentShape.bounds.absY;
    }
    initEdgeShape(shape: Shape, points: Point[]) {
        const point = points[0]
        shape.waypoint = points
        shape.bounds.absX = point.x;
        shape.bounds.absY = point.y;
    }
}

export const shapeUtil = new ShapeUtil();