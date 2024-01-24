import { Bounds, Shape, SubShapeType } from "../../types"
import { Point } from "../../util/Point";
import { Change } from "../../util/stepManager";
import { shapeFactory } from "../ShapeFactory";
import { shapeUtil } from "../ShapeUtil";
import { SiderbarItemKey } from "../constant";
import { ResizeUtil, resizeUtil } from "../resizeUtil";
import { SiderBarDropRunner } from "./SiderBarDropRunner";
import { siderbarKeyConfig } from "./config";
export interface SiderbarItemKeyConfig {
    metaclass: string | null;
    stereotype: string[];
    operation: string;
    shapeKey: string;
}

export interface SiderBarKeyOptions {
    point?: Point
    waypoint?: Point[]
    bounds?: Bounds
    parentId: string
}
export class SiderBarDropBehavior {
    shapeParentId: string

    modelOwnerId: string

    createdShapes: Set<Shape> = new Set()

    affectedShapes: Set<Change> = new Set()

    siderbarConfigItem: SiderbarItemKeyConfig
    point: Point
    waypoint: Point[]
    constructor(public context: SiderBarDropRunner, public siderBarKey: SiderbarItemKey, options: SiderBarKeyOptions) {
        const { point, waypoint, parentId } = options
        this.point = point
        this.waypoint = waypoint
        this.shapeParentId = parentId
    }
    async run(): Promise<void | "stop"> {
        await this.setSiderbarConfigItem();
        await this.createShape();
        /** 调整画布大小 */
        await this.resizeShape()
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
        const shape = shapeUtil.createShape(siderBarKey, { point: this.point, parentId: this.shapeParentId })
        this.createdShapes.add(shape);
    }

    async resizeShape() {
        this.createdShapes.forEach(shape => {
            resizeUtil.expandParent(shape);
        })
        resizeUtil.affectedShapes.forEach(shape => {
            this.affectedShapes.add(shape)
        })
    }
}