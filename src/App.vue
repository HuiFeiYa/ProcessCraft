<script setup lang="ts">
import {reactive} from 'vue'
import { GraphEditor } from './editor/graphEditor'
import { Shape, SubShapeType } from './graph/types/index'
import Graph from './graph/index.vue'
const graph = new Shape({
    subShapeType: SubShapeType.Block
})
const editor = reactive(new GraphEditor(graph))
console.log('editor:', editor)
</script>

<template>
<Graph :graph="editor.graphModel" />
</template>

