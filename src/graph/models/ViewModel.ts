import { Bounds } from "../util/Bounds"
import { Point } from "../util/Point";
import { GraphModel } from "./graphModel";

export class ViewModel {

    viewDom: HTMLDivElement | undefined
    bounds = new Bounds(0, 0, 1000, 1000)
    scale = 1
    constructor(public graph: GraphModel) { }

    setViewDom(dom: HTMLDivElement) {
        this.viewDom = dom;
    }

}