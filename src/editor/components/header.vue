<script setup lang="ts">
</script>
<template>
    <div class="toolbar">
        <el-tooltip effect="dark" content="删除元素" placement="top-start">
            <el-icon>
                <Delete />
            </el-icon>
        </el-tooltip>

    </div>
</template>
<style>
.close {
    width: 20px;
    height: 20px;

}

.common-item {
    cursor: pointer;
    text-align: center;
    user-select: none;
}

.toolbar {
    display: flex;
    align-items: center;
    height: 38px;
    width: 100%;
    border-bottom: 1px solid #dadce0;
    padding: 0 10px;
}
</style>