/*
---story---
This project explores the lifecycle of Luminarae in a virtual world, 
from birth, coexistence to conflicts caused by competition for resources, 
reflecting similar societal phenomena in the real world.

Process and details: https://viola1827.notion.site/Coding2-Final-work-Luminarae-a0164affbfe948cab8edb3757b5070ca?pvs=4

---reference---
Inspiration from : Particle Life https://www.youtube.com/watch?v=xiUpAeos168
The Nature of scene 2 Code -> Daniel Shiffman http://natureofcode.com
The particle life shape -> https://openprocessing.org/sketch/1399835
The insiration of scene 3 ->: https://openprocessing.org/sketch/1700079

Basic movement and function from weekly work: 
   VECTOR: https://editor.p5js.org/viola.zijing/sketches/nts--WjqE
   SWITCH SCENE: https://editor.p5js.org/Miya_W/sketches/j8NKKJIDO
   EAT FOOD:https://editor.p5js.org/viola.zijing/sketches/4tI6an-Gm

Chatgpt: 
   debug and sort out the logic of text, gif and image set in every drawscreen.
   teach me how to switch sence function:(from switch() -> function drawscreen1/2/3())   
   */

let currentScreen = 0;

let showMessage = false;
let messageDuration = 6000;
let messages = [];

let foodPoints = [];
let diameter = 30;

let gif1;
let gif2;
let gif3;
let img1;
let img2;
//---screen1---
let particleLife = [];

//---screenTest---
let typesNum = 2;
let pallete = ["red", "blue"];
let particlePower;
let particles;
let particlesNum = 200;
let minEye = 30;
let maxEye = 100;
let speedLimit = 10;

//---screenEating---
let flock;
let foods = [];


function preload() {
  img1 = loadImage("mouse-click.png");
  //img2 = loadImage("cover1.jpeg")
}

function setup() {
  //createCanvas(600, 600);
  createCanvas(windowWidth, windowHeight);
  background(20);
  textSize(14);
  textAlign(CENTER, CENTER);
  gif1 = createImg("newkeyboard.gif", () => { });
  gif2 = createImg("spacebar.gif", () => { });
  gif3 = createImg("mouseclick.gif", () => { });
  
  gif1.style("display", "block");
  gif1.position(10, 10);
  gif1.size(670 / 11, 325 / 11);
  // gif1.position(windowWidth - gif1.width * 2, windowHeight - gif1.height);
  // gif1.size(gif1.width / (windowWidth /20), gif1.height / (windowHeight / 20));

  gif2.style("display", "block");
  gif2.position(10, 80);
  gif2.size(233 / 3, 78 / 3);

  gif3.style("display", "block");
  gif3.position(110, 15);
  gif3.size(233 / 4, 78 / 4);

  gif1.show();
  gif2.show();
  gif3.hide();

  particles = new Particles();
  noStroke();
  ellipseMode(CENTER);

  //screen-eating
  flock = new Flock();
  // Add an initial set of boids into the system
  for (let i = 0; i < 120; i++) {
    let boid = new Boid(random(width/2), random(height/2));
    flock.addBoid(boid);
  }
}

function draw() {

  if (currentScreen === 0) {
    drawScene0();
  }if (currentScreen === 1) {
    drawScene1();
  } else if (currentScreen === 2) {
    drawScene2();
  }else if (currentScreen === 3) {
    drawScene3();
  }
  displayMessages();

  
}

function displayMessages() {
  for (let i = messages.length - 1; i >= 0; i--) {
    let msg = messages[i];
    fill(msg.color[0], msg.color[1], msg.color[2], msg.alpha);
    text(msg.text, width / 2, msg.y);
    msg.y -= 1; // Move up
    msg.alpha -= 2; // Fade out
    if (msg.alpha <= 0) {
      messages.splice(i, 1); // Remove faded messages
    }
  }
}

function drawScene0() {
  fill(255, 255, 255);
  textSize(14);
  text("This project explores the lifecycle of Luminarae in a virtual world, from birth,\n coexistence to conflicts caused by competition for resources, \nreflecting similar societal phenomena in the real world",
    width / 2,
    height / 2);
  
  gif1.hide();
}

function drawScene1() {
  for (let i = 0; i < particleLife.length; i++) {
    particleLife[i].move();
    particleLife[i].bounce();
    particleLife[i].display();
  }

  gif1.show();
  gif2.show();
  gif3.show();
  
  //img.show();
  fill(255, 255, 255);
  textSize(10);
  text("OR", 90, 25);
  text("Press to create life", 55, 50);
  text("Press to enter the next scene 1/3", 90, 120);


  displayMessages();
}

function drawScene2() {
  //show food
  for (let i = foods.length - 1; i >= 0; i--) {
    foods[i].show();
    // 检查 Boids 是否吃到食物
    for (let boid of flock.boids) {
      if (boid.position.dist(foods[i].position) < 20 && boid.color === foods[i].color) {
        foods.splice(i, 1);
        break;
      }
    }
  }
  flock.run();
  gif3.style("display", "block");
  gif3.position(10, 15);
  gif3.size(233 / 4, 78 / 4);
  gif1.hide();
  gif2.show();
  gif3.show();
  fill(255, 255, 255);
  textSize(10);
  text("Feed the lives you created", 70, 50);
  text("Press to enter the next scene 2/3", 90, 120);
  displayMessages();
}

