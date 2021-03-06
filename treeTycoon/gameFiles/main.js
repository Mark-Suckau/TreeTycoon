// TODO: make it so that when planting trees you cant plan one tree ontop of another already planted tree
// TODO: add showMessages to trees as well to allow for displaying how much damage was done

const world1 = new World(800, 800); // TEMP
const game = new Game(
  new Player(190, 190, 20, 20, 5, 100, 100, new MessageDisplayer(), false),
  world1,
  new GameTime(0.5),
); // TEMP (change GameTime param to 1)

const display = new Display(800, 800, game.world.width, game.world.height);
const controller = new Controller(400, 400, game.world.width, game.world.height);

function switchWorld(world) {
  // loads a new world into the game
  game.loadWorld(world);
  display.reCalcBuffer(game.world.width, game.world.height);

  // EXPERIMENTAL
  display.matchAspectRatio(game.world, display.canvas.width, display.canvas.height); // resizes game borders
}

// MESSAGES
// to be displayed by player using player.showMessage() method
const messages = {
  treeTooYoung: function (
    text = 'TREE TOO YOUNG',
    displayTimeSeconds = 1,
    color = {
      r: 255,
      g: 0,
      b: 0,
    },
  ) {
    return { text, displayTimeSeconds, color };
  },
  // for when player is attempting to harvest a tree that is too young so it will not drop wood
  gainWood: function (
    text = '+1 WOOD',
    displayTimeSeconds = 1,
    color = {
      r: 0,
      g: 255,
      b: 0,
    },
  ) {
    return { text, displayTimeSeconds, color };
  },

  gainSeed: function (
    seedGrade = 'Grade 1',
    displayTimeSeconds = 1,
    color = {
      r: 0,
      g: 255,
      b: 0,
    },
  ) {
    let text = `+1 ${seedGrade} seed`;
    return { text, displayTimeSeconds, color };
  },

  loseSeed: function (
    seedGrade = 'Grade 1',
    displayTimeSeconds = 1,
    color = {
      r: 255,
      g: 0,
      b: 0,
    },
  ) {
    let text = `-1 ${seedGrade} seed`;
    return { text, displayTimeSeconds, color };
  },

  gainMoney: function (
    moneyGained = 0,
    displayTimeSeconds = 1,
    color = {
      r: 0,
      g: 255,
      b: 0,
    },
  ) {
    let text = '+$' + moneyGained;
    return { text, displayTimeSeconds, color };
  },

  loseMoney: function (
    moneyLost = 0,
    displayTimeSeconds = 1,
    color = {
      r: 255,
      g: 0,
      b: 0,
    },
  ) {
    let text = '-$' + moneyLost;
    return { text, displayTimeSeconds, color };
  },

  insufficientFunds: function (
    text = 'INSUFFICIENT FUNDS',
    displayTimeSeconds = 1,
    color = {
      r: 255,
      g: 0,
      b: 0,
    },
  ) {
    return { text, displayTimeSeconds, color };
  },

  insufficientSeeds: function (
    seedTypeName,
    displayTimeSeconds = 1,
    color = { r: 255, g: 0, b: 0 },
  ) {
    let text = 'INSUFFICIENT ' + seedTypeName + ' SEEDS';
    return {
      text,
      displayTimeSeconds,
      color,
    };
  },

  // used for when planting a seed fails because the new tree would intersect either a tree or wood
  intersectingEntity: function (
    text = 'INTERSECTING ENTITY',
    displayTimeSeconds = 1,
    color = { r: 255, g: 0, b: 0 },
  ) {
    return { text, displayTimeSeconds, color };
  },

  treeDamaged: function (damageAmount, displayTimeSeconds = 1, color = { r: 255, g: 0, b: 0 }) {
    let text = `-${damageAmount}`;
    return { text, displayTimeSeconds, color };
  },
};

