class Game {
  constructor(player, world, gameTimeObj) {
    this.world = world;
    this.clickables = {
      overlayButtons: [],
      contextMenuAndStandaloneButtons: [],
      standaloneButtons: [],
      contextMenuButtons: [],
      contextMenus: [],
    };
    this.entities = {
      player: player,
      trees: [],
      wood: [],
    };
    this.frameCount = 0;
    this.gameTime = gameTimeObj; // uses GameTime Class instantiated object
  }

  update() {
    this.frameCount += 1;
    this.gameTime.update();
  }

  addMoneyToPlayer(player, moneyAmount) {
    // used for selling items and then adding the appropriate amount to player money
    player.money += moneyAmount;
  }

  checkRectForEntities(x, y, w, h) {
    // checks a given rect at x , y with w, h if there are any entities (excluding player) intersecting
    // used to check if a tree can be planted without intersecting with other trees or wood
    let intersecting = false;
    for (let tree of this.entities.trees) {
      if (
        !tree.isHidden &&
        tree.pos.x + tree.width > x &&
        tree.pos.x < x + w &&
        tree.pos.y + tree.height > y &&
        tree.pos.y < y + h
      ) {
        intersecting = true;
        break;
      }
    }
    if (intersecting) {
      return true;
    }
    // continues checking if intersecting with wood if not intersecting any trees
    for (let wood of this.entities.wood) {
      if (
        !wood.isHidden &&
        wood.pos.x > x &&
        wood.pos.x < x + w &&
        wood.pos.y > y &&
        wood.pos.y < y + h
      ) {
        intersecting = true;
        break;
      }
    }
    return intersecting;
  }

  loadWorld(world) {
    this.world = world;
  }

  get gameYears() {
    return this.gameTime.gameYears;
  }

  addWoodArray(woodArray) {
    for (let wood of woodArray) {
      this.entities.wood.push(wood);
    }
  }

  addTree(tree) {
    return this.entities.trees.push(tree);
  }

  addOverlayButton(button) {
    return this.clickables.overlayButtons.push(button);
  }

  addStandaloneButton(button) {
    this.clickables.contextMenuAndStandaloneButtons.push(button);
    return this.clickables.standaloneButtons.push(button);
  }

  addContextMenuButton(button) {
    this.clickables.contextMenuAndStandaloneButtons.push(button);
    return this.clickables.contextMenuButtons.push(button);
  }

  addContextMenu(contextMenu) {
    return this.clickables.contextMenus.push(contextMenu);
  }
}
