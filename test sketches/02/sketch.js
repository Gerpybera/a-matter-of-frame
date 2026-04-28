// ============================================================
// SKETCH.JS — Liquid blob with colored back layer
// ============================================================

let canvasWidth = 1080;
let canvasHeight = 1080;

let canvas;
let particles = [];

// Two separate graphics buffers:
// liquidLayer  = the main white liquid blob (front)
// backLayer    = a second, bigger, colored blob (behind)
let liquidLayer;
let backLayer;

let letterPointSets = [];
let letters = [];
let currentLetterIndex = 0;
let nextLetterAt = 0;

const fontSize = 1000;
const txt = "SOLEIL";
const gridDensity = 20;
const letterHoldMs = 1500;
const morphSpeed = 0.5;

// --- Front blob settings ---
const particleSize = 25;
const liquidBlur = 15;
const liquidThreshold = 0.2;

// --- Back blob settings (tweak these) ---
const backParticleSize = 55; // bigger particles
const backBlur = 22; // stronger blur = softer halo
const backThreshold = 0.15; // slightly lower threshold = larger fused shape
const backGray = 140; // gray value drawn on the back layer (0–255)
// → tinted in compositeFinal via tint()
const backTint = [150, 150, 255, 200]; // [R, G, B, Alpha]
const backOffsetX = 0; // horizontal shift of back blob
const backOffsetY = 0; // vertical shift of back blob¨

let savedCount = 0;
const totalSaves = 24 * 4; // 4 seconds at 24 fps
const framesPerSave = 1;

// ============================================================
// SETUP
// ============================================================
function setup() {
  frameRate(24);
  pixelDensity(1);

  canvas = createCanvas(canvasWidth, canvasHeight);

  liquidLayer = createGraphics(canvasWidth, canvasHeight);
  backLayer = createGraphics(canvasWidth, canvasHeight);

  liquidLayer.pixelDensity(1);
  backLayer.pixelDensity(1);

  initializeMorphSystem();
}

// ============================================================
// DRAW
// ============================================================
function draw() {
  blendMode(BLEND);
  clear();
  background(0, 0, 255);

  if (letters.length > 1 && millis() >= nextLetterAt) {
    currentLetterIndex = (currentLetterIndex + 1) % letters.length;
    assignTargetsForLetter(currentLetterIndex);
    nextLetterAt = millis() + letterHoldMs;
  }

  // ---- Update all particles ----
  particles.forEach((p) => p.update());

  // ---- Render back blob ----
  backLayer.background(0);
  particles.forEach((p) => p.drawBack(backLayer));
  backLayer.filter(BLUR, backBlur);
  backLayer.filter(THRESHOLD, backThreshold);
  makeBlackTransparent(backLayer);

  // ---- Render front blob ----
  liquidLayer.background(0);
  particles.forEach((p) => p.drawFront(liquidLayer));
  liquidLayer.filter(BLUR, liquidBlur);
  liquidLayer.filter(THRESHOLD, liquidThreshold);
  makeBlackTransparent(liquidLayer);

  // ---- Composite: back first, front on top ----
  // Back blob: tinted with color
  push();
  tint(backTint[0], backTint[1], backTint[2], backTint[3]);
  image(backLayer, backOffsetX, backOffsetY);
  pop();

  // Front blob: white, drawn on top
  image(liquidLayer, 0, 0);
  //saveImage();
}

function createBlob(canvas, target) {
  canvas.background(0);
  particles.forEach((p) => p.drawFront(canvas));
  canvas.filter(BLUR, liquidBlur);
  canvas.filter(THRESHOLD, liquidThreshold);
  makeBlackTransparent(canvas);
}

// ============================================================
// MORPH SYSTEM
// ============================================================
function initializeMorphSystem() {
  letters = txt.split("").filter((ch) => ch.trim() !== "");
  if (letters.length === 0) letters = ["A"];

  letterPointSets = letters.map((letter) => getLetterPoints(letter));

  let maxParticleCount = 0;
  for (let i = 0; i < letterPointSets.length; i++) {
    maxParticleCount = max(maxParticleCount, letterPointSets[i].length);
  }

  const firstPoints = letterPointSets[0];
  particles = [];

  if (firstPoints.length === 0 || maxParticleCount === 0) return;

  for (let i = 0; i < maxParticleCount; i++) {
    const spawn = firstPoints[i % firstPoints.length];
    particles.push(
      new Particle(spawn.x + random(-0.5, 0.5), spawn.y + random(-0.5, 0.5)),
    );
  }

  currentLetterIndex = 0;
  assignTargetsForLetter(currentLetterIndex);
  nextLetterAt = millis() + letterHoldMs;
}

function getLetterPoints(letter) {
  const layer = createGraphics(canvasWidth, canvasHeight);
  layer.pixelDensity(1);
  layer.background(0);
  layer.fill(255);
  layer.noStroke();
  layer.textSize(fontSize);
  layer.textAlign(CENTER, CENTER);
  layer.text(letter, width / 2, height / 2 + fontSize * 0.1);
  layer.loadPixels();

  const points = [];
  for (let y = 0; y < height; y += gridDensity) {
    for (let x = 0; x < width; x += gridDensity) {
      const index = (y * width + x) * 4;
      if (layer.pixels[index] > 200) {
        points.push({ x, y });
      }
    }
  }

  return points;
}

function assignTargetsForLetter(letterIndex) {
  const points = letterPointSets[letterIndex];
  if (!points || points.length === 0 || particles.length === 0) return;

  const shuffled = shuffle(points.slice());
  for (let i = 0; i < particles.length; i++) {
    const target = shuffled[i % shuffled.length];
    particles[i].setTarget(target.x, target.y);
  }
}

function makeBlackTransparent(layer) {
  layer.loadPixels();

  for (let i = 0; i < layer.pixels.length; i += 4) {
    const red = layer.pixels[i];
    const green = layer.pixels[i + 1];
    const blue = layer.pixels[i + 2];

    if (red === 0 && green === 0 && blue === 0) {
      layer.pixels[i + 3] = 0;
    } else {
      layer.pixels[i + 3] = 255;
    }
  }

  layer.updatePixels();
}

// ============================================================
// RESIZE
// ============================================================
function windowResized() {
  canvasWidth = 1080;
  canvasHeight = 1080;
  resizeCanvas(canvasWidth, canvasHeight);

  liquidLayer = createGraphics(canvasWidth, canvasHeight);
  backLayer = createGraphics(canvasWidth, canvasHeight);
  liquidLayer.pixelDensity(1);
  backLayer.pixelDensity(1);

  initializeMorphSystem();
}

function saveImage() {
  if (savedCount < totalSaves && frameCount % framesPerSave === 0) {
    saveCanvas(`animation_${nf(savedCount, 3)}`, "png");
    savedCount++;

    if (savedCount >= totalSaves) {
      // noLoop();
    }
  }
}
