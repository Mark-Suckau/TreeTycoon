class Player {
  constructor(x, y, width, height, speed, money, hp, isHidden = false) {
    this.pos = new Vector(x, y);
    this.vel = new Vector(0, 0);
    this.speed = speed;
    this.width = width;
    this.height = height;

    this.isHidden = isHidden;
    this.inventory = {
      wood: [],
      seeds: [],
      equipment: [], // TODO add equipment
    };

    this.damage = 10;
    this.money = money;
    this.hp = hp;

    this.currentlyDisplayedMessages = [];
  }

  showMessage(text, displayTimeSeconds, r, g, b) {
    // displays a message above player head which will slowly fade away
    let message = {
      text: text,
      color: {
        r: r,
        g: g,
        b: b,
        a: 1,
      },
      displayStartTimeStamp: Date.now(),
      totalDisplayTimeSeconds: displayTimeSeconds,
    };
    this.currentlyDisplayedMessages.push(message);
  }

  collectWood(wood) {
    this.inventory.wood.push(wood);
  }

  move(dirX, dirY) {
    let moveX = dirX * this.speed;
    let moveY = dirY * this.speed;
    this.vel.addV(new Vector(moveX, moveY));
  }

  update() {
    // messages
    for (let i = 0; i < this.currentlyDisplayedMessages.length; i++) {
      let timeSinceStartedDisplaying =
        Date.now() - this.currentlyDisplayedMessages[i].displayStartTimeStamp;
      // totalDisplayTimeSeconds * 1000 to convert to miliseconds
      if (
        timeSinceStartedDisplaying >=
        this.currentlyDisplayedMessages[i].totalDisplayTimeSeconds * 1000
      ) {
        this.currentlyDisplayedMessages.splice(i, 1);
      } else {
        // calculates new alpha value based on how much remaining time until message disappears to allow it to fade away
        let percentTimeGone =
          timeSinceStartedDisplaying /
          (this.currentlyDisplayedMessages[i].totalDisplayTimeSeconds * 1000);
        this.currentlyDisplayedMessages[i].color.a = 1 - percentTimeGone;
      }
    }

    // position
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
