<script setup lang="ts">
import { inject } from 'vue'
import { Shape } from '../../types/index'
import { createEventHandler } from '../createEventHandler';
import { GraphModel } from '../../models/graphModel';
import { ref } from 'vue';
import { onMounted } from 'vue';
const props = defineProps<{ shape: Shape }>()
const input = ref(null)
const graph = inject('graph') as GraphModel;
const eventHandler = createEventHandler(graph, props);
const text = ref(props.shape.modelName)
const editable = ref(true)
/** 双击图形时显示编辑 label 输入框 */
const handleDbClick = () => {
  editable.value = true
}
const handleSave = () => {
  editable.value = false
  props.shape.modelName = text.value
}
const handleInput = (e) => {
  text.value = e.target.value
}
onMounted(() => {
  input.value?.focus()
})
</script>
<template>
  <g @click.stop @mousedown.stop @mouseup.stop @mousemove.stop @dragenter.stop dragenter stop @dragleave.stop @drop.stop
    @dragover.stop v-on="eventHandler">

    <!-- 最外层是绝对坐标，要创建相对坐标系需要用<g transform=" translate(absX,absY) /> 或foreignObject" -->
    <foreignObject :width="shape.bounds.width" :height="shape.bounds.height" :x="shape.bounds.absX" :y="shape.bounds.absY"
      style="overflow:visible" @dblclick="handleDbClick">
      <div class="textarea" ref="input"
        style="height:100% ;background: linear-gradient(to right, rgb(221, 205, 158), rgb(253, 247, 223)); "
        :contenteditable="editable" @input="handleInput" @blur="handleSave">
        {{ text }}
      </div>
    </foreignObject>
  </g>
</template>
<style>
.textarea {
  display: flex;
  flex-direction: column;
  justify-content: center;
  outline-color: transparent;
  /* 设置光标颜色 */
  caret-color: black;
  user-select: none;
  text-align: center;
}
</style>