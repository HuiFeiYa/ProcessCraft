<script setup lang="ts">
import { computed } from 'vue';
import { Shape } from '../../../../types';
import { Point, rotate } from '../../../../util/Point';

const props = defineProps<{
  edge: Shape,
  style?: { [key: string]: string },
  position: String
}>();
let pt1 = new Point(-8, 4);
let pt2 = new Point(0, 0);
let pt3 = new Point(-8, -4);
const getPath = computed(() => {
  const edge = props.edge;
  let p = '';
  if (props.position === 'end' && props.edge.waypoint && props.edge.waypoint.length) {
    const p2 = props.edge.waypoint[props.edge.waypoint.length - 1];
    const p1 = props.edge.waypoint[props.edge.waypoint.length - 2] ? props.edge.waypoint[props.edge.waypoint.length - 2] : edge.waypoint[0];
    if (!p1 || !p2) { return p; }
    const arc1 = Math.atan2((p2.y - p1.y), (p2.x - p1.x));
    let _pt1 = rotate(pt1, arc1);
    let _pt2 = rotate(pt2, arc1);
    let _pt3 = rotate(pt3, arc1);
    const initPoint = props.edge.waypoint[props.edge.waypoint.length - 1];
    p += `M ${initPoint.x + _pt1.x} ${initPoint.y + _pt1.y}`;
    p += ` L ${initPoint.x + _pt2.x} ${initPoint.y + _pt2.y}`;
    p += ` L ${initPoint.x + _pt3.x} ${initPoint.y + _pt3.y}`;
  }
  return p;
});
</script>
<template>
  <path :d="getPath" fill="none" :stroke="props.style ? props.style.strokeColor : props.edge.style.strokeColor"
    :stroke-width="props.style ? props.style.strokeWidth : props.edge.style.strokeWidth" name="arrow" :position="position"
    stroke-linejoin="round"></path>
</template>