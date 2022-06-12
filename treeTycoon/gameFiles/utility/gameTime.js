class GameTime {
  constructor(irlSecondsPerGameYear) {
    this.irlSecondsPerGameYear = irlSecondsPerGameYear; // conversion factor which is how many irl seconds it takes for one in game year to pass
    this.startDate = Date.now();
    this.irlSeconds = 0;
    this.gameYears = 0;
  }
  update() {
    // translates current frameCount into correlating amount of gameTime based on conversion
    this.irlSeconds = (Date.now() - this.startDate) / 1000;
    this.gameYears = this.irlSeconds / this.irlSecondsPerGameYear;
  }
}
