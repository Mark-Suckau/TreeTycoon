const world1 = new World(800, 800); // TEMP
const game = new Game(new Player(190, 190, 20, 20, 5, 100, 100), world1, new GameTime(1)); // TEMP (change GameTime param to 1)

const display = new Display(800, 800, game.world.width, game.world.height);
const controller = new Controller(400, 400, game.world.width, game.world.height);

function switchWorld(world) {
  // loads a new world into the game
  game.loadWorld(world);
  display.reCalcBuffer(game.world.width, game.world.height);

  // EXPERIMENTAL
  display.matchAspectRatio(game.world, display.canvas.width, display.canvas.height); // resizes game borders
}

// WORLD setup
const worldObjects = {
  trees: [
    new Tree(100, 100, 30, 30, 100, 0, 30, false, [
      new Wood(0, 0, 20, 20, 'brown', 100, true),
      new Wood(0, 0, 20, 20, 'brown', 100, true),
    ]),
    new Tree(100, 300, 30, 30, 100, 0, 30, false, [
      new Wood(0, 0, 20, 20, 'brown', 100, true),
      new Wood(0, 0, 20, 20, 'brown', 100, true),
    ]),
  ],
};
// CLICKABLES
// contains buttons, contextmenus which are either standalone or will be attached to an object inside of main.js

// contextMenus containing buttons (need to be initialized before buttons to allow buttons to reference them, buttons are added in loadClickables)
const contextMenus = {
  player: {
    contextMenu: new ContextMenu(100, 50),
    inventory: {
      contextMenu: new ContextMenu(90, 50),
    },
  },
  tree: {
    contextMenu: new ContextMenu(100, 50),
  },
};
// buttons not in a contextMenu or as an overlay
const standardButton = {}; // NOTE: currently unused could be good idea in future for general menu
// buttons that will be overlayed ontop of normal game objects to make them clickable
const overlayButton = {
  // button overlay for player
  player: new OverlayButton(
    200,
    200,
    100,
    50,
    false,
    game.entities.player,
    () => {},
    () => {},
    () => {
      contextMenus.player.contextMenu.setManipulatedObj(game.entities.player);
      contextMenus.player.contextMenu.show(controller.mouseX, controller.mouseY, game.frameCount);
    },
    false,
    false,
    'rgb(100, 255, 100)',
    15,
    '',
    'white',
    0,
    'px',
    'sans-serif',
  ),

  trees: [],

  wood: [],
};
const contextMenuButtons = {
  player: {
    buttons: [
      new ContextMenuButton(
        0,
        0,
        50,
        50,
        true,
        contextMenus.player.contextMenu,
        [],
        () => {},
        () => {},
        () => {},
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
      ),
      new ContextMenuButton(
        0,
        0,
        50,
        50,
        true,
        contextMenus.player.contextMenu,
        [],
        () => {},
        () => {},
        () => {},
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
      ),
    ],
    equipment: {
      buttons: [
        new ContextMenuButton(
          0,
          0,
          50,
          50,
          true,
          contextMenus.player.inventory.contextMenu,
          [],
          () => {},
          () => {},
          () => {},
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
        ),
      ],
    },
  },
  tree: {
    buttons: [
      new ContextMenuButton(
        0,
        0,
        50,
        50,
        true,
        contextMenus.tree.contextMenu,
        [],
        () => {
          // TODO: add info window popup which can be dragged by mouse and closed (shows info like treeTypeName, age, lifePhase, woodValue, hp, etc.)
        },
        () => {},
        () => {},
        'rgb(255, 255, 255)',
        'rgb(100,  255, 100)',
        true,
        false,
        'rgb(100, 200, 100)',
        5,
        'INFO',
        'rgb(255, 0, 0)',
        50,
        'px',
        'sans-serif',
      ),
    ],
  },
};
function addTreeToGame(tree) {
  // used to fill arrays of overlayButtons to match amount of corresponding Entities since the button always needs to have the same constructor
  let treeOverlayButton = new OverlayButton(
    200,
    200,
    100,
    50,
    false,
    tree,
    () => {
      tree.getHarvestedTakeDamage(game.entities.player.damage);
    },
    () => {},
    () => {
      contextMenus.tree.contextMenu.setManipulatedObj(tree);
      contextMenus.tree.contextMenu.show(controller.mouseX, controller.mouseY, game.frameCount);
    },
    false,
    false,
    'rgb(100, 255, 100)',
    15,
    '',
    'white',
    0,
    'px',
    'sans-serif',
  );

  overlayButton.trees.push(treeOverlayButton);
  game.addOverlayButton(treeOverlayButton);

  for (let wood of tree.woodArray) {
    let woodOverlayButton = new OverlayButton(
      200,
      200,
      100,
      50,
      false,
      wood,
      () => {
        wood.hide();
        game.entities.player.collectWood(wood);
      },
      () => {},
      () => {},
      false,
      false,
      'rgb(100, 255, 100)',
      15,
      '',
      'white',
      0,
      'px',
      'sans-serif',
    );
    overlayButton.wood.push(woodOverlayButton);
    game.addOverlayButton(woodOverlayButton);
  }

  game.addTree(tree);
  game.addWoodArray(tree.woodArray);
}
function loadEntities() {
  // loads entities from different objects
  // TREES & WOOD
  for (let tree of worldObjects.trees) {
    addTreeToGame(tree);
  }

  // BUTTONS
  // overlay buttons

  game.addOverlayButton(overlayButton.player);

  // context menu buttons
  for (let button of contextMenuButtons.player.buttons) {
    game.addContextMenuButton(button);
    contextMenus.player.contextMenu.addButton(button);
  }
  for (let button of contextMenuButtons.player.equipment.buttons) {
    game.addContextMenuButton(button);
    contextMenus.player.inventory.contextMenu.addButton(button);
  }
  for (let button of contextMenuButtons.tree.buttons) {
    game.addContextMenuButton(button);
    contextMenus.tree.contextMenu.addButton(button);
  }

  // CONTEXT MENUS
  game.addContextMenu(contextMenus.player.inventory.contextMenu);
  game.addContextMenu(contextMenus.player.contextMenu);
  game.addContextMenu(contextMenus.tree.contextMenu);
}
loadEntities();

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
    for (let button of game.clickables.overlayButtons) {
      button.onMouseDown(event);
    }
    for (let button of game.clickables.standaloneButtons) {
      button.onMouseDown(event);
    }
  },
  false,
);

