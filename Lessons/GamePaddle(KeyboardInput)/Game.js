const ARROW_KEY_LEFT = 37;
const ARROW_KEY_RIGHT = 39;

var stage,padel;
var leftkeyDown,rightKeyDown = false;

function init() {
    stage = new createjs.Stage(document.getElementById('canvas'));
    createjs.Ticker.addEventListener("tick",tick);
    createjs.Ticker.setFPS(60);
    startGame();
}

function startGame() {
    padel = new createjs.Shape();
    padel.width = 100;
    padel.graphics.beginFill('#0000FF').drawRect(0,0, padel.width, 20);
    padel.x = padel.nextX = 0;
    padel.y = stage.canvas.height - 20;
    stage.addChild(padel);
    // handle keys
    window.onkeydown = movePadel;
    window.onkeyup = stopPadel;
    // fucking arround ----- delte after test
    var txtGameOver = new createjs.Text("game Over", "20px Arial", "#ff700");
    txtGameOver.textBaseline = "middle";
    txtGameOver.textAlign = "center";
    txtGameOver.x = stage.canvas.width /2;
    txtGameOver.y = stage.canvas.height /2;
    stage.addChild(txtGameOver);
    stage.update();
    txtGameOver.text = "Score";
    txtGameOver.text += " 1000";
    stage.addChild();
    stage.update();

}

function movePadel(e) {
    e = !e ? window.event : e;
    switch (e.keyCode){
        case ARROW_KEY_LEFT:
            leftkeyDown = true;
            break;
        case ARROW_KEY_RIGHT:
            rightKeyDown = true;
            break;
    }
}

function stopPadel(e) {
    e = !e ? window.event : e;
    switch (e.keyCode){
        case 37:
            leftkeyDown = false;
            break;
        case 39:
            rightKeyDown = false;
            break;
    }
}

function update() {
    var nextX = padel.x;
    if (leftkeyDown){
        nextX = padel.x - 10;
        if(nextX < 0){
            nextX = 0;
        }
    } else if (rightKeyDown){
        nextX = padel.x + 10;
        if (nextX > stage.canvas.width - padel.width){
            nextX = stage.canvas.width = padel.width;
        }
    }
    padel.nextX = nextX;
}

function render(){
    padel.x = padel.nextX;
}

function tick(e){
    update();
    render();
    stage.update();
}

