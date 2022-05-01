class Tree {
  constructor(x, y, width, height, hp, age, lifespan, treeType, youngColor, middleColor, oldColor) {
    this.pos = new Vector(x, y);
    this.width = width;
    this.height = height;
    this.activeColor = youngColor;
    this.hp = hp;
    this.age = age;
    this.lifespan = lifespan;
    this.treeType = treeType;
    this.youngColor = youngColor;
    this.middleColor = middleColor;
    this.oldColor = oldColor;
    this.isDead = false;
  }

  age() {
    this.age += 1;
    if (this.age > this.lifespan) {
      this.die();
      return;
    }

    // color selection based on age
    if (this.age <= this.age / 3) this.activeColor = this.youngColor;
    if (this.age > this.age / 3 && this.age <= (this.age / 3) * 2) {
      this.activeColor = this.middleColor;
    }
    if (this.age > (this.age / 3) * 2) this.activeColor = this.oldColor;
  }

  die() {
    this.isDead = true;
  }

  getHarvested() {}
}
