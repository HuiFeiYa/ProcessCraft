import { MoveModel } from "../../models/MoveModel";
import {
  UpdatePatchItem,
  batchUpdateShapesService,
  patchItemFactory,
} from "../../service";
import { Shape, ShapeKey, SubShapeType } from "../../types";
import { ShapeOption, ShapeType } from "../../types/shapeOption";
import { Bounds } from "../../util/Bounds";
import { ArrowType, SiderbarItemKey } from "../constant";

export const baseShapeOption: ShapeOption = {
  shapeType: ShapeType.Symbol,
  subShapeType: SubShapeType.Block,
  shapeKey: ShapeKey.Block,
  style: {
    background: "linear-gradient(to right,#DDCD9E,#FDF7DF)",
    strokeColor: "#ad9d85",
    //   strokeWidth: 1,
    //   selectable: true,
    //   movable: true,
    //   resizable: true,
    //   editable: true,
    //   showConstraintsValues: false
    // paddingTop: 0,
    // paddingLeft: 0,
    // paddingRight: 0,
    // paddingBottom: 0
  },
  keywordsBounds: new Bounds(0, 0, 0, 0, 0, 0),
  keywordsStyle: {
    fontWeight: 400,
    fontSize: 12,
    whiteSpace: "pre-wrap",
    fontFamily: "",
    color: "rgb(0,0,0)",
    textAlign: "center",
  },

  showIcon: false,
  icon: "", // 图的图标

  showName: true,
  nameStyle: {
    fontWeight: 400,
    fontSize: 12,
    whiteSpace: "pre-wrap",
    fontFamily: "",
    color: "rgb(0,0,0)",
    textAlign: "center",
  },
  taggedValuesStyle: {
    fontWeight: 400,
    fontSize: 12,
    whiteSpace: "pre-wrap",
    fontFamily: "",
    color: "rgb(0,0,0)",
    textAlign: "left",
    wordBreak: "break-all",
  },
  constraintsValuesStyle: {
    fontWeight: 400,
    fontSize: 12,
    whiteSpace: "pre-wrap",
    fontFamily: "",
    color: "rgb(0,0,0)",
    textAlign: "center",
    wordBreak: "break-all",
  },
  nameBounds: new Bounds(0, 0, 100, 13, 0, 0),
  taggedValuesBounds: new Bounds(0, 0, 100, 13, 0, 0),
  constraintsValuesBounds: new Bounds(0, 0, 100, 13, 0, 0),
  bounds: new Bounds(0, 0, 100, 80, 0, 0),
  /**
   * 移动结束时触发的方法
   * @param moveModel
   * @param dx
   * @param dy
   */
  async customEndMove(moveModel: MoveModel, dx: number, dy: number) {
    // 更新模型位置
    const effectList: UpdatePatchItem[] = []
    moveModel.movingShapes.map(
      (shape) => {
        const change = {
          oldVal: { bounds: shape.bounds },
          newVal: {
            bounds: {
              x: shape.bounds.x + dx,
              y: shape.bounds.y + dy,
              absX: shape.bounds.absX + dx,
              absY: shape.bounds.absY + dy,
            },
          },
          id: shape.id,
        };
      }
    );
    batchUpdateShapesService(effectList);
  },
};

export const edgeOption: ShapeOption = {
  ...baseShapeOption,
  shapeType: ShapeType.Edge,
  subShapeType: SubShapeType.CommonEdge,
  shapeKey: ShapeKey.Association,
  waypoint: [],
  bounds: new Bounds(0, 0, 100, 2, 0, 0),
  style: {
    ...baseShapeOption.style,
    showConstraintsValues: false,
    dashed: false,
    rounded: false,
    rightAngle: true,
    imageBox: false,
    strokeColor: "rgb(0,0,0)",
    fillColor: "rgb(255,255,255)",
    strokeWidth: 2,
    sourceArrow: undefined,
    // midArrow: undefined,
    targetMidArrow: undefined,
    sourceMidArrow: undefined,
    targetArrow: undefined,
    hidden: false,
    selectable: true,
    movable: true,
    resizable: false,
    // showKeywords: false,
    editable: false,
  },
};

export const blockOption: ShapeOption = {
  ...baseShapeOption,
  shapeType: ShapeType.Symbol,
  subShapeType: SubShapeType.Block,
  shapeKey: ShapeKey.Block,
  style: {
    ...baseShapeOption.style,
    background: "linear-gradient(to right,#DDCD9E,#FDF7DF)",
    strokeColor: "#ad9d85",
    strokeWidth: 1,
    resizable: true,
  },
  bounds: new Bounds(10, 10, 100, 50, 10, 10),
  nameStyle: {
    fontWeight: 400,
    fontSize: 12,
    whiteSpace: "pre-wrap",
    fontFamily: "",
    textAlign: "center",
  },
};

export const diagramOption: ShapeOption = {
  ...baseShapeOption,
  shapeType: ShapeType.Diagram,
  subShapeType: SubShapeType.CommonDiagram,
  shapeKey: ShapeKey.Diagram,

  style: {
    background: '#fff',
    strokeColor: 'rgb(0,0,0)',
    strokeWidth: 1,
    minWidth: 200,
    minHeight: 150,
    paddingRight: 20,
    paddingBottom: 20,
    selectable: true,
    movable: false,
    resizable: true,
    editable: false
  },

  keywordsBounds: null,
  icon: '', // 图的图标
  showIcon: false,
  showName: true,

  bounds: { absX: 12, absY: 12, width: 1000, height: 800, x: 12, y: 12, offsetX: 0, offsetY: 0 }

};
export const modelKeyConfig = {
  [SiderbarItemKey.Block]: {
    shapeOption: {
      ...blockOption,
      shapeKey: ShapeKey.Block,
      siderbarKey: SiderbarItemKey.Block,
    },
  },
  [SiderbarItemKey.Start]: {
    shapeOption: {
      ...blockOption,
      shapeKey: ShapeKey.Block,
      siderbarKey: SiderbarItemKey.Start,
      style: {
        ...blockOption.style,
        borderRadius: 20, // 圆角大小
      }
    },
  },
  [SiderbarItemKey.ItemFlow]: {
    shapeOption: {
      ...edgeOption,
      shapeKey: ShapeKey.ItemFlow,
      showKeywords: true,
      style: {
        ...edgeOption.style,
        // dashed: true,
        targetArrow: ArrowType.Arrow,
      },
      siderbarKey: SiderbarItemKey.ItemFlow,
    },
  },
  [SiderbarItemKey.FlowDiagram]: {
    keyword: { en: '', cn: '' },
    shapeOption: {
      ...diagramOption,
      shapeKey: ShapeKey.PackageDiagram,
      names: {
        shortName: '流程图',
        contextTypeName: 'Model',
        contextName: 'Model',
        name: 'Model'
      }
    }
  },
  [SiderbarItemKey.Decide]: {
    shapeOption: {
      ...blockOption,
      shapeKey: ShapeKey.Decide,
      siderbarKey: SiderbarItemKey.Decide,
      subShapeType: SubShapeType.Decide
    },
  },
};
