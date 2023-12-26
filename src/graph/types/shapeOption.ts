import { Shape, ShapeKey } from ".";
import { MoveModel } from "../models/MoveModel";
import { Bounds } from "../util/Bounds";
import { Point } from "../util/Point";

export interface StyleObject {
     /**
   * 文字的颜色
   * 对应csm的fontColor
   */
  color?:string

  /**
   * 背景色
   */
  background?: string,
  /**
   * 填充色， 渐变色的起始色，对于DecisionNode，JoinNode，SendSignalAction，TimeEventAction有用
   */
  fillColor?:string 
  strokeColor?: string;
  fontWeight?: number;
  [key: string]:string|number;
}
// 图形大类,大类表示了图形的数据结构， 相同大类的图形适用的数据结构是相同的，
export enum ShapeType {
    Symbol = "Symbol", // 图形外框
    Compartment = "Compartment", // 隔间
    CompartmentProperty = "CompartmentProperty", // 隔间内的属性
    Port = "Port", // 端口
    Edge = "Edge", // 连线
    Diagram = "Diagram", // 画布
    EdgeLabel = "EdgeLabel",
    MovableLabel = "MovableLabel",
  }
// 图形小类， 小类声明了要用哪个组件来渲染图形，在SubShapeType_Component 映射了小类到组件的映射
export enum SubShapeType {
    CommonDiagram = "CommonDiagram",
    CommonCompartmentProperty = "CommonCompartmentProperty", // 属性的图形
    Block="Block"
}
/**
 * 图形数据配置对象的接口
 */
export interface ShapeOption {
    /**
     * shapeType决定图形的数据结构
     */
    shapeType: ShapeType, //
  
    /**
     * subShapeType决定了图形用什么组件来渲染
     */
    subShapeType: SubShapeType, //
    style?: StyleObject
    keywordsBounds?: Bounds,
    taggedValuesBounds?: Bounds,
    constraintsValuesBounds?: Bounds,
    keywordsStyle?:StyleObject
    // hideCompartmentProperty?: HideCompartmentProperty,
    showName?:boolean
    // showKeywords:boolean
    icon?: string, // 图的图标
    showIcon?: boolean,
  
    /**
     * 图形的边框
     */
    bounds?: Bounds,
    nameStyle?:StyleObject,
    taggedValuesStyle?:StyleObject,
    constraintsValuesStyle?:StyleObject,
    nameBounds?:Bounds
    shapeKey:ShapeKey

    // position?:PortPosition,
  
    // flowDirection?:FlowDirection
  
    // direction?:Direction
    waypoint?:Point[] // 包括sourcePoint和targetPoint
  
    sourceId?:string
    targetId?:string
    svgPath?:string
  
    order?:number
    customEndMove: (moveModel: MoveModel, dx: number, dy: number) => void
}    