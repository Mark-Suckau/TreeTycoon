class Button {
  constructor(
    x,
    y,
    width,
    height,
    isHidden,
    text = 'untitled',
    textColor = 'white',
    defaultBackgroundColor = 'green',
    mouseOverBackgroundColor = 'darkgreen',
    actionRMB = null,
    actionLMB = null,
    actionMMB = null,
  ) {
    this.actionLMB = actionLMB;
    this.actionRMB = actionRMB;
    this.actionMMB = actionMMB;

    this.indexClickablesArray = null; // keeps track of its position inside of 'clickables' array stored by Game Class Instance to allow to update isHidden value

    this.pos = new Vector(x, y);
    this.width = width;
    this.height = height;

    this.text = text;
    this.textColor = textColor;

    this.backgroundColor = defaultBackgroundColor;
    this.mouseOverBackgroundColor = mouseOverBackgroundColor;

    this.activeBackgroundColor = defaultBackgroundColor;

    this.isHidden = isHidden;
    this.isMouseOver = false;
  }

  toggleHidden() {
    this.isHidden = !this.isHidden;
  }

  onMouseDown(event) {
    /*
    buttons:
    0: LMB
    1: MMB
    2: RMB
    */

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

  checkMouseOver(mouseX, mouseY) {
    // method needs to be inside update to constantly check if is mouse over
    if (
      mouseX > this.pos.x &&
      mouseX < this.pos.x + this.width &&
      mouseY > this.pos.y &&
      mouseY < this.pos.y + this.height
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
