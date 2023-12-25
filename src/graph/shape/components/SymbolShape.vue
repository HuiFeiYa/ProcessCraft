<script setup lang="ts">
import { inject } from 'vue'
import { Shape } from '../../types/index'
const props = defineProps<{shape:Shape}>()
const graph = inject('graph')
const eventHandler = {}
</script>
<template>
  <g
    @click.stop
    @mousedown.stop
    @mouseup.stop
    @mousemove.stop
    @dragenter.stop dragenter stop
    @dragleave.stop
    @drop.stop
    @dragover.stop
  >

    <!-- 最外层是绝对坐标，要创建相对坐标系需要用<g transform="translate(absX,absY)/> 或foreignObject" -->
      <!-- 
              :width="shape.bounds.width"
      :height="shape.bounds.height"
      :x="shape.bounds.absX"
      :y="shape.bounds.absY"
       -->
    <foreignObject


      style="overflow:visible"
      v-on="eventHandler"

    >
    <div>1111</div>
  </foreignObject>
    </g>
</template>