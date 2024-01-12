<script setup lang="ts">
import { computed } from 'vue';
import { LabelEditorModel } from '../../models/LabelEditorModel';
import { ref } from 'vue';
import { onMounted } from 'vue';
const props = defineProps<{
    editorModel: LabelEditorModel
}>();
const previewBounds = computed(() => {
    let bounds = props.editorModel.bounds;
    return bounds ? {
        absX: bounds.absX,
        absY: bounds.absY,
        width: bounds.width,
        height: bounds.height
    } : {};
});

const handleInput = (e: Event) => {
    const text = (e.target as HTMLInputElement).value;
    props.editorModel.setText(text)
}

const handleSave = () => {
    props.editorModel.endEdit()
}

const textarea = ref<HTMLInputElement | null>(null);
onMounted(() => {
    textarea.value?.focus();
    textarea.value?.select();

});
</script>
<template>
    <g>
        <foreignObject :width="previewBounds.width" :height="previewBounds.height" :x="previewBounds.absX"
            :y="previewBounds.absY">
            <textarea :value="editorModel.text" ref="textarea" class="label-editor" @input="handleInput"
                @blur="handleSave"></textarea>
        </foreignObject>
    </g>
</template>

<style>
.label-editor {
    position: absolute;
    pointer-events: all;
    border: none;
    outline: none;
    display: block;
    resize: none;
    width: 100%;
    height: 100%;
    background: transparent;
    word-break: break-all;
}
</style>