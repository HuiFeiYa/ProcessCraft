import { VertexType } from "../graph/models/ResizeModel";
import { IGraphOption, Shape } from "../graph/types/index";
import { Bounds } from "../graph/util/Bounds";
export class GraphOption implements IGraphOption {
  constructor() {

  }
  onShapeResized(shape: Shape, resizeIndex: VertexType, newBounds: Bounds) {
    shape.bounds = newBounds
  }
}
