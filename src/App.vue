<script setup lang="ts">
import {reactive} from 'vue'
import { GraphEditor } from './editor/graphEditor'
import { Shape, SubShapeType } from './graph/types/index'
import GraphView from './graph/GraphView.vue'
import { modelKeyConfig } from './graph/shape/shapeOption/commonShapeOption'
const option = modelKeyConfig[SubShapeType.Block]
// const graph = new Shape(option.shapeOption)
const editor = reactive(new GraphEditor(option))
console.log('editor:', editor)
</script>

<template>
<GraphView :graph="editor.graphModel" />
</template>

