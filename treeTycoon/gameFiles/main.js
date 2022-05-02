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

// contextMenus containing buttons (need to be initialized before buttons to allow buttons to reference them, buttons are added in loadClickables)
const contextMenus = {
  player: {
    contextMenu: new ContextMenu(100, 50),
  },
  test1: {
    contextMenu: new ContextMenu(90, 50),
  },
};
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
    'black',
    'green',
    false,
    false,
    'rgb(100, 255, 100)',
    15,
    '',
    'white',
    0,
    'px',
    'sans-serif',
    [contextMenus.player.contextMenu],
    () => {},
    () => {},
    () => {
      contextMenus.player.contextMenu.show(controller.mouseX, controller.mouseY, game.frameCount);
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
        'rgb(255, 255, 255)',
        'rgb(100,  255, 100)',
        true,
        false,
        'rgb(100, 200, 100)',
        5,
        'test',
        'rgb(255, 0, 0)',
        50,
        'px',
        'sans-serif',
        [contextMenus.test1.contextMenu],
        () => {
          console.log('LMB');
        },
        () => {
          console.log('MMB');
        },
        () => {
          contextMenus.test1.contextMenu.show(
            controller.mouseX,
            controller.mouseY,
            game.frameCount,
          );
          console.log('RMB');
        },
        contextMenus.player.contextMenu,
      ),
      new Button(
        0,
        0,
        50,
        50,
        true,
        'rgb(255, 255, 255)',
        'rgb(100,  255, 100)',
        true,
        false,
        'rgb(100, 200, 100)',
        5,
        'test',
        'rgb(255, 0, 0)',
        10,
        'px',
        'sans-serif',
        [],
        () => {
          console.log('LMB2');
        },
        () => {
          console.log('MMB2');
        },
        () => {
          console.log('RMB2');
        },
        contextMenus.player.contextMenu,
      ),
    ],
  },
  test1: {
    buttons: [
      new Button(
        0,
        0,
        50,
        50,
        true,
        'rgb(255, 255, 255)',
        'rgb(100,  255, 100)',
        true,
        false,
        'rgb(100, 200, 100)',
        5,
        'test',
        'rgb(255, 0, 0)',
        50,
        'px',
        'sans-serif',
        [],
        () => {
          console.log('LMB3');
        },
        () => {
          console.log('MMB3');
        },
        () => {
          console.log('RMB3');
        },
        contextMenus.test1.contextMenu,
      ),
    ],
  },
};

