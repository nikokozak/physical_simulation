// Using the c2.js library 
// See reference here: https://c2js.org/docs/classes/physics.world.html#particles
/*
 TODO: 
 - make it so that inflation/deflation on both is even.
 - link to other inputs. / interaction

*/ 

let world;

let quadTree;
let numParticlesA = 40;
let numParticlesB = 40;
let initialRadius = 10;
let minRadius = 5;
let initialRadiusDeviation = 2;
let timer = 5000;
let nextChange = timer;
let alternator = -1;

function drawQuadTree(quadTree) {
    stroke('#333333');
    strokeWeight(1);
    noFill();
    let bounds = quadTree.bounds;
    rect(bounds.p.x, bounds.p.y, bounds.w, bounds.h);

    if(quadTree.leaf()) return;
    for(let i=0; i<4; i++) drawQuadTree(quadTree.children[i]);
}

function setup() {
    createCanvas(960, 540);
    colorMode(HSL, 100);
    ellipseMode(RADIUS);

    world = new c2.World(new c2.Rect(0, 0, width, height));

    for(let i=0; i<(numParticlesA + numParticlesB); i++){
        let x = random(width);
        let y = random(height);
        let p = new c2.Particle(x, y);
        p.radius = random(initialRadius - initialRadiusDeviation, initialRadius + initialRadiusDeviation);
        p.color = color(random(0, 8), random(30, 60), random(20, 100));

        world.addParticle(p);
    }

    quadTree = new c2.QuadTree(new c2.Rect(0, 0, width, height));
    let collision = new c2.Collision(quadTree);
    //collision.iteration = 2;
    world.addInteractionForce(collision);

    let constForce = new c2.ConstForce(0, 1);
    world.addForce(constForce);
}

function draw() {
    background('#cccccc');

    //drawQuadTree(quadTree);

    if (millis() > nextChange) {
      alternator *= -1;
      nextChange = millis() + timer;
      console.log(alternator);
    } 

    for (let i = 0; i < numParticlesA; i++) {
      if (world.particles[i].radius < minRadius && alternator < 0) continue; 
      world.particles[i].radius += (alternator * 0.1);
    }
    for (let i = numParticlesA - 1; i < numParticlesA + numParticlesB; i++) {
      if (world.particles[i].radius < minRadius && alternator > 0) continue; 
      world.particles[i].radius -= (alternator * 0.1);
    }

    world.update();

    for(let i=0; i<world.particles.length; i++){
        let p = world.particles[i];
        stroke('#333333');
        strokeWeight(1);
        fill(p.color);
        circle(p.position.x, p.position.y, p.radius);
        strokeWeight(2);
        point(p.position.x, p.position.y);
    }
}