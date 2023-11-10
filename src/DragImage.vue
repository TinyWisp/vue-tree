<template>
  <div 
    v-if="dragAndDrop.dragNode !== null && (enableDragNodeOut === true || dragAndDrop.status === DND_STATUS.INTERNAL) && dragAndDrop.clientX !== null"
    class="vue-tree-drag-image-wrapper"
    :style="{
      '--mousex': dragAndDrop.clientX + 'px',
      '--mousey': dragAndDrop.clientY + 'px',
      '--dragNodeFontSize': dragAndDrop.dragNode.style.fontSize,
    }"> 
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    dragAndDrop: {
      type: Object,
      required: true
    },
    DND_STATUS: {
      type: Object,
      required: true
    },
    enableDragNodeOut: {
      type: Boolean,
      required: true
    }
  },
}
</script>

<style scoped>
.vue-tree-wrapper .vue-tree-drag-image-wrapper {
  display: block;
  position: absolute;
  z-index: 11;
  left: calc(var(--mousex) + var(--dragImageOffsetX) - var(--treeClientX));
  top: calc(var(--mousey) + var(--dragImageOffsetY) - var(--treeClientY));
  font-size: var(--dragNodeFontSize);
  text-indent: 0;
  text-wrap: nowrap;
}
</style>