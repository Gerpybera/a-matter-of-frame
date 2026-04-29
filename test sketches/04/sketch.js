let canvasWidth = 1080;
let canvasHeight = 1080;

let particles = [];
let maskLayer;
let shaderLayer;
let edgeShader;

let letterPointSets = [];
let letters = [];
let currentLetterIndex = 0;
let nextLetterAt = 0;

const fontSize = 1000;
const txt = "SOLEIL";
const gridDensity = 8;
const particleSize = gridDensity * 0.8;
const liquidBlur = 15;
const liquidThreshold = 0.2;
const letterHoldMs = 1000;
const transitionSpeed = 0.15;

const colorFraction = 1 / 255;

const edgeInnerColor = [
  255 * colorFraction,
  255 * colorFraction,
  255 * colorFraction,
];
const edgeColor1 = [255 * colorFraction, 0, 255 * colorFraction];
const edgeColor2 = [0, 255 * colorFraction, 255 * colorFraction];
const edgeColor3 = [0, 255 * colorFraction, 255 * colorFraction];
const edgeWidth = gridDensity * 1.5;
const glowWidth = edgeWidth * 2.5;

function preload() {
  edgeShader = loadShader("shader.vert", "shader.frag");
}

function setup() {
  pixelDensity(1);
  frameRate(24);

  createCanvas(canvasWidth, canvasHeight);

  maskLayer = createGraphics(canvasWidth, canvasHeight);
  maskLayer.pixelDensity(1);

  shaderLayer = createGraphics(canvasWidth, canvasHeight, WEBGL);
  shaderLayer.pixelDensity(1);
  shaderLayer.noStroke();

  // Ensure the loaded shader is compiled for the shaderLayer's GL context
  if (edgeShader && typeof edgeShader.copyToContext === "function") {
    edgeShader = edgeShader.copyToContext(shaderLayer);
  }

  initializeMorphSystem();
}

function draw() {
  clear();
  background(0);

  if (letters.length > 1 && millis() >= nextLetterAt) {
    currentLetterIndex = (currentLetterIndex + 1) % letters.length;
    assignTargetsForLetter(currentLetterIndex);
    nextLetterAt = millis() + letterHoldMs;
  }

  buildMask();
  renderEdgeGradient();

  image(shaderLayer, 0, 0, width, height);
}

function buildMask() {
  maskLayer.background(0);

  particles.forEach((p) => {
    p.update();
    p.draw(maskLayer, 255);
  });

  maskLayer.filter(BLUR, liquidBlur);
  maskLayer.filter(THRESHOLD, liquidThreshold);
}

function renderEdgeGradient() {
  shaderLayer.clear();
  shaderLayer.background(0);

  shaderLayer.shader(edgeShader);

  edgeShader.setUniform("uMask", maskLayer);
  edgeShader.setUniform("uResolution", [width, height]);
  edgeShader.setUniform("uInnerColor", edgeInnerColor);
  edgeShader.setUniform("uEdgeColor1", edgeColor1);
  edgeShader.setUniform("uEdgeColor2", edgeColor2);
  edgeShader.setUniform("uEdgeColor3", edgeColor3);
  edgeShader.setUniform("uEdgeWidth", edgeWidth);
  edgeShader.setUniform("uGlowWidth", glowWidth);

  shaderLayer.push();
  shaderLayer.noStroke();
  shaderLayer.rectMode(CENTER);
  shaderLayer.rect(0, 0, width, height);
  shaderLayer.pop();
}

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
      new Particle(
        spawn.x + random(-0.5, 0.5),
        spawn.y + random(-0.5, 0.5),
        gridDensity * random(0.5, 2),
        transitionSpeed,
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
  if (!points || points.length === 0 || particles.length === 0) return;

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

  maskLayer = createGraphics(canvasWidth, canvasHeight);
  maskLayer.pixelDensity(1);

  shaderLayer = createGraphics(canvasWidth, canvasHeight, WEBGL);
  shaderLayer.pixelDensity(1);
  shaderLayer.noStroke();

  // Re-copy shader to the new WEBGL graphics context after resize
  if (edgeShader && typeof edgeShader.copyToContext === "function") {
    edgeShader = edgeShader.copyToContext(shaderLayer);
  }

  initializeMorphSystem();
}
