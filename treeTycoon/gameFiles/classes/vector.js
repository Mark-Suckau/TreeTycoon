class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  //FOR VECTORS WITH VECTORS

  addV(v) {
    this.x += v.x;
    this.y += v.y;
  }

  add(v) {
    return new Vector(this.x + v.x, this.y + v.y);
  }

  subV(v) {
    this.x -= v.x;
    this.y -= v.y;
  }

  multV(v) {
    this.x *= v.x;
    this.y *= v.y;
  }

  constrainV(min, max) {
    if (this.x > max.x) this.x = max.x;
    if (this.y > max.y) this.y = max.y;

    if (this.x < min.x) this.x = min.x;
    if (this.y < min.y) this.y = min.y;
  }

  magnitude() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  normalize() {
    let length = this.magnitude();
    let x = 0;
    let y = 0;
    if (length > 0) {
      x = this.x / length;
      y = this.y / length;
    }
    return new Vector(x, y);
  }
}
