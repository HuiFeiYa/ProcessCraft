import { ShapeKey } from "../../types"
import { MetaclassType, SiderbarItemKey, StType } from "../constant"
import { CreateEdgeOnDiagramBehavior } from "./CreateEdgeOnDiagramBehavior"
import { CreateShapeOnDiagramBehavior } from "./CreateShapeOnDiagramBehavior"
import { SiderBarDropBehavior, SiderbarItemKeyConfig } from "./SiderbarDropBehavior"

export type ConfigItem = {
    siderbarItemKeys: string[],
    targetShapeKeys: string[],
    behavior: typeof SiderBarDropBehavior
  }
  
export const behaviorConfigs: ConfigItem[] = [
    {
        siderbarItemKeys: [SiderbarItemKey.Block],
        targetShapeKeys: [],
        behavior: CreateShapeOnDiagramBehavior
    },
    {
      siderbarItemKeys: [SiderbarItemKey.ItemFlow],
      targetShapeKeys: [],
      behavior: CreateEdgeOnDiagramBehavior
    }
]

export const siderbarKeyConfig: {[property:string]: SiderbarItemKeyConfig} = {
      /**
* 模块定义图图
*/
  [SiderbarItemKey.Block]: {
    metaclass: MetaclassType.Class,
    stereotype: [StType["SysML::Blocks::Block"]],
    operation: '',
    shapeKey: ShapeKey.Block
  },
  [SiderbarItemKey.ItemFlow]: {
    metaclass: MetaclassType.ItemFlow,
    stereotype: [StType['SysML::ItemFlow']],
    operation: '',
    shapeKey: ShapeKey.ItemFlow
  }
}