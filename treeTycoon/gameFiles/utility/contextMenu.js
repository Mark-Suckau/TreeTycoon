class ContextMenu {
  constructor(buttonWidth, buttonHeight) {
    // contextMenu can later be adapted into an inventory display as well to have the items be clickable
    this.pos = new Vector(0, 0); // will be updated to correct position when displayed with show()

    this.buttonWidth = buttonWidth;
    this.buttonHeight = buttonHeight;

    this.isHidden = true; // must start as hidden because show() must be called in order to properly show and keep track of everything
    this.isMouseOver = false;
    this.isChild = false;

    this.buttons = []; // array containing list of buttons / information which is to be displayed
    this.nestedContextMenus = []; // all contextMenus that are nested within this one (meaning buttons that are contained in this contextMenu can open new contextMenus)

    this.width = 0; // start with 0 width, height since no buttons are added
    this.height = 0; // width, height is updated in addButton() to account for new buttons

    // keeps track starting at which frame this contextMenu was shown
    // to allow for finding the most recently opened contextMenu
    this.shownSinceFrame = -1;

    // variable used by contextMenus incase this contextMenu is nested inside another
    // to keep track of this contextMenu's index inside the parent contextMenu's nestedContextMenus array for easier deletion
    this.indexInContextMenu = -1; // starts as -1 since that is not a valid number to avoid accidental deletion of wrong index
  }

  addButton(button) {
    // ensuring all buttons are immediately ready to be displayed which allows for buttons
    // to be added while contextMenu is displayed without needing to refresh by doing hide() then show()
    button.pos.x = this.pos.x;
    button.pos.y = this.pos.y + this.buttons.length * this.buttonHeight;
    button.width = this.buttonWidth;

    if (button.isHidden && !this.isHidden) {
      button.show();
    } else if (!button.isHidden && this.isHidden) {
      button.hide();
    }

    if (button.nestedContextMenus) {
      for (let nestedContextMenu of button.nestedContextMenus) {
        this.addNestedContextMenu(nestedContextMenu);
      }
    }
    this.buttons.push(button);
    button.indexInContextMenu = this.buttons.length - 1;

    this.width = this.buttonWidth;
    this.height = this.buttonHeight * this.buttons.length;

    if (this.isChild) {
      this.parent.childContextMenuAddButton(button);
    }
  }

  childContextMenuAddButton(button) {
    // function called by child contextMenu if a button is added to that child contextmenu
    // to allow for this context menu(parent) to update it's nestedContextMenus incase that button adds any new contextMenus
    // by each child calling it's parent it updates the entire hierarchy
    if (button.nestedContextMenus) {
      for (let nestedContextMenu of button.nestedContextMenus) {
        this.addNestedContextMenu(nestedContextMenu);
      }
    }
    if (this.isChild) {
      this.parent.childContextMenuAddButton(button);
    }
  }
  // recursive function to check all contextMenus above this one for more nested context menus
  addNestedContextMenu(contextMenu) {
    // ensuring all buttons are either hidden or shown same with contextMenu
    contextMenu.isHidden = this.isHidden;
    contextMenu.parent = this; // NOTE: potentially bad practice for child to have access to parent
    contextMenu.isNested = true;

    this.nestedContextMenus.push(contextMenu);
    contextMenu.indexInContextMenu = this.nestedContextMenus.length - 1;

    // going through all buttons of all contextMenus nested to check for more contextMenus (recursive)
    if (!contextMenu.buttons) {
      console.error('WARNING: supplied contextMenu object has no buttons');
      return;
    }
    for (let button of contextMenu.buttons) {
      if (button.nestedContextMenus) {
        this.addNestedContextMenu(button.nestedContextMenus);
      }
    }
  }

  removeButton(button) {
    this.buttons.splice(button.indexInContextMenu, 1);
    button.indexInContextMenu = -1; // to avoid accidentally deleting more
  }

  removeNestedContextMenu(contextMenu) {
    this.nestedContextMenu.splice(contextMenu.indexInContextMenu, 1);
    contextMenu.indexInContextMenu = -1; // to avoid accidentally deleting more
  }

  show(x, y, frameCount) {
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
    this.shownSinceFrame = frameCount;
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

    // if mouse is clicking in a contextMenu that has been opened by a button contained in this contextMenu dont close this contextMenu
    let isMouseOverNestedContextMenu = false;
    for (let contextMenu of this.nestedContextMenus) {
      if (contextMenu.isMouseOver) {
        isMouseOverNestedContextMenu = true;
      }
    }
    if (!this.isMouseOver && !this.isHidden && !isMouseOverNestedContextMenu) {
      if (event.button == 0 || event.button == 1 || event.button == 2) {
        this.hide();
      }
    }

    if (this.isMouseOver) {
      for (let button of this.buttons) {
        button.onMouseDown(event);
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
    // used to resolve conflicts between multiple contextMenus having mouseOver at same time
    this.isMouseOver = isMouseOver;

    if (this.isMouseOver) {
      this.activeBackgroundColor = this.mouseOverBackgroundColor;
    } else {
      this.activeBackgroundColor = this.defaultBackgroundColor;
    }
  }
}
