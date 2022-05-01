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

// CLICKABLES
// contains buttons, contextmenus which are either standalone or will be attached to an object inside of main.js

// buttons not in a contextMenu or as an overlay
const standardButton = {}; // NOTE: currently unused could be good idea in future for general menu
// buttons that will be overlayed ontop of normal game objects to make them clickable
const overlayButton = {
  // button overlay for player
  player: new Button(
    200,
    200,
    100,
    50,
    false,
    '',
    'white',
    'black',
    'green',
    () => {},
    () => {},
    () => {
      contextMenus.player.contextMenu.show(100, 100);
    },
  ),
};
const contextMenuButtons = {
  player: {
    buttons: [
      new Button(
        0,
        0,
        50,
        50,
        true,
        'test',
        'rgb(255, 0, 0)',
        'rgb(255, 255, 255)',
        'rgb(100,  255, 100)',
        () => {
          console.log('LMB');
        },
        () => {
          console.log('MMB');
        },
        () => {
          console.log('RMB');
        },
      ),
      new Button(
        0,
        0,
        50,
        50,
        true,
        'test',
        'rgb(255, 0, 0)',
        'rgb(255, 255, 255)',
        'rgb(100,  255, 100)',
        () => {
          console.log('LMB2');
        },
        () => {
          console.log('MMB2');
        },
        () => {
          console.log('RMB2');
        },
      ),
    ],
  },
};
// contextMenus containing buttons
const contextMenus = {
  player: {
    contextMenu: new ContextMenu(100, 50, true, contextMenuButtons.player.buttons),
  },
};

function loadClickablesToGame() {
  // loads clickables from different objects
  game.addButton(overlayButton.player);
  for (let button of contextMenuButtons.player.buttons) {
    game.addButton(button);
  }
  game.addContextMenu(contextMenus.player.contextMenu);
}
loadClickablesToGame();

// controller
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

// mouse click
document.addEventListener(
  'mousedown',
  (event) => {
    // NOTE: could be improved for performance by first only checking context menus to see if click is inside that area
    // and if it is inside the context menu then check all the buttons inside that context menu which would be called the button.onMouseDown()
    // methods would be called from within the context menu and the mousedown event would be passed along

    // NOTE: contextMenus need to have their onMouseDown method triggered before some buttons activate contextMenus
    // after a contextMenu is activated with a click it checks if that same click was outside its boundaries and if it was
    // it hides itself again causing it to seem like it never appeared but actually it just very briefly appeared and then dissapeared within one frame
    for (let contextMenu of game.clickables.contextMenus) {
      contextMenu.onMouseDown(event);
    }
    for (let button of game.clickables.buttons) {
      button.onMouseDown(event);
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

  // button overlays
  overlayButton.player.copyRectDimensions(player.pos.x, player.pos.y, player.width, player.height);

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
  for (let contextMenu of game.clickables.contextMenus) {
    if (!contextMenu.isHidden) {
      const visualDimensions = display.camera.getRectVisualDimensions(
        contextMenu.pos.x,
        contextMenu.pos.y,
        contextMenu.width,
        contextMenu.height,
      );
      contextMenu.checkMouseOver(
        controller.mouseX,
        controller.mouseY,
        visualDimensions.visualX,
        visualDimensions.visualY,
        visualDimensions.visualWidth,
        visualDimensions.visualHeight,
      );
    }
  }
  for (let button of game.clickables.buttons) {
    if (!button.isHidden) {
      const visualDimensions = display.camera.getRectVisualDimensions(
        button.pos.x,
        button.pos.y,
        button.width,
        button.height,
      );
      button.checkMouseOver(
        controller.mouseX,
        controller.mouseY,
        visualDimensions.visualX,
        visualDimensions.visualY,
        visualDimensions.visualWidth,
        visualDimensions.visualHeight,
      );
    }
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
  for (let button of game.clickables.buttons) {
    if (!button.isHidden) {
      display.fillRect(
        button.pos.x,
        button.pos.y,
        button.width,
        button.height,
        button.activeBackgroundColor,
      );
    }
  }

  display.render();
}

function gameLoop() {
  update();
  render();
  requestAnimationFrame(gameLoop);
}

gameLoop();
