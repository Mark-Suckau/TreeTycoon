class ContextMenuButton extends Button {
  constructor(
    x,
    y,
    width,
    height,
    isHidden,
    contextMenu,
    nestedContextMenus,
    actionLMB = null,
    actionMMB = null,
    actionRMB = null,
    defaultColor = 'darkgreen',
    mouseOverColor = 'green',
    isOutlinedInside = false, // NOTE: only one or the other should be set as true, if both are true, outlineInside will be used
    isOutlinedOutside = false,
    outlineColor = '',
    outlineWidth = '',
    text = '',
    textColor = '',
    textSize = 10,
    textSizeUnit = 'px',
    textFontFamily = 'sans-serif',
  ) {
    super(
      x,
      y,
      width,
      height,
      isHidden,
      actionLMB,
      actionMMB,
      actionRMB,
      defaultColor,
      mouseOverColor,
      isOutlinedInside, // NOTE: only one or the other should be set as true, if both are true, outlineInside will be used
      isOutlinedOutside,
      outlineColor,
      outlineWidth,
      text,
      textColor,
      textSize,
      textSizeUnit,
      textFontFamily,
    );
    this.contextMenu = contextMenu;
    this.nestedContextMenus = nestedContextMenus; // array of contextMenus that this button can open
    // variable used by contextMenus to keep track of buttons contained inside to allow for easier deletion
    this.indexInContextMenu = -1; // starts as -1 since that is not a valid number to avoid accidental deletion of wrong index
  }
}
