<script setup lang="ts">
import { computed, inject } from 'vue'
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

const radiusValue = computed(() => {
  return props.shape.style.borderRadius || 0
})
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
    <rect :rx="radiusValue" :ry="radiusValue" :width="shape.bounds.width" :height="shape.bounds.height"
      :x="shape.bounds.absX" :y="shape.bounds.absY" fill="#fff" stroke="#000" stroke-width="2">
    </rect>
    <foreignObject :width="shape.bounds.width - 4" :height="shape.bounds.height - 4" :x="shape.bounds.absX + 2"
      :y="shape.bounds.absY + 2" style="overflow: hidden;"
      :style="{ lineHeight: text ? 'normal' : shape.bounds.height + 'px', borderRadius: radiusValue + 'px' }"
      @dblclick="handleDbClick">
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
  caret-color: rgb(0, 0, 0);
  user-select: none;
  text-align: center;
  word-break: break-all;
}
</style>