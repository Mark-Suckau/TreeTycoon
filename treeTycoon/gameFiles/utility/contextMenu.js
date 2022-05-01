class ContextMenu {
  constructor(buttonWidth, buttonHeight, isHidden, buttonList = []) {
    // contextMenu can later be adapted into an inventory display as well to have the items be clickable
    this.pos = new Vector(0, 0); // will be updated to correct position when displayed with show()

    this.buttonWidth = buttonWidth;
    this.buttonHeight = buttonHeight;

    this.isHidden = isHidden;
    this.isMouseOver = false;
    this.buttons = buttonList; // array containing list of buttons / information which is to be displayed

    // ensuring all buttons are either hidden or shown same with contextMenu
    for (let button of this.buttons) {
      button.isHidden = this.isHidden;
    }

    this.width = buttonWidth;
    this.height = buttonHeight * this.buttons.length;
  }

  addButton(button) {
    this.buttons.push(button);
  }

  removeButton(index) {
    this.buttons.splice(index, 1);
  }

  show(x, y) {
    // x, y for starting position of top left corner of the context menu (ex. mouse x, y when right clicking)
    this.pos.x = x;
    this.pos.y = y;
    for (let i = 0; i < this.buttons.length; i++) {
      this.buttons[i].pos.x = this.pos.x;
      this.buttons[i].pos.y = this.pos.y + i * this.buttonHeight;
      this.buttons[i].width = this.buttonWidth;
      this.buttons[i].show();
    }
    this.isHidden = false;
  }

  hide() {
    for (let button of this.buttons) {
      button.hide();
    }
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
    if (!this.isMouseOver && !this.isHidden) {
      if (event.button == 0 || event.button == 1 || event.button == 2) {
        this.hide();
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
}
