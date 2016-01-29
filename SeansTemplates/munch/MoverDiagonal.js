var MoverDiagonal = function(sprite, stage) {
    // private property variables
    var speed = 2;
    var moving = false;
    // private variables
    var xDisplace = -1;
    var yDisplace = -1;
    
    // construct custom event object for object moving off stage
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
    
    this.update = function() {
        if (moving) {
            // move sprite
            sprite.x = sprite.x + xDisplace;
            sprite.y = sprite.y + yDisplace;

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