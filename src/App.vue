<script setup lang="ts">
import {onMounted, reactive, computed} from 'vue'
import { GraphEditor } from './editor/graphEditor'
import GraphView from './graph/GraphView.vue'
import DropCursor from './editor/DropCursor.vue'
import Siderbar from './editor/components/SiderBar.vue'
const editor = reactive(new GraphEditor({modelId: 'a-1'}))

</script>

<template>
    <div class="graph-container">
        <Siderbar :tab="editor.tab" />
        <div style="flex:1">
            <GraphView :graph="editor.graph" />
        </div>
        <DropCursor :siderBarDropModel="editor.tab.siderBarDropModel" />
    </div>
</template>
<style>
.graph-container {
    display: flex;
    width: 100vw;
    height: 100vh;
}

</style>

