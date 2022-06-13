class Seed {
  constructor(grade, tree) {
    // WARNING: grade MUST be between 1-5 else it will not be properly sorted into player inventory
    this.grade = grade; // determines what quality seed this is which determines which quality tree will be planted
    this.tree = tree; // pointer to tree obj instance from tree.js which will be planted by this seed
  }
}
