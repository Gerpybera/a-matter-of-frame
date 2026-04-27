//VARIABLES
txt = "Molécule";

fontSize = 450;

gridDensity = 8;

mouseRadius = 250;

spreadSpeed = 5;
returnSpeed = 5;

let particleSize;
particleRange = 3;

h = 30;
range = 200;

r = "#ff0000";
g = "#00ff00";
b = "#0000ff";

class Particle {
  constructor(x, y) {
    this.x = x + 0; //plus for a distortion effect
    this.y = y;
    this.posRangeX = canvas.width / 2;
    this.posRangeY = canvas.height / 2;
    this.incr = 5;
    // this.size = random(particleSize, particleSize * particleRange);
    // this.size = gridDensity + random(-8, 8);
    this.size = gridDensity * random(1, 2);
    //this.size = 3
    //store original position
    this.baseX = this.x;
    this.baseY = this.y;
    this.density = random(-30, 30);

    // this.c = random(h, h + range);
    this.c = random([r, g, b]);
    this.c = random(200, 255);
    this.opa = random(200, 255);

    this.breathe = random(12, 14);
  }

  draw() {
    push();
    noStroke();
    //fill(color(255,0,0,50));
    //fill(this.c);
    fill(255, this.opa);
    //fill(255, 0 ,0)
    //SHAPES

    circle(this.x, this.y, this.size);

    // this.size += sin(frameCount / 40) / 10;

    pop();
  }

  //calculate distance between particle position and mouse postion, if they are close enough -> get pushed away effect
  update() {
    let dx = dist(this.x, this.y, this.posRangeX, this.posRangeY);

    let forceDirectionX = (this.posRangeX - this.x) / dx;
    let forceDirectionY = (this.posRangeY - this.y) / dx;

    //stop, slow down effect, move fastest closer to mouse and then slow and stop
    let maxDistance = mouseRadius * 2;
    let force = (maxDistance - dx) / maxDistance;
    // force = map(maxDistance, 0, mouseRadius, 0, 1);

    let forceSpeed = spreadSpeed * force;

    //
    let directionX = forceDirectionX * force * this.density;
    let directionY = forceDirectionY * force * this.density;

    if (dx < mouseRadius) {
      //add a vector to simulate push away effect
      this.x -= forceDirectionX * forceSpeed;
      this.y -= forceDirectionY * forceSpeed;
    } else {
      //make it return for x,y
      if (this.x != this.baseX) {
        // let dx = dist(this.x, this.y, this.baseX, this.baseY);
        let dx = this.x - this.baseX;
        this.x -= dx / returnSpeed; //10단계에 나눠서 리턴
      }
      if (this.y != this.baseY) {
        let dx = this.y - this.baseY;
        this.y -= dx / returnSpeed; //10단계에 나눠서 리턴
      }
    }
    this.posRangeX += this.incr;
    if (this.posRangeX >= canvas.width || this.posRangeX <= 0) {
      this.incr = this.incr * -1;
    }
  }
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  background(0);
  rectMode(CENTER);
  // colorMode(HSB);
  //filter(BLUR, 20);

  //DRAW TEXT
  fill("red");
  textSize(fontSize);
  textAlign(CENTER, CENTER);
  text(txt, width / 2, height / 2);

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
  particles = [];

  for (i = 0; i < data.length; i++) {
    particles.push(new Particle(data[i].x, data[i].y));
  }
}

function draw() {
  // background(0);

  blendMode(ADD);
  clear();
  background(0);

  // DRAW PARTICLES TO TEXT AREA
  for (p of particles) {
    p.draw();

    p.update();
  }

  //LINES
  //   for(a = 0; a < particles.length; a++){
  //     for(b = a; b < particles.length; b++){
  //       let distance = dist(particles[a].x, particles[a].y, particles[b].x, particles[b].y);

  //       if(distance < 50){
  //         let opa = (255 - (distance * 5));

  //         stroke(255, opa);
  //         strokeWeight(0.5);

  //         line(particles[a].x, particles[a].y, particles[b].x, particles[b].y)
  //       }
  //     }
  //   }

  // textSize(40);
  textSize(fontSize * 0.95);
  fill("cyan");
  textAlign(CENTER, CENTER);
  //text(txt, width / 2, height / 2);

  // let legend = select('#legend');
  // legend.position(width/2, height/2 + 160);
  // legend.style('text-align', 'center');
}
