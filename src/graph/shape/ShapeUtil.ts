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
}

export const shapeUtil = new ShapeUtil();