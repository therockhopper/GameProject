  // AssetManager Demo
// Sean Morrow
// May 12, 2014

(function() {
    "use strict";

    window.addEventListener("load", onInit);

    // Game CONST
    const WALL_THICKNESS = 20;
    const PADDLE_WIDTH = 100;
    const PADDLE_SPEED = 16;
    const PUCK_SPEED = 5;
    const PADDLE_HITS_FOR_NEW_LEVEL = 5;
    const SCORE_BOARD_HEIGHT = 50;
    const ARROW_KEY_LEFT = 37;
    const ARROW_KEY_RIGHT = 39;
    const ARROW_KEY_DOWN = 40;
    const ARROW_KEY_UP = 38;
    const SPACE_KEY = 32;

    // game variables
    var canvas, stage,board, scoreTxt, livesTxt, messageTxt;
    var leftWall, rightWall, ceiling;

    var leftKeyDown = false;
    var rightKeyDown = false;
    var upKeyDown = false;
    var downKeyDown = false;

    var lives = 5;
    var score = 0;

    // frame rate of game
    var frameRate = 24;

    // game objects
    var assetManager = null;
    var whammy = null;

    // ============================================================= private methods

    function newGame() {
        buildWalls();
        stage.update();
        buildMessageBoard();
        buildTopBoard();
        setControls();
        newLevel();
        newLevel();
    }

    function buildWalls() {
        var wall = new createjs.Shape();
        wall.graphics.beginFill('#333');
        wall.graphics.drawRect(0, 0, WALL_THICKNESS, canvas.height);
        stage.addChild(wall);
        wall = new createjs.Shape();
        wall.graphics.beginFill('#333');
        wall.graphics.drawRect(0, 0, WALL_THICKNESS, canvas.height);
        wall.x = canvas.width - WALL_THICKNESS;
        stage.addChild(wall);
        wall = new createjs.Shape();
        wall.graphics.beginFill('#333');
        wall.graphics.drawRect(0, 0, canvas, WALL_THICKNESS);
        stage.addChild(wall);
        leftWall = WALL_THICKNESS;
        rightWall = canvas.width - WALL_THICKNESS;
        ceiling = WALL_THICKNESS;
    }

    function buildMessageBoard() {
        board = new createjs.Shape();
        board.graphics.beginFill('#333');
        board.graphics.drawRect(0, 0, canvas.width, SCORE_BOARD_HEIGHT);
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
        messageTxt = new createjs.Text('press spacebar to pause', '18px Times', '#fff');
        messageTxt.textAlign = 'center';
        messageTxt.y = board.y + 10;
        messageTxt.x = canvas.width / 2;
        stage.addChild(messageTxt);
    }

    function buildTopBoard() {
        board = new createjs.Shape();
        board.graphics.beginFill('#333');
        board.graphics.drawRect(0, 0, canvas.width, SCORE_BOARD_HEIGHT);
        board.y = canvas.height - 600;
        stage.addChild(board);
        messageTxt = new createjs.Text('Rock IT', '18px Times', '#fff');
        messageTxt.textAlign = 'center';
        messageTxt.y = board.y + 10;
        messageTxt.x = canvas.width / 2;
        stage.addChild(messageTxt);
    }

    // ---------------------------- Keyboard input
    function setControls() {
        window.onkeydown = handleKeyDown;
        window.onkeyup = handleKeyUp;
    }

    function handleKeyDown(e) {
        e = !e ? window.event : e;
        switch (e.keyCode) {
            case ARROW_KEY_LEFT:
                leftKeyDown = true;
                break;
            case ARROW_KEY_RIGHT:
                rightKeyDown = true;
                break;
            case ARROW_KEY_DOWN:
                downKeyDown = true;
                break;
            case ARROW_KEY_UP:
                upKeyDown = true;
                break;
        }
    }

    function handleKeyUp(e) {
        e = !e ? window.event : e;
        switch (e.keyCode) {
            case ARROW_KEY_LEFT:
                leftKeyDown = false;
                break;
            case ARROW_KEY_RIGHT:
                rightKeyDown = false;
                break;
            case ARROW_KEY_DOWN:
                downKeyDown = false;
                break;
            case ARROW_KEY_UP:
                upKeyDown = false;
                break;
            case SPACE_KEY:
                if (gameRunning) {
                    createjs.Ticker.setPaused(createjs.Ticker.getPaused() ? false : true);
                }
                else {
                    resetGame();
                }
                break;
        }

    // ---------------------
    }

    // ===================================================== event handlers
    function onInit() {
        console.log(">> initializing");

        // get reference to canvas
        canvas = document.getElementById("stage");
        // set canvas to as wide/high as the browser window
        canvas.width = 600;
        canvas.height = 600;
        // create stage object
        stage = new createjs.Stage(canvas);

        newGame();

        // construct preloader object to load spritesheet and sound assets
        assetManager = new AssetManager(stage);
        stage.addEventListener("onAllAssetsLoaded", onReady);
        // load the assets
        assetManager.loadAssets(manifest);
    }

    function onReady(e) {

        console.log(">> setup");
        // kill event listener
        stage.removeEventListener("onAllAssetsLoaded", onReady);

        // startup the ticker
        createjs.Ticker.setFPS(frameRate);
        createjs.Ticker.addEventListener("tick", onTick);
    }

    function onTick(e) {
        // TESTING FPS
        document.getElementById("fps").innerHTML = createjs.Ticker.getMeasuredFPS();

        // put your other stuff here!
        // ...

        // update the stage!
        stage.update();
    }

})();