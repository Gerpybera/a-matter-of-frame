let canvasWidth = window.innerWidth;
let canvasHeight = window.innerHeight;

function setup() {
  createCanvas(canvasWidth, canvasHeight);
}

function draw() {
  fill(255, 0, 0);
  rect(mouseX, mouseY, 100, 100);
}

function windowResized() {
  canvasWidth = window.innerWidth;
  canvasHeight = window.innerHeight;
  resizeCanvas(canvasWidth, canvasHeight);
}
