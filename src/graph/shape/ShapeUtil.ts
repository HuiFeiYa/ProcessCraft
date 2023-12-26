import { Shape } from "../types";

export class ShapeUtil {
    getShapeKey(shape: Shape) {
        return shape.shapeKey;
    }
}

export const shapeUtil = new ShapeUtil();