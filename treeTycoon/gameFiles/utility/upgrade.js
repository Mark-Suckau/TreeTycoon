class Upgrade {
  constructor(
    name,
    cost,
    upgradeEffectCallback,
    costMulitplierPerLevel = 1.1,
    ExponentialCostIncrease = true,
    costIncreasePerLevel = 10,
  ) {
    this.name = name; // used to display what this upgrade does on shop button
    this.cost = cost;
    this.level = 0;
    this.upgradeEffectCallback = upgradeEffectCallback;

    // exponential cost increasing per level
    this.costMulitplierPerLevel = costMulitplierPerLevel;
    this.ExponentialCostIncrease = ExponentialCostIncrease;

    // linear cost increasing per level (will only be active if ExponentialCostIncrease is set to false)
    this.costIncreasePerLevel = costIncreasePerLevel;
  }

  levelUp() {
    this.upgradeEffectCallback();
    this.level++;

    if (this.ExponentialCostIncrease) {
      this.cost *= this.costMulitplierPerLevel;
    } else {
      this.cost += this.costIncreasePerLevel;
    }
    this.cost = Math.round(this.cost);
  }
}
