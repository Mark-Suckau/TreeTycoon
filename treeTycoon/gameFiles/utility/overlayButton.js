class OverlayButton extends Button {
  constructor(
    x,
    y,
    width,
    height,
    isHidden,
    overlayedObj,
    actionLMB = null,
    actionMMB = null,
    actionRMB = null,
    isOutlinedInside = false, // NOTE: only one or the other should be set as true, if both are true, outlineInside will be used
    isOutlinedOutside = false,
    outlineColor = '',
    outlineWidth = '',
    text = '',
    textColor = '',
    textSize = 10,
    textSizeUnit = 'px',
    textFontFamily = 'sans-serif',
    defaultColor = 'rgba(0, 0, 0, 0)',
    mouseOverColor = 'rgba(0, 200, 0, 0.4)',
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
    this.overlayedObj = overlayedObj; // object instance that is being overlayed by this button (exclusively applies to overlay buttons and will remain NULL for non-overlay buttons)
  }

  matchRect(x, y, width, height, isHidden) {
    // used to follow a given object and match size to allow for buttons to be overlayed onto normal game objects to add clickable functionality
    this.pos.x = x;
    this.pos.y = y;
    this.width = width;
    this.height = height;
    if (isHidden && !this.isHidden) {
      this.hide();
    } else if (!isHidden && this.isHidden) {
      this.show();
    }
  }
}
