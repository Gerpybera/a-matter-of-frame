let canvasWidth = window.innerWidth;
let canvasHeight = window.innerHeight;

let canvas;
canvasWidth = 1080;
canvasHeight = 1080;

let particles = [];
let liquidLayer;

let data;
const fontSize = 1000;
const txt = "A";
const gridDensity = 20;
const particleSize = 25;
const liquidBlur = 5;
const liquidThreshold = 0.2;

function setup() {
  frameRate(24);
  canvas = createCanvas(canvasWidth, canvasHeight);
  liquidLayer = createGraphics(canvasWidth, canvasHeight);

  //DRAW TEXT
  drawText();

  //GET TEXT AREA
  loadPixels();
  data = [];

  for (y = 0; y < height; y += gridDensity) {
    for (x = 0; x < width; x += gridDensity) {
      let temp = canvas.get(x, y);

      //if it's text area, push it to data
      if (temp[0] == 255) {
        data.push({
          x: x,
          y: y,
        });
      }
    }
  }

  //DRAW PARTICLES

  for (i = 0; i < data.length; i++) {
    particles.push(
      new Particle(data[i].x, data[i].y, particleSize, [255, 255, 255]),
    );
  }
}

function draw() {
  blendMode(BLEND);
  clear();
  background(0);

  liquidLayer.clear();
  liquidLayer.background(0);

  particles.forEach((p) => {
    p.update();
    p.draw(liquidLayer, 255);
  });

  // Blur first, then threshold to fuse nearby circles into a liquid silhouette.
  liquidLayer.filter(BLUR, liquidBlur);
  liquidLayer.filter(THRESHOLD, liquidThreshold);
  image(liquidLayer, 0, 0);
}

function drawText() {
  fill("red");
  textSize(fontSize);
  textAlign(CENTER, CENTER);
  text(txt, width / 2, height / 2 + fontSize * 0.1);
}

function windowResized() {
  canvasWidth = 1080;
  canvasHeight = 1080;
  resizeCanvas(canvasWidth, canvasHeight);
  liquidLayer = createGraphics(canvasWidth, canvasHeight);
}
