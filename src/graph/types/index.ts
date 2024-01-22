/* eslint-disable camelcase */

import { MoveRange } from "../models/MoveModel";
import { VertexType } from "../models/ResizeModel";
import { GraphModel } from "../models/graphModel";
import { SiderbarItemKey } from "../shape/constant";
import { Point } from "../util/Point";
import { FontStyle, ShapeOption, StyleObject } from "./shapeOption";
import { cloneDeep } from 'lodash'

// 图形大类,大类表示了图形的数据结构， 相同大类的图形适用的数据结构是相同的，
export enum ShapeType {
  Symbol = "Symbol", // 图形外框
  Compartment = "Compartment", // 隔间
  CompartmentProperty = "CompartmentProperty", // 隔间内的属性
  Port = "Port", // 端口
  Edge = "Edge", // 连线
  Diagram = "Diagram", // 画布
  EdgeLabel = "EdgeLabel", // 线上的label
  MovableLabel = "MovableLabel",
}

// 图形小类， 小类声明了要用哪个组件来渲染图形，在SubShapeType_Component 映射了小类到组件的映射
export enum SubShapeType {
  requirementMapShape = "requirementMapShape",
  CommonEdgeLabel = "CommonEdgeLabel",
  EdgeKewordLabel = "EdgeKewordLabel",
  KewordMovableLabel = "KewordMovableLabel",
  DiagramIcon = "DiagramIcon",
  TextBox = "TextBox",
  VerticalSeparator = "VerticalSeparator",
  HorizontalSeparator = "HorizontalSeparator",
  Block = "Block", // 模块结构的类型，适用于各类结构型元素。如Block， interfaceBlock， signal， valueType，
  CommonSymbol = "CommonSymbol", // 通用的图形外框结构， 大部分图形都适用，如Block,signal,
  PropertyCompartment = "PropertyCompartment", // 属性compartment，用于承载结构型元素的属性展示，
  // ElementCompartment="ElementCompartment", // 元素compartment， 用于承载元素内显示其他symbol的展示， 如Package，Diagram内显示其他模型的symbol

  // CompartmentProperty_PartProperty="CompartmentProperty_PartProperty",,
  CommonDiagram = "CommonDiagram",
  CommonCompartmentProperty = "CommonCompartmentProperty",
  SlotCompartment = "SlotCompartment",
  Package = "Package",
  Comment = "Comment",
  Rectangular = "Rectangular",
  StructureCompartment = "StructureCompartment",
  CommonPort = "CommonPort",
  CommonMovableLabel = "CommonMovableLabel",
  // ConnectorEndLabel="ConnectorEndLabel",

  CommonEdge = "CommonEdge",
  Note = "Note",
  Image = "Image",
  UseCase = "UseCase",
  Actor = "Actor",
  Requirement = "Requirement",
  // Common='Common',

  // 活动图图形
  InitialNode = "InitialNode",
  ActivityFinal = "ActivityFinal",
  FlowFinal = "FlowFinal",
  DecisionNode = "DecisionNode", //
  MergeNode = "MergeNode",
  ForkNode = "ForkNode",
  JoinNode = "JoinNode",
  SendSignalAction = "SendSignalAction",
  AcceptEventAction = "AcceptEventAction",
  TimeEventAction = "TimeEventAction",
  InterruptibleActivityRegion = "InterruptibleActivityRegion",
  Split = "Split",
  ActivityParamterNode = "ActivityParamterNode",

  // 状态机图形
  PseudostateEntryPoint = "PseudostateEntryPoint",
  PseudostateExitPoint = "PseudostateExitPoint",
  PseudostateTerminate = "PseudostateTerminate",
  PseudostateDeepHistory = "PseudostateDeepHistory",

  Swimlane = "Swimlane",
  SwimlaneTopItem = "SwimlaneTopItem",
  SwimlaneLeftItem = "SwimlaneLeftItem",
  SwimlaneContentItem = "SwimlaneContentItem",
  // 分隔线
  RectangularShape = "RectangularShape",
  // Common='Common',
  // CompartmentProperty_StateBehavior="CompartmentProperty_StateBehavior",

