import { Shape } from "../../types"
import { ShapeOption } from "../../types/shapeOption";
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
export class SiderBarDropBehavior {
    shapeParentId:string

    modelOwnerId:string
  
    createdMainShape:Shape
  
  
    createdShapes:Set<Shape> = new Set()
  
    affectedShapes:Set<Shape> = new Set()
  
    siderbarConfigItem : SiderbarItemKeyConfig

    constructor(public context: SiderBarDropRunner,public siderBarKey: SiderbarItemKey, public point?: Point) {
    }
    async run() : Promise<void | "stop">{
        await this.setSiderbarConfigItem();
        // this.setShapeParentId()
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

    async createShape () {
        const { siderBarKey } = this;
        // const subShapeType = this.createdMainShape.subShapeType
        let shapeOption = shapeFactory.getModelShapeOption(siderBarKey);
        // , projectId, diagramId, this.shapeParentId
        const shape = Shape.fromOption(shapeOption);
        shapeUtil.initShape(shape,this.point)
        this.createdShapes.add(shape);
    }
}