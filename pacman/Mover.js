var Mover = function(sprite, stage) {
    // private property variables
    var speed = 5;
    var direction = MoverDirection.LEFT;
    var moving = false;

    // even for when the sprite goes off the stage
    var eventOffStage = new createjs.Event("onOffStage", true);

    // sprite not animating on construction
    sprite.stop();

    // --------------------------------------------------- get/set methods
    this.setSpeed = function(value) {
        // set new speed
        speed = value;
    };
    this.getSpeed = function() {
        // get the current speed
        return speed;
    };

    this.setDirection = function(value) {
        // set current direction
        direction = value;
    };

    this.getMoving = function(){
        // chek if object is moving
        return moving;
    };

    // --------------------------------------------------- public methods
    this.startMe = function() {
        // tell prite to move
        sprite.play();
        moving = true;
    };

    this.stopMe = function() {
        // tell sprite to stop
        sprite.stop();
        moving = false;
    };

    this.update = function() {
        // update the sprite
        if (moving) {
            // get the dimesions of the sprite.
            var width = sprite.getBounds().width;

            if (direction == MoverDirection.LEFT) {
                // if we move left
                sprite.scaleX = 1;
                sprite.rotation = 0;
                sprite.x = sprite.x - speed;
                // check if sprite off screen
                if (sprite.x < -width) {
                    sprite.x = stage.canvas.width;
                    sprite.dispatchEvent(eventOffStage);
                }

            } else if (direction == MoverDirection.RIGHT) {
                // if we move right
                sprite.scaleX = -1;
                sprite.rotation = 0;
                sprite.x = sprite.x + speed;
                // check if sprite off screen
                if (sprite.x > (stage.canvas.width + width)) {
                    sprite.x = -width;
                    sprite.dispatchEvent(eventOffStage);
                }

            } else if (direction == MoverDirection.UP) {
                // if we move up
                sprite.scaleX = 1;
                sprite.rotation = 90;
                sprite.y = sprite.y - speed;
                // check if sprite off screen
                if (sprite.y < -width) {
                    sprite.y = stage.canvas.height;
                    sprite.dispatchEvent(eventOffStage);
                }

            } else if (direction == MoverDirection.DOWN) {
                // if we move down
                sprite.scaleX = 1;
                sprite.rotation = -90;
                sprite.y = sprite.y + speed;
                // check if sprite off screen
                if (sprite.y > (stage.canvas.height + width)) {
                    sprite.y = -width;
                    sprite.dispatchEvent(eventOffStage);
                }
            }
        }
    };
}

// static constant hacking by adding them on as properties of a generic object
var MoverDirection = {
    "LEFT":1,
    "RIGHT":2,
    "UP":3,
    "DOWN":4
};
