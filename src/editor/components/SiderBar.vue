<script setup lang="ts">
import { ref } from 'vue'
import { SiderBarItem } from '../SiderBarDropModel';
import { GraphTab } from '../project/GraphTab';
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
            "metaclass": "Stereotype",
            "siderBarkey": "Block"
        }
    }
]
const onMousedown = (event:MouseEvent, item: SiderBarItem) => {
    props.tab.siderBarDropModel.onMouseDown(item)
}
</script>
<template>
    <div class="sidebar">
        <el-collapse v-model="active">
            <el-collapse-item title="通用" name="common">
                <div v-for="siderbarItem in siderBarList" :key="siderbarItem.modelId" class="collapse-item" @mousedown="onMousedown($event, siderbarItem)">
                    {{ siderbarItem.showData.siderBarkey }}
                    <img :src="siderbarItem.showData.icon">
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
</style>