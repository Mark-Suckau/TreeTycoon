class Button {
  constructor(
    x,
    y,
    width,
    height,
    isHidden,
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
    this.actionLMB = actionLMB;
    this.actionRMB = actionRMB;
    this.actionMMB = actionMMB;

    // if button is in a contextMenu, initial x,y is irrelevant because it will be changed by the contextMenu once the contextMenu is shown
    this.pos = new Vector(x, y);
    this.width = width;
    this.height = height;

    this.text = text;
    this.textColor = textColor;
    this.textSize = textSize;
    this.textSizeUnit = textSizeUnit;
    this.textFontFamily = textFontFamily;

    this.defaultColor = defaultColor;
    this.mouseOverColor = mouseOverColor;
    this.activeColor = defaultColor;

    this.outlineColor = outlineColor;
    this.outlineWidth = outlineWidth;

    this.isOutlinedInside = isOutlinedInside; // if outline should be inside main rect
    this.isOutlinedOutside = isOutlinedOutside; // if outline should be outside main rect
    this.isHidden = isHidden;
    this.isMouseOver = false;
  }

  show() {
    this.isHidden = false;
  }

  hide() {
    this.isHidden = true;
  }

  onMouseDown(event) {
    /*
    'event' parameter contains 'mousedown' event
    buttons:
    0: LMB
    1: MMB
    2: RMB
    */
    if (this.isMouseOver && !this.isHidden) {
      switch (event.button) {
        case 0:
          if (this.actionLMB) {
            this.actionLMB();
          }
          break;
        case 1:
          if (this.actionMMB) {
            this.actionMMB();
          }
          break;
        case 2:
          if (this.actionRMB) {
            this.actionRMB();
          }
      }
    }
  }

  checkMouseOver(mouseX, mouseY, thisVisualX, thisVisualY, thisVisualWidth, thisVisualHeight) {
    // method needs to be inside update to constantly check if is mouse over
    // NOTE: need to use visual values that have been translated to account for camera movement, zoom instead of absolute ones
    if (this.isHidden) {
      this.isMouseOver = false;
      return false;
    }
    if (
      mouseX > thisVisualX &&
      mouseX < thisVisualX + thisVisualWidth &&
      mouseY > thisVisualY &&
      mouseY < thisVisualY + thisVisualHeight
    ) {
      this.isMouseOver = true;
      return true;
    } else {
      this.isMouseOver = false;
      return false;
    }
  }

  confirmMouseOver(isMouseOver) {
    // used to resolve conflicts between multiple buttons having mouseOver at same time
    this.isMouseOver = isMouseOver;
    if (this.isMouseOver) {
      this.activeColor = this.mouseOverColor;
    } else {
      this.activeColor = this.defaultColor;
    }
  }
}
