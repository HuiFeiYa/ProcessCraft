import { cloneDeep } from 'lodash'
import { ShapeOption } from "../types/shapeOption";
import { modelKeyConfig } from "./shapeOption/commonShapeOption";
import { SubShapeType } from '../types';

export class ShapeFactory {
    getModelShapeOption(subShapeType: SubShapeType): ShapeOption | null {

        return cloneDeep(modelKeyConfig[subShapeType]?.shapeOption);

    }
}

export const shapeFactory = new ShapeFactory();