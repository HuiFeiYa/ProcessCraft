import { GraphModel } from "../graph/models/graphModel"
import { EventType, MetaclassType } from "../graph/shape/constant"
import { Shape } from "../graph/types"
import { Point } from "../graph/util/Point"

export type SiderBarItem = {

    modelId?:string // 构造型id或元类id
    shapeKey?:string
    operation?: string // 特殊操作，对于纯图形的元素就是CREATE_SHAPE，其他类型的操作可以后续拓展
    operationParam?:any // 特殊操作的参数
    dropdownTag?:string // 下拉标签，用来处理下拉类型的组件菜单， 相同dropdownTag的item会被收起到一个下拉菜单里
    icon?: string,
    cnName?: string,
    showData:{
      icon:string,
      name:string,
      metaclass?: MetaclassType.Class |string, // 构造型的metaclass， 如果是构造型就是stereotype， 否则是class
      siderBarkey?: string
    }

    children?: SiderBarItem[],
    modelLibId?: string,
    uid?: string,
    treeModelId?:string // 通过chooseMetaclass放到图上上，要重定向到树拖拽，这个id用来记录树节点的id
    packageStructureId?: string 
  }
export class SiderBarDropModel {
    /** 是否在画布中 */
    isPointInDiagram = false

    iconPosition = new Point()
    visible = false
    siderbarItem?: SiderBarItem
    /** tab 用于创建不同类型的图 */
    constructor(public graph: GraphModel, public tab?: any) { }
    onMouseDown(item: SiderBarItem) {
      this.siderbarItem = item;
      const onMouseMove = (evt: MouseEvent, shape: Shape) => {

        this.onMouseMove(evt, shape);
  
      };
      const onMouseUp = (evt: MouseEvent, shape: Shape) => {
        console.log('onMouseUp');
      }
      this.graph.emitter.on(EventType.SHAPE_MOUSE_MOVE, onMouseMove);
      this.graph.emitter.on(EventType.SHAPE_MOUSE_UP, onMouseUp);
    }
    async onMouseMove(event: MouseEvent, shape: Shape) {
        requestAnimationFrame(() => {
            // console.log('do AnimationFrame');
      
            this.iconPosition.x = event.clientX;
            this.iconPosition.y = event.clientY;
            const rect = this.graph.viewModel.viewDom?.getBoundingClientRect();
      
            this.isPointInDiagram = event.clientX > rect.left && event.clientY > rect.top;
            // this.animationNumber = 0;
          });
    }
    async dropToShape(evt: MouseEvent, shape: Shape) {}
}