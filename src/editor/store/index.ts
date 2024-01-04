import { createPinia, defineStore } from 'pinia'
import { Shape } from '../../graph/types'
import { EventType } from '../../graph/shape/constant'
import { emitter } from '../../graph/models/graphModel'

export const useDrawStore = defineStore('draw', {
    state: () => {
        return {
            shapes: []
        }
    },
    getters: {
        // 按照层级排序
        sortedShapes(state) {
            return state.shapes.sort((a,b) => (a.style.zIndex || 0) - (b.style.zIndex || 0))
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
        updateShape(id:string, newShape: Shape) {
            const index = this.shapes.findIndex(shape => shape.id === id)
            index !== -1 && this.shapes.splice(index, 1, newShape)
        }
    },
})

export const pinia = createPinia()