// SHOP
const shop = {
  // UPGRADES
  upgrades: {
    damage: new Upgrade(
      '+1 Damage',
      20,
      () => {
        game.entities.player.damage++;
      },
      1.1,
    ),
    woodValue: new Upgrade(
      '+5% Wood Value',
      20,
      () => {
        game.entities.player.woodValueMultiplier += 0.05;
      },
      1.1,
    ),
  },

  // SEEDS
  // (when buying seeds, a copy first needs to be made of the seed and then inserted into player inventory)
  // WARNING: if tree isHidden is set to false when it is first declared, it will still age regardless of being added to the game or visible
  seeds: {
    grade1: {
      seed: new Seed(
        1,
        new Tree(
          0,
          0,
          30,
          30,
          100,
          0,
          30,
          true,
          [new Wood(0, 0, 20, 20, 'brown', 100, true)],
          ['rgb(155,128,136)', 'rgb(43,27,34)'],
        ),
      ),
      cost: 10,
    },
    grade2: {
      seed: new Seed(
        2,
        new Tree(
          0,
          0,
          30,
          30,
          500,
          0,
          30,
          true,
          [new Wood(0, 0, 20, 20, 'brown', 130, true), new Wood(0, 0, 20, 20, 'brown', 130, true)],
          ['rgb(155,128,136)', 'rgb(114,88,96)', 'rgb(43,27,34)'],
        ),
      ),
      cost: 20,
    },
    grade3: {
      seed: new Seed(
        3,
        new Tree(
          0,
          0,
          30,
          30,
          1000,
          0,
          30,
          true,
          [new Wood(0, 0, 20, 20, 'brown', 200, true), new Wood(0, 0, 20, 20, 'brown', 200, true)],
          ['rgb(155,128,136)', 'rgb(114,88,96)', 'rgb(43,27,34)'],
        ),
      ),
      cost: 30,
    },
    grade4: {
      seed: new Seed(
        4,
        new Tree(
          0,
          0,
          30,
          30,
          2000,
          0,
          40,
          true,
          [
            new Wood(0, 0, 20, 20, 'brown', 200, true),
            new Wood(0, 0, 20, 20, 'brown', 200, true),
            new Wood(0, 0, 20, 20, 'brown', 200, true),
          ],
          ['rgb(155,128,136)', 'rgb(114,88,96)', 'rgb(75, 53, 65)', 'rgb(43,27,34)'],
        ),
      ),
      cost: 40,
    },
    grade5: {
      seed: new Seed(
        5,
        new Tree(
          0,
          0,
          30,
          30,
          3000,
          0,
          50,
          true,
          [
            new Wood(0, 0, 20, 20, 'rgb(169, 119, 20)', 200, true),
            new Wood(0, 0, 20, 20, 'rgb(169, 119, 20)', 200, true),
            new Wood(0, 0, 20, 20, 'rgb(169, 119, 20)', 200, true),
            new Wood(0, 0, 20, 20, 'rgb(169, 119, 20)', 200, true),
          ],
          [
            'rgb(155,128,136)',
            'rgb(114,88,96)',
            'rgb(75, 53, 65)',
            'rgb(43,27,34)',
            'rgb(189, 139, 40)',
          ],
        ),
      ),
      cost: 50,
    },
  },
};

function buyUpgrade(upgrade) {
  if (game.entities.player.money >= upgrade.cost) {
    game.entities.player.loseMoney(upgrade.cost);

    upgrade.levelUp();

    let message = messages.loseMoney(upgrade.cost);
    game.entities.player.messageDisplayer.showMessage(
      message.text,
      message.displayTimeSeconds,
      message.color.r,
      message.color.g,
      message.color.b,
    );
  } else {
    let message = messages.insufficientFunds();
    game.entities.player.messageDisplayer.showMessage(
      message.text,
      message.displayTimeSeconds,
      message.color.r,
      message.color.g,
      message.color.b,
    );
  }
}

function sellAllWood(player, playerWoodValueMultiplier) {
  // sells all wood in player inventory and shows message displaying how much money was gained
  let totalWoodValue = 0;
  for (let wood of player.inventory.wood) {
    totalWoodValue += wood.sellPrice * playerWoodValueMultiplier;
  }
  totalWoodValue = Math.round(totalWoodValue);

  game.addMoneyToPlayer(player, totalWoodValue);
  player.inventoryClearAllWood();

  let message = messages.gainMoney(totalWoodValue);
  player.messageDisplayer.showMessage(
    message.text,
    message.displayTimeSeconds,
    message.color.r,
    message.color.g,
    message.color.b,
  );
}

