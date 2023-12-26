<script setup lang="ts">
import {reactive} from 'vue'
import { GraphEditor } from './editor/graphEditor'
import { Shape, SubShapeType } from './graph/types/index'
import GraphView from './graph/GraphView.vue'
import { modelKeyConfig } from './graph/shape/shapeOption/commonShapeOption'
import { SiderBarDropRunner } from './graph/shape/behavior/SiderBarDropRunner'
import { SiderbarItemKey } from './graph/shape/constant'
const option = modelKeyConfig[SubShapeType.Block]
// const graph = new Shape(option.shapeOption)
const editor = reactive(new GraphEditor(option))
const dropRunner = new SiderBarDropRunner(SiderbarItemKey.Block)
console.log('editor:', editor)
</script>

<template>
    <div class="graph-container">
        <div class="sidebar">
            <button>模块</button>
        </div>
        <div>
            <GraphView :graph="editor.graphModel" />
        </div>
    </div>
</template>
<style>
.graph-container {
    display: flex;
    width: 100vw;
    height: 100vh;
}
.sidebar {
    width: 200px;
    height: 100vh;
}
</style>

