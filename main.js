const CANVAS_HEIGHT = window.innerHeight * 19/20 > 800 ? 800 : window.innerHeight * 19/20
const CANVAS_WIDTH = window.innerWidth * 19/20 > 400 ? 400 : window.innerWidth * 19/20

const FONT_SIZE = 32;

const FRAME_RATE = 120;


let colors = [];
let numColors = 360


class GameManager {
    constructor() { 
        this.pipes_ = []
        this.pipes_.push(new Pipe)        


        this.bird_ = new Bird

        this.background_ = new Background

        this.score_ = 0
        this.playing_ = false

    }


    getPlaying() { return this.playing_ }

    start() { this.playing_ = true }
    stop() { this.playing_ = false }

    getBird() { return this.bird_ }

    getPipe() { return this.pipes_[0] }

    addPoint() { this.score_++ }

    enqueuePipe(pipe)   {
        this.pipes_.push(pipe);
    }

    dequeuePipe(pipe) { 
        this.pipes_.splice(this.pipes_.indexOf(pipe), 1)
    }

    render() {
        //this.background_.display()

        if(!this.playing_) {
            this.displayMenu()
        } else {
            this.background_.update()

            this.pipes_[0].display()
            this.pipes_[0].update()


            this.displayScore()

            this.bird_.display()
            this.bird_.update()
            this.checkCollision(this.pipes_[0], this.bird_)
        }
    }


    displayMenu() {
        
        this.pipes_[0].display()
        stroke('black')
        strokeWeight(3)
        fill('white')
        text("Tap to start", CANVAS_WIDTH/2, CANVAS_HEIGHT/2)
        this.displayScore()

        textSize(FONT_SIZE)
        strokeWeight(1)
        stroke('black')
        this.bird_.display() 


    }

    displayScore() {
        let LOCAL_FS = 64
        textSize(LOCAL_FS)


        stroke('black')
        strokeWeight(LOCAL_FS/20)

        if(this.score_ >= 10) {
            let currentColor = colors[frameCount % numColors];
            fill(currentColor)
        } else {
            fill('white')
        }

        text(this.score_, CANVAS_WIDTH/2, CANVAS_HEIGHT/10)
        strokeWeight(1)

    }

    checkCollision(pipe, bird) {

        // if bird and pipe can even touch
        if((pipe.getPos().x - bird.getPos().x - FONT_SIZE/2) < 0 && (pipe.getPos().x + pipe.pipe_.width > bird.getPos().x)) {
            // if bird hit top pipe
            if((pipe.pipe_.topHeight - bird.getPos().y + FONT_SIZE*3/4) > 0) {
                this.gameOver()                
            }
            // if bird hit bottom pipe
            if((pipe.pipe_.botY - bird.getPos().y - FONT_SIZE*1/4) < 0) {
                this.gameOver()     
            }

        }
    }

    gameOver() {
        this.stop()

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

class Background extends GameObject {
    constructor() {
        super()

        this.display_ = '/'
    }

    display() {
        let curveHeight = CANVAS_HEIGHT/2 - (FONT_SIZE * Math.sin(frameCount/(Math.PI*12)))

        fill('grey')
        strokeWeight(0)
        text(this.display_, this.position_.x, curveHeight)

        //for(let i = 0; i < CANVAS_WIDTH + FONT_SIZE; i += FONT_SIZE/2) {
        //    for(let j = CANVAS_HEIGHT/2; j < CANVAS_HEIGHT; j += FONT_SIZE/2) {
        //        text(this.display_, i, curveHeight +j)
        //    }
        //}


    }

    update() {
        this.position_.add(backgroundVelocity)

        if(this.position_.x < 0) {
            this.position_.x = CANVAS_WIDTH
        }
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
            GameMan.enqueuePipe(new Pipe)
            GameMan.dequeuePipe(this)
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

        fill('black');
        
        textSize(FONT_SIZE)

        //rect(this.position_.x - FONT_SIZE/2, this.position_.y - FONT_SIZE*3/4, 50, 50)

        text(this.display_, this.position_.x, this.position_.y)


        let currentColor = colors[frameCount % numColors];
        textSize(FONT_SIZE)
        fill(currentColor)
        text(this.display_, this.position_.x - FONT_SIZE/20, this.position_.y - FONT_SIZE/20)

    }



    update() {
        birdVelocity.add(gravity) // Add gravity to the velocity.
        this.position_.add(birdVelocity) // Update bird's position based on velocity.
    

        if (this.position_.y > CANVAS_HEIGHT) {
          GameMan.gameOver()
        }
      }
    
    
    flap() {
        birdVelocity.y = -8 // Give the bird an upward velocity to simulate a flap.
    }

}



let canvas
let bird
let GameMan
let pipe
let frameCount


function setup() {
    canvas = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT)
    canvas.parent('p5')

    colorMode(HSB, 360, 100, 100);

    textSize(FONT_SIZE)
    textLeading(FONT_SIZE);
    textAlign(CENTER)

    frameCount = 0;

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
    gravity = createVector(0, 0.5); // Define gravity as a vector.
    birdVelocity = createVector(0, 0); // Initialize velocity vector.
    pipeVelocity = createVector(-4, 0);
    backgroundVelocity = createVector(-2, 0);

}

function keyPressed() {
    if(keyCode === 32) {
        if(!GameMan.getPlaying()) {
            let TempMan = new GameManager
            GameMan = TempMan    
        }

        GameMan.start()

        GameMan.getBird().flap()
    }
}

 
function mouseReleased() {
    if(!GameMan.getPlaying()) {

        // Logic for where we're clicking



        let TempMan = new GameManager
        GameMan = TempMan    
    }

    GameMan.start()
    bird.flap()
}
  

function draw() {
    noStroke();
    frameRate(FRAME_RATE)
    background('white')
    stroke('black')

    GameMan.render();
    if(GameMan.getPlaying()) {
        frameCount++
    }

}

