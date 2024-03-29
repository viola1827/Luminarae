class Particles {
  constructor() {
    this.particles = [];
    this.diameter = diameter;



    for (let i = particlesNum; i--;) {
      let diameter = random(20, 40)
      this.particles.push(Particle(i % typesNum, createVector(0, 0), createVector(0, 0), diameter));
    }
  }

  interact() {
    for (let current of this.particles) {
      for (let other of this.particles) {
        let delta = p5.Vector.sub(current.pos, other.pos);
        let dis = Math.hypot(delta.x, delta.y);
        if (dis < 1) {
          other.vel.sub(
            p5.Vector.sub(other.pos, createVector(width / 2, height / 2)).limit(
              0.1
            )
          );
        } else if (minEye < dis && dis < maxEye) {
          let force = delta.div(dis).mult(maxEye - dis);
          force.mult(particlePower[current.type][other.type]);
          current.acc.add(force);
        }
      }
    }
  }

  calc() {
    for (let p of this.particles) {
      p.vel.add(p.acc.mult(0.001));
      p.vel.limit(speedLimit);
      p.pos.add(p.vel);
      p.vel.mult(0.9);
      p.acc.mult(0);
    }
  }

  wrap() {
    for (let p of this.particles) {
      if (p.pos.x < 0) {
        p.pos.x = 0;
        p.vel.x = abs(p.vel.x);
      } else if (p.pos.x > width) {
        p.pos.x = width;
        p.vel.x = -abs(p.vel.x);
      }
      if (p.pos.y < 0) {
        p.pos.y = 0;
        p.vel.y = abs(p.vel.y);
      } else if (p.pos.y > height) {
        p.pos.y = height;
        p.vel.y = -abs(p.vel.y);
      }
    }
  }

  show() {
    for (let p of this.particles) {
      let outerColor, middleColor, innerColor;
      let currentDiameter = sin(frameCount * 0.1) * (this.diameter / 4) + this.diameter;
      if (p.type === 0) {
        outerColor = 'rgba(255, 0, 0, 0.3)';  // Use RGBA string format
        middleColor = 'rgba(255, 0, 0, 0.4)';
        innerColor = 'rgb(255, 100, 100)';
        diameter = 20;
      } else if (p.type === 1) {
        outerColor = 'rgba(0, 0, 255, 0.3)';
        middleColor = 'rgba(0, 0, 255, 0.5)';
        innerColor = 'rgb(100, 100, 255)';
        diameter = 30;
      } else {
        console.error('Invalid particle type or color not set', p);
        continue; // Skip this iteration to prevent errors
      }

      fill(outerColor);
      ellipse(p.pos.x, p.pos.y, currentDiameter);

      fill(middleColor);
      ellipse(p.pos.x, p.pos.y, this.diameter / 1.3);

      fill(innerColor);
      ellipse(p.pos.x, p.pos.y, this.diameter / 5.0);
    }
  }

  feed(feedPoint, strength) {
    for (let p of this.particles) {
      let forceDirection = p5.Vector.sub(feedPoint, p.pos);
      let dis = forceDirection.mag();
      let forceMagintude = strength / dis;
      forceDirection.setMag(forceMagintude);
      p.acc.add(forceDirection);
    }
  }
}