<template>
  <div class="example-wrapper">
    <div class="panel">
      <vue-tree
        :tree="tree"
        class="tree"
        @dragover="showInfo"
        @dragend="showInfo"
        :enableTouchSupport="true" />
    </div>
    <span class="info">
      <span class="key">dragNode:</span> <span class="val">{{dragNode}}</span> <br>
      <span class="key">overNode:</span> <span class="val">{{overNode}}</span> <br>
      <span class="key">overArea:</span> <span class="val">{{overArea}}</span> <br>
      <span class="key">status:</span> <span class="val">{{status}}</span>
    </span>
  </div>
</template>

<script>
import VueTree from '../../src/VueTree.vue'

export default {
  name: 'drag-and-drop-basic-touch-support-example',
  components: {
    VueTree
  },
  data() {
    return {
      dragNode: '',
      overNode: '',
      overArea: '',
      status: 0,
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
    showInfo(dragAndDrop) {
      this.dragNode = dragAndDrop.dragNode !== null
        ? dragAndDrop.dragNode.title
        : ''
      this.overNode = dragAndDrop.overNode !== null
        ? dragAndDrop.overNode.title
        : ''
      this.overArea = dragAndDrop.overArea !== null
        ? dragAndDrop.overArea
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
