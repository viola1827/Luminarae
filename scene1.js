class ParticleLife {
  constructor(diameter, position, velocity, color) {
    this.diameter = diameter;
    this.position = position;
    this.velocity = velocity;
    this.color = color; // Add color property
    this.particleLife = [];
    this.particles = [];
  }

  move() {
    this.position.add(this.velocity);
  }

  createParticleLife(color) {
    let newParticle = new ParticleLife(
      random(20, 50),
      createVector(random(width), random(height)),
      createVector(random(-5, 5), random(-5, 5)),
      color
    );
    this.particleLife.push(newParticle);
    
  }
  
  createParticle(color) {
    
    let newParticle = new Particle(random(10, 40),
      createVector(random(width), random(height)),
      createVector(random(-5, 5), random(-5, 5)),
      color);
    this.particles.push(newParticle);
    
  }

  bounce() {
    if (
      this.position.x < this.diameter / 2 ||
      this.position.x > width - this.diameter / 2
    ) {
      this.velocity.x *= -1;
    }
    if (
      this.position.y < this.diameter / 2 ||
      this.position.y > height - this.diameter / 2
    ) {
      this.velocity.y *= -1;
    }
  }

  display() {
    noStroke();
    // Use the color property
    if (this.color === "red") {
      fill(255, 0, 0, 60);
    } else if (this.color === "blue") {
      fill(0, 0, 255, 60);
    }
    let currentDiameter =
      sin(frameCount * 0.1) * (this.diameter / 4) + this.diameter;
    circle(this.position.x, this.position.y, currentDiameter);

    // Adjust inner circles based on main color
    if (this.color === "red") {
      fill(255, 0, 0, 40);
    } else if (this.color === "blue") {
      fill(0, 0, 255, 40);
    }
    circle(this.position.x, this.position.y, this.diameter / 1.3);

    if (this.color === "red") {
      fill(255, 100, 100);
    } else if (this.color === "blue") {
      fill(100, 100, 255);
    }
    circle(this.position.x, this.position.y, this.diameter / 5.0);
  }

//   keyPressed() {
//     if (keyCode === LEFT_ARROW) {
//     particleLife.push(
//           new ParticleLife(random(10, 40),
//               createVector(random(width), random(height)), 
//               createVector(random(-5, 5), random(-5, 5)),
//               'red'
//           )
//       );

//     let color = [255, 0,0];
//     messages.unshift({ text: "You create a life!", y: height / 2, alpha: 255, color});
//   } else if (keyCode === RIGHT_ARROW) {  
//      particle.push(
//           new ParticleLife(random(10, 40),
//               createVector(random(width), random(height)), 
//               createVector(random(-5, 5), random(-5, 5)),
//               'blue'
//           )
//       );
//       let color = [0, 0, 255];
//       messages.unshift({ text: "You create a life!", y: height / 2, alpha: 255, color });
//     //   showMessage = true;
//     //   messageStartTime = millis();
// }
//   }
}
