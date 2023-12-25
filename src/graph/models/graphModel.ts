import { EventType } from "../shape/constant";
import { Emitter } from "../util/Emitter";
import { MoveModel } from "./MoveModel";
import { ShapeCompManager } from "./shapeManager";

export class GraphModel {
  constructor(opt: any) {
    this.graphOption = opt;
    this.graphOption.graph = this;
  }
  /**
 * 元素移动模型
 */
  moveModel = new MoveModel(this)
  /**
 * 事件发射器
 */
  emitter = new Emitter()
  /**
   * graph配置对象(暴露的接口，由外部实现)
   */
  graphOption: any;
  init () {
    this.initEvents()
  }
  initEvents() {
    this.emitter.on(EventType.SHAPE_MOUSE_DOWN, this.moveModel.startMove.bind(this.moveModel));
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
