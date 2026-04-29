let componentWidth = 250;
const componentHeightScale = 0;
let villa;
let savedCount = 0;
const numberOfSeconds = 6;
const framesPerSave = 6;
const totalSaves = 72 * 3;

let video;
function preload() {
  video = createVideo("test.webm");
  video.hide();
  villa = loadModel("Villa model Simple simplified_more.obj.stl");
}

function setup() {
  createCanvas(1080, 1080);
  pixelDensity(1);
  noStroke();

  video.elt.muted = true;
  video.loop();
}

function draw() {
  /*
  background(255);
  // lights();
  const orthoSize = 350;
  const aspect = width / height;
  ortho(
    -orthoSize * aspect,
    orthoSize * aspect,
    -orthoSize,
    orthoSize,
    -2000,
    2000,
  );
  orbitControl();
  fill(0);
  scale(0.45);

  rotateZ(PI);

  rotateX(QUARTER_PI);
  const rotationStep = TWO_PI / totalSaves;
  const rotationAngle = PI + QUARTER_PI + savedCount * rotationStep;
  rotateY(rotationAngle);
  translate(400, 0, 0);

  model(villa);
  */
  background(255);
  image(video, 0, 0, width, height);
  if (savedCount < totalSaves && frameCount % framesPerSave === 0) {
    saveCanvas(`morph_animation_${nf(savedCount, 3)}`, "png");
    savedCount++;

    if (savedCount >= totalSaves) {
      noLoop();
    }
  }
}
