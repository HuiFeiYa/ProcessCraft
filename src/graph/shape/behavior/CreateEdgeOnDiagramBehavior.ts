import { Shape } from "../../types";
import { Point } from "../../util/Point";
import { shapeFactory } from "../ShapeFactory";
import { shapeUtil } from "../ShapeUtil";
import { SiderBarDropBehavior } from "./SiderbarDropBehavior";

export class CreateEdgeOnDiagramBehavior extends SiderBarDropBehavior {
  async createShape() {
    const { siderBarKey } = this;
    let shapeOption = shapeFactory.getModelShapeOption(siderBarKey);
    const shape = Shape.fromOption(shapeOption);
    /** 默认创建一条水平线，长度为 100 */
    shapeUtil.initEdgeShape(shape, [
      this.point,
      new Point(this.point.x + 100, this.point.y),
    ]);
    this.createdShapes.add(shape);
  }
}
