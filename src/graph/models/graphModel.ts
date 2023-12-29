import { EventType } from "../shape/constant";
import { Emitter } from "../util/Emitter";
import { MoveModel, MoveRange } from "./MoveModel";
import { ViewModel } from "./ViewModel";
import { ShapeCompManager } from "./shapeManager";
import { SelectionModel } from './SelectionModel'
import { Shape } from "../types";
import { GraphOption } from "../../editor/graphOption";
export const emitter = new Emitter()
export class GraphModel {
  disabled = false
  shapes: Set<Shape>
  rootShape =  {
    bounds: {
      absX: 12,
      absY:12
    }
  }
  constructor() {
    
  }
  /**
 * 选中元素模型
 */
  selectionModel = new SelectionModel(this)
  /**
 * 视图模型
 */
  viewModel = new ViewModel(this)

  /**
 * 元素移动模型
 */
  moveModel = new MoveModel(this)
  /**
 * 图形id索引
 */
  shapeMap = new Map<string, Shape>()
  /**
 * 事件发射器
 */
  emitter = emitter
  /**
   * 图形组件管理器(当前画布上使用到的那些图形组件)
   */
  shapeCompManager = new ShapeCompManager();
  /**
   * children索引， id -> children，(父图形ID对应的其多个子图形)
   */
  indexParent: Map<string | null, Shape[]> = new Map()
  /**
   * graph配置对象(暴露的接口，由外部实现)
   */
  graphOption: GraphOption;
  init() {
    this.initEvents()
  }
  initEvents() {
    this.emitter.on(EventType.SHAPE_MOUSE_DOWN, this.moveModel.startMove.bind(this.moveModel));
  }
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
  getShape(id: string): Shape | undefined {
    return this.shapeMap.get(id);
  }
  addShape(shape: Shape) {
    if (this.shapeMap.has(shape.id)) {
      return;
    }
    this.shapeMap.set(shape.id, shape);
  }
  removeShape(id: string) {
    const shape = this.shapeMap.get(id);
    if (shape) {
      this.shapeMap.delete(id);
    }
  }
  /**
 * 移动结束时触发的方法
 * @param moveModel
 * @param dx
 * @param dy
 */
  async customEndMove(moveModel: MoveModel, dx: number, dy: number) {
    // 更新模型位置
    moveModel.movingShapes.forEach(shape => {
      shape.bounds.x += dx;
      shape.bounds.y += dy;
      shape.bounds.absX += dx;
      shape.bounds.absY += dy;
    })
  }
  getMoveRange(moveShapes: Shape[]): Promise<MoveRange> {
          // 判断是否存在只能沿x或y轴移动的元素，没有考虑上面俩
          let [signX, signY] = [0, 0];
          // 是否有选中元素只能在
          for (let it of moveShapes) {
            signX += it.style?.xOnly ? 1 : 0;
            signY += it.style?.yOnly ? 1 : 0;
          }
    
          let [dxMin, dyMin, dxMax, dyMax] = [0, 0, Infinity, Infinity];
          let minAbsX = Math.min(...moveShapes.map(it => {
            return it.bounds.absX
          }));
          let minAbsY = Math.min(...moveShapes.map(it => {
            return it.bounds.absY
          }));
          // 能移动 x 轴偏差值如: -200,最小移动 -200
          dxMin = this.rootShape!.bounds.absX - minAbsX;
          dyMin = this.rootShape!.bounds.absY - minAbsY;
          if (signX) dyMin = dyMax = 0;
          if (signY) dxMin = dxMax = 0;
          return Promise.resolve({
            dxMin,
            dyMin,
            dxMax,
            dyMax
          });
  }
}
