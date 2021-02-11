# VueTree
[![GitHub](https://img.shields.io/github/license/tinywisp/vue-tree)](https://github.com/TinyWisp/vue-tree/master/LICENSE)
[![npm](https://img.shields.io/npm/v/vue-tree)](https://www.npmjs.com/package/vue-tree)
[![codecov](https://codecov.io/gh/TinyWisp/vue-tree/branch/master/graph/badge.svg)](https://codecov.io/gh/TinyWisp/vue-tree)
![Travis (.org)](https://img.shields.io/travis/TinyWisp/vue-tree)

 基于vue 3的树形组件。

* [主要特色](#主要特色)
* [开始使用](#开始使用)
* [文档](https://github.com/TinyWisp/vue-tree/wiki/%E6%96%87%E6%A1%A3)
* [示例](https://tinywisp.gitee.io/vue-tree/#/zh/)
* [开源协议](#开源协议)

A highly customizable tree component for vue 3.
* [Features](#features)
* [Getting Started](#getting-started)
* [Document](https://github.com/TinyWisp/vue-tree/wiki/Document)
* [Demos](https://tinywisp.github.io/vue-tree/#/en/)
* [License](#license)


## 主要特色
 *  支持复选框
 *  可异步加载
 *  拖放操作
 *  右键菜单
 *  按钮
 *  自定义外观

## 文档
 *  [文档](https://github.com/TinyWisp/vue-tree/wiki/%E6%96%87%E6%A1%A3)

## 开始使用

 npm
 ```
   npm install @tinywisp/vue-tree --save
 ```

 引入
 ```
   import VueTree from '@tinywisp/vue-tree'
 ```

 示例
 ```javascript
<template>
  <div id="app">
    <vue-tree :tree="tree" ref="tree" class="tree" />
  </div>
</template>

<script>
import VueTree from '@tinywisp/vue-tree'

export default {
  name: 'App',
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
.tree {
  width: 200px;
  height: 300px;
}
</style>

 ```

## 示例
 *  [示例](https://tinywisp.gitee.io/vue-tree/)

## 开源协议
 * MIT
 * 无论个人还是公司，都可以免费自由使用
 
 ---
 

## Features
 *  checkbox
 *  async loading
 *  drag and drop
 *  context menu
 *  button
 *  customizable appearance

## Getting Started

 npm
 ```
   npm install @tinywisp/vue-tree --save
 ```

 import the library
 ```
   import VueTree from '@tinywisp/vue-tree'
 ```

 usage
 ```javascript
<template>
  <div id="app">
    <vue-tree :tree="tree" ref="tree" class="tree" />
  </div>
</template>

<script>
import VueTree from '@tinywisp/vue-tree'

export default {
  name: 'App',
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
.tree {
  width: 200px;
  height: 300px;
}
</style>

 ```

## Document
 *  [Document](https://github.com/TinyWisp/vue-tree/wiki/Document)

## Demos
 *  [Demos](https://tinywisp.github.io/vue-tree/)

## License
 * MIT
 * it is free for commercial use.
 