<script setup>
</script>
<template>
  <g
    @click.stop
    @mousedown.stop
    @mouseup.stop
    @mousemove.stop
    @dragenter.stop
    @dragleave.stop
    @dragover.stop
  >
    <rect width="100" height="100" x="10" y="10" fill="red"></rect>
  </g>
</template>