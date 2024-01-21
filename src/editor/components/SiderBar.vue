<script setup lang="ts">
import { ref } from "vue";
import { SiderBarItem } from "../SiderBarDropModel";
import { GraphTab } from "../project/GraphTab";
import { siderBarList } from "../../graph/shape/constant";
const props = defineProps<{ tab: GraphTab }>();
const active = ref("common");

const onMousedown = (event: MouseEvent, item: SiderBarItem) => {
  props.tab.siderBarDropModel.onMouseDown(item);
};
const onDragstart = (event: DragEvent) => {
  event.stopPropagation();
};
</script>
<template>
  <div class="sidebar" @dragstart="onDragstart">
    <el-collapse v-model="active" style="margin-top: -3px">
      <el-collapse-item title="通用" name="common">
        <div
          v-for="siderbarItem in siderBarList"
          :key="siderbarItem.modelId"
          class="collapse-item"
          @mousedown="onMousedown($event, siderbarItem)"
        >
          <img :src="siderbarItem.showData.icon" />
          <span>
            {{ siderbarItem.showData.name }}
          </span>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
<style>
.sidebar {
  width: 200px;
  user-select: none;
  overflow: hidden;
  background-color: #fbfbfb;
  padding: 0 10px;
  flex-shrink: 0;
}

.collapse-item {
  user-select: none;
  display: flex;
  align-items: center;
}

.collapse-item span {
  margin-left: 4px;
  vertical-align: top;
  /* 阻止原生的拖动视觉效果，拖动行为又父级代理 */
  pointer-events: none;
}

.collapse-item img {
  vertical-align: text-top;
  /* 阻止原生的拖动视觉效果，拖动行为又父级代理 */
  pointer-events: none;
}
</style>