  TransitionToSelf = "TransitionToSelf",

  // 序列图图形
  Lifeline = "Lifeline",
  LifelineHeader = "LifelineHeader",
  MessageOccurrence = "MessageOccurrence",
  Message = "Message",
  FoundMessage = "FoundMessage",
  LostMessage = "LostMessage",
  DurationConstraint = "DurationConstraint",
  TimeConstraint = "TimeConstraint",
  CombinedFragment = "CombinedFragment",
  InteractionUse = "InteractionUse",
  StateInvariant = "StateInvariant",
  MessageToSelf = "MessageToSelf",
}

/**
 * shapeKey是最细的标识，用于标识各个图形，用于业务逻辑中的图形逻辑判断，基本每个模型都会对应一到多个
 */
export enum ShapeKey {
  StructureSysMLRetrospectMap = "StructureSysMLRetrospectMap", // 结构追溯图画布
  StructureRetrospectShape = "StructureRetrospectShape", // 结构追溯图元素
  RetrospectShape = "RetrospectShape", // 追溯图元素
  SysMLRetrospectMap = "SysMLRetrospectMap",
  TimeSeriesChart = "TimeSeriesChart",
  SimulationConfig = "SimulationConfig",
  RequirementShape = "RequirementShape",
  /**
   * 射线相关 暂未知是哪些图的
   */
  DeriveReqt = "DeriveReqt",
  Mount = "Mount",
  Expose = "Expose",
  AssociationBlock = "AssociationBlock",
  InformationFlow = "InformationFlow",
  InterfaceRealization = "InterfaceRealization",
  PackageMerge = "PackageMerge",
  ProfileApplication = "ProfileApplication",
  Deployment = "Deployment",
  Dependence = "Dependence",
  Extension = "Extension",
  /**
   * 表格
   */
  RequirementTable = "RequirementTable",
  GenericTable = "GenericTable",
  InstanceTable = "InstanceTable",
  /**
   * 矩阵
   */
  DiagramMatrix = "DiagramMatrix",
  DependencyMatrix = "DependencyMatrix",
  AllocationMatrix = "AllocationMatrix",
  RefineRequirementMatrix = "RefineRequirementMatrix",
  DeriveRequirementMatrix = "DeriveRequirementMatrix",
  VerifyRequirementMatrix = "VerifyRequirementMatrix",
  SatisfyRequirementMatrix = "SatisfyRequirementMatrix",
  /**
   * 卧底图
   */
  SysMLDiagram = "SysMLDiagram",
  SysMLBehaviorDiagram = "SysMLBehaviorDiagram",
  RocketTD = "RocketTD",
  SysMLRelationMap = "SysMLRelationMap",
  /**
   * 用这用这
   */
  ActivityDiagram = "ActivityDiagram",
  SequenceDiagram = "SequenceDiagram",
  InternalBlockDiagram = "InternalBlockDiagram",
  FaultTreeDiagram = "FaultTreeDiagram",
  ParametricDiagram = "ParametricDiagram",
  RequirementDiagram = "RequirementDiagram",
  StateMachineDiagram = "StateMachineDiagram",
  ProfileDiagram = "ProfileDiagram",
  ClassDiagram = "ClassDiagram",
  PackageDiagram = "PackageDiagram",
  UseCaseDiagram = "UseCaseDiagram",
  BlockDefinitionDiagram = "BlockDefinitionDiagram",
  Diagram = "Diagram",
  StructureDiagram = "StructureDiagram",
  UserInterfaceModelingDiagram = "UserInterfaceModelingDiagram",
  SimulationConfigDiagram = "SimulationConfigDiagram",
  ContentDiagram = "ContentDiagram",
  InteractionDiagram = "InteractionDiagram",
  /**
   * 通用图形
   */
  Note = "Note",
  Anchor = "Anchor",
  Comment = "Comment",
  Problem = "Problem",
  Rationale = "Rationale",
  ElementGroup = "ElementGroup",
  TimeConstraint = "TimeConstraint",
  DurationConstraint = "DurationConstraint",
  DurationConstraintLabel = "DurationConstraintLabel",
  Constraint = "Constraint",
  Containment = "Containment",
  Abstraction = "Abstraction",
  Dependency = "Dependency",
  Allocate = "Allocate",
  Realization = "Realization",
  ImageShape = "ImageShape",
  DiagramOverview = "DiagramOverview",
  Legend = "Legend",
  TextBox = "TextBox",
  HorizontalSeparator = "HorizontalSeparator",
  VerticalSeparator = "VerticalSeparator",
  RectangularShape = "RectangularShape",
  Split = "Split",
  CommonMovableLabel = "CommonMovableLabel",
  TransitionToSelfLabel = "TransitionToSelfLabel",
  ConnectionPointReferenceLabel = "ConnectionPointReferenceLabel",
  ExtendLabel = "ExtendLabel",
  ExtendExtensionPointLabel = "ExtendExtensionPointLabel",
  RedefinePropertyEdgeLabel = "RedefinePropertyEdgeLabel",
  DiagramIcon = "DiagramIcon",
  AttachedFile = "AttachedFile",
  AttachedFile_Image = "AttachedFile_Image",
  /**
   * 模块定义图
   */
  Block = "Block",
  InterfaceBlock = "InterfaceBlock",
  FlowSpecification = "FlowSpecification",
  ConstraintBlock = "ConstraintBlock",
  ValueType = "ValueType",
  QuantityKind = "QuantityKind",
  Unit = "Unit",
  Enumeration = "Enumeration",
  Signal = "Signal",
  Instance = "Instance",
  Interface = "Interface",
  Port = "Port",
  ProxyPort = "ProxyPort",
  FullPort = "FullPort",
  FlowPort = "FlowPort",
  Link = "Link",
  Association = "Association",
  DirectedAssociation = "DirectedAssociation",
  Aggregation = "Aggregation",
  DirectedAggregation = "DirectedAggregation",
  Composition = "Composition",
  DirectedComposition = "DirectedComposition",
  Generalization = "Generalization",
  Usage = "Usage",
  ItemFlow = "ItemFlow",
  /**
   * 内置模块图
   */
  ValueProperty = "ValueProperty",
  PartProperty = "PartProperty",
  ReferenceProperty = "ReferenceProperty",
  ConstraintProperty = "ConstraintProperty",
  FlowProperty = "FlowProperty",
  ParticipantProperty = "ParticipantProperty",
  BoundReference = "BoundReference",
  ClassifierBehaviorProperty = "ClassifierBehaviorProperty",
  ConstraintParameter = "ConstraintParameter",
  Connector = "Connector",
  BindingConnector = "BindingConnector",
  ConnectorEndLabel = "ConnectorEndLabel",
  /**
   * 参数图
   */
  Moe = "Moe",
  objectiveFunction = "objectiveFunction",
  /**
   * 包图
   */
  Package = "Package",
  Model = "Model",
  PackageImport = "PackageImport",
  ElementImport = "ElementImport",
  /**
   * 用例图
   */
  Actor = "Actor",
  Actuator = "Actuator",
  BoundarySystem = "BoundarySystem",
  EnvironmentalEffect = "EnvironmentalEffect",
  ExternalSystem = "ExternalSystem",
  Sensor = "Sensor",
  UserSystem = "UserSystem",
  SystemContext = "SystemContext",
  UseCase = "UseCase",
  RequirementUseCase = "RequirementUseCase",
  TestCase = "TestCase",
  /**
   * 需求图
   */
  Requirement = "Requirement",
  Satisfy = "Satisfy",
  Derive = "Derive",
  Copy = "Copy",
  Trace = "Trace",
  Verify = "Verify",
  Refine = "Refine",
  TestCaseActivity = "TestCaseActivity",
  TestCaseStateMachine = "TestCaseStateMachine",
  TestCaseInteraction = "TestCaseInteraction",
  /**
   * 活动图
   */
  Action = "Action",
  CallBehaviorAction = "CallBehaviorAction",
  CallOperationAction = "CallOperationAction",
  StartObjectBehaviorAction = "StartObjectBehaviorAction",
  ValueSpecificationAction = "ValueSpecificationAction",
  ReadStructuralFeatureAction = "ReadStructuralFeatureAction",
  ClearStructuralFeatureAction = "ClearStructuralFeatureAction",
  ReadExtentAction = "ReadExtentAction",
  AddStructuralFeatureValueAction = "AddStructuralFeatureValueAction",
  ReadSelfAction = "ReadSelfAction",
  CreateObjectAction = "CreateObjectAction",
  TimeEventAction = "TimeEventAction",
  OpaqueAction = "OpaqueAction",
  AnyAction = "AnyAction",
  ObjectNode = "ObjectNode",
  CentralBufferNode = "CentralBufferNode",
  DataStoreNode = "DataStoreNode",
  InputExpansionNode = "InputExpansionNode",
  OutputExpansionNode = "OutputExpansionNode",
  ActivityParameterNode = "ActivityParameterNode",
  ControlFlow = "ControlFlow",
  ObjectFlow = "ObjectFlow",
  SendSignalAction = "SendSignalAction",
  AcceptEventAction = "AcceptEventAction",
  AcceptChangeStructuralFeatureEventAction = "AcceptChangeStructuralFeatureEventAction",
  TimeEvent = "TimeEvent",
  InitialNode = "InitialNode",
  ActivityFinalNode = "ActivityFinalNode",
  FlowFinalNode = "FlowFinalNode",
  DecisionNode = "DecisionNode",
  MergeNode = "MergeNode",
  ForkNodeHorizontal = "ForkNodeHorizontal",
  ForkNodeVertical = "ForkNodeVertical",
  JoinNodeHorizontal = "JoinNodeHorizontal",
  JoinNodeVertical = "JoinNodeVertical",
  ExceptionHandler = "ExceptionHandler",
  StructuredActivityNode = "StructuredActivityNode",
  InterruptibleActivityRegion = "InterruptibleActivityRegion",
  ConditionalNode = "ConditionalNode",
  LoopNode = "LoopNode",
  SequenceNode = "SequenceNode",
  InputPin = "InputPin",
  OutputPin = "OutputPin",
  ValuePin = "ValuePin",
  ActionInputPin = "ActionInputPin",
  Swimlane = "Swimlane",
  SwimlaneTopItem = "SwimlaneTopItem",
  SwimlaneLeftItem = "SwimlaneLeftItem",
  SwimlaneContentItem = "SwimlaneContentItem",
  Activity = "Activity",
  SwimlaneVertical = "SwimlaneVertical",
  SwimlaneHorizontal = "SwimlaneHorizontal",
  ControllFlowLabel = "ControllFlowLabel",
  ObjectFlowLabel = "ObjectFlowLabel",
  ConnectorLabel = "ConnectorLabel",
  /**
   * 状态机图
   */
  State = "State",
  Pseudostate = "Pseudostate",
  CompositeState = "CompositeState",
  OrthogonalState = "OrthogonalState",
  SubmachineState = "SubmachineState",
  PseudostateInitial = "PseudostateInitial",
  FinalState = "FinalState",
  PseudostateTerminate = "PseudostateTerminate",
  PseudostateEntryPoint = "PseudostateEntryPoint",
  PseudostateExitPoint = "PseudostateExitPoint",
  ConnectionPointReference = "ConnectionPointReference",
  PseudostateDeepHistory = "PseudostateDeepHistory",
  PseudostateShallowHistory = "PseudostateShallowHistory",
  PseudostateJunction = "PseudostateJunction",
  PseudostateChoice = "PseudostateChoice",
  PseudostateForkHorizontal = "PseudostateForkHorizontal",
  PseudostateForkVertical = "PseudostateForkVertical",
  PseudostateJoinHorizontal = "PseudostateJoinHorizontal",
  PseudostateJoinVertical = "PseudostateJoinVertical",
  PseudostateJoin = "PseudostateJoin",
  PseudostateFork = "PseudostateFork",
  Transition = "Transition",
  TransitionToSelf = "TransitionToSelf",
  TransitionLabel = "TransitionLabel",
  /**
   * 序列图
   */
  Lifeline = "Lifeline",
  LifelineHeader = "LifelineHeader",
  Alternatives = "Alternatives",
  Loop = "Loop",
  Option = "Option",
  Parallel = "Parallel",
  Break = "Break",
  Negative = "Negative",
  Ignore = "Ignore",
  Consider = "Consider",
  Assertion = "Assertion",
  InteractionUse = "InteractionUse",
  Message = "Message",
  CallMessage = "CallMessage",
  SendMessage = "SendMessage",
  ReplyMessage = "ReplyMessage",
  CreateMessage = "CreateMessage",
  DeleteMessage = "DeleteMessage",
  LostMessage = "LostMessage",
  FoundMessage = "FoundMessage",
  MessageToSelf = "MessageToSelf",
  StateInvariant = "StateInvariant",
  MessageLabel = "MessageLabel",
  CombinedFragment = "CombinedFragment",
  Collaboration = "Collaboration",
  MessageOccurrence = "MessageOccurrence",
  /**
   * 扩展图
   */
  Stereotype = "Stereotype",
  Class = "Class",
  Metaclass = "Metaclass",
  Profile = "Profile",
  Customization = "Customization",
  /**
   * 其他
   */
  Trigger = "Trigger",
  StateMachine = "StateMachine",
  OpaqueBehavior = "OpaqueBehavior",
  SignalEvent = "SignalEvent",
  CallEvent = "CallEvent",
  AnyReceiveEvent = "AnyReceiveEvent",
  ChangeEvent = "ChangeEvent",

