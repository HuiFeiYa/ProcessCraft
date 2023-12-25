import { reactive } from "vue";
import { GraphModel } from "../graph/models/graphModel";
import { GraphOption } from "./graphOption";
import { IGraphOption, Shape } from "../graph/types";
import { ShapeOption } from "../graph/types/shapeOption";
export class GraphEditor {
  graphOption!: GraphOption;

  graphModel!: GraphModel;

  constructor(options: {shapeOption:ShapeOption}) {
    // this.init();
    const shape = Shape.fromOption(options.shapeOption)
    const graphOption = new GraphOption(shape);
    const graph = reactive(new GraphModel(graphOption));
    // graph.init();
    this.graphModel = graph;
  }
  init() {
    // const graphOption = new GraphOption();
    // const graph = reactive(new GraphModel(graphOption));
    // graph.init();
    // this.graphModel = graph;
  }
}
