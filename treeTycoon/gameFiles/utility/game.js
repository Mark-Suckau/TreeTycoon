class Game {
  constructor(player, world) {
    this.player = player;
    this.world = world;
    this.clickables = {
      allButtons: [],
      standaloneButtons: [],
      contextMenuButtons: [],
      contextMenus: [],
    };
    this.frameCount = 0;
  }

  updateFrameCount() {
    this.frameCount += 1;
  }

  loadWorld(world) {
    this.world = world;
  }

  addStandaloneButton(button) {
    this.clickables.allButtons.push(button);
    return this.clickables.standaloneButtons.push(button);
  }

  addContextMenuButton(button) {
    this.clickables.allButtons.push(button);
    return this.clickables.contextMenuButtons.push(button);
  }

  addContextMenu(contextMenu) {
    return this.clickables.contextMenus.push(contextMenu);
  }
}
