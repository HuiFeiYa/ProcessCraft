import { createPinia, defineStore } from 'pinia'
import { Shape } from '../../graph/types'
import { EventType } from '../../graph/shape/constant'
import { emitter } from '../../graph/models/graphModel'

export const useDrawStore = defineStore('draw', {
    state: () => {
        return {
            shapes: [],
            selectedShapes: []
        }
    },
    actions: {
        addShapes(shapes: Shape[] | Set<Shape>) {
            shapes.forEach((shape:Shape)=> {
                this.shapes.push(shape)
            })
        },
        deleteShape(id: string) {
            this.shapes = this.shapes.filter(shape => shape.id !== id)
        },
        emitSelectionChange() {
           emitter.emit(EventType.SELECTION_CHANGE, this.selectedShapes);
        },
        setSelection(arr:Shape[]) {
            this.selectedShapes = arr
            this.emitSelectionChange()
        },
        clearSelection() {
            this.selectedShapes= [];
            this.emitSelectionChange();
        }
    },
})

export const pinia = createPinia()