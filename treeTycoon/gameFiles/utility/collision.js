function collideRectWorld(
  worldWidth,
  worldHeight,
  rectPosX,
  rectPosY,
  rectWidth,
  rectHeight,
  rectVelX,
  rectVelY,
) {
  // returns colliding obj for rect colliding with world borders
  // uses Rect velocity to anticipate a collision since the velocity cannot change anymore once collision checks are being done
  // which avoides one frame glitches into world border

  let rectRightSide = rectPosX + rectWidth;
  let rectLeftSide = rectPosX;
  let rectTopSide = rectPosY;
  let rectBottomSide = rectPosY + rectHeight;

  let colliding = {
    top: false,
    bottom: false,
    right: false,
    left: false,
  };
  // Left
  if (rectLeftSide + rectVelX <= 0) {
    colliding.left = true;
  } else if (rectLeftSide > 0) {
    colliding.left = false;
  }
  // Right
  if (rectRightSide + rectVelX >= worldWidth) {
    colliding.right = true;
  } else if (rectLeftSide < worldWidth - this.w) {
    colliding.right = false;
  }
  // Top
  if (rectTopSide + rectVelY <= 0) {
    colliding.top = true;
  } else if (rectTopSide > 0) {
    colliding.top = false;
  }
  // Bottom
  if (rectBottomSide + rectVelY >= worldHeight) {
    colliding.bottom = true;
  } else if (rectBottomSide < worldHeight) {
    colliding.bottom = false;
  }

  return colliding;
}

function collideRect(
  rect1X,
  rect1Y,
  rect1Width,
  rect1Height,
  rect2X,
  rect2Y,
  rect2Width,
  rect2Height,
) {
  //returns collision for rect1 with rect2 from perspective of rect1

  // Initalizing
  let dx = rect1X + rect1Width / 2 - (rect2X + rect2Width / 2);
  let dy = rect1Y + rect1Height / 2 - (rect2Y + rect2Height / 2);
  let width = (rect1Width + rect2Width) / 2;
  let height = (rect1Height + rect2Height) / 2;
  let crossWidth = width * dy;
  let crossHeight = height * dx;

  let colliding = {
    top: false,
    bottom: false,
    left: false,
    right: false,
  };
  // Collision Detection
  if (Math.abs(dx) <= width && Math.abs(dy) <= height) {
    if (crossWidth > crossHeight) {
      if (crossWidth > -crossHeight) {
        colliding.top = true;
      } else {
        colliding.right = true;
      }
    } else {
      if (crossWidth > -crossHeight) {
        colliding.left = true;
      } else {
        colliding.bottom = true;
      }
    }
  }
}
