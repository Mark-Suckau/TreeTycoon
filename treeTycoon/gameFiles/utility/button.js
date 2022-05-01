class Button {
  constructor(
    x,
    y,
    width,
    height,
    isHidden,
    text = '',
    textColor = 'white',
    defaultBackgroundColor = 'green',
    mouseOverBackgroundColor = 'darkgreen',
    actionLMB = null,
    actionMMB = null,
    actionRMB = null,
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

    this.defaultBackgroundColor = defaultBackgroundColor;
    this.mouseOverBackgroundColor = mouseOverBackgroundColor;
    this.activeBackgroundColor = defaultBackgroundColor;

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
    if (
      mouseX > thisVisualX &&
      mouseX < thisVisualX + thisVisualWidth &&
      mouseY > thisVisualY &&
      mouseY < thisVisualY + thisVisualHeight
    ) {
      this.activeBackgroundColor = this.mouseOverBackgroundColor;
      this.isMouseOver = true;
      return true;
    } else {
      this.activeBackgroundColor = this.defaultBackgroundColor;
      this.isMouseOver = false;
      return false;
    }
  }

  copyRectDimensions(x, y, width, height) {
    // used to follow a given object and match size to allow for buttons to be overlayed onto normal game objects to add clickable functionality
    this.pos.x = x;
    this.pos.y = y;
    this.width = width;
    this.height = height;
  }
}
