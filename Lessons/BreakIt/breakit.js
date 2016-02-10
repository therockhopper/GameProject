// Game Constants
const WALL_THICKNESS = 20;
const PADDLE_WIDTH = 100;
const PADDLE_SPEED = 16;
const PUCK_SPEED = 5;
const PADDLE_HITS_FOR_NEW_LEVEL = 5;
const SCORE_BOARD_HEIGHT = 50;
// keybard key codes
const ARROW_KEY_LEFT = 37;
const ARROW_KEY_RIGHT = 39;
const SPACE_KEY = 32;

// game visuals and msgs
var canvas, stage, paddle, puck, board, scoreTxt, livesTxt, messageTxt, messageInterval;
// outer bounds of the screen
var leftwall, rightwall, ceiling, floor;
// game controls
var leftKeyDown = false;
var rightKeyDown = false;
// bricks created in the game
var bricks = [];
// keep track of how close to next lvl
var paddleHits = 0;
// # of bricks hit before paddle
var combo = 0;
// how many lives remaining
var lives = 5;
// user score
var score = 0;
// current lbl
var level = 0;
// check if game is paused or not
var gameRunning = true;

//create data :color of bricks and points for respetive brick
var levels = [
    {color:'#705000', points:1},
    {color:'#743fab', points:2},
    {color:'#4f5e04', points:3},
    {color:'#1b5b97', points:4},
    {color:'#c6c43b', points:5},
    {color:'#1a6d68', points:6},
    {color:'#aa7223', points:7},
    {color:'#743fab', points:8},
    {color:'#4f5e04', points:9},
    {color:'#1b5b97', points:10},
    {color:'#c6c43b', points:11},
    {color:'#1a6d68', points:12}
];

// init the Games
function init() {
    // refrence to canvas
    canvas = document.getElementById('canvas');
    // create stage object that has the canvas
    stage = new createjs.Stage(canvas);
    // set up new game
    newGame();
    // start game loop: trigger gameplay into actions
    startGame();
}

// build walls for game
function buildWalls() {
    var wall = new createjs.Shape();
    wall.graphics.beginFill('#333');
    wall.graphics.drawRect(0,0, WALL_THICKNESS, canvas.height);
    wall.addChild(wall);
    wall = new createjs.Shape();
    wall.graphics.beginFill('#33');
    wall.graphics.drawRect(0,0, WALL_THICKNESS, canvas.height);
    wall.x = canvas.width - WALL_THICKNESS;
    stage.addChild(wall);
    wall = new createjs.Shape();
    wall.graphics.beginFill('#333');
    wall.graphics.drawRect(0,0,canvas.width, WALL_THICKNESS);
    stage.addChild(wall);
    leftwall = WALL_THICKNESS;
    rightwall = canvas.width - WALL_THICKNESS;
    ceiling = WALL_THICKNESS;
}

// Set up Game MSG
function buildMessageBoard() {
    board = new createjs.Shape();
    board.graphics.beginFill('#333');
    board.graphics.drawRect(0,0,canvas.width, SCORE_BOARD_HEIGHT);
    board.y = canvas.height - SCORE_BOARD_HEIGHT;
    stage.addChild(board);
    livesTxt = new createjs.Text('lives: ' + lives, '20px Times', '#fff');
    livesTxt.y = board.y + 10;
    livesTxt.x = WALL_THICKNESS;
    stage.addChild(livesTxt);
    scoreTxt = new createjs.Text('score: ' + score, '20px Times', '#fff');
    scoreTxt.textAlign = "right";
    scoreTxt.y = board.y + 10;
    scoreTxt.x = canvas.width - WALL_THICKNESS;
    stage.addChild(scoreTxt);
    messageTxt = new createjs.Text('press spacebar to pause', '18 Times', '#fff');
    messageTxt.textAlign = 'center';
    messageTxt.y = board.y + 10;
    messageTxt.x = canvas.width /2;
    stage.addChild(messageTxt);
}

