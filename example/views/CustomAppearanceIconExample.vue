<template>
  <div class="example-wrapper">
    <div class="panel">
      <vue-tree 
        :tree="tree"
        class="tree">
          <template v-slot:icon="{node}">
            <img class="node-icon" src="/folder.svg" v-if="node.hasChild && node.directoryState === 'collapsed'"/>
            <img class="node-icon" src="/folder-open.svg" v-else-if="node.hasChild && node.directoryState === 'expanded'"/>
            <img class="node-icon" src="/video.svg" v-else-if="!node.hasChild && node.type === 'video'"/>
            <img class="node-icon" src="/audio.svg" v-else-if="!node.hasChild && node.type === 'audio'"/>
            <img class="node-icon" src="/text.svg" v-else />
          </template>
          <template v-slot:switcher="{node}">
            <svg class="switcher-icon collapsed" viewBox="-3 -3 38 38" fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="3px" v-if="node.directoryState === 'collapsed'">
              <path d="M12 30 L24 16 12 2" />
            </svg>
            <svg class="switcher-icon expanded" viewBox="-3 -3 38 38" fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="3px" v-else-if="node.directoryState === 'expanded'">
              <path d="M30 12 L16 24 2 12" />
            </svg>
          </template>
      </vue-tree>
    </div>
  </div>
</template>

<script>
import VueTree from '../../src/VueTree.vue'

export default {
  name: 'custom-appearance-icon-example',
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
              id: 3,
              title: 'videos',
              hasChild: true,
              children: [
                {
                  id: 4,
                  title: 'song of ice and fire',
                  type: 'video'
                },
                {
                  id: 5,
                  title: 'harry potter',
                  type: 'video'
                },
                {
                  id: 6,
                  title: 'the lord of the rings',
                  type: 'video'
                }
              ],
            },
            {
              id: 7,
              title: 'audios',
              hasChild: true,
              children: [
                  {
                      id: 8,
                      title: 'yesterday once more',
                      type: 'audio'
                  },
                  {
                      id: 9,
                      title: 'my heart will go on',
                      type: 'audio'
                  },
                  {
                      id: 10,
                      title: 'lovers',
                      type: 'audio'
                  }
              ]
            },
            {
              id: 11,
              title: 'text 1'
            },
            {
              id: 12,
              title: 'text 2'
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
.node-icon {
    width: 1em;
    height: 1em;
    vertical-align: middle;
}
.switcher-icon {
    width: 1em;
    height: 1em;
}
</style>
