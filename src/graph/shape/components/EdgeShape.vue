<script setup lang="ts">
import { computed, inject } from "vue";
import { Shape } from "../../types";
import { GraphModel } from "../../models/graphModel";
import { createEventHandler } from "../createEventHandler";
import { waypointUtil } from "../../util/WaypointUtil";
import { arrowMap } from "./common/arrows/ArrowMap";
import { ref } from "vue";
import { nextTick } from "vue";
import { cloneDeep } from "lodash";
import { shapeUtil } from "../ShapeUtil";
import { useDrawStore } from "../../../editor/store";
import { reactive } from "vue";
const props = defineProps<{
    shape: Shape;
}>();

const graph = inject<GraphModel>("graph");
const store = useDrawStore()
const eventHandler = createEventHandler(graph, props);
const editable = ref(false);
const labelDom = ref(null);
const text = ref("");
const isShowLabel = ref(!!props.shape.modelName)
/** 非受控组件 */
const nameBounds = reactive(props.shape.nameBounds);
const computedData = computed(() => {
    const svgPath = waypointUtil.getSvgPath(props.shape);
    const style = props.shape.style;
    return {
        svgPath,
        style,
    };
});
const style = computed(() => {
    const { sourceId, targetId } = props.shape;
    return { cursor: !!sourceId || !!targetId ? "not-allowed" : "grab" };
});

const labelStyle = computed(() => {
    const { width, height, absX, absY } = nameBounds
    // 编辑状态下有 padding
    const paddingWidth = 10
    if (editable.value) {
        return {
            width: width + paddingWidth,
            height: Math.max(height, 30),
            absX: absX - paddingWidth / 2,
            absY
        }
    } else {
        return nameBounds
    }

})
function select(dom) {
    if (window.getSelection) {
        var range = document.createRange();
        range.selectNodeContents(dom);
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
    }
}

const handleDbClick = () => {
    isShowLabel.value = true
    editable.value = true;
    // fix 修改 contenteditable 后选中文案无法直接编辑问题
    nextTick(() => {
        select(labelDom.value);
        labelDom.value.focus();
    });
};
const handleInput = (e) => {
    text.value = e.target.innerHTML;
    const { width, height } = shapeUtil.getTextSize(text.value, props.shape.nameStyle.fontSize)
    nameBounds.width = width
    nameBounds.height = height
};
const handleBlur = () => {
    editable.value = false;
    if (!text.value) {
        isShowLabel.value = false
    }
    //  todo 更新 nameBounds，更新到 store
    const { bounds, nameStyle: { fontSize } } = props.shape;
    const nameBounds = props.shape.nameBounds;
    const { width, height, absX, absY } = bounds;
    const { width: nameWidth, height: nameHeight } = shapeUtil.getTextSize(text.value, fontSize)
    // 计算文本宽度
    nameBounds.absX = absX + (width - nameWidth) / 2; // 减去文本的宽度
    nameBounds.absY = absY + (height - nameHeight) / 2; // 减去文本的高度
    nameBounds.width = nameWidth
    nameBounds.height = nameHeight

    store.updateShape(props.shape.id, { ...props.shape, nameBounds })
};
window.addEventListener("mouseup", handleBlur);
</script>
<template>
    <g @click.stop @mousedown.stop @mouseup.stop @drop.stop v-on="eventHandler" style="position: relative"
        @dblclick="handleDbClick">
        <g :style="style">
            <!-- 展示线 -->
            <path :d="computedData.svgPath" :stroke="computedData.style.strokeColor" :stroke-dasharray="computedData.style.strokeDasharray ||
                (computedData.style.dashed ? '10 8' : '')
                " :stroke-width="computedData.style.strokeWidth" fill="none" stroke-linejoin="round" />

            <!-- 箭头 -->
            <component :is="arrowMap[computedData.style.targetArrow]" v-if="computedData.style.targetArrow" :edge="shape"
                :style="computedData.style" position="end" />
            <!-- 操作线，设置宽度为10，透明方便拖拽 -->
            <path :d="computedData.svgPath" fill="none" :stroke-width="10" stroke="rgba(0,0,0,0)" stroke-linejoin="round" />
        </g>
        <foreignObject v-if="isShowLabel" @mousedown.stop :width="labelStyle.width" :height="labelStyle.height"
            :x="labelStyle.absX" :y="labelStyle.absY">
            <div ref="labelDom" class="label" :class="{ edit: editable }" :contenteditable="editable" autofocus
                @input="handleInput" @blur="handleBlur">
                {{ text }}
            </div>
        </foreignObject>
    </g>
</template>
<style>
.label {
    border: none;
    outline: none;
    font-size: 12px;
    color: #666;
    resize: none;
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    position: absolute;
    /* 自适应宽度 */
    resize: none;
    /* 设置光标颜色 */
    caret-color: black;
    white-space: nowrap;
    border: 1px solid transparent;
    background-color: #fff;
}

.edit {
    border: 1px solid red;
    padding: 0 5px;
}
</style>
