<template>
  <div class="example-wrapper">
    <div class="panel">
      <vue-tree 
      :tree="tree"
      class="tree"
      @select="check" />
    </div>
    <span class="output">{{text}}</span>
  </div>
</template>

<script>
import VueTree from '../../src/VueTree.vue'

export default {
  name: 'root-node-checking-example',
  components: {
    VueTree
  },
  data() {
    return {
      text: '',
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
  },
  methods: {
    check(node) {
      this.text = node.__.parent === null
                  ? 'node "' + node.title + '" is the root node'
                  : 'node "' + node.title + '" is not the root node'
    }
  }
}
</script>

<style scoped>
.panel .tree {
  width: 50%;
}
</style>