function update() {
  // ENTITIES

  // player
  if (controller.gameInput.up.active) game.entities.player.move(0, -1);
  if (controller.gameInput.down.active) game.entities.player.move(0, 1);
  if (controller.gameInput.left.active) game.entities.player.move(-1, 0);
  if (controller.gameInput.right.active) game.entities.player.move(1, 0);

  game.entities.player.handleCollisionWorld(
    collideRectWorld(
      game.world.width,
      game.world.height,
      game.entities.player.pos.x,
      game.entities.player.pos.y,
      game.entities.player.width,
      game.entities.player.height,
      game.entities.player.vel.x,
      game.entities.player.vel.y,
    ),
    game.world.width,
    game.world.height,
  );
  game.entities.player.update();

  // trees

  for (let tree of game.entities.trees) {
    if (game.gameYears - tree.age >= 1) {
      tree.gainAge();
    }
  }

  // camera
  display.camera.followObj(
    game.entities.player.pos.x,
    game.entities.player.pos.y,
    game.entities.player.width,
    game.entities.player.height,
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

  // WARNING: if the button does not have an overlayedObj defined, it will not work
  for (let gameOverlayButton of game.clickables.overlayButtons) {
    gameOverlayButton.matchRect(
      gameOverlayButton.overlayedObj.pos.x,
      gameOverlayButton.overlayedObj.pos.y,
      gameOverlayButton.overlayedObj.width,
      gameOverlayButton.overlayedObj.height,
      gameOverlayButton.overlayedObj.isHidden,
    );
  }

  // checkMouseOver for context menus
  let mouseOverContextMenus = []; // keeps track of all not hidden context menus in this frame that have the mouse over them
  for (let contextMenu of game.clickables.contextMenus) {
    if (!contextMenu.isHidden) {
      contextMenu.checkMouseOver(
        controller.mouseX,
        controller.mouseY,
        contextMenu.pos.x,
        contextMenu.pos.y,
        contextMenu.width,
        contextMenu.height,
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
      button.checkMouseOver(
        controller.mouseX,
        controller.mouseY,
        button.pos.x,
        button.pos.y,
        button.width,
        button.height,
      );
      button.confirmMouseOver(button.isMouseOver);
    } else {
      button.confirmMouseOver(false);
    }
  }
  for (let button of game.clickables.standaloneButtons) {
    // NOTE: contextMenu must have mouseOver in order for this button to check if it itself has mouseOver
    if (!button.isHidden) {
      button.checkMouseOver(
        controller.mouseX,
        controller.mouseY,
        button.pos.x,
        button.pos.y,
        button.width,
        button.height,
      );
      button.confirmMouseOver(button.isMouseOver);
    } else {
      button.confirmMouseOver(false);
    }
  }
  for (let button of game.clickables.overlayButtons) {
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

  game.update();
}
// TEST TEMP
game.entities.player.showMessage('test test test', 1);

function render() {
  display.background('rgb(100, 250, 100)', 'rgb(0, 100, 100)');

  // player
  display.fillRect(
    game.entities.player.pos.x,
    game.entities.player.pos.y,
    game.entities.player.width,
    game.entities.player.height,
    'gold',
  );

  // displays messages for player
  let maxWidth = game.entities.player.width >= 100 ? game.entities.player.width : 100;
  let messageYOffsetPX = 30;
  let messageCounter = 0;
  for (let i = game.entities.player.currentlyDisplayedMessages.length - 1; i >= 0; i--) {
    display.fillText(
      game.entities.player.currentlyDisplayedMessages[i].text,
      game.entities.player.currentlyDisplayedMessages[i].pos.x,
      game.entities.player.currentlyDisplayedMessages[i].pos.y -
        10 -
        messageYOffsetPX * messageCounter,
      maxWidth,
      'red',
      15,
      'px',
      'sans-serif',
      'center',
      'middle',
    );
    messageCounter++;
  }

  for (let tree of game.entities.trees) {
    if (!tree.isHidden) {
      //tree body
      display.fillRect(tree.pos.x, tree.pos.y, tree.width, tree.height, tree.activeColor);

      //hp bar-
      display.drawRectWithOutlineInside(
        tree.hpBar.pos.x,
        tree.hpBar.pos.y,
        tree.hpBarWidth,
        tree.hpBar.height,
        'red',
        'black',
        2,
      );
    }
  }

  for (let wood of game.entities.wood) {
    if (!wood.isHidden) {
      display.fillRect(wood.pos.x, wood.pos.y, wood.width, wood.height, wood.activeColor);
    }
  }

  for (let button of game.clickables.overlayButtons) {
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

  // clickables
  // these are displayed the same because they both need to be seperated from the game canvas
  // DISPLAYED DIRECTLY ONTO DISPLAY CANVAS so it doesn't make a difference if display.render() is called before or after
  for (let button of game.clickables.contextMenuAndStandaloneButtons) {
    if (!button.isHidden) {
      if (!button.activeColor) {
        console.error('No active color set for button', button);
      }
      if (button.isOutlinedInside) {
        if (!button.outlineColor || !button.outlineWidth) {
          console.error('No outlineColor or outlineWidth set for button', button);
        }
        display.drawRectWithOutlineInsideCanvas(
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
          display.fillTextCanvas(
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
        display.displayRectWithOutlineOutsideCanvas(
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
          display.fillTextCanvas(
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
        display.fillRectCanvas(
          button.pos.x,
          button.pos.y,
          button.width,
          button.height,
          button.activeColor,
        );

        // display text
        if (button.text) {
          display.fillTextCanvas(
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
}
function gameLoop() {
  update();
  render();
  requestAnimationFrame(gameLoop);
}

gameLoop();
