const player = new Player(190, 190, 20, 20, 5, 100, 100);
const world1 = new World(400, 400); // TEMP
const game = new Game(player, world1);

const display = new Display(400, 400, game.world.width, game.world.height);
const controller = new Controller(400, 400, game.world.width, game.world.height);

function switchWorld(world) {
  // loads a new world into the game
  game.loadWorld(world);
  display.reCalcBuffer(game.world.width, game.world.height);
  // EXPERIMENTAL
  display.matchAspectRatio(game.world, display.canvas.width, display.canvas.height); // resizes game borders
}

// CONTROLLER
document.addEventListener(
  'keydown',
  (e) => {
    controller.keyChange(e.key, e.type, controller.gameInput, false);
    controller.keyChange(e.key, e.type, controller.camControls, true);
  },
  false,
);
document.addEventListener(
  'keyup',
  (e) => {
    controller.keyChange(e.key, e.type, controller.gameInput, false);
    controller.keyChange(e.key, e.type, controller.camControls, true);
  },
  false,
);

document.addEventListener('mousemove', (e) => {
  controller.mouseX = e.clientX;
  controller.mouseY = e.clientY;
});

// MOUSE CLICK

// TEMP
function testActionLMB() {
  console.log('LMB');
}
function testActionRMB() {
  console.log('RMB');
}
function testActionMMB() {
  console.log('MMB');
}
// TEMP
const button = new Button(
  200,
  200,
  100,
  50,
  false,
  'test',
  'white',
  'black',
  'green',
  testActionRMB,
  testActionLMB,
  testActionMMB,
);
game.addClickable(button);

document.addEventListener(
  'mousedown',
  (event) => {
    for (let clickable of game.clickables) {
      clickable.onMouseDown(event);
    }
  },
  false,
);

function update() {
  // player
  if (controller.gameInput.up.active) player.move(0, -1);
  if (controller.gameInput.down.active) player.move(0, 1);
  if (controller.gameInput.left.active) player.move(-1, 0);
  if (controller.gameInput.right.active) player.move(1, 0);

  player.handleCollisionWorld(
    collideRectWorld(
      game.world.width,
      game.world.height,
      game.player.pos.x,
      game.player.pos.y,
      game.player.width,
      game.player.height,
      game.player.vel.x,
      game.player.vel.y,
    ),
    game.world.width,
    game.world.height,
  );
  player.update();

  // camera
  display.camera.followObj(
    game.player.pos.x,
    game.player.pos.y,
    game.player.width,
    game.player.height,
    game.world.width,
    game.world.height,
  );

  if (controller.camControls.up.active) display.camera.moveCam(0, -1);
  if (controller.camControls.left.active) display.camera.moveCam(-1, 0);
  if (controller.camControls.down.active) display.camera.moveCam(0, 1);
  if (controller.camControls.right.active) display.camera.moveCam(1, 0);
  if (controller.camControls.zoomIn.active) display.camera.zoomChange(1, 1);
  if (controller.camControls.zoomOut.active) display.camera.zoomChange(-1, -1);

  // clickables
  for (let clickable of game.clickables) {
    const visualDimensions = display.camera.getRectVisualDimensions(
      clickable.pos.x,
      clickable.pos.y,
      clickable.width,
      clickable.height,
    );
    clickable.checkMouseOver(
      controller.mouseX,
      controller.mouseY,
      visualDimensions.visualX,
      visualDimensions.visualY,
      visualDimensions.visualWidth,
      visualDimensions.visualHeight,
    );
  }
}

function render() {
  display.background('blue', 'black');

  // player
  display.fillRect(
    game.player.pos.x,
    game.player.pos.y,
    game.player.width,
    game.player.height,
    'white',
  );

  // clickables
  for (let clickable of game.clickables) {
    display.fillRect(
      clickable.pos.x,
      clickable.pos.y,
      clickable.width,
      clickable.height,
      clickable.activeBackgroundColor,
    );
  }

  display.render();
}

function gameLoop() {
  update();
  render();
  requestAnimationFrame(gameLoop);
}

gameLoop();
