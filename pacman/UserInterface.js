var UserInterface = function(stage, assetManager) {

    var eaten = 0;
    var scoreboard;

    var txtWhammyBar = new createjs.Text("Whammy Bars Eaten: " + eaten, "bold 15px Arial", "#ff7700");
    txtWhammyBar.x = 173;
    txtWhammyBar.y = 7;
    stage.addChild(txtWhammyBar);

    scoreboard = assetManager.getSprite("assets");
    scoreboard.gotoAndStop("Scoreboard0");
    scoreboard.x = 500;
    scoreboard.y = 300;
    stage.addChild(scoreboard);

    // -------------------------------------------------- get / set methods
    this.setWhammyBarsEaten = function(value) {
        eaten = value;
        stage.addChild(txtWhammyBar);
    };

    this.upScoreboard = function(value) {
        // check and see what point the user is on.
        if (value === 1) scoreboard.gotoAndStop("Scoreboard0");
        if (value === 2) scoreboard.gotoAndStop("Scoreboard25");
        if (value === 3) scoreboard.gotoAndStop("Scoreboard50");
        if (value === 4) scoreboard.gotoAndStop("Scoreboard75");
        if (value === 5) scoreboard.gotoAndStop("Scoreboard100");
        if (value === 6) scoreboard.gotoAndStop("Scoreboard110");
        // update the stge with the correct scoreboard
        console.log("updating scoreboard");
        stage.addChild(scoreboard);
    };





    // -------------------------------------------------- public methods
    this.setupMe = function() {
        // set points to 0
        this.setWhammyBarsEaten(6);
        //reset score board
    }

};
