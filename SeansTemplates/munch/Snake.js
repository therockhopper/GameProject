var Snake = function(stage, assetManager, maxSpeed) {
    // initialization
    var killed = false;
    var slowDownDelay = 5000;
    var slowDownTimer = null;
    // to keep track of scope
    var me = this;

    // construct custom event objects
    var eventSnakeKilled = new createjs.Event("onSnakeKilled", true);
    var eventSnakeSpeedChange = new createjs.Event("onSnakeSpeedChange", true);

    // grab clip for Snake and add to stage canvas
    var sprite = assetManager.getSprite("assets");
    var spriteMover = new Mover(sprite, stage);
    stage.addChild(sprite);

    // ---------------------------------------------- get/set methods
    this.getKilled = function() {
        return killed;
    };

    this.getSprite = function() {
        return sprite;
    };
    
    this.getSpeed = function() {
        return spriteMover.getSpeed();        
    };

    // ---------------------------------------------- public methods
    this.setupMe = function() {
        killed = false;
        // start the timer
        slowDownTimer = window.setInterval(onSlowMe, slowDownDelay);
    };
    
    this.startMe = function(direction) {
        spriteMover.setDirection(direction);
        if (!spriteMover.getMoving()) {
            sprite.gotoAndPlay("alive");
            spriteMover.startMe();
        }
    };    

    this.stopMe = function() {
        // stop animation and movement
        sprite.stop();
        spriteMover.stopMe();
    };

    this.resetMe = function() {
        sprite.gotoAndStop("snakeAlive");
        sprite.x = 280;
        sprite.y = 300;
        spriteMover.setSpeed(maxSpeed);
    };

    this.energizeMe = function() {
        // snake can only gain more energy if less than maximum
        if (spriteMover.getSpeed() < maxSpeed) {
            spriteMover.setSpeed(spriteMover.getSpeed() + 1);
            sprite.dispatchEvent(eventSnakeSpeedChange);
        }
		
		console.log("Snake energized: " + spriteMover.getSpeed());
		
        // reset slowdown timer so the interval starts again
        window.clearInterval(slowDownTimer);
        slowDownTimer = window.setInterval(onSlowMe, slowDownDelay);
    };

    this.killMe = function() {
        if (!killed) {
            killed = true;
            spriteMover.stopMe();
            // kill slowdown timer
            window.clearInterval(slowDownTimer);
            sprite.gotoAndPlay("snakeDead");
            sprite.addEventListener("animationend", onKilled);
        }
    };
    
    this.updateMe = function() {
        spriteMover.update();
    };

    // ----------------------------------------------- event handlers
    function onSlowMe() {
        // adjust speed of MovingObject
        spriteMover.setSpeed(spriteMover.getSpeed() - 1);
        sprite.dispatchEvent(eventSnakeSpeedChange);
        
        console.log("Snake slowed: " + spriteMover.getSpeed());        
        
        // check if snake is dead
        if (spriteMover.getSpeed() <= 0) {
            me.killMe();
        }
    }

    function onKilled(e) {
        // cleanup
        sprite.stop();
        e.remove();
        // dispatch event that snake has been killed!
        sprite.dispatchEvent(eventSnakeKilled);
    }
};
