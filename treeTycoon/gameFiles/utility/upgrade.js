class Upgrade {
  constructor(
    cost,
    level,
    costMulitplierPerLevel = 1.1,
    ExponentialCostIncrease = true,
    costIncreasePerLevel = 10,
  ) {
    this.cost = cost;
    this.level = level;

    // exponential cost increasing per level
    this.costMulitplierPerLevel = costMulitplierPerLevel;
    this.ExponentialCostIncrease = ExponentialCostIncrease;

    // linear cost increasing per level (will only be active if ExponentialCostIncrease is set to false)
    this.costIncreasePerLevel = costIncreasePerLevel;
  }

  levelUp() {
    this.level++;

    if (this.ExponentialCostIncrease) {
      this.cost *= this.costMulitplierPerLevel;
    } else {
      this.cost += this.costIncreasePerLevel;
    }
    this.cost = Math.round(this.cost);
  }
}
