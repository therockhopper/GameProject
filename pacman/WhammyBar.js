var WhammyBar = function(stage, assetManager, slash) {
    //INIT
    var slashSprite = slash.getSprite();
    // event object
    var eventWhammyBarEaten = new createjs.Event("onWhammyBarEaten", true);

    // is the Coin cusrrently begin used
    var active = false;

    // construct sprite for this object and add to stage
    var sprite = assetManager.getSprite("assets");
    sprite.gotoAndPlay("WhammyBar");

    // =================== PRIVATE METHODS =======================
    function randomMe() {
        return Math.floor(Math.random() * (450) + 1);
    }

    // ==================== GET / SET METHODS ===================
    this.getActive = function() {
        return active;
    };

    this.setActive = function(value) {
        active = value;
    };

    // ==================== PUBLIC METHODS =======================
    // ------------------------- place Coin on canvas
    this.setupMe = function() {

        // get bounds of sprite so we can determine width / height
        var dimensions = sprite.getBounds();

        // randomly slect where Coin shouyld be on stage
        sprite.x = randomMe();
        sprite.y = randomMe();

        // add Coin so they are below the slash
        stage.addChildAt(sprite, stage.getChildIndex(slashSprite));
    };

    // ---------------------------- check if slash has collied with the Coin
    this.updateMe = function() {

        var intersection = ndgmr.checkRectCollision(slashSprite,sprite);

        if (intersection != null){
            // collision detection with slash
            sprite.dispatchEvent(eventWhammyBarEaten);
            onKillMe();
        }

    };

    // ======================== EVENT HANDLERS ==========================
    // ---------------------- Play dead animation
    function onKillMe(e) {
        createjs.Sound.play("point", {volume:.8});
        sprite.gotoAndPlay("WhammyBarDead");
        sprite.addEventListener("animationend", onKilled);
    }

    // -------------------- event clean up
    function onKilled(e) {
        e.remove();
        sprite.removeAllEventListeners();
        stage.removeChild(sprite);
        active = false;
    }

};