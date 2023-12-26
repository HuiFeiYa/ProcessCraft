<script setup lang="ts">
import { computed } from 'vue'
import { Shape } from '../../types';
import { shapeSkeletonUtil } from '../../models/ShapeSkeletonUtil';
import { PathBuilder } from '../../util';

const props = defineProps<{shapes: Shape[], dx: number, dy:number}>();
console.log('preview:', props)
const c = new PathBuilder();
const symbolBoundsSvgPath = computed(()=> {
    const symbols = props.shapes
    if (symbols.length > 0) {
        const draw = shapeSkeletonUtil.getRectPath;
        symbols.forEach(shape=> {
            draw(c, shape)
        }) 
        const path = c.getPath()
        console.log('path:',path)
        return path
    } else {
        return ''
    }
})
</script>
<template>
  <g :transform="`translate(${dx},${dy})`">
    <path v-if="props.shapes.length > 0" :d="symbolBoundsSvgPath" fill="none" stroke-width="2"
        stroke="black" />
  </g>
</template>