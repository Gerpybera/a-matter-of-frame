class Particle {
  constructor(x, y, size = 10, speed = 0.08) {
    this.x = x;
    this.y = y;
    this.tx = x;
    this.ty = y;
    this.size = size;
    this.speed = speed;
    this.incr = 1;
    this.opa = random(200, 255);
  }

  setTarget(x, y) {
    this.tx = x;
    this.ty = y;
  }

  update() {
    this.x +=
      (this.tx - this.x) * this.speed + random(-this.incr, this.incr) * 0.15;
    this.y +=
      (this.ty - this.y) * this.speed + random(-this.incr, this.incr) * 0.15;
  }

  draw(target, gray = 255) {
    target.push();
    target.noStroke();
    target.fill(gray, this.opa);
    target.ellipse(this.x, this.y, this.size, this.size);
    target.pop();
  }
}
