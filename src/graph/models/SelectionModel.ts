import { EventType } from "../shape/constant";
import { Shape } from "../types";
import { GraphModel } from "./graphModel";

export class SelectionModel {
    selectedShapes: Shape[] = []
    get selection() {
        return this.selectedShapes
    }
    constructor(public graph:GraphModel) {}
    emitSelectionChange() {
        this.graph.emitter.emit(EventType.SELECTION_CHANGE, this.selectedShapes);
    }
    setSelection(arr:Shape[]) {
        this.selectedShapes = arr
        this.emitSelectionChange()
    }
    clearSelection() {
        this.selectedShapes= [];
        this.emitSelectionChange();
    }
}