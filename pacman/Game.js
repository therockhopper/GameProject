// Munch implemented in HTML5
// Sean Morrow
// May 12, 2014

"use strict";
(function() {

    window.addEventListener("load", onInit);

    // game variables
    var stage = null;
    var canvas = null;

    // keyboard constols
    var downKey = false;
    var upKey = false;
    var leftKey = false;
    var rightKey = false;

    // frame rate of game
    var framerate = 26;

    // # of whammy bars eaten
    var whammyBarEaten;

    // game objects
    var assetManager;
    var introCaption;
    var scoreboard;
    var background;
    var userInterface;
    var gameOverCaption;
    var slash;
    var whammyBar;
    var autoTune;

    // =============================== EVENT HANDLERS ============================
    function onInit() {
        console.log(">> INIT");

        // get cnavas
        canvas = document.getElementById("stage");
        // set canvas to as wide/hieth as browser window
        canvas.width = 600;
        canvas.height = 600;
        // create stage object
        stage = new createjs.Stage(canvas);

        // constuct reloader object to load spritesheet and sound assets
        assetManager = new AssetManager(stage);
        stage.addEventListener("onAllAssetsLoaded", onSetup);
        // load the assets
        assetManager.loadAssets(manifest);
    }

    // -------------------- consturct game object now that loading is done
    function onSetup() {
        console.log(">> setup");
        // kill event listeer
        stage.removeEventListener("onAllAssetsLoaded", onSetup);

        // constuct the game objects
        background = assetManager.getSprite("assets");
        background.gotoAndStop("background");
        stage.addChild(background);

        // contruct the intro caption
        introCaption = assetManager.getSprite("assets");
        introCaption.gotoAndStop("introCaption");
        introCaption.x = 50;
        introCaption.y = 50;
        stage.addChild(introCaption);

        // construct the game over Caption
        gameOverCaption = assetManager.getSprite("assets");
        gameOverCaption.gotoAndStop("gameOver");
        gameOverCaption.x = 50;
        gameOverCaption.y = 50;

        // construct the userInterface that handles the score board
        userInterface = new UserInterface(stage,assetManager);
        userInterface.setupMe();

        // construct the main charchter SLASH
        slash = new Slash(stage,assetManager);
        slash.resetMe();

        // construct the first of many Whammy bars
        whammyBar = new WhammyBar(stage,assetManager,slash);
        whammyBar.setupMe();

        // construct the first of many Auto tunes
        autoTune = new AutoTune(stage,assetManager,slash);
        autoTune.setupMe();

        // setup event listen to start game
        background.addEventListener("click", onStartGame);
        // listen for when the whammyBar are eaten
        stage.addEventListener("onWhammyBarEaten", onWhammyBarEaten, true);
        // listen for when slash is killed
        stage.addEventListener("onSlashKilled", onGameOver, true);
        // listen for when slash is killed
        stage.addEventListener("onAutoTuneDead", onAutoTuneDead, true);

        //start ticker
        createjs.Ticker.setFPS(framerate);
        createjs.Ticker.addEventListener("tick", onTick);

        //start background music and loop forever
        createjs.Sound.play("drumLoop", {loop:-1});

    }

    function onStartGame(e) {
        console.log("start Game");
        stage.removeChild(introCaption);
        // remove click event on background
        background.removeEventListener("click", onStartGame);

        // start the slash object
        slash.setupMe();
        //release the auto tune afdter the game has started
        autoTune.releaseMe();

        // no whammyBar eaten at start of gmae
        whammyBarEaten = 0;

        // current state of keys
        leftKey = false;
        rightKey = false;
        upKey = false;
        downKey = false;

        // setup event listeners for kyboard keys
        document.addEventListener("keydown", onKeyDown);
        document.addEventListener("keyup", onKeyUp);

        // start the ticker
        createjs.Ticker.setFPS(framerate);
        createjs.Ticker.addEventListener("tick", onTick);
    }

    function onGameOver(e) {
        // gameOver
        stage.addChild(gameOverCaption);

        // add listener to reset game when click background
        background.addEventListener("click", onResetGame);

        // remove all listeners
        document.removeEventListener("keydown", onKeyDown);
        document.removeEventListener("keyup", onKeyUp);
    }

    function onResetGame(e) {
        // when the game needs to be reset simple recall setup....its really greasy but it works .... ill fix this later
        onSetup();
    }

    function AddWhammyBar() {
        // cerate new whammyBar add add it to stage
        whammyBar = new WhammyBar(stage,assetManager,slash);
        whammyBar.setupMe();
    }

    function onAutoTuneDead() {
        // create new auto tune then release it onto the canvas
        autoTune = new AutoTune(stage,assetManager,slash);
        autoTune.setupMe();
        autoTune.releaseMe();
    }

    function onWhammyBarEaten(e) {
        // increment whammyBar counter
        whammyBarEaten++;
        console.log("Current amount of whammy eaten: " + whammyBarEaten);
        // update the whammy bar counter on the interface
        userInterface.setWhammyBarsEaten(whammyBarEaten);
        // update scoreboard
        userInterface.upScoreboard(whammyBarEaten);

        // add another one
        AddWhammyBar();
    }

    function onKeyDown(e) {
        // find out what key is down
        if (e.keyCode == 37) leftKey = true;
        else if (e.keyCode == 39) rightKey = true;
        else if (e.keyCode == 38) upKey = true;
        else if (e.keyCode == 40) downKey = true;
    }

    function onKeyUp(e) {
        // find out what key is up
        if (e.keyCode == 37) leftKey = false;
        else if (e.keyCode == 39) rightKey = false;
        else if (e.keyCode == 38) upKey = false;
        else if (e.keyCode == 40) downKey = false;
    }

    function onTick(e) {
        // testing FPS
        document.getElementById("fps").innerHTML = createjs.Ticker.getMeasuredFPS();

        // only check keyboard if slash is alive
        if (!slash.getKilled()) {
            if (leftKey) slash.startMe(MoverDirection.LEFT);
            else if (rightKey) slash.startMe(MoverDirection.RIGHT);
            else if (upKey) slash.startMe(MoverDirection.UP);
            else if (downKey) slash.startMe(MoverDirection.DOWN);
            else slash.stopMe();
        }

        // update the auto tune
        autoTune.updateMe();
        // check for collison
        whammyBar.updateMe();
        // update the snake
        slash.updateMe();

        // update the stage
        stage.update();

    }

})(); 