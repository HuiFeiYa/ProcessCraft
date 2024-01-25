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

const points = computed(() => {
    const { absX, absY, width, height } = props.shape.bounds
    return `${absX + width / 2},${absY}  ${absX + width},${absY + height / 2} ${absX + width / 2}, ${absY + height} ${absX}, ${absY + height / 2}`
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
        <!-- 菱形 -->
        <polygon :points="points" fill="#fff" stroke="#000" stroke-width="2" />
        <!-- 输入框，要大于菱形，不会有遮挡 -->
        <foreignObject :width="shape.bounds.width + 4" :height="shape.bounds.height + 8" :x="shape.bounds.absX - 2"
            :y="shape.bounds.absY - 4" :style="{ lineHeight: text ? 'normal' : shape.bounds.height - 4 + 'px' }"
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
    caret-color: black;
    user-select: none;
    text-align: center;
    word-break: break-all;
    height: calc(100% - 4px);
    width: calc(100% - 4px);
    margin: 2px;
}
</style>