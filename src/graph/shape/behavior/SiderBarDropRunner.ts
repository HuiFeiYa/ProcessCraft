import { Shape } from "../../types";
import { SiderbarItemKey } from "../constant";
import { SiderBarDropBehavior, SiderBarKeyOptions } from "./SiderbarDropBehavior";
import { behaviorConfigs } from "./config";
import { Change } from "../../util/stepManager";
export class SiderBarDropRunner {
    public shape: Shape
    createdShapes: Set<Shape> = new Set()
    affectedShapes: Set<Change> = new Set()
    constructor() {

    }
    async init() {
        // const shapeMap = new Map()
        // this.shape = shapeMap.get(this.shapeId)
    }
    // 调用处 dropSiderbarKeyToShape 函数，放置图形时 src/editor/SiderBarDropModel.ts:91
    async run(siderBarKey: SiderbarItemKey, options: SiderBarKeyOptions) {

        await this.init()
        const behaviors = this.getMatchedBehaviors(siderBarKey, options);
        for (let behavior of behaviors) {
            const result = await behavior.run();
            if (result === 'stop') break; // 可能执行到一半后需不要继续执行了，（例如需要用户二次确认）
            this.createdShapes = behavior.createdShapes
            this.affectedShapes = behavior.affectedShapes
        }

    }
    getMatchedBehaviors(siderBarKey: SiderbarItemKey, options: SiderBarKeyOptions) {
        const behaviors: SiderBarDropBehavior[] = [];
        behaviorConfigs.forEach(config => {
            if (config.siderbarItemKeys.includes(siderBarKey)) {
                const Behavior = config.behavior
                behaviors.push(new Behavior(this, siderBarKey, options))
            }
        })
        return behaviors
    }
}