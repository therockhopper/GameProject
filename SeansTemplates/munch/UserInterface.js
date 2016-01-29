var UserInterface = function(stage, assetManager, maxSpeed) {
    // grab sprite for UserInterface and add to stage canvas
    var sprite = assetManager.getSprite("assets");
    sprite.gotoAndStop("interface");
    sprite.x = 10;
    sprite.y = 10;
    stage.addChild(sprite);

    var txtBugs = new createjs.BitmapText("0", assetManager.getSpriteSheet("assets"));
    txtBugs.x = 173;
    txtBugs.y = 7;
    txtBugs.letterSpacing = 2;
    stage.addChild(txtBugs);

    var speedBar = new createjs.Shape();
    stage.addChild(speedBar);

    // -------------------------------------------------- get / set methods
    this.setBugsEaten = function(value) {
        txtBugs.text = String(value);
    }

    this.setSnakeSpeed = function(speed) {
        // adjust width of speedBar
        var width = (speed / maxSpeed) * 80;
        // redraw bar shape object to reflect current speed
        speedBar.graphics.clear();
        speedBar.graphics.beginFill("#66CC33").drawRect(41, 15, width, 10);
    }


    // -------------------------------------------------- public methods
    this.setupMe = function() {
        this.setBugsEaten(0);
        this.setSnakeSpeed(maxSpeed);
    }

};
