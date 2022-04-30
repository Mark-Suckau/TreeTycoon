class Player {
  constructor(x, y, width, height, speed, money, hp) {
    this.pos = new Vector(x, y);
    this.speed = speed;
    this.width = width;
    this.height = height;

    this.money = money;
    this.hp = hp;
  }
  move(dirX, dirY) {
    let moveX = dirX * this.speed;
    let moveY = dirY * this.speed;
    this.pos.addV(new Vector(moveX, moveY));
  }
}
