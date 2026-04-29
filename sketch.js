let canvasWidth = window.innerWidth;
let canvasHeight = window.innerHeight;

let canvas;
canvasWidth = 1080;
canvasHeight = 1080;

let particles = [];
let mousePosX;
let mousePosY;
let numberOfRanges = 7;
let ranges = [];

let letterPointSets = [];
let letters = [];
let currentLetterIndex = 0;
let nextLetterAt = 0;

const fontSize = 1150;
const txt = "ATKINS";
const gridDensity = 30;
const particleSize = gridDensity * 0.8;
const liquidBlur = 25;
const liquidThreshold = 0.2;
const letterHoldMs = 800;

let brush;
let font;
let customFrameCount = 0;
const rangeSpawnStartFrame = 20;

let displayAnimation = true;
function preload() {
  brush = loadImage("circle3.png");
  font = loadFont("./font/SuisseEcalIntlMono.otf");
}

function setup() {
  if (!displayAnimation) return;
  frameRate(6);
  pixelDensity(1);
  canvas = createCanvas(canvasWidth, canvasHeight);
  if (ranges.length < numberOfRanges) {
    const rangeSpawner = setInterval(() => {
      if (customFrameCount < rangeSpawnStartFrame) {
        return;
      }
      if (ranges.length >= numberOfRanges) {
        clearInterval(rangeSpawner);
        return;
      }
      ranges.push(new Range(random(width), random(height), 0));
    }, 1000);
  }
  /*
  for (let i = 0; i < numberOfRanges; i++) {
    ranges.push(new Range(random(width), random(height), random(50, 150)));
  }
  */
  //  image(brush, 0, 0);
  initializeMorphSystem();
}

function draw() {
  if (!displayAnimation) return;
  mousePosX = mouseX;
  mousePosY = mouseY;
  // blendMode(ADD);
  //clear();
  background(0, 50);

  if (letters.length > 1 && millis() >= nextLetterAt) {
    currentLetterIndex = (currentLetterIndex + 1) % letters.length;
    assignTargetsForLetter(currentLetterIndex);
    nextLetterAt = millis() + letterHoldMs;
  }

  clear();
  background(0);

  particles.forEach((p) => {
    p.isInRange = false;
    p.update();
    for (let r of ranges) {
      p.detectRange(r.x, r.y, r.range);
    }
    p.draw();
  });

  filter(POSTERIZE, 8);
  push();
  blendMode(BLEND);
  stroke(255, 0, 0);
  noFill();
  strokeWeight(2);
  for (let r of ranges) {
    r.update();
    //r.draw();
  }
  pop();
  /*
  if(frameCount < 100 ) {
      save("animation-frame" + nf(frameCount, 4) + ".png");
  }
      */
  //filter(BLUR, liquidBlur);
  // filter(THRESHOLD, liquidThreshold);
  //saveFrames();
  textSize(24);
  fill(255);
  text(customFrameCount, 20, height - 20);
  text(txt, width - 20 - textWidth(txt), height - 20);
  customFrameCount++;
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
        gridDensity * random(1, 2) * random(2, 7),
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
  letterLayer.textFont(font);
  letterLayer.textSize(fontSize);
  // Center glyphs using actual font bounds instead of a fixed Y offset.
  const bounds = font.textBounds(letter, 0, 0, fontSize);
  const centeredX = width / 2 - (bounds.x + bounds.w / 2);
  const centeredY = height / 2 - (bounds.y + bounds.h / 2);
  letterLayer.textAlign(LEFT, BASELINE);
  letterLayer.text(letter, centeredX, centeredY);
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
  initializeMorphSystem();
}

class Range {
  constructor(x, y, range) {
    this.x = x;
    this.y = y;
    this.incrX = random(-10, 10);
    this.incrY = random(-10, 10);
    this.incrSize = random(8, 11);
    this.range = range;
  }
  update(x, y) {
    this.x += this.incrX;
    this.y += this.incrY;
    this.range += this.incrSize;
    this.bounce();
  }
  bounce() {
    if (this.x < 0 || this.x > canvasWidth) {
      this.incrX *= -1;
    }
    if (this.y < 0 || this.y > canvasHeight) {
      this.incrY *= -1;
    }
  }
  draw() {
    push();
    blendMode(BLEND);
    stroke(255, 0, 0);
    noFill();
    strokeWeight(2);
    ellipse(this.x, this.y, this.range * 2);
    pop();
  }
}

function keyPressed() {
  if (key === "q") {
    displayAnimation = true;
    setup();

    const capture = P5Capture.getInstance();
    if (capture) {
      capture.start();
    }
  }
}
