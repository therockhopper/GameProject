var Bug = function(stage, assetManager, snake) {
    // initialization
    var snakeSprite = snake.getSprite();
    // construct custom event objects
    var eventBugEaten = new createjs.Event("onBugEaten", true);

    // is the bug currently being used?
    var active = false;
    
    // construct sprite for this object and add to stage
    var sprite = assetManager.getSprite("assets");
    sprite.gotoAndStop("bugAlive");
    var spriteMover = new MoverDiagonal(sprite, stage);
    
    // --------------------------------------------- private methods
    function randomMe(low, high) {
        return Math.round(Math.random() * (high - low)) + low;
    }

    // ---------------------------------------------- get/set methods
    this.getActive = function() {
        return active;  
    };
    
    this.setActive = function(value) {
        active = value;
    };
    
    // ---------------------------------------------- public methods
    this.setupMe = function() {
        // random selection of speed of bug
        spriteMover.setSpeed(randomMe(2,6));

        // get bounds of sprite so we can determine width / height
        var dimensions = sprite.getBounds();

        // bug starts on left or right of stage?
        if (randomMe(1, 2) == 1) {
            // move right
            sprite.x = -dimensions.width;
            // randomly select starting y location of mower
            sprite.y = randomMe(50, stage.canvas.height - 50);
            sprite.rotation = randomMe(45, -45);
        } else {
            // move left
            sprite.x = stage.canvas.width;
            sprite.y = randomMe(50, stage.canvas.height - 50);
            sprite.rotation = randomMe(135, 225);
        }

        // listen for when my bug goes off the screen and kill it if it does
        sprite.addEventListener("onMovingDiagonalOffStage", onKillMe);
    };
    
    this.releaseMe = function() {
        // fire startMe again to take the new rotation of the bug
        sprite.gotoAndPlay("bugAlive");
        spriteMover.startMe();

        // add bugs so they are below the snake (snake)
        stage.addChildAt(sprite, stage.getChildIndex(snakeSprite));
    };
    
    this.updateMe = function() {
        // if bug not moving then nothing to update!
        if ((!spriteMover.getMoving()) || (snake.getKilled())) return;
        
        spriteMover.update(); 

        /*
        // collision detection
        // HITTEST APPROACH
        // have to convert position of one sprite (bug) to be relative to the snakeSprite for it to work
        var point = snakeSprite.globalToLocal(sprite.x, sprite.y);
        if (snakeSprite.hitTest(point.x, point.y)) {
            console.log("collision!");
            // collision detection with snake
            sprite.dispatchEvent(eventBugEaten);
            onKillMe();
        }
        */

        // RADIUS TESTING APPROACH
        // radius collision detection
        // Calculate difference between centers
        var a = snakeSprite.x - sprite.x;
        var b = snakeSprite.y - sprite.y;
        // Get distance with Pythagoras
        var c = Math.sqrt((a * a) + (b * b));
        // bug has a radius of 20
        // snake has a radius of 30
        // force the radius of the circle on the snake to only be 5
        // sum of 5 + 20 = 25
        if (c <= 25) {
            console.log("collision!");
            sprite.dispatchEvent(eventBugEaten);
            onKillMe();
        }
    };

    // ----------------------------------------------- event handlers
    function onKillMe(e) {
        spriteMover.stopMe();
        // play death sequence of bug
        sprite.gotoAndPlay("bugDead");
        sprite.addEventListener("animationend", onKilled);
    }

    function onKilled(e) {
        // cleanup event listeners
        e.remove();
        sprite.removeAllEventListeners();
        // remove displayobject
        stage.removeChild(sprite);
        used = false;
        console.log("bug killed");
        
        // put bug back in the pool
        active = false;
    }
};
