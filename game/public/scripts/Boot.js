Kente = {
	socket : io('http://localhost:3000'),
    removeAllSocketListeners: function(){
        Kente.socket.removeAllListeners('threadTouch'); //Remove all previous listeners
        Kente.socket.removeAllListeners('shuttleTouch'); //Remove all previous listeners
        Kente.socket.removeAllListeners('beaterClick'); //Remove all previous listeners
    },
    /* Here we've just got some global level vars that persist regardless of State swaps */
    score: 0,

    /* If the music in your game needs to play through-out a few State swaps, then you could reference it here */
    music: null,
    background: null,
    sounds: []

};

Kente.Boot = function (game) {
};

Kente.Boot.prototype = {

    preload: function () {

        // this.load.image('verticalWarpThread', 'assets/vWarpThread.png');
        this.load.image('background', 'assets/background.png');
        this.load.image('bg_Tutorial', 'assets/bg_Tutorial.png');
        this.load.image('warp_placeholder', 'assets/warp_placeholder.png');
        this.load.image('shuttle', 'assets/shuttle.png');
        this.load.image('btn', 'assets/button.jpeg');
        //Load all Sounds
        this.load.audio('instr1_Audio', 'assets/audio/instr1.m4a');// 0 Lightlt pull
        this.load.audio('instr2_Audio', 'assets/audio/instr2.m4a');// 1 First, lest learn how
        this.load.audio('instr3_Audio', 'assets/audio/instr3.m4a');// 2 These vertical threads are called
        this.load.audio('stillThereShuttle_Audio', 'assets/audio/stillThereShuttle.m4a');//3 Still there shuttle
        this.load.audio('stillThereShuttle1_Audio', 'assets/audio/stillThereShuttle_1.m4a');//4 Still there shuttle continue

    },

    create: function () {
        Kente.sounds.push(this.game.add.audio('instr1_Audio'));
        Kente.sounds.push(this.game.add.audio('instr2_Audio'));
        Kente.sounds.push(this.game.add.audio('instr3_Audio'));
        Kente.sounds.push(this.game.add.audio('stillThereShuttle_Audio'));
        Kente.sounds.push(this.game.add.audio('stillThereShuttle1_Audio'));

        this.game.sound.setDecodedCallback(Kente.sounds, this.loadMainMenuState, this);
    }, 
    loadMainMenuState : function(){
        this.state.start('MainMenu',true,false);
    }

};