class Particle {
  constructor(x, y, size = 10, color = [255, 0, 0]) {
    this.x = x;
    this.y = y;

    this.size = size;
    this.color = color;
    this.incr = 1;
    this.opa = random(200, 255);
    this.ismousePressed = false;
  }
  update() {
    noStroke();
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
    this.x += cos(angle) * this.incr * 5;
    this.y += sin(angle) * this.incr * 5;
  }
  draw(target = null, gray = null) {
    const renderer = target || window;

    renderer.push();
    renderer.noStroke();

    if (gray === null) {
      renderer.fill(this.color, this.opa);
    } else {
      renderer.fill(gray, this.opa);
    }

    renderer.ellipse(this.x, this.y, this.size, this.size);
    renderer.pop();
  }
}
