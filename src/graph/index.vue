<script setup>
import DiagramShape from './components/DiagramShape.vue'
function handleClickOut() {


}
function handleMousedownOut() {
}
function handleMouseupOut() {

}
function handleMousemoveOut() {

}
function handleDragOver() {

}

const handleDrop = () => {

};
</script>
<template>
  <div class="graph-view">
        <!-- 展示层 -->
    <svg
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        class="svg-container"
      
        transform-origin="0 0"
        @click="handleClickOut"
        @mousedown="handleMousedownOut"
        @mouseup="handleMouseupOut"
        @mousemove="handleMousemoveOut"
        @dragover="handleDragOver"
        @drop.stop="handleDrop"
        >
        <g>
            <DiagramShape />
        </g>
    </svg>
  </div>
</template>