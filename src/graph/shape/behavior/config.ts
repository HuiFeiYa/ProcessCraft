import { MetaclassType, SiderbarItemKey, StType } from "../constant"
import { CreateEdgeOnDiagramBehavior } from "./CreateEdgeOnDiagramBehavior"
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
  },
  {
    siderbarItemKeys: [SiderbarItemKey.ItemFlow, SiderbarItemKey.Start, SiderbarItemKey.Decide],
    targetShapeKeys: [],
    behavior: CreateEdgeOnDiagramBehavior
  }
]
