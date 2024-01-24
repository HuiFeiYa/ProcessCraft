import { cloneDeep } from "lodash";
import { VertexType } from "../graph/models/ResizeModel";
import { GraphModel } from "../graph/models/graphModel";
import { UpdatePatchItem, batchUpdateShapesService, patchItemFactory, updateShapeService } from "../graph/service";
import { shapeUtil } from "../graph/shape/ShapeUtil";
import { resizeUtil } from "../graph/shape/resizeUtil";
import { IGraphOption, Shape, SubShapeType } from "../graph/types/index";
import { Bounds } from "../graph/util/Bounds";
import { Point } from "../graph/util/Point";
import { getBoundsCenterPoint } from "../graph/util";
export class GraphOption implements IGraphOption {
  // src/editor/graphEditor.ts:18 更新 graph 处
  graph!: GraphModel
  constructor() {

  }
  adjustEdgeWhenShapeResized(resizeShape: Shape) {
    const affectedShapes = new Set<UpdatePatchItem>();
    const endToEdges = shapeUtil.getEndToEdgeMap()
    const relatedEdges = endToEdges.get(resizeShape.id);
    for (const edge of (relatedEdges || [])) {
      const change = this.adjustStraitEdgeWhenShapeMovedWithDxDy(resizeShape, edge)
      affectedShapes.add(change)
    }
    return affectedShapes
  }
  adjustStraitEdgeWhenShapeMovedWithDxDy(resizeShape: Shape, edge: Shape) {
    const isSource = edge.sourceId === resizeShape.id;
    const change: UpdatePatchItem = {
      id: edge.id,
      oldVal: {
        waypoint: edge.waypoint
      },
      newVal: null
    }
    const newWayPoint = cloneDeep(edge.waypoint)
    if (isSource) {
      const centerPt = getBoundsCenterPoint(resizeShape.bounds, false);
      newWayPoint[0] = centerPt
      change.newVal = {
        waypoint: newWayPoint
      }
    } else {
      const centerPt = getBoundsCenterPoint(resizeShape.bounds, false);
      newWayPoint[newWayPoint.length - 1] = centerPt;
      change.newVal = {
        waypoint: newWayPoint
      }
    }
    return change
  }
  onShapeResized(shape: Shape, resizeIndex: VertexType, newBounds: Bounds) {

    const resizeChange: UpdatePatchItem = {
      newVal: { bounds: newBounds },
      oldVal: { bounds: shape.bounds },
      id: shape.id
    }
    const changes = this.adjustEdgeWhenShapeResized(Object.assign({}, shape, resizeChange.newVal))
    batchUpdateShapesService([resizeChange, ...changes])
    // updateShapeService(shape.id, , )
    resizeUtil.expandParent(Object.assign({}, shape, { bounds: newBounds }))
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
