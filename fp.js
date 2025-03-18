let board;
let boardWidth = 480;
let boardHeight = 720;
let context;

let birdWidth = 34;
let birdHeight = 24;
let birdX = boardWidth/8;
let birdY = boardHeight/2;
let birdimg;

let bird = {
    width:birdWidth,
    height:birdHeight,
    x:birdX,
    y:birdY
}

let pipeArray = [];
let pwidth = 64;
let pheight = 512;
let px = boardWidth;
let py = 0;

let toppipeimg;
let bottompipeimg;

let velocityx = -3; 
let velocityY = 0;
gravity = 0.2;

let gameover = false;
let score = 0;
let topScore = 0;

window.onload = function() {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");
    
    birdimg = new Image();
    birdimg.src = "./flappybird.png";
    birdimg.onload = function() {
        context.drawImage(birdimg, bird.x, bird.y, bird.width, bird.height);
    }

    toppipeimg = new Image();
    toppipeimg.src = "./toppipe.png";

    bottompipeimg = new Image();
    bottompipeimg.src = "./bottompipe.png";
   
    setInterval(generatepipe,900);

    update();
    
    document.addEventListener("keydown",moveBird);
    document.addEventListener("keydown",reset);

}

function update(){
    requestAnimationFrame(update);

    if(gameover){
        displayGameOver();
        return;
    }

    context.clearRect(0,0,board.width,board.height);

    velocityY += gravity;
    bird.y = Math.max(bird.y + velocityY , 0);
    context.drawImage(birdimg, bird.x, bird.y, bird.width, bird.height);

    if (bird.y > board.height){
        gameover = true;
    }


    for(let i = 0; i < pipeArray.length; i++){
        let p = pipeArray[i];
        p.x = p.x + velocityx;

        context.drawImage(p.img, p.x, p.y, p.width, p.height);

        UpdateScore(p);
        
        if(collisionDetection(bird, p)){
            gameover = true;
        }
    }
    
    while (pipeArray.length > 0 && pipeArray[0].x + pwidth < 0) {
        pipeArray.shift(); 
    }

    displayScore();
    displayTopscore();
}

function generatepipe(){

    if(gameover){
        return;
    }

    let randompy = py - pheight/4 - Math.random()*(pheight/2); 
    let opening = board.height/4;

    let toppipe = {
        img : toppipeimg,
        x : px,
        y : randompy,
        width : pwidth,
        height : pheight,
        passed : false

    }

    pipeArray.push(toppipe);

    let bottompipe ={
        img : bottompipeimg,
        x : px,
        y : randompy + pheight + opening,
        width : pwidth,
        height : pheight,
        passed : false
    }

    pipeArray.push(bottompipe);
}

function moveBird(e) {
    if(e.code == "Space" || e.code == "ArrowUp"){
        velocityY = -5;
        
    }
}

function collisionDetection(bird, pipe){
    return bird.x < pipe.x + pipe.width &&
           bird.x + bird.width > pipe.x &&
           bird.y < pipe.y + pipe.height &&
           bird.y + bird.height > pipe.y;
}

function displayGameOver() {
    context.font = "48px Arial";
    context.fillStyle = "black";
    context.textAlign = "center";
    context.fillText("Game Over", boardWidth / 2, boardHeight / 2);

    context.font = "20px Arial"; 
    context.fillStyle = "red";   
    context.fillText("Press Enter to Restart", boardWidth / 2, boardHeight / 2 + 30);
    
}

function UpdateScore(p) {
    if (!p.passed && bird.x > p.x + p.width) {
        score += 0.5;
        p.passed = true;
    }
 
}

function displayScore() {
    context.font = "50px Arial";
    context.fillStyle = "white";
    context.textAlign = "left";
    context.fillText(score,10,45);
}

function displayTopscore(){
    if(gameover && score >= topScore){
        topScore = score;
    }

    context.font = "15px Arial";
    context.fillStyle = "white";
    context.textAlign = "rigth";
    context.fillText(`TOP SCORE: ${topScore}`,360,30);

}

function reset(e) {
    if(e.code == 'Enter' && gameover){
        bird.y = birdY;
        pipeArray = [];
        score = 0;
        gameover = false;  
        context.clearRect(0,0,board.width,board.height);
    }
}