  AllocateActivityPartitionVertical = "AllocateActivityPartitionVertical",
  AllocateActivityPartitionHorizontal = "AllocateActivityPartitionHorizontal",
  TimeLine = "TimeLine",
  TimeGap = "TimeGap",
  CommandAction = "CommandAction",
  Region = "Region",

  BehaviorExecutionSpecification = "BehaviorExecutionSpecification",
  Interaction = "Interaction",
  ExtensionPoint = "ExtensionPoint",

  InstanceSpecification = "InstanceSpecification",

  ObjectiveFunction = "ObjectiveFunction",

  /**
   * compartment 属性
   */
  CompartmentProperty = "CompartmentProperty", // compartment中的普通属性
  CompartmentProperty_PartProperty = "CompartmentProperty_PartProperty", // compartment中的partproeprty
  CompartmentProperty_ConstraintProperty = "CompartmentProperty_ConstraintProperty",
  CompartmentProperty_ValueProperty = "CompartmentProperty_ValueProperty",
  CompartmentProperty_FlowProperty = "CompartmentProperty_FlowProperty",
  CompartmentProperty_RefrenceProperty = "CompartmentProperty_RefrenceProperty",
  CompartmentProperty_Constraint = "CompartmentProperty_Constraint",
  CompartmentProperty_ReferenceProperty = "CompartmentProperty_ReferenceProperty",
  CompartmentProperty_FullPort = "CompartmentProperty_FullPort",
  CompartmentProperty_ProxyPort = "CompartmentProperty_ProxyPort",
  CompartmentProperty_Port = "CompartmentProperty_Port",
  CompartmentProperty_SignalReception = "CompartmentProperty_SignalReception",
  CompartmentProperty_Operation = "CompartmentProperty_Operation",
  CompartmentProperty_ExtensionPoint = "CompartmentProperty_ExtensionPoint",
  Compartment_ConstraintParameter = "Compartment_ConstraintParameter",
  CompartmentProperty_ConstraintParameter = "CompartmentProperty_ConstraintParameter",
  CompartmentProperty_Slot = "CompartmentProperty_Slot",
  Compartment_Attributes = "Compartment_Attributes",
  Compartment_Interaction_Operand = "Compartment_Interaction_Operand",
  Compartment_Interaction_Operand_Else = "Compartment_Interaction_Operand_Else",
  CompartmentProperty_Entry = "CompartmentProperty_Entry",
  CompartmentProperty_Exit = "CompartmentProperty_Exit",
  CompartmentProperty_DoActivity = "CompartmentProperty_DoActivity",
  CompartmentProperty_LegendItem = "CompartmentProperty_LegendItem",
  /**
   * compartment
   */
  Compartment = "Compartment", // 通用compartment
  Compartment_Parts = "Compartment_Parts",
  Compartment_Values = "Compartment_Values",
  Compartment_Constraints = "Compartment_Constraints",
  Compartment_Flow_Properties = "Compartment_Flow_Properties",
  Compartment_Properties = "Compartment_Properties",
  Compartment_Refrences = "Compartment_Refrences",
  Compartment_Operations = "Compartment_Operations",
  Compartment_Full_Ports = "Compartment_Full_Ports",
  Compartment_Proxy_Ports = "Compartment_Proxy_Ports",
  Compartment_Structure = "Compartment_Structure",
  Compartment_Clause_Test = "Compartment_Clause_Test",
  Compartment_Clause_Body = "Compartment_Clause_Body",
  Compartment_Clause_Else = "Compartment_Clause_Else",
  Compartment_Clause_Setup = "Compartment_Clause_Setup",
  Compartment_ExtensionPoint = "Compartment_ExtensionPoint",
  Compartment_StateBehaviors = "Compartment_StateBehaviors",
  Compartment_Requirement = "Compartment_Requirement",
  Compartment_SignalReceptions = "Compartment_SignalReceptions",
  CompartmentRequirement_Text = "CompartmentRequirement_Text",
  CompartmentSlot_Value = "CompartmentSlot_Value",
  Compartment_Slots = "Compartment_Slots",
  Compartment_TaggedValues = "Compartment_TaggedValues",
  Property = "Property",
  Compartment_LegendItems = "Compartment_LegendItems",

