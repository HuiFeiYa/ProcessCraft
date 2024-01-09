<script setup lang="ts">
import { Shape } from '../../types';

defineProps<{
    shape: Shape | undefined,
    previewPath: string
}>();
</script>
<template>
    <g>
        <path :d="previewPath" :stroke="shape?.style.strokeColor || 'black'"
            :stroke-dasharray="shape?.style.dashed ? '10 8' : ''" fill="none" stroke-width="2" stroke-miterlimit="10"
            stroke-linejoin="round" />
    </g>
</template>