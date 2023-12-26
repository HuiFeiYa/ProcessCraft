import { Shape } from "../../types"
import { ShapeOption } from "../../types/shapeOption";
import { shapeFactory } from "../ShapeFactory";
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

    constructor(public context: SiderBarDropRunner) {
    }
    async run() : Promise<void | "stop">{
        await this.setSiderbarConfigItem();
        this.setShapeParentId()
        await this.createShape();
    }
    async setSiderbarConfigItem() {
        const { siderBarKey } = this.context;
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
        const { diagramId } = this.context;
        const subShapeType = this.createdMainShape.subShapeType
        let shapeOption = shapeFactory.getModelShapeOption(subShapeType);
        // , projectId, diagramId, this.shapeParentId
        const shape = Shape.fromOption(shapeOption);
        this.createdShapes.add(shape);
    }
}