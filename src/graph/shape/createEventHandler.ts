import { StartMoveSource } from "../models/MoveModel";
import { GraphModel } from "../models/graphModel";
import { Shape } from "../types";
import { EventType } from "./constant";

/** 选中元素的事件 */
export function createEventHandler(graph: GraphModel, props: { shape: Shape }) {
  return {
    click() {

      graph.emitter.emit(EventType.SHAPE_CLICK, window.event, props.shape);
    },
    mousedown() {
      console.log('mousedown shape:', props.shape)
      /** 选中其他元素之前清空其他选中元素 */
      graph.selectionModel.clearSelection()
      graph.emitter.emit(EventType.SHAPE_MOUSE_DOWN, window.event, StartMoveSource.Shape, props.shape);
    },
    mouseup() {

      // debugger;
      graph.emitter.emit(EventType.SHAPE_MOUSE_UP, window.event, props.shape);

    },

    mousemove(event: MouseEvent) {
      graph.emitter.emit(EventType.SHAPE_MOUSE_MOVE, event, props.shape);
    },

    drop() {
      graph.emitter.emit(EventType.SHAPE_DRAG_DROP, window.event, props.shape);
    },

    dragover(event: DragEvent) {

      event.stopPropagation();
      event.preventDefault();
      graph.emitter.emit(EventType.SHAPE_DRAG_OVER, window.event, props.shape);

    },

    contextmenu(event: MouseEvent) {
      event.stopPropagation();
      graph.emitter.emit(EventType.SHAPE_CONTEXT_MENU, window.event, props.shape);
    },

    dblclick() {
      graph.emitter.emit(EventType.SHAPE_DBL_CLICK, window.event, props.shape);
    }

  };
}
