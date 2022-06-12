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
