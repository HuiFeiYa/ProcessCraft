// import { PathBuilder, Shape, ShapeKey } from "../../index";
// interface Shape {}
// interface ShapeKey {}

import { Shape, ShapeKey } from "../types";
import { PathBuilder } from "../util";

// interface PathBuilder {}
export type SkeletonDrawer = (
  p: PathBuilder,
  shape: Shape,
  shapeMap: Map<string, Shape>
) => void;

/**
 * 图形骨架绘制工具类
 * 根据subShapeType和bounds绘制骨架path
 * 骨架path用于显示move预览和resize预览
 */
class ShapeSkeletonUtil {
  getDefaultPath(p: PathBuilder, shape: Shape) {
    return this.getRectPath(p, shape);
  }
  /**
   * 通用矩形图元边框
   */
  getRectPath(p: PathBuilder, shape: Shape) {
    const { absX, absY, width, height } = shape.bounds;
    const borderRadius = shape.style?.borderRadius || 0;
    const cx = borderRadius;
    const cy = borderRadius;
    // 以左侧向下偏移点为起点话
    p.MoveTo(absX, absY + borderRadius);
    p.Arc(cx, cy, 0, 0, 1, absX + borderRadius, absY);
    p.lineHorizontalTo(width - borderRadius * 2);
    p.Arc(cx, cy, 0, 0, 1, absX + width, absY + borderRadius);
    p.lineVerticalTo(height - borderRadius * 2);
    p.Arc(cx, cy, 0, 0, 1, absX + width - borderRadius, absY + height);
    p.lineHorizontalTo(-(width - borderRadius * 2));
    p.Arc(cx, cy, 0, 0, 1, absX, absY + height - borderRadius);
    // if (borderRadius &&  borderRadius > 0){
    //   const cx = borderRadius;
    //   const cy = borderRadius;
    //   p.moveTo(absX, absY + borderRadius);
    //   p.Arc(cx, cy, 0, 0, 1, absX + borderRadius, absY);
    //   p.lineHorizontalTo(width - borderRadius * 2);
    //   p.Arc(cx, cy, 0, 0, 1, absX + width, absY + borderRadius);
    //   p.lineVerticalTo(height - borderRadius * 2);
    //   p.Arc(cx, cy, 0, 0, 1, absX + width - borderRadius, absY + height);
    //   p.lineHorizontalTo(-(width - borderRadius * 2));
    //   p.Arc(cx, cy, 0, 0, 1, absX, absY + height - borderRadius);
    //   p.lineVerticalTo(-(height - borderRadius * 2));
    // } else {
    //   p.MoveTo(absX, absY);
    //   p.lineHorizontalTo(width);
    //   p.lineVerticalTo(height);
    //   p.lineHorizontalTo(-width);
    // }
    p.closePath();
  }

  /**
   * 包类型的
   */
  getPackagePath(p: PathBuilder, shape: Shape) {
    const { absX, absY, width, height } = shape.bounds;
    const width3off = Math.round(width / 3);
    const paddingTop = shape.style?.paddingTop || 0;
    p.MoveTo(absX, absY);
    p.lineHorizontalTo(width3off);
    p.lineVerticalTo(paddingTop);
    p.lineHorizontalTo(width - width3off);
    p.lineVerticalTo(height - paddingTop);
    p.lineHorizontalTo(-width);
    p.closePath();
  }

  /**
   * 椭圆
   * 用例
   */
  /**
   * 活动起点，活动终点，状态
   */
  getEllipsePath(p: PathBuilder, shape: Shape) {
    const { absX, absY, width, height } = shape.bounds;
    const cx = absX + width / 2;
    p.MoveTo(cx, absY + height);
    const rx = width / 2;
    const ry = height / 2;
    // 选择中下方的切点作为起始点
    p.Arc(rx, ry, 0, 1, 1, cx, absY);
    p.Arc(rx, ry, 0, 1, 1, cx, absY + height);
  }

  getSendSignalActionPath(p: PathBuilder, shape: Shape) {
    const { absX, absY, width, height } = shape.bounds;
    p.MoveTo(absX, absY);
    p.lineHorizontalTo(width - 22);
    p.lineTo(22, height / 2);
    p.lineTo(-22, height / 2);
    p.lineHorizontalTo(-(width - 22));
    p.closePath();
  }

  getAcceptSignalActionPath(p: PathBuilder, shape: Shape) {
    const { absX, absY, width, height } = shape.bounds;
    p.MoveTo(absX, absY);
    p.lineHorizontalTo(width);
    p.lineTo(0, height);
    p.lineTo(-width, 0);
    p.lineTo(22, -height / 2);
    p.closePath();
  }

  getTimeEventActionPath(p: PathBuilder, shape: Shape) {
    const { absX, absY, height } = shape.bounds;
    p.MoveTo(absX, absY);
    p.lineHorizontalTo(20);
    p.lineTo(-20, height);
    p.lineHorizontalTo(20);
    p.lineTo(-20, -height);
    p.closePath();
  }
  /**
   * 活动起点，活动终点，状态
   */
  // getCirclePath(p:PathBuilder, shape:Shape, shapeMap:Map<string,Shape>){

  // }

  /**
   * 菱形
   *
   * 判断节点，合并节点等
   */
  getDiamondPath(p: PathBuilder, shape: Shape) {
    const { width, height, absX, absY } = shape.bounds;
    const halfWidth = width / 2;
    const halfHeight = height / 2;
    p.MoveTo(absX, absY);
    p.moveTo(halfWidth, 0);
    p.lineTo(halfWidth, halfHeight);
    p.lineTo(-halfWidth, halfHeight);
    p.lineTo(-halfWidth, -halfHeight);
    p.closePath();
  }
  lifeLineShapePath(
    p: PathBuilder,
    shape: Shape,
    shapeMap: Map<string, Shape>
  ) {
    let lineHeaderShape: Shape | undefined;
    let lineShape: Shape | undefined;
    if (shape.shapeKey === ShapeKey.Lifeline) {
      lineShape = shape;
      // 找到头
      lineHeaderShape = shapeMap.get(shape.parentId as string) as Shape;
    }
    if (shape.shapeKey === ShapeKey.LifelineHeader) {
      // 找到线
      lineHeaderShape = shape;
      lineShape = Array.from(shapeMap.values()).find((one: Shape) => {
        return one.parentId === lineHeaderShape?.id;
      });
    }
    if (lineShape && lineHeaderShape) {
      const { absX, absY, width, height } = lineHeaderShape.bounds;
      p.MoveTo(absX, absY);
      p.lineHorizontalTo(width);
      p.lineVerticalTo(height);
      p.lineHorizontalTo(-width);
      p.closePath();
      p.MoveTo(absX + width / 2, absY + height);
      p.lineVerticalTo(lineShape.bounds.height);
      p.closePath();
    }
  }
}

export const shapeSkeletonUtil = new ShapeSkeletonUtil();
