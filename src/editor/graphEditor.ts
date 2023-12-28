import { reactive } from "vue";
import { GraphModel } from "../graph/models/graphModel";
import { GraphOption } from "./graphOption";
import { IGraphOption, Shape } from "../graph/types";
import { ShapeOption } from "../graph/types/shapeOption";
export class GraphEditor {
  graphOption!: GraphOption;

  graph: GraphModel

  shapes: Set<Shape>
  constructor() {
    const graph = reactive(new GraphModel());
    this.graph = graph;
    graph.init();
  }
  init() {
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
