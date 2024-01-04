<script setup lang="ts">
import { Bounds } from '../../types';

defineProps<{ bounds: Bounds, color?: string }>();
</script>
<template>
    <g>
        <rect :x="bounds.absX" :y="bounds.absY" :width="bounds.width" :height="bounds.height" fill="none"
            :stroke="color || 'black'" style="pointer-events:none;transform: 'translate(3px,3px)'"></rect>

    </g>
</template>