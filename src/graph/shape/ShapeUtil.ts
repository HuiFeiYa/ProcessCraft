import { Shape } from "../types";
import { Bounds } from "../util/Bounds";
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
    const point = points[0];
    shape.waypoint = points;
    shape.bounds.absX = point.x;
    shape.bounds.absY = point.y;
    // 更新 label 位置
    shape.nameBounds.absX = point.x + shape.bounds.width / 2 - 8; // 减去文本的宽度
    shape.nameBounds.absY = point.y + shape.bounds.height / 2 - 11; // 减去文本的高度
  }
}

export const shapeUtil = new ShapeUtil();

/**
 * 点是否在边框上
 * @param p
 * @param bounds
 */
export function isPointAtBorder(p: Point, bounds: Bounds, borderWidth = 16) {
  const size = borderWidth / 2;

  if (
    (p.y >= bounds.absY - size && p.y <= bounds.absY + size) ||
    (p.y >= bounds.absY + bounds.height - size &&
      p.y <= bounds.absY + bounds.height + size)
  ) {
    if (p.x >= bounds.absX - size && p.x <= bounds.absX + bounds.width + size) {
      return true;
    }
  } else if (
    (p.x >= bounds.absX - size && p.x <= bounds.absX + size) ||
    (p.x >= bounds.absX + bounds.width - size &&
      p.x <= bounds.absX + bounds.width + size)
  ) {
    if (
      p.y >= bounds.absY - size &&
      p.y <= bounds.absY + bounds.height + size
    ) {
      return true;
    }
  }
  return false;
}
