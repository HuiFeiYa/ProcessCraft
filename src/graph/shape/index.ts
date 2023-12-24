import SymbolShapeVue from "./components/SymbolShape.vue";
import { Shape, SubShapeType } from "../types";
export const shapeComps = [
  {
    key: SubShapeType.Block,
    comp: SymbolShapeVue,
  },
];
//   shapeComps.forEach(it => {
//     markRaw(it.comp);
//   });