  Include = "Include",
  Extend = "Extend",
  CommonEdgeLabel = "CommonEdgeLabel",
  EdgeKeywordLabel = "EdgeKeywordLabel",
  PropertyEdgeLabel = "PropertyEdgeLabel", // association两端的属性的label,绑定的是一个属性

  SimulationFrame = "SimulationFrame",
  SimulationPanel = "SimulationPanel",
  SimulationButton = "SimulationButton",
  SimulationLabel = "SimulationLabel",
  SimulationTextField = "SimulationTextField",
  ItemFlowLabel = "ItemFlowLabel",
}
export interface IBounds {
  absX: number;
  absY: number;
  x: number;
  y: number;
  width: number;
  height: number;
}
export class Bounds implements IBounds {
  constructor(
    // 相对于父元素的位置
    public x = 0,
    public y = 0,
    public width = 0,
    public height = 0,
    // 画布绝对位置
    public absX = 0,
    public absY = 0,
    /** 相对于线的偏移距离,百分比 */
    // 如果要修改label的位置就是修改对应的百分比值
    public offsetX = 0.5,
    public offsetY = 0.5
  ) { }
}

let CHARSET = "0123456789abcdefghijklmnopqrstuvwxyz".split("");
const size = CHARSET.length;
// NB: does not validate input
export class Base36 {
  static encode(int: number) {
    if (int === 0) {
      return CHARSET[0];
    }

    let res = "";
    while (int > 0) {
      res = CHARSET[int % size] + res;
      int = Math.floor(int / size);
    }
    return res;
  }
  static decode(str: string) {
    let res = 0,
      length = str.length,
      i, char;
    for (i = 0; i < length; i++) {
      char = str.charCodeAt(i);
      if (char < 58) { // 0-9
        char = char - 48;
      } else if (char < 91) { // A-Z
        char = char - 29;
      } else { // a-z
        char = char - 87;
      }
      res += char * Math.pow(62, length - i - 1);
    }
    return res;
  }
}

