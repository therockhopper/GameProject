var Slash = function (stage, assetManger) {
    // INIT
    var killed = false;

    // event objects
    var eventSlashKilled = new createjs.Event("onSlashKilled", true);

    // get animation for snake
    var sprite = assetManger.getSprite("assets");
    sprite.regX= 30;
    sprite.regY= 30;
    var spriteMover = new Mover(sprite,stage);
    // add slash to the stage
    stage.addChild(sprite);

    // ================ GET / SET METHODS ======================
    // --------------------------- return if Slash is killed
    this.getKilled = function() {
        return killed;
    };

    // --------------------------- return the Slash sprite
    this.getSprite = function() {
      return sprite;
    };

    // ================= PUBLIC METHODS =======================
    // ----------------------------------- Start playing animation and set direction
    this.setupMe = function(direction) {
        spriteMover.setDirection(direction);
        if (!spriteMover.getMoving()) {
            sprite.gotoAndPlay("slashAlive");
            spriteMover.startMe();
        }
    };

    this.startMe = function(direction) {
        spriteMover.setDirection(direction);
        if (!spriteMover.getMoving()) {
            sprite.gotoAndPlay("slashAlive");
            spriteMover.startMe();
        }
    };

    // ------------------------ Stop animation and movement
    this.stopMe = function() {
        sprite.stop();
        spriteMover.stopMe();
    };

    // ------------------------- Reset Slash
    this.resetMe = function() {
        sprite.gotoAndStop("slashAlive");
        sprite.x = 280;
        sprite.y = 300;
    };

    // ------------------------- Kill slash if not already dead, then chagne animation
    this.killMe = function () {
        if (!killed) {
            killed = true;
            spriteMover.stopMe();
            sprite.gotoAndStop("SlashDead");
            createjs.Sound.play("death");
            sprite.addEventListener("animationend", onKilled);
            console.log("Killing slash");
            sprite.dispatchEvent(eventSlashKilled);
        }
    };

    this.updateMe = function() {
        spriteMover.update();
    };

    // ========================= EVENT HANDLERS ===============================
    // -------------------- Clean up sprite when killed
    function onKilled(e) {
        sprite.stop();
        e.remove();
        console.log("SLASH IS DEAD");

    }




};