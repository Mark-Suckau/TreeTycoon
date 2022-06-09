class Player {
  constructor(x, y, width, height, speed, money, hp, isHidden = false) {
    this.pos = new Vector(x, y);
    this.vel = new Vector(0, 0);
    this.speed = speed;
    this.width = width;
    this.height = height;

    this.isHidden = false;

    this.money = money;
    this.hp = hp;
  }

  move(dirX, dirY) {
    let moveX = dirX * this.speed;
    let moveY = dirY * this.speed;
    this.vel.addV(new Vector(moveX, moveY));
  }

  update() {
    this.pos.addV(this.vel);

    // reset velocity
    this.vel.x = 0;
    this.vel.y = 0;
  }

  handleCollisionWorld(colliding, worldWidth, worldHeight) {
    /* colliding obj structure must contain with boolean values:
    top
    bottom
    right
    left
    */
    const offset = 0.001; // how much distance between actual border and point the player is reset to, to avoid sticking to walls

    if (colliding.top) {
      this.pos.y = 0;
      if (this.vel.y < 0) {
        this.vel.y = 0;
      } else {
        this.pos.y += offset;
      }
    }
    if (colliding.bottom) {
      this.pos.y = worldHeight - this.height;
      if (this.vel.y > 0) {
        this.vel.y = 0;
      } else {
        this.pos.y -= offset;
      }
    }
    if (colliding.right) {
      this.pos.x = worldWidth - this.width;
      if (this.vel.x > 0) {
        this.vel.x = 0;
      } else {
        this.pos.x -= offset;
      }
    }
    if (colliding.left) {
      this.pos.x = 0;
      if (this.vel.x < 0) {
        this.vel.x = 0;
      } else {
        this.pos.x += offset;
      }
    }
  }
}
