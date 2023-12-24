import { IGraphOption } from "../types";
import { ShapeCompManager } from "./shapeManager";

export class GraphModel {
  /**
   * graph配置对象(暴露的接口，由外部实现)
   */
  graphOption: IGraphOption;
  constructor(opt: IGraphOption) {
    this.graphOption = opt;
    this.graphOption.graph = this;
  }
  /**
   * 图形组件管理器(当前画布上使用到的那些图形组件)
   */
  shapeCompManager = new ShapeCompManager();
  /**
   * 注册图形组件 {key:组件的subShapeType, comp:vue组件}
   * @param arr
   */
  registerShapeComps(arr: { key: string; comp: any }[]) {
    this.shapeCompManager.addShapes(arr);
  }
  /**
   * 注册图形组件
   * @param arr
   */
  getShapeComp(key: string) {
    return this.shapeCompManager.get(key);
  }
}
