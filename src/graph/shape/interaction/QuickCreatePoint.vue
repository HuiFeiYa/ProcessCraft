<script setup lang="ts">
import { inject } from "vue";
import { Bounds } from "../../types";
import { CreatePointType, EventType } from "../constant";
import { GraphModel } from "../../models/graphModel";
import { StartMoveSource } from "../../models/MoveModel";
const graph = inject<GraphModel>('graph')
const props = defineProps<{ bounds: Bounds }>();
const emit = defineEmits<{
  (e: "create", index: CreatePointType): void;
}>();
const handleCreate = (index: CreatePointType) => {
  emit("create", index);
};

const handleMousedown = (e) => {
  graph.emitter.emit(EventType.SHAPE_MOUSE_DOWN, e, StartMoveSource.QuickCreatePoint, null)
}
/** 控制点宽度 */
const width = 16;
const height = 16;
const space = 1;
</script>
<template>
  <g style="pointer-events: all" @mousedown="handleMousedown">
    <!-- 创建点 -->
    <!-- 上 -->
    <foreignObject :x="bounds.absX + bounds.width / 2" :y="bounds.absY" :width="width" :height="height"
      :style="{ transform: `translate(-${width / 2}px, ${-height - space}px)` }" @mousedown="handleCreate(1)">
      <el-icon class="create">
        <CirclePlus />
      </el-icon>
    </foreignObject>

    <!-- 下 -->
    <foreignObject :x="bounds.absX + bounds.width / 2" :y="bounds.absY + bounds.height" :width="width" :height="height"
      fill="#000" :style="{ transform: `translate(-${width / 2}px, ${space}px` }" @mousedown="handleCreate(3)">
      <el-icon class="create">
        <CirclePlus />
      </el-icon>
    </foreignObject>
    <!-- 右 -->
    <foreignObject :x="bounds.absX + bounds.width" :y="bounds.absY + bounds.height / 2" :width="width" :height="height"
      fill="#000" :style="{ transform: `translate( ${space}px,-${height / 2}px)` }" @mousedown="handleCreate(2)">
      <el-icon class="create">
        <CirclePlus />
      </el-icon>
    </foreignObject>
    <!-- 左 -->
    <foreignObject :x="bounds.absX" :y="bounds.absY + bounds.height / 2" :width="width" :height="height" fill="#000"
      :style="{ transform: `translate(-${width + space}px,-${height / 2}px)` }" @mousedown="handleCreate(4)">
      <el-icon class="create">
        <CirclePlus />
      </el-icon>
    </foreignObject>
  </g>
</template>
<style>
.create {
  color: #7ebfde !important;
  font-weight: 500;
  background-color: rgba(255, 255, 255, 0.7);
  padding: 1px;
}

.create:hover {
  color: #0795d6 !important;
}
</style>
