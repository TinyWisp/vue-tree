<template>
  <div class="example-wrapper">
    <div class="panel">
      <vue-tree 
      :tree="tree"
      :defaultAttrs="{
        style: {
          showSwitcher: false,
        }
      }"
      class="tree" />
    </div>
  </div>
</template>

<script>
import VueTree from '../../src/VueTree.vue'

export default {
  name: 'custom-appearance-no-directory-toggles-example',
  components: {
    VueTree
  },
  data() {
    return {
      tree: [
        {
          id: 1,
          title: 'ROOT',
          hasChild: true,
          children: [
            {
              id: 2,
              title: 'child 1',
            },
            {
              id: 3,
              title: 'child 2',
              hasChild: true,
              children: [
                {
                  id: 4,
                  title: 'child 2-1'
                },
                {
                  id: 5,
                  title: 'child 2-2'
                },
                {
                  id: 6,
                  title: 'child 2-3'
                }
              ],
            },
            {
              id: 7,
              title: 'child 3'
            },
            {
              id: 8,
              title: 'child 4'
            }
          ]
        }
      ]

    }
  }
}
</script>

<style scoped>
.panel .tree {
  width: 50%;
}
</style>