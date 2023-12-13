3.2.1
- fixed:
	- the node.style.titleMaxWidth property doesn't work if it is negative and its unit is not '%'.

3.2.0
- fixed:
	- if the user dragged a node, moved it from tree A to tree B, and then moved it out of tree B, there would be an arrow on tree B.
	- if the parent container had a 'transform: translate3d' property, the arrow and ghost image would not work normally, and they would be displayed at the wrong position.

3.1.0
- changed:
    - improve the performance of drag and drop operations.

3.0.0
- added:
	- touch support for drag and drop.
	- the isTheTouchOperationFromTheTree method.
	- the getDragFrom method.
	- the fnCustomClasses property.
- fixed:
	- the previously selected node will be deselected if the user clicks a node and then the fnBeforeSelect
	function returns false.
  - the input box's width didn't fit its content well.
  - the reload() method caused an animation playing.
	- a node was able to be dragged while the user was editing its title.
	- reverted the performance optimization that might lead to the fnAfterCalculate property not working in 2.0.0.
	- when the user dropped a node from another tree, two drop events were emitted.
- security:
	- upgraded some dependencies.

2.0.0
- changed:
	- optimized the expand/collapse performance.

1.0.0
- the first stable version.