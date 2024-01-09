import { VertexType } from "../graph/models/ResizeModel";
import { GraphModel } from "../graph/models/graphModel";
import { IGraphOption, Shape } from "../graph/types/index";
import { Bounds } from "../graph/util/Bounds";
import { Point } from "../graph/util/Point";
export class GraphOption implements IGraphOption {
  // src/editor/graphEditor.ts:18 更新 graph 处
  graph!: GraphModel
  constructor() {

  }
  onShapeResized(shape: Shape, resizeIndex: VertexType, newBounds: Bounds) {
    shape.bounds = newBounds
  }
  getConnectTargetShape(edgeKey: string, hoverShape: Shape | undefined, point: Point) {
    if (!hoverShape) {
      hoverShape = this.graph.rootShape;
    }
    if (!hoverShape) {
      return undefined;
    }
  }
}
