var stage, livesTxt, gameOverTxt, win;
var answer = "CREATEJS IS&AWSOME";
var abc = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
var lives = 5;
var lettersNeeded = 0;

function init() {
    stage = new createjs.Stage(document.getElementById('canvas'));
    drawBoard();
    drawLetters();
    drawMessages();
    startGame();
}
// DRAW AND POSTION MY GAME DISPLAY OBJECTS
function drawBoard() {
    var i, char, box;
    var xPos = 20;
    var yPos = 90;
    for (i=0;i<answer.length;i++){
        char = answer[i];
        // if char is not a blank or a link break
        if (char !== '' && char !== '&'){
            lettersNeeded++;
            box = new createjs.Shape();
            box.graphics.beginStroke("#000");
            box.graphics.drawRect(0,0,20,24);
            box.regX = 10;
            box.regY = 12;
            box.x = xPos;
            box.y = yPos;
            box.name = 'box_' + i;
            box.key = char;
            stage.addChild(box);
        }
        xPos += 26;
        // IF THE BOX IS THE FIRST LETTER OF NEW WORD, MAKE IT LOWER AND START NEW WORD
        if (char === '&'){
            yPos += 40;
            xPos = 20;
        }
    }
}

function drawLetters() {
    var i,char, txt, btn;
    var cnt = 0;
    var xPos = 20;
    var yPos = 200;
    for (i=0;i<abc.length;i++){
        char = abc[i];
        btn = new createjs.Shape();
        btn.graphics.beginFill("#000");
        btn.graphics.beginStroke("#000");
        btn.graphics.drawRect(0,0,20,24);
        btn.regX = 10;
        btn.reyX = 12;
        btn.x = xPos;
        btn.y = yPos;
        stage.addChild(btn);
        // create text
        txt = new createjs.Text(char);
        txt.color = "#FFF";
        txt.textAlign = 'center';
        txt.textBaseline = 'middle';
        txt.x = xPos;
        txt.y = yPos;
        stage.addChild(txt);
        btn.txt = txt;
        btn.addEventListener('click', onLetterClick);
        // adjust postions
        xPos +=24;
        cnt++;
        if (cnt === 13){
            yPos += 30;
            xPos = 20;
        }
    }
}

function drawMessages() {
    var txt = new createjs.Text("WORD GAME", "26px Arial");
    txt.color = "#99000";
    txt.x = txt.y = 10;
    stage.addChild(txt);
    livesTxt = new createjs.Text("Lives: " + lives, "16px Arial");
    livesTxt.textAlign = 'right';
    livesTxt.y = 16;
    livesTxt.x = stage.canvas.width - 10;
    stage.addChild(livesTxt);
}