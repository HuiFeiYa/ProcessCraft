import { createPinia, defineStore } from 'pinia'
import { Shape } from '../../graph/types'
import piniaPersist from 'pinia-plugin-persist'
import { UpdatePatchItem, UpdateShapeValue } from '../../graph/service'
export const useDrawStore = defineStore('draw', {
    state: () => {
        return {
            shapes: [],
            shapeMap: {} // 此处不能使用 map，可能是 pinia-plugin-persist 序列化数据时造成的问题
        }
    },
    getters: {
        // 按照层级排序
        sortedShapes(state) {
            return state.shapes.sort((a, b) => (a.style.zIndex || 0) - (b.style.zIndex || 0))
        }
    },
    actions: {
        addShapes(shapes: Shape[] | Set<Shape>) {
            shapes.forEach((shape: Shape) => {
                this.shapes.push(shape)
                this.shapeMap[shape.id] = shape
            })
        },
        deleteShapes(ids: string[]) {
            ids.forEach(id => {
                this.deleteShape(id)
            })
        },
        deleteShape(id: string) {
            this.shapes = this.shapes.filter(shape => shape.id !== id)
            delete this.shapeMap[id]
        },
        updateShape(id: string, newVal: UpdateShapeValue) {
            const index = this.shapes.findIndex(shape => shape.id === id)
            if (index !== -1) {
                this.shapes[index] = Object.assign({}, this.shapes[index], newVal)
            }
        },
        batchUpdateShapes(effectList: UpdatePatchItem[]) {
            effectList.forEach(effect => {
                this.updateShape(effect.id, effect.newVal)
            })
        }
    },
    persist: {
        enabled: true
    }
})