function drawScene3() {
  particlePower = updateparticlePower();
  // with (particles) {
  //   interact();
  //   calc();
  //   wrap();
  //   show();
  //   drawFood();
  // }
  particles.interact();
  particles.calc();
  particles.wrap();
  particles.show();
  //particles.drawFood();
  drawFood();

  fill(255, 255, 255);
  textSize(18);
  //text("click", 40, 30);
  if (showMessage && millis() - messageStartTime < messageDuration) {
    text(
      "You cannot stop the war! Food can't satisfy them anymore",
      width / 2,
      height / 2
    );
  } else {
    showMessage = false;
  }
  image(img1, 10, 10, 233 / 3, 78 / 3);
  gif1.hide();
  gif2.show();
  gif3.hide();
  fill(255, 255, 255);
  textSize(10);
  //text("Feed the lives you created", 70, 50);
  text("Press to enter the next scene 3/3", 90, 120 );
  text("Click", 20, 50);
  displayMessages();
}

let Particle = (type) => ({
  pos: createVector(random(width), random(height)),
  vel: createVector(0, 0),
  acc: createVector(0, 0),
  type: type,
  diameter: 20,
});

function drawFood() {
  for (let i = foodPoints.length - 1; i >= 0; i--) {
    let food = foodPoints[i];

    fill(255, 255, 255, food.lifetime);
    rect(food.position.x, food.position.y, 10, 10);

    food.lifetime -= 2;

    if (food.lifetime <= 0) {
      foodPoints.splice(i, 1);
    }
  }
}

function keyPressed() {
  // if (key === " ") {
  //   currentScreen = currentScreen === 1 ? 2 : 1;
  // }
  if (key === " ") {
    if (currentScreen === 0) {
      currentScreen = 1;
    } else if (currentScreen === 1) {
      currentScreen = 2;
    } else if (currentScreen === 2) {
      currentScreen = 3;
    } else if (currentScreen === 3) {
      currentScreen = 0;
    }
  }

  if (currentScreen === 1) {
    if (keyCode === LEFT_ARROW) {
      particleLife.push(
        new ParticleLife(
          random(10, 40),
          createVector(random(width), random(height)),
          createVector(random(-5, 5), random(-5, 5)),
          "red"
        )
      );

      let color = [255, 0, 0];
      messages.unshift({
        text: "You create a life!",
        y: height / 2,
        alpha: 255,
        color,
      });
    } else if (keyCode === RIGHT_ARROW) {
      particleLife.push(
        new ParticleLife(
          random(10, 40),
          createVector(random(width), random(height)),
          createVector(random(-5, 5), random(-5, 5)),
          "blue"
        )
      );

      let color = [0, 0, 255];
      messages.unshift({
        text: "You create a life!",
        y: height / 2,
        alpha: 255,
        color,
      });
    }
  }
}

function mousePressed() {
  if (currentScreen === 1) {
    if (mouseButton === LEFT) {
      particleLife.push(
        new ParticleLife(
          random(10, 40),
          createVector(random(width), random(height)),
          createVector(random(-5, 5), random(-5, 5)),
          "red"
        )
      );

      let color = [255, 0, 0];
      messages.unshift({
        text: "You create a life!",
        y: height / 2,
        alpha: 255,
        color,
      });
    } else if (mouseButton === RIGHT) {
      particleLife.push(
        new ParticleLife(
          random(10, 40),
          createVector(random(width), random(height)),
          createVector(random(-5, 5), random(-5, 5)),
          "blue"
        )
      );

      let color = [0, 0, 255];
      messages.unshift({
        text: "You create a life!",
        y: height / 2,
        alpha: 255,
        color,
      });
    }
  }
  else if (currentScreen === 2) {
    let foodColor = mouseButton === LEFT ? 'red' : 'blue';
    foods.push(new Foods(mouseX, mouseY, foodColor));
  }
  else if (currentScreen === 3) {
    foodPoints.push({ position: createVector(mouseX, mouseY), lifetime: 255 });
    showMessage = true;
    messageStartTime = millis();
  }
}

function updateparticlePower() {
  // if (currentScreen === 2) {
  let array = [];
  for (let j = 0; j < typesNum; j++) {
    array[j] = [];
    for (let i = 0; i < typesNum; i++) {
      array[j][i] = sin(100 * noise(i, j, frameCount / 3000));
    }
  }
  return array;
  // }
}

function displayMessages() {
  for (let i = messages.length - 1; i >= 0; i--) {
    let msg = messages[i];
    fill(msg.color[0], msg.color[1], msg.color[2], msg.alpha);
    text(msg.text, width / 2, msg.y);
    msg.y -= 1;
    msg.alpha -= 2;
    if (msg.alpha <= 0) {
      messages.splice(i, 1);
    }
  }
}