function copySeed(seed) {
  // used to copy a seed from the shop in order for it to be used to give to player inventory
  let newWoodArray = [];
  for (let wood of seed.tree.woodArray) {
    newWoodArray.push(
      new Wood(
        wood.pos.x,
        wood.pos.y,
        wood.width,
        wood.height,
        wood.activeColor,
        wood.sellPrice,
        wood.isHidden,
      ),
    );
  }
  let newTree = new Tree(
    seed.tree.pos.x,
    seed.tree.pos.y,
    seed.tree.width,
    seed.tree.height,
    seed.tree.hp,
    seed.tree.age,
    seed.tree.lifespan,
    seed.tree.isHidden,
    newWoodArray,
    seed.tree.ageColors,
  );
  let newSeed = new Seed(seed.grade, newTree);
  return newSeed;
}

function buySeed(seed, cost) {
  if (game.entities.player.money >= cost) {
    game.entities.player.loseMoney(cost);

    let seedCopy = copySeed(seed);
    game.entities.player.gainSeed(seedCopy);

    let message = messages.loseMoney(cost);
    game.entities.player.messageDisplayer.showMessage(
      message.text,
      message.displayTimeSeconds,
      message.color.r,
      message.color.g,
      message.color.b,
    );
  } else {
    let message = messages.insufficientFunds();
    game.entities.player.messageDisplayer.showMessage(
      message.text,
      message.displayTimeSeconds,
      message.color.r,
      message.color.g,
      message.color.b,
    );
  }
}

