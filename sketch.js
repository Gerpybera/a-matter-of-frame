let canvasWidth = window.innerWidth;
let canvasHeight = window.innerHeight;

let canvas;
canvasWidth = 1080;
canvasHeight = 1080;

let particles = [];
let liquidLayer;

let letterPointSets = [];
let letters = [];
let currentLetterIndex = 0;
let nextLetterAt = 0;

const fontSize = 1000;
const txt = "Soleil Rayons UV Atkins";
const gridDensity = 20;
const particleSize = 25;
const liquidBlur = 15;
const liquidThreshold = 0.2;
const letterHoldMs = 1500;

function setup() {
  frameRate(24);
  pixelDensity(1);
  canvas = createCanvas(canvasWidth, canvasHeight);
  liquidLayer = createGraphics(canvasWidth, canvasHeight);
  liquidLayer.pixelDensity(1);

  initializeMorphSystem();
}

function draw() {
  blendMode(BLEND);
  clear();
  background(0);

  if (letters.length > 1 && millis() >= nextLetterAt) {
    currentLetterIndex = (currentLetterIndex + 1) % letters.length;
    assignTargetsForLetter(currentLetterIndex);
    nextLetterAt = millis() + letterHoldMs;
  }

  liquidLayer.clear();
  liquidLayer.background(0);

  particles.forEach((p) => {
    p.update();
    p.draw(liquidLayer, 255, 1);
  });

  // Blur first, then threshold to fuse nearby circles into a liquid silhouette.
  liquidLayer.filter(BLUR, liquidBlur);
  liquidLayer.filter(THRESHOLD, liquidThreshold);
  image(liquidLayer, 0, 0);
}

function initializeMorphSystem() {
  letters = txt.split("").filter((ch) => ch.trim() !== "");

  if (letters.length === 0) {
    letters = ["A"];
  }

  letterPointSets = letters.map((letter) => getLetterPoints(letter));

  let maxParticleCount = 0;
  for (let i = 0; i < letterPointSets.length; i++) {
    maxParticleCount = max(maxParticleCount, letterPointSets[i].length);
  }

  const firstPoints = letterPointSets[0];
  particles = [];

  if (firstPoints.length === 0 || maxParticleCount === 0) {
    return;
  }

  for (let i = 0; i < maxParticleCount; i++) {
    const spawn = firstPoints[i % firstPoints.length];
    particles.push(
      new Particle(
        spawn.x + random(-0.5, 0.5),
        spawn.y + random(-0.5, 0.5),
        particleSize,
        [255, 255, 255],
      ),
    );
  }

  currentLetterIndex = 0;
  assignTargetsForLetter(currentLetterIndex);
  nextLetterAt = millis() + letterHoldMs;
}

function getLetterPoints(letter) {
  const letterLayer = createGraphics(canvasWidth, canvasHeight);
  letterLayer.pixelDensity(1);
  letterLayer.background(0);
  letterLayer.fill(255);
  letterLayer.noStroke();
  letterLayer.textSize(fontSize);
  letterLayer.textAlign(CENTER, CENTER);
  letterLayer.text(letter, width / 2, height / 2 + fontSize * 0.1);
  letterLayer.loadPixels();

  const points = [];

  for (let y = 0; y < height; y += gridDensity) {
    for (let x = 0; x < width; x += gridDensity) {
      const index = (y * width + x) * 4;
      if (letterLayer.pixels[index] > 200) {
        points.push({ x, y });
      }
    }
  }

  return points;
}

function assignTargetsForLetter(letterIndex) {
  const points = letterPointSets[letterIndex];

  if (!points || points.length === 0 || particles.length === 0) {
    return;
  }

  const shuffled = shuffle(points.slice());
  for (let i = 0; i < particles.length; i++) {
    const target = shuffled[i % shuffled.length];
    particles[i].setTarget(target.x, target.y);
  }
}

function windowResized() {
  canvasWidth = 1080;
  canvasHeight = 1080;
  resizeCanvas(canvasWidth, canvasHeight);
  liquidLayer = createGraphics(canvasWidth, canvasHeight);
  liquidLayer.pixelDensity(1);
  initializeMorphSystem();
}
