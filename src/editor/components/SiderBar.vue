<script setup lang="ts">
import { ref } from 'vue'
import { SiderBarItem } from '../SiderBarDropModel';
import { GraphTab } from '../project/GraphTab';
import { SiderbarItemKey } from '../../graph/shape/constant';
const props = defineProps<{tab: GraphTab}>()
const active = ref('common')
const siderBarList :SiderBarItem[]= [
    {
        "modelId": "SysML::Blocks::Block",
        "operation": "",
        "dropdownTag": "",
        "showData": {
            "name": "Block",
            "icon": "src/assets/Block.svg",
            "siderBarkey": SiderbarItemKey.Block
        }
    },
    {
        "modelId": "SysML::ItemFlow",
        "operation": "",
        "dropdownTag": "",
        "showData": {
            "name": "Item Flow",
            "icon": "src/assets/ItemFlow.svg",
            "siderBarkey":  SiderbarItemKey.ItemFlow
        }
    }
]
const onMousedown = (event:MouseEvent, item: SiderBarItem) => {
    props.tab.siderBarDropModel.onMouseDown(item)
}
const onDragstart = (event:DragEvent) => {
    event.stopPropagation()
}
</script>
<template>
    <div class="sidebar" @dragstart="onDragstart">
        <el-collapse v-model="active">
            <el-collapse-item title="通用" name="common">
                <div v-for="siderbarItem in siderBarList" :key="siderbarItem.modelId" class="collapse-item" @mousedown="onMousedown($event, siderbarItem)">
                    <img :src="siderbarItem.showData.icon">
                    <span>
                        {{ siderbarItem.showData.siderBarkey }}
                    </span>
                </div>
            </el-collapse-item>
        </el-collapse>
    </div>
</template>
<style>
.sidebar {
    width: 200px;
    height: 100vh;
}

.collapse-item {
    user-select: none;

}
.collapse-item span {
    vertical-align: top;
    /* 阻止原生的拖动视觉效果，拖动行为又父级代理 */
    pointer-events: none;
}
.collapse-item img{
    vertical-align: text-top;
    /* 阻止原生的拖动视觉效果，拖动行为又父级代理 */
    pointer-events: none;
}
</style>