<template>
  <div 
    v-if="dragAndDrop.isDroppable && dragAndDrop.overNode !== null && dragAndDrop.overArea !== null"
    :class="[
      'vue-tree-drag-arrow-wrapper',
      `vue-tree-drag-arrow-${dragAndDrop.overArea}`
    ]"
    :style="{
      '--overNodeX': dragAndDrop.overRect.left + 'px',
      '--overNodeY': dragAndDrop.overRect.top + 'px',
      '--overNodeHeight': dragAndDrop.overRect.height + 'px',
      '--overNodeFullIndent': dragAndDrop.overNode.__.fullIndent,
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
    }
  }
}
</script>

<style scoped>
.vue-tree-wrapper .vue-tree-drag-arrow-wrapper {
  height: var(--overNodeHeight);
  width: 0;
  border: 0;
  padding: 0;
  margin: 0;
  text-indent: 0;
  position: fixed;
  left: calc(var(--overNodeX) + var(--overNodeFullIndent) + 1em);
  top: var(--overNodeY);
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  align-items: flex-end;
  overflow: visible;
  z-index: 10;
  font-size: 12px;
}
.vue-tree-wrapper .vue-tree-drag-arrow-wrapper .vue-tree-drag-arrow {
  width: 1.7em;
  height: 2.6em;
  stroke: #5cb85c;
  fill: #5cb85c;
  overflow: visible;
}
.vue-tree-wrapper .vue-tree-drag-arrow-prev {
  justify-content: flex-start;
}
.vue-tree-wrapper .vue-tree-drag-arrow-prev > :first-child {
  transform: translateY(-50%);
}
.vue-tree-wrapper .vue-tree-drag-arrow-next {
  justify-content: flex-end;
}
.vue-tree-wrapper .vue-tree-drag-arrow-next > :first-child {
  transform: translateY(50%);
}
.vue-tree-wrapper .vue-tree-drag-arrow-self {
  justify-content: center;
}
.vue-tree-wrapper .vue-tree-drag-arrow-self > :first-child {
  transform: translateY(0);
}
.vue-tree-wrapper .vue-tree-node-drag-over-self .vue-tree-icon-and-title {
  background-color: var(--dragOverBgColor);
}
.vue-tree-wrapper .vue-tree-drag-image-wrapper .vue-tree-drag-image {
  text-indent: 0;
  font-size: var(--fontSize);
  width: auto;
  height: 1.5em;
  line-height: 1.5em;
  padding: 0.3em 0.5em;
  border: 0;
  border-radius: 5px;
  background-color: #bae7ff;
}
</style>
