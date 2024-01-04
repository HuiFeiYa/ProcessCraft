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
    leftTop=1,
    rightTop=2,
    rightBottom=3,
    leftBottom=4
  }
  
  export enum SiderbarItemKey {
    Block = 'Block',
    ItemFlow = "ItemFlow"
  }

  export enum MetaclassType {
    Class = "Class",
    ItemFlow = "ItemFlow"
  }

  export enum StType {
    "SysML::Blocks::Block"="SysML::Blocks::Block",
    "SysML::ItemFlow"="SysML::ItemFlow",
  }

  export enum ArrowType {
    ContainArrow="ContainArrow",
    DiamondHollowArrow="DiamondHollowArrow",
    DiamondSolidArrow="DiamondSolidArrow",
    Arrow="Arrow",
    TriangleHollowArrow="TriangleHollowArrow",
    TriangleSolidArrow="TriangleSolidArrow"
  }