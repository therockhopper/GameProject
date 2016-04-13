var Follow = function(sprite,target, stage) {
    // private property variables
    var speed = 2;
    var moving = false;
    // private variables
    var xDisplace = -1;
    var yDisplace = -1;

    // create event for when sprite goes off screen
    var eventOffStage = new createjs.Event("onMovingDiagonalOffStage", true);
    
    // sprite not animating on construction
    sprite.stop();
    
    // --------------------------------------------------- get/set methods
    this.setSpeed = function(value) {
        speed = value;
    };
    
    this.getMoving = function(){
        return moving;   
    };
    
    // -------------------------------------------------- private methods
    function radianMe(degrees) {
        return (degrees * (Math.PI / 180));
    }        
    
    // --------------------------------------------------- public methods
    this.startMe = function() {
        if (!moving) {
            // convert current rotation of object to radians
            var radians = radianMe(sprite.rotation);
            // calculating X and Y displacement
            xDisplace = Math.cos(radians) * speed;
            yDisplace = Math.sin(radians) * speed;
            sprite.play();
            moving = true;
        }
    };

    this.stopMe = function() {
        if (moving) {
            sprite.stop();
            moving = false;
        }
    };
    
    this.update = function(speed) {
        //move sprite closer to target
        if (moving) {

            var difX = target.x - sprite.x;
            var difY = target.y - sprite.y;

            sprite.x += difX / (100/speed); //making these numbers (100) smaller makes it go faster
            sprite.y += difY / (100/speed);

            // get dimenstions of current frame in sprite
            var dimensions = sprite.getBounds();
            var width = dimensions.width;
            var height = dimensions.height;

            // check if object is off the stage
            if ((sprite.x < -width) || (sprite.x > (stage.canvas.width + width)) || (sprite.y < -height) || (sprite.y > (stage.canvas.height + height))) {
                sprite.dispatchEvent(eventOffStage);
            }

        }
    }
}