(function() {
    "use strict";

    var stage;
    var queue;
    function init() {
        queue = new createjs.LoadQueue();
        queue.installPlugin(createjs.Sound);
        queue.addEventListener("complete", loadComplete);
        queue.loadManifest([
            {id:"butterfly", src:"images/butterfly.png"},
            {id:"woosh", src:"sounds/woosh.mp3"},
            {id:"chime", src:"sounds/chime.mp3"}
        ]); }
    function loadComplete() {
        setupStage();
        buildButterflies();
    }
    function setupStage() {
        stage = new createjs.Stage(document.getElementById('canvas'));
        createjs.Ticker.setFPS(60);
        createjs.Ticker.addEventListener("tick", function(){
            stage.update();
        });
    }
    function buildButterflies() {
        var img = queue.getResult("butterfly");
        var i, sound, butterfly;
        for (i = 0; i < 3; i++) {
            butterfly = new createjs.Bitmap(img);
            butterfly.x = i * 200;
            stage.addChild(butterfly);
            createjs.Tween.get(butterfly).wait(i * 1000).to({y:100}, 1000,
                createjs.Ease.quadOut).call(butterflyComplete);
            sound = createjs.Sound.play('woosh',createjs.Sound.INTERRUPT_NONE,i * 1000);
        } }
    function butterflyComplete(){
        stage.removeChild(this);
        if(!stage.getNumChildren()){
            createjs.Sound.play('chime');
        }
    }

})();