class Game {
  constructor(player, world) {
    this.player = player;
    this.world = world;
    this.clickables = [];
  }
  loadWorld(world) {
    this.world = world;
  }
  addClickable(clickable) {
    return this.clickables.push(clickable);
  }
}
