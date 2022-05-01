class Game {
  constructor(player, world) {
    this.player = player;
    this.world = world;
    this.clickables = {
      buttons: [],
      contextMenus: [],
    };
  }
  loadWorld(world) {
    this.world = world;
  }
  addButton(button) {
    return this.clickables.buttons.push(button);
  }
  addContextMenu(contextMenu) {
    return this.clickables.contextMenus.push(contextMenu);
  }
}
