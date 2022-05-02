# TreeTycoon

## Comment Tags

- // TEMP : temporary addition will be changed in the future
- // EXPERIMENTAL : untested feature could be causing problems, in case of bugs first attempt commenting out this area
- // NOTE : for potential future optimizations and cleaner code or potential bugs if not used correctly

## Clickables

Clickables are: button.js, contextMenu.js

All clickables must have the following:

- onMouseDown() _method_
- checkMouseOver() _method_
- isHidden _boolean_
- isMouseOver _boolean_
- hide() _method_
- show() _method_
- indexInContextMenu _interger_ (contextMenus need to contain an 'indexInContextMenu' interger since they can be nested inside of other contextMenus)
- nestedContextMenus _array_ (buttons need to contain a 'nestedContextMenus' array too, to allow the contextMenu the button is inside to add the list of contextMenus openable by this button to its own nestedContextMenus array)
