// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

// Boid class
// Methods for Separation, Cohesion, Alignment added

class Boid {
    constructor(x, y) {
      this.acceleration = createVector(0, 0);
      this.velocity = createVector(random(-1, 1), random(-1, 1));
      this.position = createVector(x, y);
      this.r = 3.0;
      this.maxspeed = 2; // Maximum speed
      this.maxforce = 0.03; // Maximum steering force
      this.color = random(['red', 'blue']);
    }
  
    run(boids) {
      this.flock(boids);
      this.update();
      this.borders();
      this.show();
    }
  
    applyForce(force) {
      // We could add mass here if we want A = F / M
      this.acceleration.add(force);
    }
  
    // We accumulate a new acceleration each time based on three rules
    flock(boids) {
      let sep = this.separate(boids); // Separation
      let ali = this.align(boids); // Alignment
      let coh = this.cohere(boids); // Cohesion
      let attractForce = this.attractToFoods(foods); // 计算吸引力
      //let avoidForce = this.avoidOtherColorBoids(boids); 
      
      
      // Arbitrarily weight these forces
      sep.mult(1.5);
      ali.mult(1.0);
      coh.mult(1.0);
      attractForce.mult(0.005); 
      //avoidForce.mult(0.001);
        
      // Add the force vectors to acceleration
      this.applyForce(sep);
      this.applyForce(ali);
        this.applyForce(coh);
        this.applyForce(attractForce);
        //this.applyForce(avoidForce);
    }
  
    // Method to update location
    update() {
      // Update velocity
      this.velocity.add(this.acceleration);
      // Limit speed
      this.velocity.limit(this.maxspeed);
      this.position.add(this.velocity);
      // Reset accelertion to 0 each cycle
        this.acceleration.mult(0);
        
    }
    attractToFoods(foods) {
        let steeringForce = createVector(0, 0);
        for (let food of foods) {
          if (this.color === food.color) {
            let attraction = p5.Vector.sub(food.position, this.position);
            
            steeringForce.add(attraction);
          }
        }
        return steeringForce;
      }
    
      avoidOtherColorBoids(boids) {
        let avoidanceForce = createVector(0, 0);
        for (let other of boids) {
            if (this.color !== other.color) {
                let avoidance = p5.Vector.sub(this.position, other.position);
            
                avoidanceForce.add(avoidance);
            }
        }
        return avoidanceForce;
      }
    
    flee(target) {
        
    }
    
    // A method that calculates and applies a steering force towards a target
    // STEER = DESIRED MINUS VELOCITY
    seek(target) {
      let desired = p5.Vector.sub(target, this.position); // A vector pointing from the location to the target
      // Normalize desired and scale to maximum speed
        desired.normalize();
        
      desired.mult(this.maxspeed);
      // Steering = Desired minus Velocity
      let steer = p5.Vector.sub(desired, this.velocity);
        steer.limit(this.maxforce); // Limit to maximum steering force

      let force = p5.Vector.sub(target, this.position);
        //desired.setMag(this.maxspeed);
        force.setMag(this.maxspeed);
        force.sub(this.vel);
        force.limit(this.maxforce);
        force.mult(-0.1);
        //return force;
        
      return steer;
    }

    show() {
      let angle = this.velocity.heading() + radians(90); // Direction of the boid
      let outerColor, middleColor, innerColor;
      //let currentDiameter = 24; 
      let currentDiameter = sin(frameCount * 0.1) * (this.diameter / 4) + this.diameter;

    // Define colors based on the boid's color property
    if (this.color === 'red') {
      outerColor = 'rgba(255, 0, 0, 0.3)';
      middleColor = 'rgba(255, 0, 0, 0.5)';
      innerColor = 'rgb(255, 100, 100)';
      this.diameter = 20;
    } else if (this.color === 'blue') {
      outerColor = 'rgba(0, 0, 255, 0.3)';
      middleColor = 'rgba(0, 0, 255, 0.5)';
      innerColor = 'rgb(100, 100, 255)';
      this.diameter = 30;
    }

    // Drawing the three-layered ellipse
    push();
    translate(this.position.x, this.position.y);
    rotate(angle);
    noStroke();
    fill(outerColor);
    ellipse(0, 0, currentDiameter * 1.2); // Outer layer
    fill(middleColor);
    ellipse(0, 0, currentDiameter * 0.75); // Middle layer
    fill(innerColor);
    ellipse(0, 0, currentDiameter * 0.5); // Inner layer
    pop();
    } 
    
    
  
    // Wraparound
    borders() {
      if (this.position.x < -this.r) this.position.x = width + this.r;
      if (this.position.y < -this.r) this.position.y = height + this.r;
      if (this.position.x > width + this.r) this.position.x = -this.r;
      if (this.position.y > height + this.r) this.position.y = -this.r;
    }
    
    // Separation
    // Method checks for nearby boids and steers away
    separate(boids) {
      let desiredSeparation = 25;
      let steer = createVector(0, 0);
      let count = 0;
      // For every boid in the system, check if it's too close
      for (let i = 0; i < boids.length; i++) {
        let d = p5.Vector.dist(this.position, boids[i].position);
        // If the distance is greater than 0 and less than an arbitrary amount (0 when you are yourself)
        if (d > 0 && d < desiredSeparation) {
          // Calculate vector pointing away from neighbor
          let diff = p5.Vector.sub(this.position, boids[i].position);
          diff.normalize();
          diff.div(d); // Weight by distance
          steer.add(diff);
          count++; // Keep track of how many
        }
      }
      // Average -- divide by how many
      if (count > 0) {
        steer.div(count);
      }
  
      // As long as the vector is greater than 0
      if (steer.mag() > 0) {
        // Implement Reynolds: Steering = Desired - Velocity
        steer.normalize();
        steer.mult(this.maxspeed);
        steer.sub(this.velocity);
        steer.limit(this.maxforce);
      }
      return steer;
    }
  
    // Alignment
    // For every nearby boid in the system, calculate the average velocity
    align(boids) {
      let neighborDistance = 50;
      let sum = createVector(0, 0);
      let count = 0;
      for (let i = 0; i < boids.length; i++) {
        let d = p5.Vector.dist(this.position, boids[i].position);
        if (d > 0 && d < neighborDistance) {
          sum.add(boids[i].velocity);
          count++;
        }
      }
      if (count > 0) {
        sum.div(count);
        sum.normalize();
        sum.mult(this.maxspeed);
        let steer = p5.Vector.sub(sum, this.velocity);
        steer.limit(this.maxforce);
        return steer;
      } else {
        return createVector(0, 0);
      }
    }
  
    // Cohesion
    // For the average location (i.e. center) of all nearby boids, calculate steering vector towards that location
    cohere(boids) {
      let neighborDistance = 50;
      let sum = createVector(0, 0); // Start with empty vector to accumulate all locations
      let count = 0;
      for (let i = 0; i < boids.length; i++) {
        let d = p5.Vector.dist(this.position, boids[i].position);
        if (d > 0 && d < neighborDistance) {
          sum.add(boids[i].position); // Add location
          count++;
        }
      }
      if (count > 0) {
        sum.div(count);
        return this.seek(sum); // Steer towards the location
      } else {
        return createVector(0, 0);
      }
    }
  }
  