export const getUid = (() => {
  let now = Base36.encode(Date.now() - 1634869060000);
  let random = Base36.encode(parseInt(Math.random() * 10000 + ''));
  let index = 0;
  let p = `${now}-${random}-`;
  return () => {
    if (index >= Number.MAX_SAFE_INTEGER) {
      now = Base36.encode(Date.now() - 1634869060000);
      random = Base36.encode(parseInt(Math.random() * 10000 + ''));
      index = 0;
      p = `${now}-${random}-`;
    }
    index++;
    return `${p}${Base36.encode(index)}`;

  };
})();


export class Shape {
  id: string;

  id_: number;

  parentId: string | null;

  noteTargetId: string | null;

  bounds: Bounds;
  nameBounds: Bounds;
  keywords: string[];

  showKeywords: boolean;
  style: StyleObject;
  // name:string
  names: {
    prefix: string; // 显示的前缀字符
    // contextTypeName:string // 图的上下文的类型的名称
    shortName: string; // 图的简称如 bdd,ibd
    clauseName: string;
    // parameterName:string
    // parameter_direction:string
    [p: string]: string;
  };
  nameStyle: FontStyle
  shapeType: ShapeType;
  subShapeType: SubShapeType;

  projectId: string;

  diagramId: string;

  //   waypoint: IPoint[];

