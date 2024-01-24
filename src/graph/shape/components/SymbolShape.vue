<script setup lang="ts">
import { inject } from 'vue'
import { Shape } from '../../types/index'
import { createEventHandler } from '../createEventHandler';
import { GraphModel } from '../../models/graphModel';
import { ref } from 'vue';
import { onMounted } from 'vue';
import { updateShapeService } from '../../service';
const props = defineProps<{ shape: Shape }>()
const input = ref(null)
const graph = inject('graph') as GraphModel;
const eventHandler = createEventHandler(graph, props);
const text = ref(props.shape.modelName)
const prevText = ref(props.shape.modelName)
const editable = ref(true)
/** 双击图形时显示编辑 label 输入框 */
const handleDbClick = () => {
  editable.value = true
}
const handleSave = () => {
  editable.value = false
  if (text.value !== prevText.value) {
    updateShapeService(props.shape.id, { modelName: text.value }, { modelName: props.shape.modelName })
  }
}
const handleInput = (e) => {
  text.value = e.target.innerHTML
}
onMounted(() => {
  input.value.focus()
})
</script>
<template>
  <g @click.stop @mousedown.stop @mouseup.stop @mousemove.stop @dragenter.stop dragenter stop @dragleave.stop @drop.stop
    @dragover.stop v-on="eventHandler">

    <!-- 最外层是绝对坐标，要创建相对坐标系需要用<g transform=" translate(absX,absY) /> 或foreignObject" -->
    <foreignObject :width="shape.bounds.width" :height="shape.bounds.height" :x="shape.bounds.absX" :y="shape.bounds.absY"
      style="overflow:visible;border: 1px solid #000;padding: 1px;background-color: #fff;"
      :style="{ lineHeight: text ? 'normal' : shape.bounds.height - 4 + 'px' }" @dblclick="handleDbClick">
      <!-- 减去 padding 和 border 的距离 -->
      <div class="textarea" ref="input" :contenteditable="editable" @input="handleInput" @blur="handleSave">
        {{ shape.modelName }}
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
  word-break: break-all;
  height: calc(100% - 4px);
  width: calc(100% - 4px);
  margin: 2px;
}
</style>