function plantSeed(seedGrade) {
  // WARNING: seedGrade must be at or between 1-5
  let seed = game.entities.player.removeSeedGrade(seedGrade);
  if (seed) {
    if (
      !game.checkRectForEntities(
        game.entities.player.pos.x,
        game.entities.player.pos.y,
        seed.tree.width,
        seed.tree.height,
      )
    ) {
      addTreeToGame(seed.tree);

      seed.tree.show(game.entities.player.pos.x, game.entities.player.pos.y, game.gameYears);
    } else {
      game.entities.player.gainSeed(seed); // adds seed back to inventory if it's placement is blocked

      let message = messages.intersectingEntity();
      game.entities.player.messageDisplayer.showMessage(
        message.text,
        message.displayTimeSeconds,
        message.color.r,
        message.color.g,
        message.color.b,
      );
    }
  } else {
    let message = messages.insufficientSeeds('GRADE ' + seedGrade);
    game.entities.player.messageDisplayer.showMessage(
      message.text,
      message.displayTimeSeconds,
      message.color.r,
      message.color.g,
      message.color.b,
    );
  }
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
    wood: {
      contextMenu: new ContextMenu(90, 50),
    },
    seeds: {
      contextMenu: new ContextMenu(90, 50),
    },
  },
  tree: {
    contextMenu: new ContextMenu(100, 50),
  },
  wood: {
    contextMenu: new ContextMenu(100, 50),
  },
  shop: {
    contextMenu: new ContextMenu(100, 50),
    upgrades: {
      contextMenu: new ContextMenu(150, 50),
    },
    seeds: {
      contextMenu: new ContextMenu(120, 50),
    },
  },
};
// buttons not in a contextMenu or as an overlay
const standaloneButtons = {
  shop: new StandaloneButton(
    10,
    10,
    100,
    50,
    false,
    () => {},
    () => {},
    () => {
      contextMenus.shop.contextMenu.show(controller.mouseX, controller.mouseY, game.frameCount);
    },
    'SHOP',
    'rgb(0, 0, 0)',
    'darkgreen',
    'green',
    true,
    false,
    'rgb(0, 0, 0)',
    5,
  ),
}; // NOTE: currently unused could be good idea in future for general menu
// buttons that will be overlayed ontop of normal game objects to make them clickable
// WARNING: when setting up new buttons which open new contextMenus, make sure to include game.frameCount when using contextMenu.show() else the contextMenu will appear below the last contextMenu

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
        [contextMenus.player.wood.contextMenu],
        () => {},
        () => {},
        () => {
          contextMenus.player.wood.contextMenu.setManipulatedObj(game.entities.player);
          contextMenus.player.wood.contextMenu.show(
            controller.mouseX,
            controller.mouseY,
            game.frameCount,
          );
        },
        'Wood',
      ),
      new ContextMenuButton(
        0,
        0,
        50,
        50,
        true,
        contextMenus.player.contextMenu,
        [contextMenus.player.seeds.contextMenu],
        () => {},
        () => {},
        () => {
          contextMenus.player.seeds.contextMenu.setManipulatedObj(game.entities.player);
          contextMenus.player.seeds.contextMenu.show(
            controller.mouseX,
            controller.mouseY,
            game.frameCount,
          );
        },
        'Seeds',
      ),
    ],
    wood: {
      buttons: [
        new ContextMenuButton(
          0,
          0,
          50,
          50,
          true,
          contextMenus.player.wood.contextMenu,
          [],
          () => {
            sellAllWood(game.entities.player, game.entities.player.woodValueMultiplier);
          },
          () => {},
          () => {},
          'Sell',
        ),
      ],
    },
    seeds: {
      buttons: [
        new ContextMenuButton(
          0,
          0,
          50,
          50,
          true,
          contextMenus.player.seeds.contextMenu,
          [],
          () => {
            // if player still has grade1 seed then it is removed and a tree is planted at player location if there is no other tree blocking
            plantSeed(1);
          },
          () => {},
          () => {},
          'Grade 1',
        ),
        new ContextMenuButton(
          0,
          0,
          50,
          50,
          true,
          contextMenus.player.seeds.contextMenu,
          [],
          () => {
            // if player still has grade1 seed then it is removed and a tree is planted at player location if there is no other tree blocking
            plantSeed(2);
          },
          () => {},
          () => {},
          'Grade 2',
        ),
        new ContextMenuButton(
          0,
          0,
          50,
          50,
          true,
          contextMenus.player.seeds.contextMenu,
          [],
          () => {
            // if player still has grade1 seed then it is removed and a tree is planted at player location if there is no other tree blocking
            plantSeed(3);
          },
          () => {},
          () => {},
          'Grade 3',
        ),
        new ContextMenuButton(
          0,
          0,
          50,
          50,
          true,
          contextMenus.player.seeds.contextMenu,
          [],
          () => {
            // if player still has grade1 seed then it is removed and a tree is planted at player location if there is no other tree blocking
            plantSeed(4);
          },
          () => {},
          () => {},
          'Grade 4',
        ),
        new ContextMenuButton(
          0,
          0,
          50,
          50,
          true,
          contextMenus.player.seeds.contextMenu,
          [],
          () => {
            // if player still has grade1 seed then it is removed and a tree is planted at player location if there is no other tree blocking
            plantSeed(5);
          },
          () => {},
          () => {},
          'Grade 5',
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
        'INFO',
      ),
    ],
  },
  wood: {
    buttons: [
      new ContextMenuButton(
        0,
        0,
        50,
        50,
        true,
        contextMenus.wood.contextMenu,
        [],
        () => {
          // TODO: add info window popup which can be dragged by mouse and closed (shows info like treeTypeName, age, lifePhase, woodValue, hp, etc.)
        },
        () => {},
        () => {},
        'INFO',
      ),
    ],
  },
  shop: {
    buttons: [
      new ContextMenuButton(
        0,
        0,
        50,
        50,
        true,
        contextMenus.shop.contextMenu,
        [contextMenus.shop.upgrades.contextMenu],
        () => {},
        () => {},
        () => {
          contextMenus.shop.upgrades.contextMenu.show(
            controller.mouseX,
            controller.mouseY,
            game.frameCount,
          );
        },
        'Upgrades',
      ),
      new ContextMenuButton(
        0,
        0,
        50,
        50,
        true,
        contextMenus.shop.contextMenu,
        [contextMenus.shop.seeds.contextMenu],
        () => {},
        () => {},
        () => {
          contextMenus.shop.seeds.contextMenu.show(
            controller.mouseX,
            controller.mouseY,
            game.frameCount,
          );
        },
        'Seeds',
      ),
    ],
    upgrades: {
      buttons: [
        new ContextMenuButton(
          0,
          0,
          50,
          50,
          true,
          contextMenus.shop.upgrades.contextMenu,
          [],
          () => {
            buyUpgrade(shop.upgrades.damage);
          },
          () => {},
          () => {},
          shop.upgrades.damage.name,
        ),
        new ContextMenuButton(
          0,
          0,
          50,
          50,
          true,
          contextMenus.shop.upgrades.contextMenu,
          [],
          () => {
            buyUpgrade(shop.upgrades.woodValue);
          },
          () => {},
          () => {},
          shop.upgrades.woodValue.name,
        ),
      ],
    },
    seeds: {
      buttons: [
        new ContextMenuButton(
          0,
          0,
          50,
          50,
          true,
          contextMenus.shop.seeds.contextMenu,
          [],
          () => {
            buySeed(shop.seeds.grade1.seed, shop.seeds.grade1.cost);
          },
          () => {},
          () => {},
          '+1 Grade 1',
        ),
        new ContextMenuButton(
          0,
          0,
          50,
          50,
          true,
          contextMenus.shop.seeds.contextMenu,
          [],
          () => {
            buySeed(shop.seeds.grade2.seed, shop.seeds.grade2.cost);
          },
          () => {},
          () => {},
          '+1 Grade 2',
        ),
        new ContextMenuButton(
          0,
          0,
          50,
          50,
          true,
          contextMenus.shop.seeds.contextMenu,
          [],
          () => {
            buySeed(shop.seeds.grade3.seed, shop.seeds.grade2.cost);
          },
          () => {},
          () => {},
          '+1 Grade 3',
        ),
        new ContextMenuButton(
          0,
          0,
          50,
          50,
          true,
          contextMenus.shop.seeds.contextMenu,
          [],
          () => {
            buySeed(shop.seeds.grade4.seed, shop.seeds.grade4.cost);
          },
          () => {},
          () => {},
          '+1 Grade 4',
        ),
        new ContextMenuButton(
          0,
          0,
          50,
          50,
          true,
          contextMenus.shop.seeds.contextMenu,
          [],
          () => {
            buySeed(shop.seeds.grade5.seed, shop.seeds.grade5.cost);
          },
          () => {},
          () => {},
          '+1 Grade 5',
        ),
      ],
    },
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
      if (tree.lifePhase == 0) {
        let message = messages.treeTooYoung();
        tree.messageDisplayer.showMessage(
          message.text,
          message.displayTimeSeconds,
          message.color.r,
          message.color.g,
          message.color.b,
        );
      } else {
        tree.getHarvestedTakeDamage(game.entities.player.damage);
        let message = messages.treeDamaged(game.entities.player.damage);
        tree.messageDisplayer.showMessage(
          message.text,
          message.displayTimeSeconds,
          message.color.r,
          message.color.g,
          message.color.b,
        );
      }
    },
    () => {},
    () => {
      contextMenus.tree.contextMenu.setManipulatedObj(tree);
      contextMenus.tree.contextMenu.show(controller.mouseX, controller.mouseY, game.frameCount);
    },
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
        let message = messages.gainWood();
        game.entities.player.messageDisplayer.showMessage(
          message.text,
          message.displayTimeSeconds,
          message.color.r,
          message.color.g,
          message.color.b,
        );
        wood.hide();
        game.entities.player.gainWood(wood);
      },
      () => {},
      () => {
        contextMenus.wood.contextMenu.setManipulatedObj(wood);
        contextMenus.wood.contextMenu.show(controller.mouseX, controller.mouseY, game.frameCount);
      },
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

  // standalone buttons

  game.addStandaloneButton(standaloneButtons.shop);

  // overlay buttons

  game.addOverlayButton(overlayButton.player);

  // context menu buttons

  // player
  for (let button of contextMenuButtons.player.buttons) {
    game.addContextMenuButton(button);
    contextMenus.player.contextMenu.addButton(button);
  }

  for (let button of contextMenuButtons.player.wood.buttons) {
    game.addContextMenuButton(button);
    contextMenus.player.wood.contextMenu.addButton(button);
  }

  for (let button of contextMenuButtons.player.seeds.buttons) {
    game.addContextMenuButton(button);
    contextMenus.player.seeds.contextMenu.addButton(button);
  }

  // trees
  for (let button of contextMenuButtons.tree.buttons) {
    game.addContextMenuButton(button);
    contextMenus.tree.contextMenu.addButton(button);
  }

  // wood
  for (let button of contextMenuButtons.wood.buttons) {
    game.addContextMenuButton(button);
    contextMenus.wood.contextMenu.addButton(button);
  }

  // shop
  for (let button of contextMenuButtons.shop.buttons) {
    game.addContextMenuButton(button);
    contextMenus.shop.contextMenu.addButton(button);
  }

  for (let button of contextMenuButtons.shop.upgrades.buttons) {
    game.addContextMenuButton(button);
    contextMenus.shop.upgrades.contextMenu.addButton(button);
  }

  for (let button of contextMenuButtons.shop.seeds.buttons) {
    game.addContextMenuButton(button);
    contextMenus.shop.seeds.contextMenu.addButton(button);
  }

  // CONTEXT MENUS
  game.addContextMenu(contextMenus.player.seeds.contextMenu);
  game.addContextMenu(contextMenus.player.wood.contextMenu);
  game.addContextMenu(contextMenus.player.contextMenu);

  game.addContextMenu(contextMenus.tree.contextMenu);
  game.addContextMenu(contextMenus.wood.contextMenu);

  game.addContextMenu(contextMenus.shop.upgrades.contextMenu);
  game.addContextMenu(contextMenus.shop.seeds.contextMenu);
  game.addContextMenu(contextMenus.shop.contextMenu);
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
    if (!tree.isHidden) {
      tree.update();
      if (game.gameYears - tree.shownSinceYear - tree.age >= 1) {
        tree.gainAge();
      }
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
  let disableMouseOverStandaloneButtons = false; // if any contextMenus have mouseOver, any standaloneButtons with mouseOver true will have mouseOver set to false
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
        disableMouseOverStandaloneButtons = true;
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
    // NOTE: all contextMenus take prescedence over all standaloneButtons,
    // meaning if a contextMenu and a standaloneButton both have mouseOver,
    // the standaloneButton will have mouseOver set to false
    if (!button.isHidden && !disableMouseOverStandaloneButtons) {
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

function render() {
  display.background('rgba(32, 219, 29)', 'rgb(38, 128, 237)');

  for (let tree of game.entities.trees) {
    if (!tree.isHidden) {
      //tree body
      display.fillRect(tree.pos.x, tree.pos.y, tree.width, tree.height, tree.activeColor);

      //hp bar
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
  // player
  display.fillRect(
    game.entities.player.pos.x,
    game.entities.player.pos.y,
    game.entities.player.width,
    game.entities.player.height,
    'gold',
  );

  // displays messages for player

  // WARNING: if color of message matches background color too closely it wont be visible since it will just blend in
  let messageYOffsetPX = 30;

  for (let tree of game.entities.trees) {
    if (!tree.isHidden) {
      let messageCounterTree = 0;
      for (let i = tree.messageDisplayer.currentlyDisplayedMessages.length - 1; i >= 0; i--) {
        display.fillTextNoMaxWidth(
          tree.messageDisplayer.currentlyDisplayedMessages[i].text,
          tree.pos.x + tree.width / 2,
          tree.pos.y - 30 - messageYOffsetPX * messageCounterTree,
          'rgba(' +
            tree.messageDisplayer.currentlyDisplayedMessages[i].color.r +
            ',' +
            tree.messageDisplayer.currentlyDisplayedMessages[i].color.g +
            ',' +
            tree.messageDisplayer.currentlyDisplayedMessages[i].color.b +
            ',' +
            tree.messageDisplayer.currentlyDisplayedMessages[i].color.a +
            ')',
          17,
          'px',
          'sans-serif',
          'center',
          'middle',
        );
        messageCounterTree++;
      }
    }
  }

  let messageCounterPlayer = 0;
  for (
    let i = game.entities.player.messageDisplayer.currentlyDisplayedMessages.length - 1;
    i >= 0;
    i--
  ) {
    display.fillTextNoMaxWidth(
      game.entities.player.messageDisplayer.currentlyDisplayedMessages[i].text,
      game.entities.player.pos.x + game.entities.player.width / 2,
      game.entities.player.pos.y - 10 - messageYOffsetPX * messageCounterPlayer,
      'rgba(' +
        game.entities.player.messageDisplayer.currentlyDisplayedMessages[i].color.r +
        ',' +
        game.entities.player.messageDisplayer.currentlyDisplayedMessages[i].color.g +
        ',' +
        game.entities.player.messageDisplayer.currentlyDisplayedMessages[i].color.b +
        ',' +
        game.entities.player.messageDisplayer.currentlyDisplayedMessages[i].color.a +
        ')',
      17,
      'px',
      'sans-serif',
      'center',
      'middle',
    );
    messageCounterPlayer++;
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

  // displaying player money
  display.fillTextCanvas(
    '$' + game.entities.player.money,
    game.world.width - 100,
    50,
    100,
    'rgb(0, 255, 0)',
    20,
    'px',
    'sans-serif',
    'center',
    'middle',
  );
}
function gameLoop() {
  update();
  render();
  requestAnimationFrame(gameLoop);
}

gameLoop();
