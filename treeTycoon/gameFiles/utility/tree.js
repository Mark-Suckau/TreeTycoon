class Tree {
  constructor(
    x,
    y,
    width,
    height,
    hp,
    age,
    lifespan,
    ageColors = ['brown'],
    isHidden = false,
    woodObj,
  ) {
    this.pos = new Vector(x, y);
    this.width = width;
    this.height = height;
    this.activeColor = ageColors[0];
    this.hp = hp;
    this.age = age;
    this.lifespan = lifespan;
    this.wood = woodObj; // object instance of wood.js
    this.ageColors = ageColors;
    this.isDead = false;
    this.isHidden = isHidden; // whether or not this tree should be displayed while rendering
  }

  age() {
    this.age += 1;
    if (this.age > this.lifespan) {
      this.die();
      return;
    }

    // color selection based on age
    let ageDifferences = this.lifespan / this.ageColors.length; // amount of years between each color change
    for (let i = 0; i < this.ageColors.length; i++) {
      if (this.age <= ageDifferences * i && this.age >= ageDifferences * i - 1) {
        this.activeColor = this.ageColors[i];
      }
    }
  }

  die() {
    this.isDead = true;
    this.hide();
  }

  show(x, y) {
    this.pos.x = x;
    this.pos.y = y;
    this.isHidden = false;
  }

  hide() {
    this.isHidden = true;
  }

  getHarvestedTakeDamage(damageAmount) {
    // used for applying damage to the tree through swinging an axe, once tree is felled, dropWood() should be used

    if (this.hp <= 0 || this.hp - damageAmount <= 0) {
      this.dropWood();
      this.die();
    } else {
      this.hp -= damageAmount;
    }
  }

  dropWood() {
    this.wood.show(this.pos.x, this.pos.y);
  }
}
