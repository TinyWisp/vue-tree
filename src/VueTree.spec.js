import VueTree from './VueTree.vue'
import { mount } from '@vue/test-utils'
import { describe, expect, test } from 'vitest'
import { nextTick, reactive } from 'vue'

function delay(milliseconds) {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

describe('basic', ()=>{
    let commonTree = [
        {
            id: 1,
            title: 'ROOT',
            hasChild: true,
            children: [
                {
                    id: 2,
                    title: 'child 1'
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
                    ]
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

    test('data:items', async ()=>{
        let wrapper = mount(VueTree, {
            propsData: {
                tree: commonTree
            }
        })
        await nextTick()

        let items = wrapper.vm.items

        expect(items.length).toBe(8)
        for (let i=0; i<8; i++) {
            let item = items[i]

            expect(item.id).toBe(i + 1)
            expect(item.__.gpos).toBe(i)
            expect(item.__.depth).toBe(item.__.path.length + 1)

            if (item.__.parent !== null) {
                let parent = item.__.parent
                expect(parent.hasChild).toBeTruthy()
                expect(parent.children).toContain(item)
                expect(parent.children.indexOf(item)).toBe(item.__.pos)
            }
        }

        expect(items[0].title).toMatch('ROOT')
        expect(items[0].__.parent).toBeNull()
        expect(items[2].__.parent).toBe(items[0])
        expect(items[5].__.parent).toBe(items[2])
    })

    test('method: getById', async ()=>{
        let wrapper = mount(VueTree, {
            propsData: {
                tree: commonTree
            }
        })
        await nextTick()

        let items = wrapper.vm.items
        for (let i=0; i<8; i++) {
            let item = items[i]
            let id = item.id
            expect(wrapper.vm.getById(id)).toBe(item)
        }
    })

    test('method: getByGpos', async ()=>{
        let wrapper = mount(VueTree, {
            propsData: {
                tree: commonTree
            }
        })
        await nextTick()

        let items = wrapper.vm.items
        for (let i=0; i<8; i++) {
            let item = items[i]
            let gpos = item.__.gpos
            expect(wrapper.vm.getByGpos(gpos)).toBe(item)
        }
    })

    test('method: getAttr', async ()=>{
        let wrapper = mount(VueTree, {
            propsData: {
                tree: commonTree
            }
        })
        await nextTick()

        let items = wrapper.vm.items
        for (let i=0; i<8; i++) {
            let item = items[i]
            expect(item.id).toBe(wrapper.vm.getAttr(item, 'id'))
            expect(item.title).toBe(wrapper.vm.getAttr(item, 'title'))
            expect(item.__.parent).toBe(wrapper.vm.getAttr(item, '__', 'parent'))
            expect(item.__.path).toBe(wrapper.vm.getAttr(item, '__', 'path'))
            expect(item.__.pos).toBe(wrapper.vm.getAttr(item, '__', 'pos'))
        }
    })

    test('method: setAttr', async ()=>{
        let wrapper = mount(VueTree, {
            propsData: {
                tree: commonTree
            }
        })
        await nextTick()

        let items = wrapper.vm.items
        for (let i=0; i<8; i++) {
            let item = items[i]
            wrapper.vm.setAttr(item, 'test', i)
            expect(item.test).toBe(i)

            wrapper.vm.setAttr(item, 'sub', 'test', i)
            expect(item.sub.test).toBe(i)
        }
    })

    test('method: getFlatTree', async ()=>{
        let wrapper = mount(VueTree, {
            propsData: {
                tree: commonTree
            }
        })
        await nextTick()

        let items = wrapper.vm.getFlatTree()
        expect(items.length).toBe(8)
        for (let i=0; i<8; i++) {
            expect(items[i].id).toBe(i+1)
        }
    })

    test('method: getNestedTree', async ()=>{
        let wrapper = mount(VueTree, {
            propsData: {
                tree: commonTree
            }
        })
        await nextTick()

        let nodes = wrapper.vm.getNestedTree()
        expect(nodes.length).toBe(1)
        
        let root = nodes[0]
        expect(root.id).toBe(1)
        expect(root.title).toBe('ROOT')
        expect(root.hasChild).toBeTruthy()
        expect(root.children.length).toBe(4)

        let child2 = root.children[1]
        expect(child2.id).toBe(3)
        expect(child2.hasChild).toBeTruthy()
        expect(child2.children.length).toBe(3)
    })

    test('method: create', async ()=>{
        let wrapper = mount(VueTree, {
            propsData: {
                tree: commonTree
            }
        })
        await nextTick()


        let node3 = wrapper.vm.getById(3)
        wrapper.vm.create({
            id: 9,
            title: 'create node',
            hasChild: false
        }, node3, 1)

        let created = wrapper.vm.getById(9)
        expect(created.__.parent).toBe(node3)
        expect(node3.children.length).toBe(4)
        expect(created).toBe(wrapper.vm.getByGpos(4))

        let node8 = wrapper.vm.getById(8)
        wrapper.vm.create({
            id: 10,
            title: 'create node',
            hasChild: false
        }, node8)
        created = wrapper.vm.getById(10)
        expect(created.__.parent).toBe(node8)
        expect(node8.hasChild).toBeTruthy()
        expect(node8.children.length).toBe(1)
        expect(node8.children[0]).toBe(created)

        wrapper.vm.create({
            id: 11,
            title: 'create node',
            hasChild: false
        }, null, 0)
        created = wrapper.vm.getById(11)
        expect(created.__.parent).toBeNull()
        expect(wrapper.vm.items.length).toBe(11)
        expect(wrapper.vm.items[0].id).toBe(11)
        expect(wrapper.vm.items[1].id).toBe(1)

        wrapper.vm.create({
            id: 12,
            title: 'create node',
            hasChild: false
        }, null)
        created = wrapper.vm.getById(12)
        expect(created.__.parent).toBeNull()
        expect(wrapper.vm.items.length).toBe(12)
        expect(wrapper.vm.items[11].id).toBe(12)
    })

    test('method: remove', async ()=>{
        let wrapper = mount(VueTree, {
            propsData: {
                tree: commonTree
            }
        })
        await nextTick()

        wrapper.vm.remove(wrapper.vm.getById(5))        
        expect(wrapper.vm.getById(5)).toBeNull()
        expect(wrapper.vm.getById(3).children.length).toBe(2)

        wrapper.vm.remove(wrapper.vm.getById(3))
        expect(wrapper.vm.getById(3)).toBeNull()
        expect(wrapper.vm.items.length).toBe(4)
        
        expect(wrapper.vm.getById(8).__.pos).toBe(2)
    })

    test('method: move', async ()=>{
        let wrapper = mount(VueTree, {
            propsData: {
                tree: commonTree
            }
        })
        await nextTick()

        let node3 = wrapper.vm.getById(3)
        let node5 = wrapper.vm.getById(5)
        let node6 = wrapper.vm.getById(6)

        expect(node3.children[1]).toBe(node5)
        wrapper.vm.move(node5, node3, 3)
        expect(node3.children.length).toBe(3)
        expect(node3.children[2]).toBe(node5)
        expect(node3.children[1]).toBe(node6)
        expect(node5.__.pos).toBe(2)

        wrapper.vm.move(node6, null)
        expect(wrapper.vm.items.length).toBe(8)
        expect(wrapper.vm.items[7].id).toBe(6)
        expect(wrapper.vm.items[7].__.parent).toBeNull()
        expect(wrapper.vm.items[7].__.pos).toBe(1)

        wrapper.vm.move(node6, null, 0)
        expect(wrapper.vm.items.length).toBe(8)
        expect(wrapper.vm.items[0].id).toBe(6)
        expect(wrapper.vm.items[0].__.parent).toBeNull()
        expect(wrapper.vm.items[1].id).toBe(1)
    })

    test('method: sort (fnCompare)', async ()=>{
        let wrapper = mount(VueTree, {
            propsData: {
                tree: commonTree
            }
        })
        await nextTick()

        let node3 = wrapper.vm.getById(3)

        wrapper.vm.sort(node3, false, function(node1, node2) {
            return node2.id - node1.id
        })

        expect(node3.children[0].id).toBe(6)
        expect(node3.children[1].id).toBe(5)
        expect(node3.children[2].id).toBe(4)
    })


    test('method: sort (fnCompare not provided)', async ()=>{
        let wrapper = mount(VueTree, {
            propsData: {
                tree: commonTree
            }
        })
        await nextTick()

        let node3 = wrapper.vm.getById(3)

        node3.children[0].title = 'aaaaa'
        node3.children[1].title = 'ccccc'
        node3.children[2].title = 'bbbbb'

        wrapper.vm.sort(node3, false)

        expect(node3.children[0].id).toBe(4)
        expect(node3.children[1].id).toBe(6)
        expect(node3.children[2].id).toBe(5)
    })


    test('method: sort (recursive = true)', async ()=>{
        let wrapper = mount(VueTree, {
            propsData: {
                tree: commonTree
            }
        })
        await nextTick()

        let node3 = wrapper.vm.getById(3)
        node3.children[0].title = 'aaaaa'
        node3.children[1].title = 'ccccc'
        node3.children[2].title = 'bbbbb'

        let node1 = wrapper.vm.getById(1)
        wrapper.vm.sort(node1, true)

        expect(node3.children[0].id).toBe(4)
        expect(node3.children[1].id).toBe(6)
        expect(node3.children[2].id).toBe(5)
    })

    test('method: sort (node = null)', async ()=>{
        let wrapper = mount(VueTree, {
            propsData: {
                tree: commonTree
            }
        })
        await nextTick()

        let node3 = wrapper.vm.getById(3)
        node3.children[0].title = 'aaaaa'
        node3.children[1].title = 'ccccc'
        node3.children[2].title = 'bbbbb'

        let node1 = wrapper.vm.getById(1)
        wrapper.vm.sort(null, true)

        expect(node3.children[0].id).toBe(4)
        expect(node3.children[1].id).toBe(6)
        expect(node3.children[2].id).toBe(5)
    })
   
    test('methods: search, clearSearchResult', async ()=>{
        let wrapper = mount(VueTree, {
            propsData: {
                tree: commonTree
            }
        })
        await nextTick()

        let nodes  = wrapper.vm.search('ROOT')
        expect(nodes.length).toBe(1)
        expect(nodes[0]).toBe(wrapper.vm.getById(1))
        expect(nodes[0].__.isSearchResult).toBeTruthy()

        nodes = wrapper.vm.search({min:3, max:5}, function(node, keyword){
            return (node.id >= keyword.min && node.id <= keyword.max)
        })
        expect(nodes.length).toBe(3)
        expect(nodes).toContain(wrapper.vm.getById(3))
        expect(nodes).toContain(wrapper.vm.getById(4))
        expect(nodes).toContain(wrapper.vm.getById(5))
        expect(nodes[0].__.isSearchResult).toBeTruthy()
        expect(nodes[1].__.isSearchResult).toBeTruthy()
        expect(nodes[2].__.isSearchResult).toBeTruthy()

        wrapper.vm.clearSearchResult()
        for (let item of wrapper.vm.items) {
            expect(item.__.isSearchResult).toBeFalsy()
        }
    })

    test('methods: edit, quitEdit', async ()=>{
        let wrapper = mount(VueTree, {
            propsData: {
                tree: commonTree
            }
        })
        await nextTick()

        let node6 = wrapper.vm.getById(6)

        wrapper.vm.edit(node6)
        await nextTick()
        expect(node6.__.isEditing).toBeTruthy()

        wrapper.vm.quitEdit(node6)
        await nextTick()
        expect(node6.__.isEditing).toBeFalsy()
    })

    test('method: reload', async ()=>{
        let tree = JSON.parse(JSON.stringify(commonTree))

        let wrapper = mount(VueTree, {
            propsData: {
                tree: tree
            }
        })
        await nextTick()

        expect(wrapper.vm.items.length).toBe(8)
        tree[0]['children'].push({
            id: 100,
            title: 'node100'
        })
        wrapper.vm.reload()
        await nextTick()
        expect(wrapper.vm.items.length).toBe(9)
        expect(wrapper.vm.getById(100)).not.toBeNull()
    })

    test('property: autoReload=true', async ()=>{
        let tree = reactive(JSON.parse(JSON.stringify(commonTree)))

        let wrapper = mount(VueTree, {
            propsData: {
                tree: tree,
                autoReload: true
            }
        })
        await nextTick()

        tree[0].title = 'hello, world!'
        await nextTick()
        await delay(200)
        expect(wrapper.vm.items.length).toBe(8)
        expect(wrapper.vm.items[0].title).toBe('hello, world!')
    })

     test('property: autoReload=false', async ()=>{
        let tree = reactive(JSON.parse(JSON.stringify(commonTree)))

        let wrapper = mount(VueTree, {
            propsData: {
                tree: tree,
                autoReload: false
            }
        })
        await nextTick()

        tree[0].title = 'hello, world!'
        await nextTick()
        await delay(200)
        expect(wrapper.vm.items.length).toBe(8)
        expect(wrapper.vm.items[0].title).toBe('ROOT')
    })
})

describe('select', ()=>{
    let selectTree = [
        {
            id: 1,
            title: 'ROOT',
            hasChild: true,
            children: [
                {
                    id: 2,
                    title: 'child 1',
                    selected: true
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
                            title: 'child 2-2',
                        },
                        {
                            id: 6,
                            title: 'child 2-3'
                        }
                    ]
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


    test('data: items', async ()=>{
        let wrapper = mount(VueTree, {
            propsData: {
                tree: selectTree,
            }
        })
        await nextTick()

        let items = wrapper.vm.items
        for (let i=0; i<8; i++) {
            if (i !== 1) {
                expect(items[i].selected).toBeFalsy()
            } else {
                expect(items[i].selected).toBeTruthy()
            }
        }
    })

    test('methods: getSelected, getSelectedOne, select, deselect', async ()=>{
        let wrapper = mount(VueTree, {
            propsData: {
                tree: selectTree,
                multiSelect: true
            }
        })
        await nextTick()

        let selected = wrapper.vm.getSelected()
        let selectedOne = wrapper.vm.getSelectedOne()
        expect(selected.length).toBe(1)
        expect(selected[0]).toBe(selectedOne)

        let node5 = wrapper.vm.getById(5)
        wrapper.vm.select(node5)
        selected = wrapper.vm.getSelected()
        selectedOne = wrapper.vm.getSelectedOne()
        expect(selected.length).toBe(2)
        expect(selectedOne).toBe(selected[0])

        let node7 = wrapper.vm.getById(7)
        wrapper.vm.select(node7)
        selected = wrapper.vm.getSelected()
        selectedOne = wrapper.vm.getSelectedOne()
        expect(selected.length).toBe(3)
        expect(selectedOne).toBe(selected[0])

        wrapper.vm.select(node7)
        selected = wrapper.vm.getSelected()
        selectedOne = wrapper.vm.getSelectedOne()
        expect(selected.length).toBe(3)
        expect(selectedOne).toBe(selected[0])

        wrapper.vm.deselect(node7)
        selected = wrapper.vm.getSelected()
        selectedOne = wrapper.vm.getSelectedOne()
        expect(selected.length).toBe(2)
        expect(selectedOne).toBe(selected[0])
    })


    test('action: single select', async ()=>{
        let wrapper = mount(VueTree, {
            propsData: {
                tree: selectTree,
                multiSelect: false
            }
        })
        await nextTick()

        let selected = wrapper.vm.getSelected()
        let selectedOne = wrapper.vm.getSelectedOne()
        expect(selected.length).toBe(1)
        expect(selected[0]).toBe(selectedOne)

        await wrapper.find({ref: 'node-5'}).trigger('click')
        selected = wrapper.vm.getSelected()
        selectedOne = wrapper.vm.getSelectedOne()
        expect(selected.length).toBe(1)
        expect(selectedOne).toBe(selected[0])

        await wrapper.find({ref: 'node-6'}).trigger('click')
        selected = wrapper.vm.getSelected()
        selectedOne = wrapper.vm.getSelectedOne()
        expect(selected.length).toBe(1)
        expect(selectedOne).toBe(selected[0])

        await wrapper.find({ref: 'node-6'}).trigger('click')
        selected = wrapper.vm.getSelected()
        selectedOne = wrapper.vm.getSelectedOne()
        expect(selected.length).toBe(1)
        expect(selectedOne).toBe(selected[0])
    })

    test('action: multi select', async ()=>{
        let wrapper = mount(VueTree, {
            propsData: {
                tree: selectTree,
                multiSelect: true
            }
        })
        await nextTick()

        let selected = wrapper.vm.getSelected()
        let selectedOne = wrapper.vm.getSelectedOne()
        expect(selected.length).toBe(1)
        expect(selected[0]).toBe(selectedOne)

        await wrapper.find({ref: 'node-5'}).trigger('click')
        selected = wrapper.vm.getSelected()
        selectedOne = wrapper.vm.getSelectedOne()
        expect(selected.length).toBe(2)
        expect(selectedOne).toBe(selected[0])

        await wrapper.find({ref: 'node-7'}).trigger('click')
        selected = wrapper.vm.getSelected()
        selectedOne = wrapper.vm.getSelectedOne()
        expect(selected.length).toBe(3)
        expect(selectedOne).toBe(selected[0])

        await wrapper.find({ref: 'node-7'}).trigger('click')
        selected = wrapper.vm.getSelected()
        selectedOne = wrapper.vm.getSelectedOne()
        expect(selected.length).toBe(2)
        expect(selectedOne).toBe(selected[0])
    })
})

describe('checkbox (checkboxLinkage = true)', ()=>{
    let checkboxTree = [
        {
            id: 1,
            title: 'ROOT',
            hasChild: true,
            children: [
                {
                    id: 2,
                    title: 'child 1'
                },
                {
                    id: 3,
                    title: 'child 2',
                    hasChild: true,
                    children: [
                        {
                            id: 4,
                            title: 'child 2-1',
                            checkbox: {
                                show: false
                            }
                        },
                        {
                            id: 5,
                            title: 'child 2-2',
                            checkbox: {
                                disable: true
                            }
                        },
                        {
                            id: 6,
                            title: 'child 2-3',
                            checkbox: {
                                state: 'checked'
                            }
                        }
                    ]
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


    test('data: items', async ()=>{
        let wrapper = mount(VueTree, {
            propsData: {
                tree: checkboxTree,
                checkboxLinkage: true,
                defaultAttrs: {
                    checkbox: {
                        show: true,
                        state: 'unchecked',
                        disable: false
                    }
                }
            }
        })
        await nextTick()

        let node1 = wrapper.vm.getById(1)
        expect(node1.checkbox.show).toBeTruthy()
        expect(node1.checkbox.state).toMatch('undetermined')
        expect(node1.checkbox.disable).toBeFalsy()

        let node2 = wrapper.vm.getById(2)
        expect(node2.checkbox.show).toBeTruthy()
        expect(node2.checkbox.state).toMatch('unchecked')
        expect(node2.checkbox.disable).toBeFalsy()

        let node3 = wrapper.vm.getById(3)
        expect(node3.checkbox.show).toBeTruthy()
        expect(node3.checkbox.state).toMatch('undetermined')
        expect(node3.checkbox.disable).toBeFalsy()

        let node4 = wrapper.vm.getById(4)
        expect(node4.checkbox.show).toBeFalsy()

        let node5 = wrapper.vm.getById(5)
        expect(node5.checkbox.show).toBeTruthy()
        expect(node5.checkbox.state).toMatch('unchecked')
        expect(node5.checkbox.disable).toBeTruthy()

        let node6 = wrapper.vm.getById(6)
        expect(node6.checkbox.show).toBeTruthy()
        expect(node6.checkbox.state).toMatch('checked')
        expect(node6.checkbox.disable).toBeFalsy()
    })

    test('methods: getChecked, getUnchecked, getUndetermined', async ()=>{
        let wrapper = mount(VueTree, {
            propsData: {
                tree: checkboxTree,
                checkboxLinkage: true,
                defaultAttrs: {
                    checkbox: {
                        show: true,
                        state: 'unchecked',
                        disable: false
                    }
                }
            }
        })
        await nextTick()

        let checked = wrapper.vm.getChecked()
        expect(checked.length).toBe(1)
        expect(checked[0]).toBe(wrapper.vm.getById(6))

        let unchecked = wrapper.vm.getUnchecked()
        expect(unchecked.length).toBe(4)
        expect(unchecked).toContain(wrapper.vm.getById(2))
        expect(unchecked).toContain(wrapper.vm.getById(5))
        expect(unchecked).toContain(wrapper.vm.getById(7))
        expect(unchecked).toContain(wrapper.vm.getById(8))

        let undetermined = wrapper.vm.getUndetermined()
        expect(undetermined.length).toBe(2)
        expect(undetermined).toContain(wrapper.vm.getById(1))
        expect(undetermined).toContain(wrapper.vm.getById(3))
    })

    test('methods: check, uncheck (check/uncheck a disabled node)', async ()=>{
        let wrapper = mount(VueTree, {
            propsData: {
                tree: checkboxTree,
                checkboxLinkage: true,
                defaultAttrs: {
                    checkbox: {
                        show: true,
                        state: 'unchecked',
                        disable: false
                    }
                }
            }
        })
        await nextTick()

        let node5 = wrapper.vm.getById(5)
        wrapper.vm.check(node5)
        expect(node5.checkbox.state).toMatch('unchecked')

        wrapper.vm.setCheckboxState(node5, 'checked')
        wrapper.vm.uncheck(node5)
        expect(node5.checkbox.state).toMatch('checked')
    })

    test('methods: check, uncheck (check/uncheck a leaf node)', async ()=>{
        let wrapper = mount(VueTree, {
            propsData: {
                tree: checkboxTree,
                checkboxLinkage: true,
                defaultAttrs: {
                    checkbox: {
                        show: true,
                        state: 'unchecked',
                        disable: false
                    }
                }
            }
        })
        await nextTick()

        let node6 = wrapper.vm.getById(6)
        wrapper.vm.uncheck(node6)
        expect(node6.__.parent.checkbox.state).toMatch('unchecked')
        expect(node6.__.parent.__.parent.checkbox.state).toMatch('unchecked')

        wrapper.vm.check(node6)
        expect(node6.__.parent.checkbox.state).toMatch('undetermined')
        expect(node6.__.parent.__.parent.checkbox.state).toMatch('undetermined')
    })

    test('methods: check, uncheck (check/uncheck the root node, no disabled checkbox)', async ()=>{
        let wrapper = mount(VueTree, {
            propsData: {
                tree: checkboxTree,
                checkboxLinkage: true,
                defaultAttrs: {
                    checkbox: {
                        show: true,
                        state: 'unchecked',
                        disable: false
                    }
                }
            }
        })
        await nextTick()
        wrapper.vm.setAttr(wrapper.vm.getById(5), 'checkbox', 'disable', false)

        wrapper.vm.uncheck(wrapper.vm.getById(6))
        for (let i=0; i<8; i++) {
            let item = wrapper.vm.items[i]
            if (item.checkbox.show === true) {
                expect(item.checkbox.state).toMatch('unchecked')
            }
        }

        let root = wrapper.vm.getById(1)
        wrapper.vm.check(root)
        for (let i=0; i<8; i++) {
            let item = wrapper.vm.items[i]
            if (item.checkbox.show === true && item.checkbox.disable === false) {
                expect(item.checkbox.state).toMatch('checked')
            }
        }

        wrapper.vm.uncheck(root)
        for (let i=0; i<8; i++) {
            let item = wrapper.vm.items[i]
            if (item.checkbox.show === true && item.checkbox.disable === false) {
                expect(item.checkbox.state).toMatch('unchecked')
            }
        }
    })
})

describe('checkbox (checkboxLinkage = false)', ()=>{
    let checkboxTree = [
        {
            id: 1,
            title: 'ROOT',
            hasChild: true,
            children: [
                {
                    id: 2,
                    title: 'child 1'
                },
                {
                    id: 3,
                    title: 'child 2',
                    hasChild: true,
                    children: [
                        {
                            id: 4,
                            title: 'child 2-1',
                            checkbox: {
                                show: false
                            }
                        },
                        {
                            id: 5,
                            title: 'child 2-2',
                            checkbox: {
                                disable: true
                            }
                        },
                        {
                            id: 6,
                            title: 'child 2-3',
                            checkbox: {
                                state: 'checked'
                            }
                        }
                    ]
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


    test('data: items', async ()=>{
        let wrapper = mount(VueTree, {
            propsData: {
                tree: checkboxTree,
                checkboxLinkage: false,
                defaultAttrs: {
                    checkbox: {
                        show: true,
                        state: 'unchecked',
                        disable: false
                    }
                }
            }
        })
        await nextTick()

        let node1 = wrapper.vm.getById(1)
        expect(node1.checkbox.show).toBeTruthy()
        expect(node1.checkbox.state).toMatch('unchecked')
        expect(node1.checkbox.disable).toBeFalsy()

        let node2 = wrapper.vm.getById(2)
        expect(node2.checkbox.show).toBeTruthy()
        expect(node2.checkbox.state).toMatch('unchecked')
        expect(node2.checkbox.disable).toBeFalsy()

        let node3 = wrapper.vm.getById(3)
        expect(node3.checkbox.show).toBeTruthy()
        expect(node3.checkbox.state).toMatch('unchecked')
        expect(node3.checkbox.disable).toBeFalsy()

        let node4 = wrapper.vm.getById(4)
        expect(node4.checkbox.show).toBeFalsy()

        let node5 = wrapper.vm.getById(5)
        expect(node5.checkbox.show).toBeTruthy()
        expect(node5.checkbox.state).toMatch('unchecked')
        expect(node5.checkbox.disable).toBeTruthy()

        let node6 = wrapper.vm.getById(6)
        expect(node6.checkbox.show).toBeTruthy()
        expect(node6.checkbox.state).toMatch('checked')
        expect(node6.checkbox.disable).toBeFalsy()
    })

    test('methods: getChecked, getUnchecked, getUndetermined', async ()=>{
        let wrapper = mount(VueTree, {
            propsData: {
                tree: checkboxTree,
                checkboxLinkage: false,
                defaultAttrs: {
                    checkbox: {
                        show: true,
                        state: 'unchecked',
                        disable: false
                    }
                }
            }
        })
        await nextTick()

        let checked = wrapper.vm.getChecked()
        expect(checked.length).toBe(1)
        expect(checked[0]).toBe(wrapper.vm.getById(6))

        let unchecked = wrapper.vm.getUnchecked()
        expect(unchecked.length).toBe(6)
        expect(unchecked).toContain(wrapper.vm.getById(1))
        expect(unchecked).toContain(wrapper.vm.getById(2))
        expect(unchecked).toContain(wrapper.vm.getById(3))
        expect(unchecked).toContain(wrapper.vm.getById(5))
        expect(unchecked).toContain(wrapper.vm.getById(7))
        expect(unchecked).toContain(wrapper.vm.getById(8))

        let undetermined = wrapper.vm.getUndetermined()
        expect(undetermined.length).toBe(0)
    })

    test('methods: check, uncheck (check/uncheck a disabled node)', async ()=>{
        let wrapper = mount(VueTree, {
            propsData: {
                tree: checkboxTree,
                checkboxLinkage: false,
                defaultAttrs: {
                    checkbox: {
                        show: true,
                        state: 'unchecked',
                        disable: false
                    }
                }
            }
        })
        await nextTick()

        let node5 = wrapper.vm.getById(5)
        wrapper.vm.check(node5)
        expect(node5.checkbox.state).toMatch('unchecked')

        wrapper.vm.setCheckboxState(node5, 'checked')
        wrapper.vm.uncheck(node5)
        expect(node5.checkbox.state).toMatch('checked')
    })

    test('methods: check, uncheck (check/uncheck a leaf node)', async ()=>{
        let wrapper = mount(VueTree, {
            propsData: {
                tree: checkboxTree,
                checkboxLinkage: false,
                defaultAttrs: {
                    checkbox: {
                        show: true,
                        state: 'unchecked',
                        disable: false
                    }
                }
            }
        })
        await nextTick()

        let node6 = wrapper.vm.getById(6)
        wrapper.vm.uncheck(node6)
        expect(node6.__.parent.checkbox.state).toMatch('unchecked')
        expect(node6.__.parent.__.parent.checkbox.state).toMatch('unchecked')

        wrapper.vm.check(node6)
        expect(node6.__.parent.checkbox.state).toMatch('unchecked')
        expect(node6.__.parent.__.parent.checkbox.state).toMatch('unchecked')
    })

    test('methods: check, uncheck (check/uncheck the root node, no disabled checkbox)', async ()=>{
        let wrapper = mount(VueTree, {
            propsData: {
                tree: checkboxTree,
                checkboxLinkage: false,
                defaultAttrs: {
                    checkbox: {
                        show: true,
                        state: 'unchecked',
                        disable: false
                    }
                }
            }
        })
        await nextTick()
        wrapper.vm.setAttr(wrapper.vm.getById(5), 'checkbox', 'disable', false)

        wrapper.vm.uncheck(wrapper.vm.getById(6))
        for (let i=0; i<8; i++) {
            let item = wrapper.vm.items[i]
            if (item.checkbox.show === true) {
                expect(item.checkbox.state).toMatch('unchecked')
            }
        }

        let root = wrapper.vm.getById(1)
        wrapper.vm.check(root)
        for (let i=0; i<8; i++) {
            let item = wrapper.vm.items[i]
            if (item.id === 1) {
                expect(item.checkbox.state).toMatch('checked')
            } else {
                expect(item.checkbox.state).toMatch('unchecked')
            }
        }

        wrapper.vm.uncheck(root)
        for (let i=0; i<8; i++) {
            let item = wrapper.vm.items[i]
            if (item.id === 1) {
                expect(item.checkbox.state).toMatch('unchecked')
            } else {
                expect(item.checkbox.state).toMatch('checked')
            }
        }
    })

    test('methods: toggleCheckboxState', async ()=>{
        let wrapper = mount(VueTree, {
            propsData: {
                tree: checkboxTree,
                checkboxLinkage: false,
                defaultAttrs: {
                    checkbox: {
                        show: true,
                        state: 'unchecked',
                        disable: false
                    }
                }
            }
        })
        await nextTick()
        wrapper.vm.setAttr(wrapper.vm.getById(5), 'checkbox', 'disable', false)

        let node1 = wrapper.vm.getById(1)
        wrapper.vm.toggleCheckbox(node1)
        expect(node1.checkbox.state).toMatch('checked')

        wrapper.vm.toggleCheckbox(node1)
        expect(node1.checkbox.state).toMatch('unchecked')
    })
})


describe('directory', ()=>{
    let directoryTree = [
        {
            id: 1,
            title: 'ROOT',
            hasChild: true,
            children: [
                {
                    id: 2,
                    title: 'child 1'
                },
                {
                    id: 3,
                    title: 'child 2',
                    directoryState: 'collapsed',
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
                    ]
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

    test('data: items', async ()=>{
        let wrapper = mount(VueTree, {
            propsData: {
                tree: directoryTree,
            }
        })
        await nextTick()

        expect(wrapper.vm.getById(1).directoryState).toMatch('expanded')
        expect(wrapper.vm.getById(3).directoryState).toMatch('collapsed')

        expect(wrapper.vm.getById(1).__.isVisible).toBeTruthy()
        expect(wrapper.vm.getById(2).__.isVisible).toBeTruthy()
        expect(wrapper.vm.getById(3).__.isVisible).toBeTruthy()
        expect(wrapper.vm.getById(4).__.isVisible).toBeFalsy()
        expect(wrapper.vm.getById(5).__.isVisible).toBeFalsy()
        expect(wrapper.vm.getById(6).__.isVisible).toBeFalsy()
        expect(wrapper.vm.getById(7).__.isVisible).toBeTruthy()
        expect(wrapper.vm.getById(8).__.isVisible).toBeTruthy()
    })

    test('method: expand', async ()=>{
        let wrapper = mount(VueTree, {
            propsData: {
                tree: directoryTree,
            }
        })
        await nextTick()

        wrapper.vm.expand(wrapper.vm.getById(3))
        expect(wrapper.vm.getById(3).directoryState).toMatch('expanded')
        for (let item of wrapper.vm.items) {
            expect(item.__.isVisible).toBeTruthy()
        }
    })

    test('method: collapse', async ()=>{
        let wrapper = mount(VueTree, {
            propsData: {
                tree: directoryTree,
            }
        })
        await nextTick()

        wrapper.vm.collapse(wrapper.vm.getById(1))
        expect(wrapper.vm.getById(1).directoryState).toMatch('collapsed')
        for (let item of wrapper.vm.items) {
            if (item.id === 1) {
                expect(item.__.isVisible).toBeTruthy()
            } else {
                expect(item.__.isVisible).toBeFalsy()
            }
        }
    })

    test('method: toggleDirectoryState', async ()=>{
        let wrapper = mount(VueTree, {
            propsData: {
                tree: directoryTree,
            }
        })
        await nextTick()

        let node1 = wrapper.vm.getById(1)
        expect(node1.directoryState).toMatch('expanded')

        wrapper.vm.toggleDirectoryState(node1)
        expect(node1.directoryState).toMatch('collapsed')

        wrapper.vm.toggleDirectoryState(node1)
        expect(node1.directoryState).toMatch('expanded')
    })

    test('prop: fnLoadData (return an array)', async ()=>{
        let fnLoadData = function() {
            return [
                {
                    title: 'hello',
                },
                {
                    title: 'world',
                }
            ]
        }
        let wrapper = mount(VueTree, {
            propsData: {
                tree: directoryTree,
                fnLoadData: fnLoadData
            }
        })
        await nextTick()

        let node3 = wrapper.vm.getById(3)
        wrapper.vm.expand(node3)
        expect(node3.directoryState).toMatch('expanded')
        for (let item of wrapper.vm.items) {
            expect(item.__.isVisible).toBeTruthy()
        }
        expect(node3.children.length).toBe(2)
        expect(node3.children[1].title).toMatch('world')
    })

    test('prop: fnLoadData (return a promise)', async ()=>{
        let fnLoadData = function() {
            let promise = new Promise(function(resolve) {
                resolve([
                    {
                        title: 'hello',
                    },
                    {
                        title: 'world',
                    }
                ])
            })

            return promise
        }
        let wrapper = mount(VueTree, {
            propsData: {
                tree: directoryTree,
                fnLoadData: fnLoadData
            }
        })
        await nextTick()

        let node3 = wrapper.vm.getById(3)
        wrapper.vm.expand(node3)
        await nextTick()

        expect(node3.directoryState).toMatch('expanded')
        for (let item of wrapper.vm.items) {
            expect(item.__.isVisible).toBeTruthy()
        }
        expect(node3.children.length).toBe(2)
        expect(node3.children[1].title).toMatch('world')
    })

    test('method: fnBeforeExpand', async ()=>{
        let wrapper = mount(VueTree, {
            propsData: {
                tree: directoryTree,
                defaultAttrs: {
                    directoryState: 'collapsed'
                },
                fnBeforeExpand: function() {
                    return false
                }
            }
        })
        await nextTick()

        expect(wrapper.vm.getById(1).directoryState).toMatch('collapsed')
        wrapper.vm.expand(wrapper.vm.getById(1))
        expect(wrapper.vm.getById(1).directoryState).toMatch('collapsed')
        for (let item of wrapper.vm.items) {
            if (item.id === 1) {
                expect(item.__.isVisible).toBeTruthy()
            } else {
                expect(item.__.isVisible).toBeFalsy()
            }
        }
    })

    test('method: fnBeforeCollapse', async ()=>{
        let wrapper = mount(VueTree, {
            propsData: {
                tree: directoryTree,
                defaultAttrs: {
                    directoryState: 'expanded'
                },
                fnBeforeCollapse: function() {
                    return false
                }
            }
        })
        await nextTick()

        expect(wrapper.vm.getById(1).directoryState).toMatch('expanded')
        wrapper.vm.collapse(wrapper.vm.getById(1))
        expect(wrapper.vm.getById(1).directoryState).toMatch('expanded')
        for (let item of wrapper.vm.items) {
            if (item.__.parent !== null && item.__.parent.id === 3) {
                expect(item.__.isVisible).toBeFalsy()
            } else {
                expect(item.__.isVisible).toBeTruthy()
            }
        }
    })
})

describe('drag and drop', ()=>{
    let dndTree = [
        {
            id: 1,
            title: 'ROOT',
            hasChild: true,
            children: [
                {
                    id: 2,
                    title: 'child 1'
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
                    ]
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

    test('data: items', async ()=>{
        let wrapper = mount(VueTree, {
            propsData: {
                tree: dndTree
            }
        })
        await nextTick()

        let items = wrapper.vm.items

        expect(items.length).toBe(8)
        for (let i=0; i<8; i++) {
            let item = items[i]
            expect(item.__.dragOverArea).toBeNull()
            expect(item.__.isDroppable).toBeTruthy()
        }
    })

    test('event: dragstart, dragover, dragend', async ()=>{
        let wrapper = mount(VueTree, {
            propsData: {
                tree: dndTree
            }
        })
        await nextTick()

        let node6 = wrapper.vm.getById(6)
        expect(wrapper.vm.dragAndDrop.dragNode).toBeNull()
        await wrapper.find({ref: 'node-' + node6.id}).trigger('dragstart', {
            dataTransfer: {
                setData: function(){},
                setDragImage: function(){},
                dropEffect: null
            }
        })
        expect(wrapper.vm.dragAndDrop.dragNode).toBe(node6)

        await wrapper.find({ref: 'node-' + node6.id}).trigger('dragover', {
            pageX: 100,
            pageY: 50
        })
        expect(wrapper.vm.dragAndDrop.overNode).toBe(node6)
        expect(wrapper.vm.dragAndDrop.isDroppable).toBeFalsy()

        let node4 = wrapper.vm.getById(4)
        await wrapper.find({ref: 'node-' + node4.id}).trigger('dragover', {
            pageX: 100,
            pageY: 50
        })
        expect(wrapper.vm.dragAndDrop.overNode).toBe(node4)
        expect(wrapper.vm.dragAndDrop.isDroppable).toBeTruthy()

        await wrapper.find({ref: 'node-' + node6.id}).trigger('dragend')
        expect(wrapper.vm.dragAndDrop.dragNode).toBeNull()
    })
})

describe('no root node', ()=>{
    let commonTree = [
        {
            id: 1,
            title: 'node 1',
            hasChild: true,
            children: [
                {
                    id: 2,
                    title: 'child 1'
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
                    ]
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
        },
        {
            id: 9,
            title: 'node 2',
            hasChild: false
        },
        {
            id: 10,
            title: 'node 3',
            hasChild: false
        },
        {
            id: 11,
            title: 'node 4',
            hasChild: false
        }
    ]

    test('method: create', async ()=>{
        let wrapper = mount(VueTree, {
            propsData: {
                tree: commonTree
            }
        })
        await nextTick()

        wrapper.vm.create({
            id: 100,
            title: 'create node',
            hasChild: false
        }, null)
        await nextTick()

        expect(wrapper.vm.items.length).toBe(12)
        expect(wrapper.vm.nodes.length).toBe(5)
        expect(wrapper.vm.nodes[4].id).toBe(100)
    })

    test('method: remove', async ()=>{
        let wrapper = mount(VueTree, {
            propsData: {
                tree: commonTree
            }
        })
        await nextTick()

        let node11 = wrapper.vm.getById(11)
        wrapper.vm.remove(node11)
        await nextTick()

        expect(wrapper.vm.items.length).toBe(10)
        expect(wrapper.vm.nodes.length).toBe(3)
        expect(wrapper.vm.nodes[2].id).toBe(10)
    })

    test('method: move', async ()=>{
        let wrapper = mount(VueTree, {
            propsData: {
                tree: commonTree
            }
        })
        await nextTick()

        let node5 = wrapper.vm.getById(5)
        wrapper.vm.move(node5, null)
        await nextTick()

        expect(wrapper.vm.items.length).toBe(11)
        expect(wrapper.vm.items[10].id).toBe(5)
        expect(wrapper.vm.nodes[4].id).toBe(5)
    })

    test('method: sort', async ()=>{
        let wrapper = mount(VueTree, {
            propsData: {
                tree: commonTree
            }
        })
        await nextTick()

        wrapper.vm.sort(null, false, function(node1, node2) {
            return node2.id - node1.id
        })
        await nextTick()

        expect(wrapper.vm.nodes[0].id).toBe(11)
        expect(wrapper.vm.nodes[1].id).toBe(10)
        expect(wrapper.vm.nodes[2].id).toBe(9)
        expect(wrapper.vm.nodes[3].id).toBe(1)
    })


})
