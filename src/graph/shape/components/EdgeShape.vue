<script setup lang="ts">
import { computed, inject } from 'vue';
import { Shape } from '../../types';
import { GraphModel } from '../../models/graphModel';
import { createEventHandler } from '../createEventHandler';
import { waypointUtil } from '../../util/WaypointUtil';
import { arrowMap } from './common/arrows/ArrowMap'
import { ref } from 'vue';
import { nextTick } from 'vue';
const props = defineProps<{
    shape: Shape
}>();

const graph = inject<GraphModel>('graph');
const eventHandler = createEventHandler(graph, props);
const editable = ref(false)
const labelDom = ref(null)
const text = ref('默认值')
const computedData = computed(() => {
    const svgPath = waypointUtil.getSvgPath(props.shape)
    const style = props.shape.style
    return {
        svgPath,
        style
    }
})
const style = computed(() => {
    const { sourceId, targetId } = props.shape
    return { cursor: (!!sourceId || !!targetId) ? 'not-allowed' : 'grab' }
})

function select(dom) {
    if (window.getSelection) {
        var range = document.createRange()
        range.selectNodeContents(dom)
        window.getSelection().removeAllRanges()
        window.getSelection().addRange(range)
    }
}

const handleDbClick = () => {
    editable.value = true
    // fix 修改 contenteditable 后选中文案无法直接编辑问题
    nextTick(() => {
        select(labelDom.value)
        labelDom.value.focus()
    })
}
const handleBlur = () => {
    editable.value = false
}
window.addEventListener('mouseup', handleBlur);
</script>
<template>
    <g @click.stop @mousedown.stop @mouseup.stop @drop.stop v-on="eventHandler" style="position: relative;">
        <g :style="style">
            <!-- 展示线 -->
            <path :d="computedData.svgPath" :stroke="computedData.style.strokeColor"
                :stroke-dasharray="computedData.style.strokeDasharray || (computedData.style.dashed ? '10 8' : '')"
                :stroke-width="computedData.style.strokeWidth" fill="none" stroke-linejoin="round" />

            <!-- 箭头 -->
            <component :is="arrowMap[computedData.style.targetArrow]" v-if="computedData.style.targetArrow" :edge="shape"
                :style="computedData.style" position="end" />
            <!-- 操作线，设置宽度为10，透明方便拖拽 -->
            <path :d="computedData.svgPath" fill="none" :stroke-width="10" stroke="rgba(0,0,0,0)" stroke-linejoin="round" />
        </g>
        <foreignObject @mousedown.stop :width="shape.nameBounds.width" height="30" :x="shape.bounds.absX"
            :y="shape.bounds.absY">
            <!-- <input v-show="editable" type="text" class="label" :value="text" autofocus maxlength="10"> -->
            <div ref="labelDom" class="label" :class="{ edit: editable }" :contenteditable="editable" autofocus
                @dblclick="handleDbClick" @blur="handleBlur">
                {{ text }}
            </div>
        </foreignObject>
    </g>
</template>
<style>
.label {
    border: none;
    outline: none;
    font-size: 14px;
    color: #666;
    resize: none;
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    position: absolute;
    /* top: 0;
    left: 50%; */
    left: 10px;
    /* 自适应宽度 */
    resize: none;
    /* 设置光标颜色 */
    caret-color: black;
    white-space: nowrap;
    border: 1px solid transparent;
}

.edit {
    border: 1px solid red;
    padding: 0 5px;
}
</style>