class ContextMenu {
  constructor(totalWidth = null, totalHeight = null) {
    this.totalWidth = totalWidth;
    this.totalHeight = totalHeight;
    this.sizeConstraintWidth = totalWidth != null;
    this.sizeConstraintHeight = totalHeight != null;

    this.buttons = []; // array containing list of buttons / information which is to be displayed
  }
}
