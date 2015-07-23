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
    sounds: [],
    theSounds: null,
    postImage: function(game){
        var image64 = game.canvas.toDataURL('image/png');

        // var second_game = new Phaser.Game(175, 300, Phaser.AUTO);
        // second_game.preserveDrawingBuffer = true;

        // console.log(image64);
        $.ajax({
            url: 'http://localhost:3000/kente',
            dataType: 'json',
            type: 'post',
            contentType: 'application/json',
            data: JSON.stringify( { "image64": image64}),
            processData: false,
            success: function( data, textStatus, jQxhr ){
                console.log(JSON.stringify( data ) );
            },
            error: function( jqXhr, textStatus, errorThrown ){
                console.log( errorThrown );
            }
        });
    }

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
        this.load.image('shuttle_vector', 'assets/shuttleVector.png');
        this.load.image('thread', 'assets/thread.png');
        this.load.image('weftChunk', 'assets/weftChunk.png');
        this.load.image('weftChunk_large', 'assets/weftThread_473.png');
        this.load.image('wooden_divider', 'assets/woodendivider.png');
        this.load.image('kente_bg', 'assets/kentebg.png');
        this.load.image('btn', 'assets/button.jpeg');
        this.load.image('halfbg', 'assets/half-background.png');
        
        //Load all Sounds
        this.load.audio('1-start', 'assets/audio/1-start.mp3');// 0 Welcome to the interactive weaving exhibit
        this.load.audio('1-1', 'assets/audio/1-1.mp3');// Are you still there
        this.load.audio('2-0-1', 'assets/audio/2-0-1.mp3');// 2 These vertical threads are called
        this.load.audio('2-0-2', 'assets/audio/2-0-2.mp3');// 3
        this.load.audio('2-0-3', 'assets/audio/2-0-3.mp3');// 3
        this.load.audio('3-0-1', 'assets/audio/3-0-1.mp3');// 3
        this.load.audio('3-0-2', 'assets/audio/3-0-2.mp3');// 3
        this.load.audio('3-0-3', 'assets/audio/3-0-3.mp3');// 3
        this.load.audio('4-0', 'assets/audio/4-0.mp3');// 3
        this.load.audio('5-0-1', 'assets/audio/5-0-1.mp3');// 3
        this.load.audio('5-0-2', 'assets/audio/5-0-2-take1.mp3');// 3
        this.load.audio('5-2', 'assets/audio/5-2.mp3');// 3
        this.load.audio('5-1-0', 'assets/audio/5-1-0.mp3');// 3
        this.load.audio('5-1-1', 'assets/audio/5-1-1.mp3');// 3
        this.load.audio('6-0-1', 'assets/audio/6-0-1.mp3');// 3

        

    },
    create: function () {
        Kente.theSounds = {
            '1-start': this.game.add.audio('1-start'),
            '1-1': this.game.add.audio('1-1'),
            '2-0-1': this.game.add.audio('2-0-1'),
            '2-0-2': this.game.add.audio('2-0-2'),
            '2-0-3': this.game.add.audio('2-0-3'),
            '3-0-1': this.game.add.audio('3-0-1'),
            '3-0-2': this.game.add.audio('3-0-2'),
            '3-0-3': this.game.add.audio('3-0-3'),
            '4-0': this.game.add.audio('4-0'),
            '5-0-1': this.game.add.audio('5-0-1'),
            '5-0-2': this.game.add.audio('5-0-2'),
            '5-2': this.game.add.audio('5-2'),
            '5-1-0': this.game.add.audio('5-1-0'),
            '5-1-1': this.game.add.audio('5-1-1'),
            '6-0-1': this.game.add.audio('6-0-1')
         };


        Kente.sounds.push(Kente.theSounds['1-start']);
        Kente.sounds.push(Kente.theSounds['1-1']);
        Kente.sounds.push(Kente.theSounds['2-0-1']);
        Kente.sounds.push(Kente.theSounds['2-0-2']);
        Kente.sounds.push(Kente.theSounds['2-0-3']);
        Kente.sounds.push(Kente.theSounds['3-0-1']);
        Kente.sounds.push(Kente.theSounds['3-0-2']);
        Kente.sounds.push(Kente.theSounds['3-0-3']);
        Kente.sounds.push(Kente.theSounds['4-0']);
        Kente.sounds.push(Kente.theSounds['5-0-1']);
        Kente.sounds.push(Kente.theSounds['5-0-2']);
        Kente.sounds.push(Kente.theSounds['5-2']);
        Kente.sounds.push(Kente.theSounds['5-1-0']);
        Kente.sounds.push(Kente.theSounds['5-1-1']);
        Kente.sounds.push(Kente.theSounds['6-0-1']);
        // Kente.sounds.push(this.game.add.audio('instr3_Audio'));
        // Kente.sounds.push(this.game.add.audio('stillThereShuttle_Audio'));
        // Kente.sounds.push(this.game.add.audio('stillThereShuttle1_Audio'));

        this.game.sound.setDecodedCallback(Kente.sounds, this.loadMainMenuState, this);
    }, 
    loadMainMenuState : function(){
        this.state.start('SlideShow',true,false);
    }

};