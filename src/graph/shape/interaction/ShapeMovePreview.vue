<script setup lang="ts">
import { computed } from 'vue'
import { Shape, ShapeType } from '../../types';
import { shapeSkeletonUtil } from '../../models/ShapeSkeletonUtil';
import { PathBuilder } from '../../util';
import { waypointUtil } from '../../util/WaypointUtil';

const props = defineProps<{ shapes: Shape[], dx: number, dy: number }>();
const c = new PathBuilder();
const symbolBoundsSvgPath = computed(() => {
    const symbols = props.shapes
    if (symbols.length > 0) {
        const draw = shapeSkeletonUtil.getRectPath;
        symbols.forEach(shape => {
            draw(c, shape)
        })
        const path = c.getPath()
        return path
    } else {
        return ''
    }
})

const shapeGroup = computed(() => {
    let commonShapes: Shape[] = []
    let edgeShapes: Shape[] = []
    let solidEdgeSvgPath = ''
    props.shapes.forEach(shape => {
        switch (shape.shapeType) {
            case ShapeType.Edge:
                edgeShapes.push(shape);
                break;

            default:
                commonShapes.push(shape);
                break;
        }
    });
    edgeShapes.forEach((shape) => {
        solidEdgeSvgPath = waypointUtil.getSvgPath(shape) + ' '
    })
    return {
        commonShapes,
        edgeShapes,
        solidEdgeSvgPath
    }
})
</script>
<template>
    <g :transform="`translate(${dx},${dy})`">
        <path v-if="shapeGroup.commonShapes.length > 0" :d="symbolBoundsSvgPath" fill="none" stroke-width="2"
            stroke="black" />
        <path v-if="shapeGroup.edgeShapes.length > 0" :d="shapeGroup.solidEdgeSvgPath" stroke="black" fill="none"
            stroke-width="1" stroke-miterlimit="10" stroke-linejoin="round" />
    </g>
</template>