function loadClickables() {
  // loads clickables from different objects

  // BUTTONS
  // overlay buttons
  game.addStandaloneButton(overlayButton.player);

  // context menu buttons
  for (let button of contextMenuButtons.player.buttons) {
    game.addContextMenuButton(button);
    contextMenus.player.contextMenu.addButton(button);
  }
  for (let button of contextMenuButtons.test1.buttons) {
    game.addContextMenuButton(button);
    contextMenus.test1.contextMenu.addButton(button);
  }

  // CONTEXT MENUS
  game.addContextMenu(contextMenus.test1.contextMenu);
  game.addContextMenu(contextMenus.player.contextMenu);
}
loadClickables();

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
    for (let button of game.clickables.standaloneButtons) {
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

  // CLICKABLES START
  // button overlays
  overlayButton.player.copyRectDimensions(player.pos.x, player.pos.y, player.width, player.height);

  // checkMouseOver for context menus
  let mouseOverContextMenus = []; // keeps track of all not hidden context menus in this frame that have the mouse over them
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
      if (contextMenu.isMouseOver) {
        mouseOverContextMenus.push(contextMenu);
      }
    } else {
      contextMenu.confirmMouseOver(false);
    }
  }
  // removes conflicts of mutliple contextMenus having isMouseOver true at same time and chooses the most recently opened one
  // if there is not more than 1 active contextMenus with mouseOver, this is not needed
  if (mouseOverContextMenus.length > 1) {
    let mostRecentContextMenu = mouseOverContextMenus[0];
    let mostRecentContextMenuIndex = 0;
    for (let i = 0; i < mouseOverContextMenus.length; i++) {
      if (mouseOverContextMenus[i].shownSinceFrame > mostRecentContextMenu.shownSinceFrame) {
        mostRecentContextMenu = mouseOverContextMenus[i];
        mostRecentContextMenuIndex = i;
      }
      // removes contextMenu that should stay selected, then changes isMouseOver for all other contextMenus to false
      mouseOverContextMenus.splice(mostRecentContextMenuIndex, 1);
      mostRecentContextMenu.confirmMouseOver(true);

      for (let contextMenu of mouseOverContextMenus) {
        contextMenu.confirmMouseOver(false);
      }
    }
  } else {
    for (let contextMenu of game.clickables.contextMenus) {
      // keep isMouseOver unchanged if there are no conflicts
      contextMenu.confirmMouseOver(contextMenu.isMouseOver);
    }
  }
  // checkMouseOver for buttons
  for (let button of game.clickables.contextMenuButtons) {
    // NOTE: contextMenu must have mouseOver in order for this button to check if it itself has mouseOver
    if (!button.isHidden && button.contextMenu.isMouseOver) {
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
      button.confirmMouseOver(button.isMouseOver);
    } else {
      button.confirmMouseOver(false);
    }
  }
  for (let button of game.clickables.standaloneButtons) {
    // NOTE: all contextMenus take prescedence over all standaloneButtons,
    // meaning if a contextMenu and a standaloneButton both have mouseOver,
    // the standaloneButton will have mouseOver set to false
    if (!button.isHidden && mouseOverContextMenus.length == 0) {
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
      button.confirmMouseOver(button.isMouseOver);
    } else {
      button.confirmMouseOver(false);
    }
  }

  // CLICKABLES END

  game.updateFrameCount();
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
  for (let button of game.clickables.allButtons) {
    if (!button.isHidden) {
      if (!button.activeColor) {
        console.error('No active color set for button', button);
      }
      if (button.isOutlinedInside) {
        if (!button.outlineColor || !button.outlineWidth) {
          console.error('No outlineColor or outlineWidth set for button', button);
        }
        display.drawRectWithOutlineInside(
          button.pos.x,
          button.pos.y,
          button.width,
          button.height,
          button.activeColor,
          button.outlineColor,
          button.outlineWidth,
        );

        // display text
        if (button.text) {
          display.fillText(
            button.text,
            button.pos.x + button.width / 2,
            button.pos.y + button.height / 2,
            button.width - button.outlineWidth,
            button.textColor,
            button.textSize,
            button.textSizeUnit,
            button.textFontFamily,
            'center',
            'middle',
          );
        }
      } else if (button.isOutlinedOutside) {
        if (!button.outlineColor || !button.outlineWidth) {
          console.error('No outlineColor or outlineWidth set for button', button);
        }
        display.displayRectWithOutlineOutside(
          button.pos.x,
          button.pos.y,
          button.width,
          button.height,
          button.activeColor,
          button.outlineColor,
          button.outlineWidth,
        );

        // display text
        if (button.text) {
          display.fillText(
            button.text,
            button.pos.x + button.width / 2,
            button.pos.y + button.height / 2,
            button.width,
            button.textColor,
            button.textSize,
            button.textSizeUnit,
            button.textFontFamily,
            'center',
            'middle',
          );
        }
      } else {
        // if neither outline outside or inside are true then normal rect without outline
        display.fillRect(
          button.pos.x,
          button.pos.y,
          button.width,
          button.height,
          button.activeColor,
        );

        // display text
        if (button.text) {
          display.fillText(
            button.text,
            button.pos.x + button.width / 2,
            button.pos.y + button.height / 2,
            button.width - button.outlineWidth,
            button.textColor,
            button.textSize,
            button.textSizeUnit,
            button.textFontFamily,
            'center',
            'middle',
          );
        }
      }
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
