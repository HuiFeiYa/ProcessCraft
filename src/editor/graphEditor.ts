import { reactive } from "vue";
import { GraphModel } from "../graph/models/graphModel";
import { GraphOption } from "./graphOption";
import { IGraphOption, Shape } from "../graph/types";
import { ShapeOption } from "../graph/types/shapeOption";
import { SiderBarDropModel } from "./SiderBarDropModel";
export class GraphEditor {
  graphOption!: GraphOption;

  graph: GraphModel

  shapes: Set<Shape>
  siderBarDropModel:SiderBarDropModel
  constructor() {
    const graph = reactive(new GraphModel());
    this.graph = graph;
    graph.init();
  }
  init() {
    this.siderBarDropModel = reactive(new SiderBarDropModel(this.graph)) as SiderBarDropModel;
    // const graphOption = new GraphOption();
    // const graph = reactive(new GraphModel(graphOption));
    // graph.init();
    // this.graphModel = graph;
  }
  addShapes(shapeList: Set<Shape>) {
    shapeList.forEach(shape=> {
      this.shapes.add(shape)
    })
  }
}
