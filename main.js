let CANVAS_HEIGHT = window.innerHeight * 19/20
let CANVAS_WIDTH = window.innerWidth * 19/20

let FRAME_RATE = 60;


let canvas
function setup() {
    canvas = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT)
    canvas.parent('p5')

    textSize(32  )

    canvas.mouseClicked(flap)
    
}

function preload() {
}

function keyPressed() {
    if(keyCode === 32) {
        flap();
    }
}

//let x = 0;
let y = CANVAS_HEIGHT/2;

function draw() {
    frameRate(FRAME_RATE)
    background('white')
    stroke('black')

    text('@', CANVAS_WIDTH/3, y)

    //x = x >= window.innerWidth ? 0 : ++x


    gravity();
}

function flap() {
    if(y > 0)   y -= 100
}

function gravity() {
    if(y < CANVAS_HEIGHT) { y += 5 }
}
