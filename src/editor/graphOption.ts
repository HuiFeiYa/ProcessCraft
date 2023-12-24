import { IGraphOption, Shape } from "../graph/types/index";
export class GraphOption implements IGraphOption {
  constructor(public shape: Shape) {}
}
