import { reactive } from "vue";
import { GraphModel } from "../graph/models/graphModel";
import { GraphOption } from "./graphOption";
import { Shape } from "../graph/types";
export class GraphEditor {
  graphOption!: GraphOption;

  graphModel!: GraphModel;

  constructor(shape: Shape) {
    // this.init();
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
