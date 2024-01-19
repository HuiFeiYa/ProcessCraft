<script setup lang="ts">
import { computed, inject, toRaw } from "vue";
import { Bounds, Shape } from "../../types";
import { GraphModel } from "../../models/graphModel";
import { createEventHandler } from "../createEventHandler";
import { waypointUtil } from "../../util/WaypointUtil";
import { arrowMap } from "./common/arrows/ArrowMap";
import { ref } from "vue";
import { nextTick } from "vue";
import { cloneDeep } from "lodash";
import { shapeUtil } from "../ShapeUtil";
import { reactive } from "vue";
import { updateShapeService } from "../../service";
const props = defineProps<{
    shape: Shape;
}>();

const graph = inject<GraphModel>("graph");
const eventHandler = createEventHandler(graph, props);
const editable = ref(false);
const labelDom = ref(null);
const text = ref(props.shape.modelName);
const prevText = ref(props.shape.modelName)
const prevNameBounds = ref(new Bounds())
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
    const { bounds: { absX: parentAbsX, absY: parentAbsY }, waypoint } = props.shape
    const { width, height, offsetX, offsetY } = props.shape.nameBounds
    const firstPoint = waypoint[0]
    const lastPoint = waypoint[waypoint.length - 1]
    // 编辑状态下有 padding
    const paddingWidth = 12
    if (editable.value) {
        return {
            width: width + paddingWidth,
            height: Math.max(height, 30),
            /**
             * 以父级的 absX 为相对坐标，向右偏移 offsetX 百分比的距离，然后将自身移动到中点，然后在移动一个 padding 中点的位置
             */
            absX: parentAbsX + (lastPoint.x - firstPoint.x) * offsetX - width / 2 - paddingWidth / 2,
            absY: parentAbsY + (lastPoint.y - firstPoint.y) * offsetY - height / 2
        }
    } else {
        return {
            width,
            height,
            absX: parentAbsX + (lastPoint.x - firstPoint.x) * offsetX - width / 2,
            absY: parentAbsY + (lastPoint.y - firstPoint.y) * offsetY - height / 2
        }
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
    editable.value = true;
    // fix 修改 contenteditable 后选中文案无法直接编辑问题
    nextTick(() => {
        select(labelDom.value);
        labelDom.value.focus();
    });
};
const handleFocus = (e) => {
    prevNameBounds.value = cloneDeep(props.shape.nameBounds)
    prevText.value = e.target.innerHTML
}
const handleInput = (e) => {
    text.value = e.target.innerHTML;
    const { nameBounds: { offsetX }, bounds: { width: parentWidth, absX } } = props.shape;
    const { width, height } = shapeUtil.getTextSize(text.value, props.shape.nameStyle.fontSize)
    updateShapeService(props.shape.id, {
        nameBounds: {
            ...props.shape.nameBounds,
            width,
            height,
            absX: absX + (parentWidth * offsetX - width) / 2 // 减去文本的宽度
        }
    }, null, false)
    // 输入时 y 轴高度不需要改变
};
const handleBlur = () => {
    editable.value = false;
    if (prevText.value !== text.value) {
        updateShapeService(props.shape.id, { nameBounds: props.shape.nameBounds, modelName: text.value }, { nameBounds: prevNameBounds.value, modelName: props.shape.modelName })
        prevText.value = text.value
    }
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
        <foreignObject :width="labelStyle.width" :height="labelStyle.height" :x="labelStyle.absX" :y="labelStyle.absY"
            @click.stop @mousedown.stop @mouseup.stop @drop.stop>
            <div ref="labelDom" class="label" :class="{ edit: editable }" :contenteditable="editable" autofocus
                @focus="handleFocus" @input="handleInput" @blur="handleBlur">
                {{ shape.modelName }}
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
    cursor: grab;
}

.edit {
    border: 1px solid red;
    padding: 0 5px;
}
</style>
