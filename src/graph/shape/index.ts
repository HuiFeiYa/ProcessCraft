import { markRaw } from "vue";
import SymbolShapeVue from "./components/SymbolShape.vue";
import { Shape, SubShapeType } from "../types";
export const shapeComps = [
  {
    key: SubShapeType.Block,
    comp: SymbolShapeVue,
  },
];
// 解决报错 893ffcf:1452 [Vue warn]: Vue received a Component that was made a reactive object.
shapeComps.forEach(it => {
  markRaw(it.comp);
});
