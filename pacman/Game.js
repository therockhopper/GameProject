(function() {

    "use strict";

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
    var whammyBarEaten = 0;

    // game objects
    var assetManager;
    var introCaption;
    var scoreboard;
    var background;
    var gameOverCaption;
    var gameWinCaption;
    var slash;
    var whammyBar;
    var autoTune;
    var autoTune2;
    var autoTune3;

    // music
    var backgroundMusic;

    // flags
    var autoTune2Released = false;
    var autoTune3Released = false;

    // =============================== EVENT HANDLERS ============================
    function onInit() {
        console.log(">> INIT");
        // get canvas
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

        // create music objects
        backgroundMusic = createjs.Sound.play("drumLoop", {loop:-1});

        // construct the game over Caption
        gameOverCaption = assetManager.getSprite("assets");
        gameOverCaption.gotoAndStop("gameOver");

        // construct the game over Caption
        gameWinCaption = assetManager.getSprite("assets");
        gameWinCaption.gotoAndStop("gameWin");

        // construct the main charchter SLASH
        slash = new Slash(stage,assetManager);
        slash.resetMe();

        // construct the first of many Whammy bars
        whammyBar = new WhammyBar(stage,assetManager,slash);
        whammyBar.setupMe();

        // construct the first of many Auto tunes
        autoTune = new AutoTune(stage,assetManager,slash);
        autoTune.setupMe();

        autoTune2 = new AutoTune(stage,assetManager,slash);
        autoTune2.setupMe();

        autoTune3 = new AutoTune(stage,assetManager,slash);
        autoTune3.setupMe();

        scoreboard = assetManager.getSprite("assets");
        scoreboard.gotoAndStop("scoreboard1");
        scoreboard.x = 20;
        scoreboard.y = 1;
        stage.addChild(scoreboard);

        // setup event listen to start game
        background.addEventListener("click", onStartGame);
        // listen for when the whammyBar are eaten
        stage.addEventListener("onWhammyBarEaten", onWhammyBarEaten, true);
        // listen for when slash is killed
        stage.addEventListener("onSlashKilled", onGameOver, true);
        // listen for when slash is killed
        stage.addEventListener("onAutoTuneDead", onAutoTuneDead, true);

        // contruct the intro caption
        introCaption = assetManager.getSprite("assets");
        introCaption.gotoAndStop("introCaption");

        stage.addChild(introCaption);

        //start ticker
        createjs.Ticker.setFPS(framerate);
        createjs.Ticker.addEventListener("tick", onTick);

    }

    function onStartGame(e) {
        console.log("start Game");
        stage.removeChild(introCaption);
        stage.removeChild(gameOverCaption);
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
        // stop the ticker
        createjs.Ticker.removeEventListener("tick", onTick);
        stage.addChild(gameOverCaption);

        // add listener to reset game when click background
        background.addEventListener("click", resetGame);

        // remove all listeners
        document.removeEventListener("keydown", onKeyDown);
        document.removeEventListener("keyup", onKeyUp);
        slash.stopMe();
    }

    function onGameWin() {
        // stop the ticker
        createjs.Ticker.removeEventListener("tick", onTick);
        // User has won
        stage.addChild(gameWinCaption);

        // add listener to reset game when click background
        background.addEventListener("click", resetGame);

        // remove all listeners
        document.removeEventListener("keydown", onKeyDown);
        document.removeEventListener("keyup", onKeyUp);
        slash.stopMe();
    }

    function checkForWin() {
        // if ther user has over 10 points end the game
        if (whammyBarEaten > 10) {
            // user has won
            onGameWin();
        } else if (whammyBarEaten === 5 && autoTune2Released === false) {
            // if score is 5
            createjs.Sound.play("newAuto");
            autoTune2.releaseMe();
            autoTune2Released = true
        }else if (whammyBarEaten === 8 && autoTune3Released === false) {
            // if score is 5
            createjs.Sound.play("newAuto");
            autoTune3.releaseMe();
            autoTune3Released = true

        }
    }

    function resetGame(e) {
        console.log("resetting Game");
        createjs.Sound.stop(backgroundMusic);
        // remove reset listener
        background.removeEventListener("click", resetGame);
        autoTune2Released = false;
        autoTune3Released = false;
        //reset amount of whammy bars eaten
        backgroundMusic = null;
        whammyBarEaten = 0;
        updateInterface();
        onSetup();
    }

    function updateInterface() {
        // create user interface
        //txtWhammyBar.text = String("Whammy Bars Eaten: " + whammyBarEaten);
        if (whammyBarEaten === 1){
            scoreboard.gotoAndPlay("scoreboard1");
        }else if (whammyBarEaten === 2){
            scoreboard.gotoAndPlay("scoreboard2");
        }else if (whammyBarEaten === 3){
            scoreboard.gotoAndPlay("scoreboard3");
        }else if (whammyBarEaten === 4){
            scoreboard.gotoAndPlay("scoreboard4");
        }else if (whammyBarEaten === 5){
            scoreboard.gotoAndPlay("scoreboard5");
        }else if (whammyBarEaten === 6){
            scoreboard.gotoAndPlay("scoreboard6");
        }else if (whammyBarEaten === 7){
            scoreboard.gotoAndPlay("scoreboard7");
        }else if (whammyBarEaten === 8){
            scoreboard.gotoAndPlay("scoreboard8");
        }else if (whammyBarEaten === 9){
            scoreboard.gotoAndPlay("scoreboard9");
        }else if (whammyBarEaten === 10){
            scoreboard.gotoAndPlay("scoreboard10");
        }
        // update the stge with the correct scoreboard
        console.log("updating scoreboard");
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
        updateInterface();
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

        // update the auto tunes
        autoTune.updateMe(1);
        autoTune2.updateMe(2);
        autoTune3.updateMe(3);
        // check for collison
        whammyBar.updateMe();
        // update the snake
        slash.updateMe();

        // check for win
        checkForWin();
        // update the stage
        stage.update();
    }

})(); 