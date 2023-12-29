<script setup lang="ts">
import {onMounted, reactive, computed} from 'vue'
import { GraphEditor } from './editor/graphEditor'
import { Shape, SubShapeType } from './graph/types/index'
import GraphView from './graph/GraphView.vue'
import { modelKeyConfig } from './graph/shape/shapeOption/commonShapeOption'
import { SiderBarDropRunner } from './graph/shape/behavior/SiderBarDropRunner'
import { SiderbarItemKey } from './graph/shape/constant'
import { Point } from './graph/util/Point'
import { useDrawStore } from './editor/store/index'
import Siderbar from './editor/components/SiderBar.vue'
const store= useDrawStore()
    const editor = reactive(new GraphEditor())
onMounted(async ()=> {
    const point = new Point(100,100)
    const point1 = new Point(200,200)
    const dropRunner = new SiderBarDropRunner()
    await dropRunner.run(SiderbarItemKey.Block,point)
    // await dropRunner.run(SiderbarItemKey.Block,point1)
})

</script>

<template>
    <div class="graph-container">
        <Siderbar />
        <div>
            <GraphView :graph="editor.graph" />
        </div>
        <DropCursor :siderBarDropModel="editor.siderBarDropModel" />
    </div>
</template>
<style>
.graph-container {
    display: flex;
    width: 100vw;
    height: 100vh;
}

</style>