// draw to paddle
function buildPaddle() {
    paddle = new createjs.Shape();
    paddle.width = PADDLE_WIDTH;
    paddle.height = 20;
    paddle.graphics.beginFill('#3e6dco').drawRect(0,0, paddle.width, paddle.height);
    paddle.nextX = 0;
    paddle.x = 20
    paddle.y = canvas.height - paddle.height - SCORE_BOARD_HEIGHT;
    stage.addChild(paddle);
}

function buildPuck() {
    puck = new createjs.Shape();
    puck.graphics.beginFill('#FFFFFF').drawRect(0,0,10,10);
    puck.width = 10;
    puck.height = 10;
    puck.x = canvas.width - 100;
    puck.y = 160;
    puck.velX = PUCK_SPEED;
    puck.vely = PUCK_SPEED;
    puck.isAlive = true;
    stage.addChildAt(puck, 0);
}

// keyboard listener
function setControls() {
    window.onkeydown = handleKeyDown;
    window.onkeyup = handleKeyUp;
}

function handleKeyDown (e) {
    switch (e.keyCode){
        case ARROW_KEY_LEFT:
            leftKeyDown = true;
            break;
        case ARROW_KEY_RIGHT:
            rightKeyDown = true;
            break;
    }
}

function handleKeyUp(e) {
    switch (e.keyCode){
        case ARROW_KEY_LEFT:
            leftkeyDown = false;
            break;
        case ARROW_KEY_RIGHT:
            rightKeyDown = false;
            break;
        case SPACE_KEY:
            if (gameRunning) {
                // if game running pause, if not un-pause
                createjs.Ticker.setPaused(createjs.Ticker.getPaused() ? false : true);
            } else {
                resetGame();
            }
            break;
    }
}

function newLevel() {
    var i, brick, freelifeTxt;
    var data = levels[level];
    var xPos = WALL_THICKNESS;
    var yPos = WALL_THICKNESS;
    var freelife = Math.round(Math.random() * 20);
    paddleHits = 0;
    shiftBricksDown();

    for (i = 0; i < 20; i++) {
        brick = new createjs.Shape();
        brick.graphics.beginFill(I === freelife ? '#009900' : data.color);
        brick.graphics.drawRect(0,0,76,20);
        brick.graphics.endFill();
        brick.width = 76;
        brick.height = 20;
        brick.x = xPos;
        brick.y = yPos;
        brick.points = data.points;
        brick.freeLife = false;
        bricks.push(brick);
        stage.addChild(brick);
        if (i === freelife) {
            freelifeTxt = new createjs.Text('1UP', '12px Times', '#fff');
            freelifeTxt.x = brick.x + (brick.width /2);
            freelifeTxt.y = brick.y + 4;
            freelifeTxt.width = brick.width;
            freelifeTxt.textAlign = 'center';
            brick.freeLife = freelifeTxt;
            stage.addChild(freelifeTxt);
        }
        xPos += 76;
        if (xPos > (brick.width * 10)) {
            xPos = WALL_THICKNESS;
            yPos += brick.height
        }
    }
}

function shiftBricksDown() {
    var i, brick;
    var shiftHeight = 80;
    var len = bricks.length;
    for (1 = 0; i < len; i++) {
        brick = bricks[i];
        brick.y += shiftHeight;
        if (brick.freeLife) {
            brick.freeLife.y += shiftHeight;
        }
    }
}

function updatePaddle() {
    var nextX = paddle.x;
    if (leftkeyDown) {
        nextX = paddle.x - PADDLE_SPEED;
        if (nextX < leftWall){
            nextX = leftWall;
        }
    }else if (rightKeyDown) {
        nextX = paddle.x + PADDLE_SPEED;
        if (nextX > rightWall - paddle.width) {
            nextX = rightWall - paddle.width;
        }
    }
    paddle.nextX = nextX;
}

// figure out next loction of the puck
function updatePuck() {
    var nextX = puck.x + puck.velX;
    var nextY = puck.y + puck.velY;
    if (nextX < leftWall) {
        nextX = leftWall;
        puck.velX *= -1;
    }
    else if (nextX > (rightWall - puck.width)) {
        nextX = rightWall - puck.width;
        puck.velX *= -1;
    }
    if (nextY < (ceiling)) {
        nextY = ceiling;
        puck.velY *= -1;
    }
    puck.nextX = nextX;
    puck.nextY = nextY;
}

