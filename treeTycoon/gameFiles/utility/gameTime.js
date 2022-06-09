class GameTime {
  constructor(irlSecondsPerGameYear) {
    this.irlSecondsPerGameYear = irlSecondsPerGameYear; // conversion factor which is how many irl seconds it takes for one in game year to pass
    this.gameYears = 0;
    this.startDate = Date.now();
  }
  update() {
    // translates current frameCount into correlating amount of gameTime based on conversion
    let irlSeconds = (Date.now() - this.startDate) / 1000;
    this.gameYears = irlSeconds / this.irlSecondsPerGameYear;
  }
}
