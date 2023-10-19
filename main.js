let CANVAS_HEIGHT = window.innerHeight * 19/20
let CANVAS_WIDTH = window.innerWidth * 19/20

let FRAME_RATE = 60;

//let upVector = createVector(0, 100);

class Bird {
    constructor() {
        this.y_ = CANVAS_HEIGHT/2
        this.x_ = CANVAS_WIDTH

        this.char_ = '@'
    }


    drawBird() {
        text(this.char_, this.x_, this.y_);
    }

    flap() {
        if(this.y_ > 0) {
            this.y_ -= 100
        }
    }

    gravity(gravity = 5) {
        if(this.y_ < CANVAS_HEIGHT) {
            this.y_ -= gravity;
        }
    }

}





let canvas
let bird

function setup() {
    canvas = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT)
    canvas.parent('p5')

    textSize(32)

    bird = new Bird();



    canvas.mouseClicked(bird.flap())
    
}

function preload() {
}

function keyPressed() {
    if(keyCode === 32) {
        bird.flap();
    }
}


function draw() {
    frameRate(FRAME_RATE)
    background('white')
    stroke('black')

    bird.drawBird();
    
    bird.gravity();
}

function main() {
    
}
