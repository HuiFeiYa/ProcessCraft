import { Shape, SubShapeType } from "../../types"
import { Point } from "../../util/Point";
import { shapeFactory } from "../ShapeFactory";
import { shapeUtil } from "../ShapeUtil";
import { SiderbarItemKey } from "../constant";
import { SiderBarDropRunner } from "./SiderBarDropRunner";
import { siderbarKeyConfig } from "./config";
export interface SiderbarItemKeyConfig {
    metaclass: string | null;
    stereotype: string[];
    operation: string;
    shapeKey: string;
}

export interface SiderBarKeyOptions {
    point?: Point, waypoint?: Point[]
}
export class SiderBarDropBehavior {
    shapeParentId: string

    modelOwnerId: string

    createdMainShape: Shape


    createdShapes: Set<Shape> = new Set()

    affectedShapes: Set<Shape> = new Set()

    siderbarConfigItem: SiderbarItemKeyConfig
    point: Point
    waypoint: Point[]
    constructor(public context: SiderBarDropRunner, public siderBarKey: SiderbarItemKey, options: SiderBarKeyOptions) {
        const { point, waypoint } = options
        this.point = point
        this.waypoint = waypoint
    }
    async run(): Promise<void | "stop"> {
        await this.setSiderbarConfigItem();
        await this.createShape();
    }
    async setSiderbarConfigItem() {
        const { siderBarKey } = this;
        const config = siderbarKeyConfig[siderBarKey];
        if (!config) {
            throw new Error("siderbarkey node found");
        }
        this.siderbarConfigItem = config;
    }
    async setShapeParentId() {
        const parentId = this.context.shape.id;
        this.shapeParentId = parentId;
    }

    async createShape() {
        const { siderBarKey } = this;
        const shape = shapeUtil.createShape(siderBarKey, { point: this.point })
        this.createdShapes.add(shape);
    }

}