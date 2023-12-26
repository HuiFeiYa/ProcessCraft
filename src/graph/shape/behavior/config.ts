import { ShapeKey } from "../../types"
import { MetaclassType, SiderbarItemKey, StType } from "../constant"
import { CreateShapeOnDiagramBehavior } from "./CreateShapeOnDiagramBehavior"
import { SiderBarDropBehavior } from "./SiderbarDropBehavior"

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
    }
]

export const siderbarKeyConfig = {
      /**
* 模块定义图图
*/
  [SiderbarItemKey.Block]: {
    metaclass: MetaclassType.Class,
    stereotype: [StType["SysML::Blocks::Block"]],
    operation: '',
    shapeKey: ShapeKey.Block
  },
}