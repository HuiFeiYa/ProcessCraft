import { cloneDeep } from 'lodash'
import { ShapeOption } from "../types/shapeOption";
import { modelKeyConfig } from "./shapeOption/commonShapeOption";
import { SiderbarItemKey } from './constant';

export class ShapeFactory {
    getModelShapeOption(itemKey: SiderbarItemKey): ShapeOption | null {

        return cloneDeep(modelKeyConfig[itemKey]?.shapeOption);

    }
}

export const shapeFactory = new ShapeFactory();