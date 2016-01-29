// Munch implemented in HTML5
// Sean Morrow
// May 12, 2014

"use strict";
(function() {

    window.addEventListener("load", onInit);

    // game variables
    var stage = null;
    var canvas = null;
    var downKey = false;
    var upKey = false;
    var leftKey = false;
    var rightKey = false;
    // frame rate of game
    var frameRate = 26;
    var snakeMaxSpeed = 5;
    
    // bug timer to add gameplay
    var bugTimer = null;
    var bugDelay = 0;
    var bugsEaten = 0;
    // object pooling
    var bugMax = 50;
    var bugPool = [];

    // game objects
    var assetManager;
    var introCaption;
    var background;
    var snake;
    var gameOverCaption;
    var userInterface;

    // ------------------------------------------------------------ event handlers
    function onInit() {
        console.log(">> initializing");

        // get reference to canvas
        canvas = document.getElementById("stage");
        // set canvas to as wide/high as the browser window
        canvas.width = 600;
        canvas.height = 600;
        // create stage object
        stage = new createjs.Stage(canvas);

        // construct preloader object to load spritesheet and sound assets
        assetManager = new AssetManager(stage);
        stage.addEventListener("onAllAssetsLoaded", onSetup);
        // load the assets
        assetManager.loadAssets(manifest);
    }

    function onSetup() {
        console.log(">> setup");
        // kill event listener
        stage.removeEventListener("onAllAssetsLoaded", onSetup);

        // construct game objects
        background = assetManager.getSprite("assets");
        background.gotoAndStop("background");
        stage.addChild(background);
        
        introCaption = assetManager.getSprite("assets");
        introCaption.gotoAndStop("introCaption");
        introCaption.x = 50;
        introCaption.y = 50;
        stage.addChild(introCaption);
        
        gameOverCaption = assetManager.getSprite("assets");
        gameOverCaption.gotoAndStop("gameOverCaption");
        gameOverCaption.x = 50;
        gameOverCaption.y = 50;
        
        userInterface = new UserInterface(stage, assetManager, snakeMaxSpeed);
        userInterface.setupMe();	
        
        snake = new Snake(stage, assetManager, snakeMaxSpeed);
        snake.resetMe();
        
        // bug object pooling - constructing bug objects
        for (var i=0; i<bugMax; i++) {
            bugPool.push(new Bug(stage, assetManager, snake));
        }

        // setup event listener to start game
        background.addEventListener("click", onStartGame);
        // listen for when bugs are eaten (dispatch by snake)
        stage.addEventListener("onBugEaten", onBugEaten, true);
        // listen for when snake killed
        stage.addEventListener("onSnakeKilled", onGameOver, true);
        // listen for when snake speed changes
        stage.addEventListener("onSnakeSpeedChange", onSnakeSpeedChange, true);
        
        // startup the ticker
        createjs.Ticker.setFPS(frameRate);
        createjs.Ticker.addEventListener("tick", onTick);
    }

    function onStartGame(e) {
        stage.removeChild(introCaption);

        // remove click event on background
        background.removeEventListener("click", onStartGame);

        // start the snake object
        snake.setupMe();
        
        // no bugs eaten at start of game
        bugsEaten = 0;
        // construct and setup bugtimer to drop bugs on displaylist
        bugDelay = 500;
        bugTimer = window.setInterval(onAddBug, bugDelay);

        // current state of keys
        leftKey = false;
        rightKey = false;
        upKey = false;
        downKey = false;

        // setup event listeners for keyboard keys
        document.addEventListener("keydown", onKeyDown);
        document.addEventListener("keyup", onKeyUp);

        // startup the ticker
        createjs.Ticker.setFPS(frameRate);
        createjs.Ticker.addEventListener("tick", onTick);
    }
    
    function onGameOver(e) {
        // gameOver
        clearInterval(bugTimer);
        stage.addChild(gameOverCaption);

        // add listener to reset game when click background
        background.addEventListener("click", onResetGame);

        // remove all listeners
        document.removeEventListener("keydown", onKeyDown);
        document.removeEventListener("keyup", onKeyUp);
    }

    function onResetGame(e) {
        // kill event listener and add listener to start a new game again
        background.removeEventListener("click", onResetGame);
        background.addEventListener("click", onStartGame);

        // reset the snake and user interface
        snake.resetMe();
        // reset interface
        userInterface.setupMe();

        // adjust caption on screen
        stage.removeChild(gameOverCaption);
        stage.addChild(introCaption);
    }    
    
    function onAddBug(e) {
        // find bug in pool and add to game
        for (var i=0; i<bugPool.length; i++) {
            var newBug = bugPool[i];
            if (newBug.getActive() === false) {
                newBug.setActive(true);
                newBug.setupMe();
                newBug.releaseMe();
                break;
            }
        }
    }
    
    function onBugEaten(e) {
        // increment bug counter
        bugsEaten++;
        // energize the snake with energy
        snake.energizeMe();

        // decrease the amount of bugs on the screen every ten bugs eaten
        if ((bugsEaten % 10) == 0) {
            bugDelay = bugDelay + 500;
            window.clearInterval(bugTimer);
            bugTimer = window.setInterval(onAddBug, bugDelay);
        }

        // update user interface
        userInterface.setBugsEaten(bugsEaten);
        console.log("onBugEaten");
    }

    function onSnakeSpeedChange(e) {
        userInterface.setSnakeSpeed(snake.getSpeed());
    }

    function onKeyDown(e) {
        // which keystroke is down?
        if (e.keyCode == 37) leftKey = true;
        else if (e.keyCode == 39) rightKey = true;
        else if (e.keyCode == 38) upKey = true;
        else if (e.keyCode == 40) downKey = true;
    }

    function onKeyUp(e) {
        // which keystroke is up?
        if (e.keyCode == 37) leftKey = false;
        else if (e.keyCode == 39) rightKey = false;
        else if (e.keyCode == 38) upKey = false;
        else if (e.keyCode == 40) downKey = false;
    }

    function onTick(e) {
        // TESTING FPS
        document.getElementById("fps").innerHTML = createjs.Ticker.getMeasuredFPS();

        // only monitor keyboard if snake is alive
        if (!snake.getKilled()) {
            if (leftKey) {
                snake.startMe(MoverDirection.LEFT);
            } else if (rightKey) {
                snake.startMe(MoverDirection.RIGHT);
            } else if (upKey) {
                snake.startMe(MoverDirection.UP);
            } else if (downKey) {
                snake.startMe(MoverDirection.DOWN);
            } else {
                snake.stopMe();
            }
        }
        
        // update all bugs (their mover) in pool if active
        for (var n=0; n<bugPool.length; n++) {
            if (bugPool[n].getActive()) bugPool[n].updateMe();
        }
        
        // update the snake (its mover)
        snake.updateMe();

        // update the stage!
        stage.update();
    }

})(); 