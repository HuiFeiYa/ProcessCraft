import { Shape, SubShapeType } from "../types";
import { getTextWidth } from "../util";
import { Bounds } from "../util/Bounds";
import { Point } from "../util/Point";
import { charWidthConfig } from "../util/charWidth";
import { shapeFactory } from "./ShapeFactory";
import { SiderBarKeyOptions } from "./behavior/SiderbarDropBehavior";
import { SiderbarItemKey } from "./constant";
export const lineHeightAdd = 6; // 行高比字体增加多少， 设置为1
export const textPadding = 10; // 左右padding各 5
export class ShapeUtil {
  getShapeKey(shape: Shape) {
    return shape.shapeKey;
  }
  initShape(shape: Shape, point: Point) {
    shape.bounds.absX = point.x;
    shape.bounds.absY = point.y;
  }
  initEdgeShape(shape: Shape, points: Point[]) {
    const point = points[0];
    shape.waypoint = points;
    shape.bounds.absX = point.x;
    shape.bounds.absY = point.y;
    const {
      modelName,
      nameStyle: { fontSize },
    } = shape;
    const { width, height } = modelName
      ? shapeUtil.getTextSize(modelName, fontSize)
      : { width: 0, height: 20 };
    // 更新 label 位置, 相对于父级的坐标
    shape.nameBounds = new Bounds(point.x, point.y, width, height);
  }
  /**
   * 获得一段文本的宽高，换行符会被计算进折行,
   * @param text
   * @param fontSize
   * @returns
   */
  getTextSize(
    text: string,
    fontSize: number,
    fontFamily: keyof typeof charWidthConfig = ""
  ) {
    const strs = text?.split("\n") || [];
    const oneLineHeight = this.getLineHeight(fontSize);
    let height = 0;
    let width = 0;
    for (const str of strs) {
      const strWidth = getTextWidth(str, fontSize, fontFamily);
      width = Math.max(width, strWidth);
      height += oneLineHeight;
    }
    if (height < oneLineHeight) {
      height = oneLineHeight;
    }
    return {
      width,
      height,
    };
  }
  getLineHeight(fontSize: number) {
    return (fontSize || 12) + lineHeightAdd;
  }
  createShape(siderBarKey, options: SiderBarKeyOptions): Shape {
    const { point, waypoint } = options
    let shapeOption = shapeFactory.getModelShapeOption(siderBarKey);
    const shape = Shape.fromOption(shapeOption);
    if (shape.subShapeType === SubShapeType.CommonEdge) {
      shapeUtil.initEdgeShape(shape, waypoint)
      return shape
    } else {
      shapeUtil.initShape(shape, point)
      return shape
    }
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
