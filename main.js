const CANVAS_HEIGHT = window.innerHeight * 19/20 > 800 ? 800 : window.innerHeight * 19/20
const CANVAS_WIDTH = window.innerWidth * 19/20 > 500 ? 500 : window.innerWidth * 19/20

const FONT_SIZE = 32;

const FRAME_RATE = 90;


let colors = [];
let numColors = 360


class GameManager {
    constructor() { 
        this.gameObjects = [];
        this.gameObjects.push(new Pipe)

        this.bird_ = new Bird

        this.score_ = 0;

        this.playing_ = false;
    }

    start() { this.playing_ = true; }
    stop() { this.playing_ = false; }

    getBird() { return this.bird_ }

    getPipe() { return this.gameObjects[0] }

    addPoint() { this.score_++ }

    enqueue(gameObject)   {
        this.gameObjects.push(gameObject);
    }

    dequeue(gameObject) { 
        this.gameObjects.splice(this.gameObjects.indexOf(gameObject), 1)
    }

    render() {
        if(this.playing_) {
            this.gameObjects[0].display()
            this.gameObjects[0].update()


            this.displayScore()

            this.bird_.display();
            this.bird_.update();
            this.checkCollision()

        } else {
            textSize(28)
            text("Press space to start\n\t\tOr tap to start", CANVAS_WIDTH/8, CANVAS_HEIGHT/10)
            textSize(FONT_SIZE)
            this.bird_.display() 
            this.gameObjects[0].display()

        }
    }

    displayScore() {


        let digits = this.score_
        let accum = 1

        while(digits > 9) {
            digits = digits % 10;
            accum++
        }
        stroke('black')
        fill('white')

        rect(CANVAS_WIDTH/2 - FONT_SIZE*accum, CANVAS_HEIGHT/10 - FONT_SIZE*7/8, FONT_SIZE*accum*3/2, FONT_SIZE)
        fill('black')
        text(this.score_, CANVAS_WIDTH/2 - FONT_SIZE/2*accum, CANVAS_HEIGHT/10)
    }

    checkCollision() {

        if(((this.gameObjects[0].getPos().x < CANVAS_WIDTH / 6 + FONT_SIZE) && !(this.gameObjects[0].getPos().x < CANVAS_WIDTH / 6 - this.gameObjects[0].pipe_.width))
        && ((this.bird_.getPos().y - FONT_SIZE/2 < this.gameObjects[0].pipe_.topHeight) || (this.bird_.getPos().y + FONT_SIZE/8 > this.gameObjects[0].pipe_.botY))) {
            this.gameOver()

        }
    }

    gameOver() {
        this.stop()
        let TempMan = new GameManager
        GameMan = TempMan

    }

}

class GameObject {
    constructor (x, y) {
        this.position_ = new p5.Vector(x, y)
        this.collider = false;
    }

    getPos() { return this.position_ }

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

            width:4*FONT_SIZE,

            topHeight: this.opening_,
            botHeight: CANVAS_HEIGHT - this.opening_
        }

        this.newPipe_ = true;
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
            GameMan.enqueue(new Pipe)
            GameMan.dequeue(this)
            GameMan.addPoint()
        }
    }



}

class Bird extends GameObject {
    constructor() {
        super()
        this.position_ = createVector(CANVAS_WIDTH / 6, CANVAS_HEIGHT / 2)

        this.display_ = '@'
    }

    display() {
        stroke('black');
        textSize(FONT_SIZE +1)

        text(this.display_, this.position_.x+ FONT_SIZE/20, this.position_.y+ FONT_SIZE/20)


        let currentColor = colors[frameCount % numColors];
        textSize(FONT_SIZE)
        fill(currentColor)
        text(this.display_, this.position_.x + FONT_SIZE/20, this.position_.y + FONT_SIZE/20)

        fill('black');
        
        textSize(FONT_SIZE -1)

        text(this.display_, this.position_.x, this.position_.y)



    }



    update() {
        birdVelocity.add(gravity) // Add gravity to the velocity.
        this.position_.add(birdVelocity) // Update bird's position based on velocity.
    

        if (this.position_.y > CANVAS_HEIGHT) {
          GameMan.gameOver()
        }
      }
    
    
    flap() {
        birdVelocity.y = -5.5 // Give the bird an upward velocity to simulate a flap.
    }

}



let canvas
let bird
let GameMan
let pipe


function setup() {
    canvas = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT)
    canvas.parent('p5')

    colorMode(HSB, 360, 100, 100);

    textSize(FONT_SIZE)
    textLeading(FONT_SIZE);

    GameMan = new GameManager()
    bird = new Bird()
    pipe = new Pipe();

    for (let i = 0; i < numColors; i++) {
        let hue = map(i, 0, numColors, 0, 360);
        let saturation = 100;
        let brightness = 100;
        colors.push(color(hue, saturation, brightness));
    }


}

function preload() {
    gravity = createVector(0, 0.2); // Define gravity as a vector.
    birdVelocity = createVector(0, 0); // Initialize velocity vector.
    pipeVelocity = createVector(-4, 0);

}

function keyPressed() {
    if(keyCode === 32) {
        GameMan.start()
        GameMan.getBird().flap()
    }
}

 
function mouseReleased() {
    GameMan.start()
    bird.flap()
}
  

function draw() {
    noStroke();
    frameRate(FRAME_RATE)
    background('white')
    stroke('black')

    GameMan.render();



}

