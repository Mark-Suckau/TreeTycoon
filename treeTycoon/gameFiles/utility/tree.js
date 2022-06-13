class Tree {
  constructor(
    x,
    y,
    width,
    height,
    hp,
    age,
    lifespan,
    isHidden = false,
    woodArray = [],
    ageColors = ['rgb(155,128,136)', 'rgb(114,88,96)', 'rgb(43,27,34)'],
  ) {
    this.pos = new Vector(x, y);
    this.width = width;
    this.height = height;

    this.maxHp = hp;
    this.hp = hp;
    this.age = age;
    this.lifespan = lifespan; // doesnt actually die after lifespan is over but stops growing (dying from old age would make gameplay worse)

    this.woodArray = woodArray; // object instances of wood.js (WARNING: must contain same amout of wood objs as ageColors contains colors to match amount of lifePhases
    // since for each new ageColor there is another lifePhase and for each lifePhase it must drop another piece of wood but for first lifePhase no wood must be dropped so
    // therefore the woods array must only contain the amount of maximum lifePhases - 1)

    this.messageDisplayer = new MessageDisplayer();

    this.activeColor = ageColors[0];
    this.ageColors = ageColors;
    this.lifePhase = 0; // integer which indicates which phase of life this tree is in
    // lifePhase determines which ageColor will be displayed as activeColor and also starting when the tree will drop wood (starting lifePhase 1)
    // the amount of wood dropped by the tree is determined by the number of lifePhase (lifePhase = 0 - tree drops 0 wood, lifePhase = 3 - tree drops 3 wood)
    // max lifePhase is determined by number of colors inside ageColors since each lifePhase has a different color
    this.isDead = false;
    this.isHidden = isHidden; // whether or not this tree should be displayed while rendering
    this.shownSinceYear = 0; // starting which year this tree has been shown (to calculate age properly)

    this.hpBar = {
      pos: new Vector(x + width * 0.1, y - 15),
      height: 10,
      // width is calculated in get hpBarWidth() getter to allow for hp changes to make it smaller
    };

    if (ageColors.length - 1 != woodArray.length) {
      console.error(
        'WARNING: The wood objects array must contain exactly one less wood object inside of woodArray as colors inside of ageColors, see commented explanation.',
      );
    }
  }

  update() {
    this.messageDisplayer.update();
  }

  get hpBarWidth() {
    return this.width * 0.8 * (this.hp / this.maxHp);
  }

  gainAge() {
    this.age += 1;

    // color selection based on age
    let ageDifferences = this.lifespan / this.ageColors.length; // amount of years between each color change
    for (let i = 0; i < this.ageColors.length; i++) {
      if (this.age <= ageDifferences * i && this.age >= ageDifferences * i - 1) {
        this.lifePhase = i;
      }
    }

    this.activeColor = this.ageColors[this.lifePhase];
  }

  die() {
    this.isDead = true;
    this.hide();
  }

  show(x, y, gameYear) {
    this.pos.x = x;
    this.pos.y = y;

    this.hpBar.pos = new Vector(this.pos.x + this.width * 0.1, this.pos.y - 15);

    this.shownSinceYear = gameYear;
    this.isHidden = false;
  }

  hide() {
    this.isHidden = true;
  }

  getHarvestedTakeDamage(damageAmount) {
    // used for applying damage to the tree through swinging an axe, once tree is felled, dropWood() should be used

    if (this.hp <= 0 || this.hp - damageAmount <= 0) {
      for (let i = 0; i < this.lifePhase; i++) {
        this.dropWood(this.woodArray[i]);
      }
      this.die();
      this.hp = 0;
    } else {
      this.hp -= damageAmount;
    }
  }

  dropWood(wood) {
    let xPosition = Math.random() * this.width;
    if (Math.random() > 0.5) {
      xPosition *= -1;
    }
    xPosition += this.pos.x;

    let yPosition = Math.random() * this.height;
    if (Math.random() > 0.5) {
      yPosition *= -1;
    }
    yPosition += this.pos.y;

    wood.show(xPosition, yPosition);
  }
}
