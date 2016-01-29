  // AssetManager Demo
// Sean Morrow
// May 12, 2014

(function() {
    "use strict";

    window.addEventListener("load", onInit);

    // game variables
    var stage = null;
    var canvas = null;

    // frame rate of game
    var frameRate = 24;

    // game objects
    var assetManager = null;
    var snake = null;
    var bug = null;
    var biplane = null;

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
        stage.addEventListener("onAllAssetsLoaded", onReady);
        // load the assets
        assetManager.loadAssets(manifest);
    }

    function onReady(e) {
        console.log(">> setup");
        // kill event listener
        stage.removeEventListener("onAllAssetsLoaded", onReady);
        
        // add snake to the stage
        snake = assetManager.getSprite("gameAssets");
        snake.x = 200;
        snake.y = 200;
        snake.gotoAndPlay("snakeAlive");
        stage.addChild(snake);

        bug = assetManager.getSprite("gameAssets");
        bug.x = 200;
        bug.y = 200;
        bug.gotoAndPlay("bugDead");
        stage.addChildAt(bug, 0);
        
        biplane = assetManager.getSprite("biplaneAssets");
        biplane.x = 300;
        biplane.y = 300;
        biplane.gotoAndPlay("flyRight");
        stage.addChild(biplane);
        
        createjs.Sound.play("boing");
        

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