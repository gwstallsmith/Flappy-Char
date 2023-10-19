let CANVAS_HEIGHT = window.innerHeight * 19/20 > 1000 ? 1000 : window.innerHeight * 19/20 
let CANVAS_WIDTH = window.innerWidth * 19/20 > 500 ? 500 : window.innerWidth * 19/20

let FRAME_RATE = 60;

//let upVector = createVector(0, 100);


class GameManager {
    constructor() { 
        this.gameObjects = []; 
    }

    static Priority = {
        LOW: 1,
        MEDIUM: 2,
        HIGH: 3
    }

    queue(gameObject)   { 
        this.gameObjects.push(gameObject);
        this.changed = true;
    }

}

class GameObject {
    constructor (x, y) {
        this.position = new p5.Vector(x, y);
        this.collider = false;
        this.priority = GameManager.Priority.LOW;
    }
}

class Bird extends GameObject{
    constructor() {
        super()
        this.position = createVector(CANVAS_WIDTH / 6, CANVAS_HEIGHT / 2); 

        this.char_ = '@'
    }


    update() {
        velocity.add(gravity); // Add gravity to the velocity.
        this.position.add(velocity); // Update bird's position based on velocity.
    
        if (this.position.y > CANVAS_HEIGHT) {
          this.position.y = CANVAS_HEIGHT; // Keep the bird within the canvas.
          velocity.mult(0); // Reset velocity when it hits the ground.
        }
      }
    
      display() {
        stroke('black');
        text(this.char_, this.position.x, this.position.y);
      }
    
      flap() {
        velocity.y = -5; // Give the bird an upward velocity to simulate a flap.
      }

}



let canvas
let bird

function setup() {
    canvas = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT)
    canvas.parent('p5')

    textSize(32)

    bird = new Bird();

    
}

function preload() {
    gravity = createVector(0, 0.2); // Define gravity as a vector.
    velocity = createVector(0, 0); // Initialize velocity vector.
}

function keyPressed() {
    if(keyCode === 32) {
        bird.flap();
    }
}

 
function mouseReleased() {
    bird.flap()
}
  

function draw() {
    frameRate(FRAME_RATE)
    background('white')
    stroke('black')

    bird.display();
    
    bird.update();


}

function main() {
    
}
