import { VertexType } from "../graph/models/ResizeModel";
import { GraphModel } from "../graph/models/graphModel";
import { updateShapeService } from "../graph/service";
import { IGraphOption, Shape, SubShapeType } from "../graph/types/index";
import { Bounds } from "../graph/util/Bounds";
import { Point } from "../graph/util/Point";
import { useDrawStore } from "./store";
export class GraphOption implements IGraphOption {
  // src/editor/graphEditor.ts:18 更新 graph 处
  graph!: GraphModel
  store = useDrawStore()
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
  /*** 编辑文案更新到 shape */
  saveText(shape: Shape, text: string) {
    updateShapeService(shape.id, { modelName: text }, { modelName: shape.modelName })
  }
  getEditingText(shape: Shape) {
    if (shape.subShapeType === SubShapeType.Block) {
      return shape.modelName
    }
    if (shape.subShapeType === SubShapeType.CommonEdge) {
      return shape.modelName
    }
  }
}
