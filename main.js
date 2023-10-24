const CANVAS_HEIGHT = window.innerHeight * 19/20 > 1000 ? 1000 : window.innerHeight * 19/20
const CANVAS_WIDTH = window.innerWidth * 19/20 > 500 ? 500 : window.innerWidth * 19/20

const FONT_SIZE = 28;

const FRAME_RATE = 60;


class GameManager {
    constructor() { 
        this.gameObjects = [];
        this.gameObjects.push(new Pipe)

        this.score_ = 0;
    }

    enqueue(gameObject)   {
        this.gameObjects.push(gameObject);
        ++this.score_;
    }

    dequeue(gameObject) { 
        this.gameObjects.splice(this.gameObjects.indexOf(gameObject), 1)
    }

    render() {
        this.gameObjects[0].display()
        this.gameObjects[0].update()

        this.displayScore()

    }

    displayScore() {
        stroke('white')
        fill(0,0,0)
        rect(CANVAS_WIDTH/2 - FONT_SIZE/4, CANVAS_HEIGHT/10 - FONT_SIZE *0.85, FONT_SIZE, FONT_SIZE)
        stroke('black')
        fill(255,255,255)
        text(this.score_, CANVAS_WIDTH/2, CANVAS_HEIGHT/10)
    }

}

class GameObject {
    constructor (x, y) {
        this.position_ = new p5.Vector(x, y)
        this.collider = false;
    }


    update() {
        this.position_.add(pipeVelocity)
    
        if (this.position_.x < 0) {
          this.position_.x = CANVAS_WIDTH // Keep the bird within the canvas.
        }
      }
    
    display() {
        stroke('black');
        fill('black');
        text(this.display_, this.position_.x, this.position_.y)
    }

}

class Pipe extends GameObject {
    constructor() {
        super()
        this.position_ = createVector(CANVAS_WIDTH, -FONT_SIZE)

        do {
            this.opening_ = Math.ceil(CANVAS_HEIGHT * Math.random())
        } while((this.opening_ < 0.1*CANVAS_HEIGHT || this.opening_ > 0.8*CANVAS_HEIGHT))

        this.pipe_ = { 
            x: this.position_.x,
            topY: 0,
            botY: this.opening_ +  4 * FONT_SIZE,

            
            width:2*FONT_SIZE,

            topHeight: this.opening_,
            botHeight: CANVAS_HEIGHT - this.opening_
        }
    }

    display() {
        fill(0,0,0)
        stroke('black')
        rect(this.position_.x, this.pipe_.topY, this.pipe_.width, this.pipe_.topHeight)
        rect(this.position_.x, this.pipe_.botY, this.pipe_.width, this.pipe_.botHeight)
        
    }

    update() {
        this.position_.add(pipeVelocity)
    
        if (this.position_.x < -this.pipe_.width) {
            this.position_.x = CANVAS_WIDTH // pop off pipe stack in manager
            GameMan.dequeue(this)
            GameMan.enqueue(new Pipe)
        }
    }



}

class Bird extends GameObject {
    constructor() {
        super()
        this.position_ = createVector(CANVAS_WIDTH / 6, CANVAS_HEIGHT / 2)

        this.display_ = '@'
    }


    update() {
        birdVelocity.add(gravity) // Add gravity to the velocity.
        this.position_.add(birdVelocity) // Update bird's position based on velocity.
    
        if (this.position_.y > CANVAS_HEIGHT) {
          this.position_.y = CANVAS_HEIGHT // Keep the bird within the canvas.
          birdVelocity.mult(0) // Reset velocity when it hits the ground.
        }
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

    textSize(FONT_SIZE)
    textLeading(FONT_SIZE);

    GameMan = new GameManager()
    bird = new Bird()
    pipe = new Pipe();
}

function preload() {
    gravity = createVector(0, 0.2); // Define gravity as a vector.
    birdVelocity = createVector(0, 0); // Initialize velocity vector.
    pipeVelocity = createVector(-3.5, 0);

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

    GameMan.render();

    bird.display();

    bird.update();


}