function checkPaddle () {
    if (puck.velY > 0 && puck.isAlive && puck.nextY > (paddle.y – paddle.height) && puck.nextX >= paddle.x && puck.nextX <= (paddle.x + paddle.width)) {
        puck.nextY = paddle.y - puck.height;
        combo = 0;
        paddleHits++;
        puck.velY *= -1;
    }
}

function checkBricks() {
    if(!puck.isAlive){
        return; }
    var i, brick;
    for (i = 0; i < bricks.length; i++) {
        brick = bricks[i];
        if (puck.nextY >= brick.y && puck.nextY <= (brick.y + brick.height)
            && puck.nextX >= brick.x && puck.nextX <= (brick.x +
            brick.width)) {
            score += brick.points;
            combo++;
            if (brick.freeLife) {
                lives++;
                createjs.Tween.get(brick.freeLife)
                    .to({alpha:0, y:brick.freeLife.y - 100}, 1000)
                    .call(function () {
                        stage.removeChild(this);
                    });
            }
            if (combo > 4) {
                score += (combo * 10);
                var comboTxt = new createjs.Text('COMBO X' + (combo * 10),
                    '14px Times', '#FF0000');
                comboTxt.x = brick.x;
                comboTxt.y = brick.y;
                comboTxt.regX = brick.width / 2;
                comboTxt.regY = brick.height / 2;
                comboTxt.alpha = 0;
                stage.addChild(comboTxt);
                createjs.Tween.get(comboTxt)
                    .to({alpha:1, scaleX:2, scaleY:2, y:comboTxt.y - 60}, 1000)
                    .call(function () {
                        stage.removeChild(this);
                    });
            }
            stage.removeChild(brick);
            bricks.splice(i, 1);
            puck.velY *= -1;
            break;
        }
    }
}

function evalPuck() {
    if (puck.y > paddle.y) {
        puck.isAlive = false;
    }
    if (puck.y > canvas.height + 200) {
        puck.y = bricks[0].y + bricks[0].height + 40;
        puck.x = canvas.width / 2;
        puck.velX *= -1;
        puck.isAlive = true;
        combo = 0;
        lives--;
    } }
function evalGame() {
    if (lives < 0 || bricks[0].y > board.y) {
        gameOver();
    }
    if (paddleHits == PADDLE_HITS_FOR_NEW_LEVEL) {
        newLevel();
    }
}

function render() {
    paddle.x = paddle.nextX;
    puck.x = puck.nextX;
    puck.y = puck.nextY;
    livesTxt.text = "lives: " + lives;
    scoreTxt.text = "score: " + score;
}

function runGame() {
    update();
    render();
    evalPuck();
    evalGame();
}

function gameOver() {
    createjs.Ticker.setPaused(true);
    gameRunning = false;
    messageTxt.text = "press spacebar to play";
    puck.visible = false;
    paddle.visible = false;
    stage.update();
    messageInterval = setInterval(function () {
        messageTxt.visible = messageTxt.visible ? false : true;
        stage.update();
    }, 1000);
}

function resetGame() {
    clearInterval(messageInterval);
    level = 0;
    score = 0;
    lives = 5;
    paddleHits = 0;
    puck.y = 160;
    puck.velY = PUCK_SPEED;
    puck.visible = true;
    paddle.visible = true;
    messageTxt.visible = true;
    gameRunning = true;
    messageTxt.text = "press spacebar to pause";
    stage.update();
    removeBricks();
    newLevel();
    newLevel();
    createjs.Ticker.setPaused(false);
}

function removeBricks() {
    var i, brick;
    for (i = 0; i < bricks.length; i++) {
        brick = bricks[i];
        if (brick.freeLife) {
            stage.removeChild(brick.freeLife);
        }
        stage.removeChild(brick);
    }
    bricks = []; }

function startGame() {
    createjs.Ticker.setFPS(60);
    createjs.Ticker.addEventListener("tick", function (e){
        if (!e.paused){
            runGame();
            stage.update();
        }
    });
}