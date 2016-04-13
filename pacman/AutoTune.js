var AutoTune = function(stage, assetManager, slash) {
    //INIT
    var slashSprite = slash.getSprite();
    // event for when the AUTO tune is killed
    var eventAutoTuneDead = new createjs.Event("onAutoTuneDead", true);

    // construct sprite for this object and add to stage
    var sprite = assetManager.getSprite("assets");
    sprite.gotoAndPlay("MTV");
    var follow = new Follow(sprite,slashSprite,stage);

    // =================== PRIVATE METHODS =======================
    function randomMe(low, high) {
        return Math.round(Math.random() * (high - low)) + low;
    }

    // ==================== PUBLIC METHODS =======================
    // ------------------------- place autotune on canvas
    this.setupMe = function() {

        // random selection of speed of auto tune
        follow.setSpeed(randomMe(2,6));

        // get bounds of sprite so we can determine width / height
        var dimensions = sprite.getBounds();

        // auto tube starts on left or right of stage?
        if (randomMe(1, 2) == 1) {
            // move right
            sprite.x = -dimensions.width;
            // randomly select starting y location of mower
            sprite.y = randomMe(50, stage.canvas.height - 50);
        } else {
            // move left
            sprite.x = stage.canvas.width;
            sprite.y = randomMe(50, stage.canvas.height - 50);
        }

        // listen for when the auto tune goes off screen
        sprite.addEventListener("onMovingDiagonalOffStage", onKillMe);
    };

    this.releaseMe = function() {
        // release the bug onto the canvas and make it start moving
        sprite.gotoAndPlay("MTV");
        follow.startMe();

        console.log("releasing new Auto tune");
        // add the auto tune to the stage below SLASH
        stage.addChildAt(sprite, stage.getChildIndex(slashSprite));
    };

    // ---------------------------- check if slash has collied with the auto tune
    this.updateMe = function(speed) {

        // if bug not moving then nothing to update!
        if ((!follow.getMoving()) || (slash.getKilled())) return;

        // update sprite
        follow.update(speed);

        var intersection = ndgmr.checkRectCollision(slashSprite,sprite);

        if (intersection != null) {
            // collision detection with snake
            console.log("Slash collision!");
            // kill slash and end game
            slash.killMe();
        }

    };

    // ======================== EVENT HANDLERS ==========================
    // ---------------------- Play dead animation
    function onKillMe(e) {
        sprite.dispatchEvent(eventAutoTuneDead);
        follow.stopMe();
        sprite.gotoAndPlay("MTVDead");
        sprite.addEventListener("animationend", onKilled);

    }

    // -------------------- event clean up
    function onKilled(e) {
        e.remove();
        sprite.removeAllEventListeners();
        stage.removeChild(sprite);
        console.log("Auto Tune Killed");
    }

};