<template>
  <div class="example-wrapper">
    <div class="panel">
      <vue-tree 
        :tree="tree"
        :fnCustomClasses="fnCustomClasses" 
        class="tree"/>
    </div>
  </div>
</template>

<script>
import VueTree from '../../src/VueTree.vue'

export default {
  name: 'custom-appearance-size-example',
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
  },
  methods: {
    fnCustomClasses(node) {
      return [`mystyle-${node.id}`]
    }
  }
}
</script>

<style scoped>
.panel .tree {
  width: 50%;
}
</style>

<style>
.mystyle-1 {
  font-weight: bolder;
  text-shadow: 1px 1px 1px grey;
}

.mystyle-3 .vue-tree-title {
  color: white;
  text-shadow: 0px 0px 3px darkblue, 0px 0px 6px darkblue, 0px 0px 9px darkblue;
}

.mystyle-5 {
  color: blue;
  text-shadow: 1px 1px grey, 1px 1px grey, 1px 1px grey;
}
</style>