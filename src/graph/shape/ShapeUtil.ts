import { useDrawStore } from "../../editor/store";
import { Shape, ShapeType, SubShapeType } from "../types";
import { getTextWidth } from "../util";
import { Bounds } from "../util/Bounds";
import { Point } from "../util/Point";
import { charWidthConfig } from "../util/charWidth";
import { shapeFactory } from "./ShapeFactory";
import { SiderBarKeyOptions } from "./behavior/SiderbarDropBehavior";
import { HeaderHeight, SideBarWidth, SiderbarItemKey } from "./constant";
export const lineHeightAdd = 6; // 行高比字体增加多少， 设置为1
export const textPadding = 10; // 左右padding各 5
export class ShapeUtil {
  getShapeKey(shape: Shape) {
    return shape.shapeKey;
  }

  initDiagram(shape: Shape, bounds: Bounds) {
    shape.bounds = bounds
    return shape
  }
  initShape(shape: Shape, point: Point) {
    shape.bounds.absX = point.x;
    shape.bounds.absY = point.y;
    return shape
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
    return shape
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
  createShape(siderBarKey: SiderbarItemKey, options: SiderBarKeyOptions): Shape {
    let { point, waypoint, parentId } = options
    let shapeOption = shapeFactory.getModelShapeOption(siderBarKey);
    const shape = Shape.fromOption(shapeOption);
    shape.parentId = parentId
    switch (shape.subShapeType) {
      case SubShapeType.CommonEdge: {
        waypoint = waypoint || [point, new Point(point.x + 100, point.y)]
        return shapeUtil.initEdgeShape(shape, waypoint)
      }
      case SubShapeType.CommonDiagram: {
        return shapeUtil.initDiagram(shape, options.bounds)
      }
      default: {
        return shapeUtil.initShape(shape, point)
      }
    }
  }
  /**
  * 一个图形有哪些连线
  * @param shapeMap
  * @returns
  */
  getEndToEdgeMap() {
    const store = useDrawStore()
    const endToEdgeMap = new Map<string, Set<Shape>>();
    const edges = store.shapes.filter(shape => shape.shapeType === ShapeType.Edge)
    edges.forEach(edge => {
      if (edge.sourceId) {
        let set = endToEdgeMap.get(edge.sourceId);
        if (!set) {
          set = new Set();
          endToEdgeMap.set(edge.sourceId, set);
        }
        set.add(edge);

      }
      if (edge.targetId) {
        let set = endToEdgeMap.get(edge.targetId);
        if (!set) {
          set = new Set();
          endToEdgeMap.set(edge.targetId, set);
        }
        set.add(edge);

      }
    });
    return endToEdgeMap
  }
}

export const shapeUtil = new ShapeUtil();

const windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
const windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
const minWidth = 400
const minHeight = 300
const padding = 12
const canvasWidth = Math.max(minWidth, windowWidth - SideBarWidth - padding * 2 - 60)
const canvasHeight = Math.max(minHeight, windowHeight - HeaderHeight - padding * 2 - 30)
export const rootShape = shapeUtil.createShape(SiderbarItemKey.FlowDiagram, { bounds: new Bounds(12, 12, canvasWidth, canvasHeight, 12, 12, 0, 0), parentId: null })

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
