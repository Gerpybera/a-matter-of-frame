class Particle {
  constructor(x, y, size = 10, color = [255, 0, 0]) {
    this.x = x;
    this.y = y;

    this.size = size;
    this.color = color;
    this.incr = 5;
    this.ismousePressed = false;
  }
  update() {
    this.x += random(-this.incr, this.incr);
    this.y += random(-this.incr, this.incr);
    if (this.ismousePressed) {
      this.goToMouse();
    }
  }
  goToMouse() {
    let mouseX = window.mouseX;
    let mouseY = window.mouseY;
    let angle = atan2(mouseY - this.y, mouseX - this.x);
    this.x += cos(angle) * this.incr;
    this.y += sin(angle) * this.incr;
  }
  draw() {
    fill(this.color);
    ellipse(this.x, this.y, this.size, this.size);
  }
}
