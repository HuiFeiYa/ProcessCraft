<script setup lang="ts">
import { onMounted, reactive, computed } from 'vue'
import { GraphEditor } from './editor/graphEditor'
import GraphView from './graph/GraphView.vue'
import DropCursor from './editor/DropCursor.vue'
import Siderbar from './editor/components/SiderBar.vue'
import Header from './editor/components/header.vue'
const editor = reactive(new GraphEditor({ modelId: 'a-1' }))

</script>

<template>
    <Header :graph="editor.graph" />
    <div class="graph-container">
        <Siderbar :tab="editor.tab" />
        <div class="diagram-container">
            <GraphView :graph="editor.graph" />
        </div>
        <DropCursor :siderBarDropModel="editor.tab.siderBarDropModel" />
    </div>
</template>
<style>
.graph-container {
    display: flex;
    width: 100vw;
    height: calc(100vh - 39px);
}

.diagram-container {
    width: calc(100vw - 220px);
    overflow: auto;
    background-color: #eaecee;
}

/* 画布计算起点归零 */
body {
    margin: 0;
    padding: 0;
}
</style>

