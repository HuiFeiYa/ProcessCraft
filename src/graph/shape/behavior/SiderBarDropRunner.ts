import { Shape } from "../../types";
import { Point } from "../../util/Point";
import { shapeUtil } from "../ShapeUtil";
import { SiderbarItemKey } from "../constant";
import { SiderBarDropBehavior } from "./SiderbarDropBehavior";
import { behaviorConfigs } from "./config";

export class SiderBarDropRunner {
    public shape:Shape
    constructor(public siderBarKey:SiderbarItemKey, public shapeId:string, public diagramId:string, public point?:Point) {
        
    }
    async init() {
        const shapeMap = new Map()
        this.shape = shapeMap.get(this.shapeId)
    }
    async run() {
        // await this.init()
        const behaviors = this.getMatchedBehaviors();
        for (let behavior of behaviors) {
            const result = await behavior.run();
            if (result === 'stop') break; // 可能执行到一半后需不要继续执行了，（例如需要用户二次确认）
          }

    }
    getMatchedBehaviors() {
        const behaviors:SiderBarDropBehavior[] = [];
        behaviorConfigs.forEach(config => {
            if (config.siderbarItemKeys.includes(this.siderBarKey)) {
                const Behavior = config.behavior
                behaviors.push(new Behavior(this))
            }
        })
        return behaviors
    }
}