  sourceId: string;
  targetId: string;

  name: string;

  modelId: string;

  modelName: string;
  shapeKey: ShapeKey;
  children?: Shape[];
  waypoint: Point[]

  siderbarKey?: SiderbarItemKey

  /** todo 添加画布等信息 */
  static fromOption(shapeOption: ShapeOption) {
    const shape = new Shape();
    shape.id = getUid();
    Object.assign(shape, cloneDeep(shapeOption));
    return shape;

  }
}

export interface IGraphOption {
  graph?: GraphModel;
  shape?: Shape;
  simulationValueMap?: Map<string, string>;
  /**
   *
   */
  onShapeMouseDown?: (event: MouseEvent, shape: Shape) => void;
  onShapeMouseUp?: (event: MouseEvent, shape: Shape) => void;
  onShapeClick?: (event: MouseEvent, shape: Shape) => void;
  /**
 * 获得连线的目标图形
 * @param shapeKey
 * @param shape
 * @param graph
 * @param point
 */
  getConnectTargetShape?(edgeKey: string, hoverShape: Shape | undefined, point: Point): Shape | undefined
  onShapeDblClick?: (
    event: MouseEvent,
    shape: Shape,
    loading?: boolean
  ) => void;

  /**
   * 图形移动
   */
  onShapeMoved?: (shape: Shape) => void;

  /**
   * 图形右键菜单
   */
  onShapeContextMenu?: (shape: Shape) => void;
  /**
   * 图形拖放至其他图形时触发
   */
  onShapeDroped?: (sourceShape: Shape, targetShape: Shape) => void;

  /**
   * 右上角加号按钮
   */
  onClickAddBtn?: (shape: Shape) => void;

  /**
   * 左上角compartment按钮
   */
  onClickCompartmentBtn?: (shape: Shape) => void;

  /**
   * 左下角导航按钮
   */
  onClickNavBtn?: (shape: Shape) => void;

  limitResizeBounds?: (shape: Shape, newBounds: IBounds) => IBounds;
  onShapeResized?: (shape: Shape, resizeIndex: VertexType, bounds: Bounds) => void
  saveText?: (editingShape: Shape, text: string) => void
  getEditingText?: (shape: Shape) => string
}
