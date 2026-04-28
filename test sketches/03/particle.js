class Particle {
  constructor(x, y, size = 10, color = [255, 0, 0]) {
    this.x = x + 0;
    this.y = y;
    this.targetX = x;
    this.targetY = y;

    this.size = size;
    this.color = color;
    this.incr = random(3, 10);
    this.ease = random(0.08, 0.16);
    this.opa = random(200, 255);
    this.speed = 4;
    this.ismousePressed = false;
  }

  setTarget(x, y) {
    this.targetX = x;
    this.targetY = y;
  }

  update() {
    this.x += (this.targetX - this.x) * this.ease * this.speed;
    this.y += (this.targetY - this.y) * this.ease * this.speed;

    // Tiny jitter keeps the liquid edge alive without breaking the letter shape.
    this.x += random(-this.incr, this.incr);
    this.y += random(-this.incr, this.incr);
  }
  draw() {
    push();
    noStroke();

    fill(this.color, this.opa);
    ellipse(this.x, this.y, this.size, this.size);
    pop();
  }
}
