Kente = {

    /* Here we've just got some global level vars that persist regardless of State swaps */
    score: 0,

    /* If the music in your game needs to play through-out a few State swaps, then you could reference it here */
    music: null
};

Kente.Boot = function (game) {
};

Kente.Boot.prototype = {

    preload: function () {

        // this.load.image('verticalWarpThread', 'assets/vWarpThread.png');
        this.load.image('background', 'assets/background.png');

    },

    create: function () {


        this.state.start('MainMenu',true,false);

    }

};