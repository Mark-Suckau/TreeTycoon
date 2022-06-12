class Wood {
  constructor(x, y, width, height, activeColor, sellPrice, isHidden = true) {
    this.pos = new Vector(x, y);
    this.width = width;
    this.height = height;
    this.activeColor = activeColor;
    this.sellPrice = sellPrice;
    this.isHidden = isHidden;
  }

  show(x, y) {
    this.pos.x = x;
    this.pos.y = y;
    this.isHidden = false;
  }

  hide() {
    this.isHidden = true;
  }
}
