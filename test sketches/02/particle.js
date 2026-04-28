// ============================================================
// PARTICLE.JS
// ============================================================

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.tx = x;
    this.ty = y;
    this.incr = 100;
    this.opa = random(200, 255);
  }

  setTarget(x, y) {
    this.tx = x;
    this.ty = y;
  }

  update() {
    this.x +=
      (this.tx - this.x) * morphSpeed + random(-this.incr, this.incr) * 0.15;
    this.y +=
      (this.ty - this.y) * morphSpeed + random(-this.incr, this.incr) * 0.15;
  }

  // Front blob: small white particle
  drawFront(target) {
    target.push();
    target.noStroke();
    target.fill(255, this.opa);
    target.ellipse(this.x, this.y, particleSize, particleSize);
    target.pop();
  }

  // Back blob: bigger particle, different gray value
  drawBack(target) {
    target.push();
    target.noStroke();
    target.fill(backGray, this.opa);
    target.ellipse(this.x, this.y, backParticleSize, backParticleSize);
    target.pop();
  }
}
