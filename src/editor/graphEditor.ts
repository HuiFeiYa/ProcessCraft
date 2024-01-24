import { reactive } from "vue";
import { GraphModel } from "../graph/models/graphModel";
import { GraphOption } from "./graphOption";
import { IGraphOption, Shape } from "../graph/types";
import { ShapeOption } from "../graph/types/shapeOption";
import { SiderBarDropModel } from "./SiderBarDropModel";
import { GraphTab } from "./project/GraphTab";
const graphOption = new GraphOption()
export const graph = reactive(new GraphModel(graphOption));
export class GraphEditor {
  graphOption!: GraphOption;

  graph: GraphModel

  shapes: Set<Shape>
  siderBarDropModel: SiderBarDropModel
  constructor(public tab: GraphTab) {
    this.graph = graph;
    graph.init();
    this.init()
  }
  init() {
    this.tab.siderBarDropModel = reactive(new SiderBarDropModel(this.graph)) as SiderBarDropModel;
  }
  addShapes(shapeList: Set<Shape>) {
    shapeList.forEach(shape => {
      this.shapes.add(shape)
    })
  }
}
