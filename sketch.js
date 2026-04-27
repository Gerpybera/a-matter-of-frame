let canvasWidth = window.innerWidth;
let canvasHeight = window.innerHeight;

let particles = [];

function setup() {
  createCanvas(canvasWidth, canvasHeight);
  for (let i = 0; i < 1000; i++) {
    let posX = random(canvasWidth);
    let posY = random(canvasHeight);
    let size = random(5, 20);
    let color = [random(255), random(255), random(255)];
    particles.push(new Particle(posX, posY, size, color));
  }
}

function draw() {
  background(0, 255, 0);
  fill(255);
  textSize(100);
  text("I fucking hate those particles!", 10, 100);
  particles.forEach((p) => {
    p.update();
    p.draw();
  });
}

function mousePressed() {
  particles.forEach((p) => {
    p.ismousePressed = true;
  });
}
function mouseReleased() {
  particles.forEach((p) => {
    p.ismousePressed = false;
  });
}

function windowResized() {
  canvasWidth = window.innerWidth;
  canvasHeight = window.innerHeight;
  resizeCanvas(canvasWidth, canvasHeight);
}
