import { SiderBarItem } from "../../editor/SiderBarDropModel";
import { SubShapeType } from "../types";

export enum EdgeMoveType {
  Segment, // 线段拖动
  Waypoint, // waypoint拖动
  SourcePoint, // 起点拖动
  TargetPoint, // 终点拖动
}

/**
 * 图形标亮的颜色
 */
export enum MarkerColor {
  valid = "#1890FF",
  invalid = "#FF181F",
}

export enum EventType {
  SHAPE_INIT_EDIT = "SHAPE_INIT_EDIT",
  SHAPE_CLICK = "SHAPE_CLICK",
  SHAPE_DBL_CLICK = "SHAPE_DBL_CLICK",

  SHAPE_MOUSE_DOWN = "SHAPE_MOUSE_DOWN",
  SHAPE_MOUSE_UP = "SHAPE_MOUSE_UP",
  SHAPE_MOUSE_MOVE = "SHAPE_MOUSE_MOVE",
  NAME_LABEL_CLICK = "NAME_LABEL_CLICK",
  SLOT_LABEL_CLICK = "SLOT_LABEL_CLICK",
  SHAPE_DRAG_ENTER = "SHAPE_DRAG_ENTER",
  SHAPE_DRAG_LEAVE = "SHAPE_DRAG_LEAVE",
  SHAPE_DRAG_DROP = "SHAPE_DRAG_DROP",

  SHAPE_DRAG_OVER = "SHAPE_DRAG_OVER",

  SELECTION_CHANGE = "SELECTION_CHANGE",
  SHAPE_CONTEXT_MENU = "SHAPE_CONTEXT_MENU",
  // eslint-disable-next-line camelcase
  OPTION_BTN_CLICk = "OPTION_BTN_CLICk",
  SHAPE_POP_MENU = "SHAPE_POP_MENU",
  HYPERLINKS = "HYPERLINKS",
  HTMLLINKS = "HTMLLINKS",
  VERTEX_ICON_CLICK = "VERTEX_ICON_CLICK",

  PROJECT_MERGE_SHAPE_CLICK = "PROJECT_MERGE_SHAPE_CLICK",
}

export enum VertexType {
  leftTop = 1,
  rightTop = 2,
  rightBottom = 3,
  leftBottom = 4,
}
export enum CreatePointType {
  Top = 1,
  Right = 2,
  Bottom = 3,
  Left = 4,
}

export enum SiderbarItemKey {
  Block = "Block",
  ItemFlow = "ItemFlow",
  FlowDiagram = "FlowDiagram",
  Start = 'Start',
  Decide = 'Decide'
}

export enum MetaclassType {
  Class = "Class",
  ItemFlow = "ItemFlow",
  FlowDiagram = 'FlowDiagram'
}

export enum StType {
  "SysML::Blocks::Block" = "SysML::Blocks::Block",
  "SysML::ItemFlow" = "SysML::ItemFlow",
}

export enum ArrowType {
  ContainArrow = "ContainArrow",
  DiamondHollowArrow = "DiamondHollowArrow",
  DiamondSolidArrow = "DiamondSolidArrow",
  Arrow = "Arrow",
  TriangleHollowArrow = "TriangleHollowArrow",
  TriangleSolidArrow = "TriangleSolidArrow",
}
export const siderBarList: SiderBarItem[] = [
  {
    modelId: "SysML::Blocks::Block",
    operation: "",
    dropdownTag: "",
    showData: {
      name: "开始/结束",
      icon: "src/assets/startend.png",
      siderBarkey: SiderbarItemKey.Start,
    },
  },
  {
    modelId: "SysML::Blocks::Block",
    operation: "",
    dropdownTag: "",
    showData: {
      name: "矩形",
      icon: "src/assets/rect.png",
      siderBarkey: SiderbarItemKey.Block,
    },
  },
  {
    modelId: "SysML::ItemFlow",
    operation: "",
    dropdownTag: "",
    showData: {
      name: "直线",
      icon: "src/assets/line.png",
      siderBarkey: SiderbarItemKey.ItemFlow,
    },
  },
  {
    modelId: "SysML::Decide",
    operation: "",
    dropdownTag: "",
    showData: {
      name: "判定",
      icon: "src/assets/decide.png",
      siderBarkey: SiderbarItemKey.Decide,
    },
  },
];


export const HeaderHeight = 38
export const SideBarWidth = 200

export const showQuickCreateList = [
  SubShapeType.Block, SubShapeType.Decide
]
export const showDashboardList = [
  SiderbarItemKey.Block, SiderbarItemKey.Decide, SiderbarItemKey.Start
]