<template>
  <div class="example-wrapper">
    <div class="panel">
      <vue-tree :tree="tree" ref="tree" class="tree" @dragover="showInfo" @dragend="showInfo" />
    </div>
    <span class="info">
      <span class="key">dragNode:</span> <span class="val">{{dragNode}}</span> <br>
      <span class="key">overNode:</span> <span class="val">{{overNode}}</span> <br>
      <span class="key">overArea:</span> <span class="val">{{overArea}}</span>
    </span>
  </div>
</template>

<script>
import VueTree from '../../src/VueTree.vue'

export default {
  name: 'drag-and-drop-basic-example',
  components: {
    VueTree
  },
  data() {
    return {
      dragNode: '',
      overNode: '',
      overArea: '',
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
            },
            {
              id: 9,
              title: 'child 5'
            },
            {
              id: 10,
              title: 'child 6'
            }
          ]
        }
      ]
    }
  },
  methods: {
    showInfo() {
      let tree = this.$refs.tree

      this.dragNode = tree.dragAndDrop.dragNode !== null
        ? tree.dragAndDrop.dragNode.title
        : ''
      this.overNode = tree.dragAndDrop.overNode !== null
        ? tree.dragAndDrop.overNode.title
        : ''
      this.overArea = tree.dragAndDrop.overArea !== null
        ? tree.dragAndDrop.overArea
        : ''
    }
  }
}
</script>

<style scoped>
.panel .tree {
  width: 50%;
}
.btn {
  width: 100px;
  margin-right: 20px;
}
.info {
  display: block;
  width: 100%;
  text-align: left;
}
.key {
  font-weight: bold;
  font-size: 18px;
}
</style>
