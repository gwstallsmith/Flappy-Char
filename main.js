const CANVAS_HEIGHT = window.innerHeight * 3/4 > 1000 ? 1000 : window.innerHeight * 3/4  
const CANVAS_WIDTH = window.innerWidth * 19/20 > 500 ? 500 : window.innerWidth * 19/20

const FONT_SIZE = 28;

const FRAME_RATE = 60;

// PC == Pipe Chars
const PC = [' ', '┃', '━', '┏', '┓', '┗', '┛']


class GameManager {
    constructor() { 
        this.gameObjects = []; 
    }



}

class GameObject {
    constructor (x, y) {
        this.position_ = new p5.Vector(x, y)
        this.collider = false;
    }

    static PipeParts = {
        TOP: PC[3] + PC[2] + PC[4] + '\n',
        BOTTOM: PC[5] + PC[2] + PC[6] + '\n',
        SIDE: PC[1] + PC[0] + PC[0] + PC[1] + '\n',
        AIR: '\n'
    }

    update() {
        this.position_.add(pipeVelocity)
    
        if (this.position_.x < 0) {
          this.position_.x = CANVAS_WIDTH // Keep the bird within the canvas.
        }
      }
    
    display() {
        stroke('black');
        text(this.char_, this.position_.x, this.position_.y)
    }


}

class Pipe extends GameObject {
    constructor() {
        super()
        this.position_ = createVector(CANVAS_WIDTH, -FONT_SIZE)

        this.opening_ = CANVAS_HEIGHT/2//Math.ceil(CANVAS_HEIGHT * Math.random())

        for(let i = -FONT_SIZE; i < CANVAS_HEIGHT + FONT_SIZE; i += FONT_SIZE) {

            if(Math.abs(this.opening_ - i) < FONT_SIZE) {
                this.char += GameObject.PipeParts.BOTTOM
                
                console.log('BOT', GameObject.PipeParts.BOTTOM)
                   
            } else if(Math.abs(this.opening_ - i) < 3*FONT_SIZE) {
                this.char_ += GameObject.PipeParts.AIR
                console.log('AIR')


            } else {
                this.char_ += GameObject.PipeParts.SIDE
                console.log('SIDE')

            }


        }

    }

    update() {
        this.position_.add(pipeVelocity) // Update bird's position based on velocity.
    
        if (this.position_.x < -100) {
          this.position_.x = CANVAS_WIDTH // Keep the bird within the canvas.
          this.opening_ = Math.ceil(CANVAS_HEIGHT * Math.random())
        }
      }




}

class Bird extends GameObject {
    constructor() {
        super()
        this.position_ = createVector(CANVAS_WIDTH / 6, CANVAS_HEIGHT / 2)

        this.char_ = '@'
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
