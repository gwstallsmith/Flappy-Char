let CANVAS_HEIGHT = window.innerHeight * 19/20 > 1000 ? 1000 : window.innerHeight * 19/20 
let CANVAS_WIDTH = window.innerWidth * 19/20 > 500 ? 500 : window.innerWidth * 19/20

let FRAME_RATE = 60;

class GameManager {
    constructor() { 
        this.gameObjects = []; 
    }


    queue(gameObject)   { 
        this.gameObjects.push(gameObject)
    }

}

class GameObject {
    constructor (x, y) {
        this.position = new p5.Vector(x, y)
        this.collider = false;
    }
}

class Pipe extends GameObject {
    constructor() {
        super()
        this.position = createVector(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2)

        this.char_ = '|'
    }

    update() {
        this.position.add(pipeVelocity)
    
        if (this.position.x < 0) {
          this.position.x = CANVAS_WIDTH // Keep the bird within the canvas.
        }
      }
    
    display() {
        stroke('black');
        text(this.char_, this.position.x, this.position.y)
    }



}

class Bird extends GameObject {
    constructor() {
        super()
        this.position = createVector(CANVAS_WIDTH / 6, CANVAS_HEIGHT / 2)

        this.char_ = '@'
    }


    update() {
        birdVelocity.add(gravity) // Add gravity to the velocity.
        this.position.add(birdVelocity) // Update bird's position based on velocity.
    
        if (this.position.y > CANVAS_HEIGHT) {
          this.position.y = CANVAS_HEIGHT // Keep the bird within the canvas.
          birdVelocity.mult(0) // Reset velocity when it hits the ground.
        }
      }
    
    display() {
        stroke('black');
        text(this.char_, this.position.x, this.position.y)
    }
    
    flap() {
        birdVelocity.y = -5 // Give the bird an upward velocity to simulate a flap.
    }

}



let canvas
let bird
let GameMan
let pipe
function setup() {
    canvas = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT)
    canvas.parent('p5')

    textSize(32)

    GameMan = new GameManager()
    bird = new Bird()
    pipe = new Pipe();
}

function preload() {
    gravity = createVector(0, 0.2); // Define gravity as a vector.
    birdVelocity = createVector(0, 0); // Initialize velocity vector.
    pipeVelocity = createVector(-1  , 0);

}

function keyPressed() {
    if(keyCode === 32) {
        bird.flap()
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
    pipe.display();

    bird.update();
    pipe.update();

}

function main() {
    
}
