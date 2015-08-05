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
    beaterPosition: null,
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
        this.load.image('shuttle_vector', 'assets/shuttleVector.png');
        this.load.image('red', 'assets/shuttleVector_red.png');
        this.load.image('blue', 'assets/shuttleVector_blue.png');
        this.load.image('green', 'assets/shuttleVector_green.png');
        this.load.image('yellow', 'assets/shuttleVector_yellow.png');
        this.load.image('thread', 'assets/thread.png');
        this.load.image('weftChunk', 'assets/weftChunk.png');
        this.load.image('weftChunk_large', 'assets/weftThread_473.png');
        this.load.image('wooden_divider', 'assets/woodendivider.png');
        this.load.image('kente_bg', 'assets/kentebg.png');
        this.load.image('halfbg', 'assets/half-background.png');
        
        //Load all Sounds
        // this.load.audio('1-start', 'assets/audio/1-start.mp3');// 0 Welcome to the interactive weaving exhibit
        // this.load.audio('1-1', 'assets/audio/1-1.mp3');// Are you still there
        // this.load.audio('2-0-1', 'assets/audio/2-0-1.mp3');// 2 These vertical threads are called
        // this.load.audio('2-0-2', 'assets/audio/2-0-2.mp3');// 3
        // this.load.audio('2-0-3', 'assets/audio/2-0-3.mp3');// 3
        // this.load.audio('3-0-1', 'assets/audio/3-0-1.mp3');// 3
        // this.load.audio('3-0-2', 'assets/audio/3-0-2.mp3');// 3
        // this.load.audio('3-0-3', 'assets/audio/3-0-3.mp3');// 3
        // this.load.audio('4-0', 'assets/audio/4-0.mp3');// 3
        // this.load.audio('5-0-1', 'assets/audio/5-0-1.mp3');// 3
        // this.load.audio('5-0-2', 'assets/audio/5-0-2-take1.mp3');// 3
        // this.load.audio('5-2', 'assets/audio/5-2.mp3');// 3
        // this.load.audio('5-1-0', 'assets/audio/5-1-0.mp3');// 3
        // this.load.audio('5-1-1', 'assets/audio/5-1-1.mp3');// 3
        // this.load.audio('6-0-1', 'assets/audio/6-0-1.mp3');// 3
        // this.load.audio('6-0-2', 'assets/audio/6-0-2.mp3');// 3
        // this.load.audio('6-0-4', 'assets/audio/6-0-4.mp3');// 3
        // this.load.audio('6-0-5', 'assets/audio/6-0-5.mp3');// 3
        // this.load.audio('7-0-1', 'assets/audio/7-0-1.mp3');// 3
        // this.load.audio('7-0-2', 'assets/audio/7-0-2.mp3');// 3
        // this.load.audio('7-1', 'assets/audio/7-1.mp3');// 3
        // this.load.audio('7-2', 'assets/audio/7-2.mp3');// 3
        // this.load.audio('7-3', 'assets/audio/7-3.mp3');// 3
        // this.load.audio('7-4', 'assets/audio/7-4.mp3');// 3
        // this.load.audio('7-5', 'assets/audio/7-5.mp3');// 3
        // this.load.audio('7-6', 'assets/audio/7-6.mp3');// 3
        // this.load.audio('8-0-1', 'assets/audio/8-0-1.mp3');// 3
        // this.load.audio('8-0-2', 'assets/audio/8-0-2.mp3');// 3
        // this.load.audio('8-2', 'assets/audio/8-2.mp3');// 3
        // this.load.audio('9-0-1', 'assets/audio/9-0-1.mp3');// 3
        // this.load.audio('9-0-2', 'assets/audio/9-0-2-take1.mp3');// 3
        // this.load.audio('9-0-3', 'assets/audio/9-0-3.mp3');// 3
        // this.load.audio('10-0', 'assets/audio/10-0.mp3');// 3
        // this.load.audio('11-0-1', 'assets/audio/11-0-1.mp3');// 3
        // this.load.audio('11-0-2', 'assets/audio/11-0-2.mp3');// 3

        this.load.audio('1-0-1', 'assets/audio/v2/1-0-1.mp3');
        this.load.audio('1-0-2', 'assets/audio/v2/1-0-2.mp3');
        this.load.audio('1-0-3', 'assets/audio/v2/1-0-3.mp3');
        this.load.audio('1-1', 'assets/audio/v2/1-1.mp3');
        this.load.audio('2-0', 'assets/audio/v2/2-0.mp3');
        this.load.audio('3-0-1', 'assets/audio/v2/3-0-1.mp3');
        this.load.audio('3-0-2', 'assets/audio/v2/3-0-2.mp3');
        this.load.audio('3-0-3', 'assets/audio/v2/3-0-3.mp3');            
        this.load.audio('4-0', 'assets/audio/v2/4-0.mp3');
        this.load.audio('5-0-1', 'assets/audio/v2/5-0-1.mp3');
        this.load.audio('5-0-2', 'assets/audio/v2/5-0-2.mp3');
        this.load.audio('5-1-1-a', 'assets/audio/v2/5-1-1-a.mp3');
        this.load.audio('5-1-1-b', 'assets/audio/v2/5-1-1-b.mp3');
        this.load.audio('5-1-2', 'assets/audio/v2/5-1-2.mp3');
        this.load.audio('5-1-3', 'assets/audio/v2/5-1-3.mp3');
        this.load.audio('5-1-4', 'assets/audio/v2/5-1-4.mp3');
        this.load.audio('5-2', 'assets/audio/v2/5-2.mp3');
        this.load.audio('5-3', 'assets/audio/v2/5-3.mp3');
        this.load.audio('5-4', 'assets/audio/v2/5-4.mp3');
        this.load.audio('5-5', 'assets/audio/v2/5-5.mp3');
        this.load.audio('6-0-1', 'assets/audio/v2/6-0-1.mp3');
        this.load.audio('6-0-2', 'assets/audio/v2/6-0-2.mp3');
        this.load.audio('6-0-3', 'assets/audio/v2/6-0-3.mp3');
        this.load.audio('6-0-4', 'assets/audio/v2/6-0-4.mp3');
        this.load.audio('7-0-1', 'assets/audio/v2/7-0-1.mp3');
        this.load.audio('7-0-2', 'assets/audio/v2/7-0-2.mp3');
        this.load.audio('7-1', 'assets/audio/v2/7-1.mp3');
        this.load.audio('7-2', 'assets/audio/v2/7-2.mp3');
        this.load.audio('7-3', 'assets/audio/v2/7-3.mp3');
        this.load.audio('7-4', 'assets/audio/v2/7-4.mp3');
        this.load.audio('7-5', 'assets/audio/v2/7-5.mp3');
        this.load.audio('7-6', 'assets/audio/v2/7-6.mp3');
        this.load.audio('7-7', 'assets/audio/v2/7-7.mp3');
        this.load.audio('8-0-1', 'assets/audio/v2/8-0-1.mp3');
        this.load.audio('8-0-2', 'assets/audio/v2/8-0-2.mp3');
        this.load.audio('8-1', 'assets/audio/v2/8-1.mp3');
        this.load.audio('8-2', 'assets/audio/v2/8-2.mp3');
        this.load.audio('8-3', 'assets/audio/v2/8-3.mp3');
        this.load.audio('8-5', 'assets/audio/v2/8-5.mp3');
        this.load.audio('9-0-1', 'assets/audio/v2/9-0-1.mp3');
        this.load.audio('9-0-2', 'assets/audio/v2/9-0-2.mp3');
        this.load.audio('9-0-3', 'assets/audio/v2/9-0-3.mp3');
        this.load.audio('10', 'assets/audio/v2/10.mp3');
        this.load.audio('11-0-1', 'assets/audio/v2/11-0-1.mp3');
        this.load.audio('11-0-2', 'assets/audio/v2/11-0-2.mp3');





    },
    create: function () {
        Kente.theSounds = {
            // '1-start': this.game.add.audio('1-start'),
            // '1-1': this.game.add.audio('1-1'),
            // '2-0-1': this.game.add.audio('2-0-1'),
            // '2-0-2': this.game.add.audio('2-0-2'),
            // '2-0-3': this.game.add.audio('2-0-3'),
            // '3-0-1': this.game.add.audio('3-0-1'),
            // '3-0-2': this.game.add.audio('3-0-2'),
            // '3-0-3': this.game.add.audio('3-0-3'),
            // '4-0': this.game.add.audio('4-0'),
            // '5-0-1': this.game.add.audio('5-0-1'),
            // '5-0-2': this.game.add.audio('5-0-2'),
            // '5-2': this.game.add.audio('5-2'),
            // '5-1-0': this.game.add.audio('5-1-0'),
            // '5-1-1': this.game.add.audio('5-1-1'),
            // '6-0-1': this.game.add.audio('6-0-1'),
            // '6-0-2': this.game.add.audio('6-0-2'),
            // '6-0-4': this.game.add.audio('6-0-4'),
            // '6-0-5': this.game.add.audio('6-0-5'),
            // '7-0-1': this.game.add.audio('7-0-1'),
            // '7-0-2': this.game.add.audio('7-0-2'),
            // '7-1': this.game.add.audio('7-1'),
            // '7-2': this.game.add.audio('7-2'),
            // '7-3': this.game.add.audio('7-3'),
            // '7-4': this.game.add.audio('7-4'),
            // '7-5': this.game.add.audio('7-5'),
            // '7-6': this.game.add.audio('7-6'),
            // '8-0-1': this.game.add.audio('8-0-1'),
            // '8-0-2': this.game.add.audio('8-0-2'),
            // '8-2': this.game.add.audio('8-2'),
            // '9-0-1': this.game.add.audio('9-0-1'),
            // '9-0-2': this.game.add.audio('9-0-2'),
            // '9-0-3': this.game.add.audio('9-0-3'),
            // '10-0': this.game.add.audio('10-0'),
            // '11-0-1': this.game.add.audio('11-0-1'),
            // '11-0-2': this.game.add.audio('11-0-2')

            '1-0-1': this.game.add.audio('1-0-1'),
            '1-0-2': this.game.add.audio('1-0-2'),
            '1-0-3': this.game.add.audio('1-0-3'),
            '1-1': this.game.add.audio('1-1'),
            '2-0': this.game.add.audio('2-0'),
            '3-0-1': this.game.add.audio('3-0-1'),
            '3-0-2': this.game.add.audio('3-0-2'),
            '3-0-3': this.game.add.audio('3-0-3'),
            '4-0': this.game.add.audio('4-0'),
            '5-0-1': this.game.add.audio('5-0-1'),
            '5-0-2': this.game.add.audio('5-0-2'),
            '5-1-1-a': this.game.add.audio('5-1-1-a'),
            '5-1-1-b': this.game.add.audio('5-1-1-b'),
            '5-1-2': this.game.add.audio('5-1-2'),
            '5-1-3': this.game.add.audio('5-1-3'),
            '5-1-4': this.game.add.audio('5-1-4'),
            '5-2': this.game.add.audio('5-2'),
            '5-3': this.game.add.audio('5-3'),
            '5-4': this.game.add.audio('5-4'),
            '5-5': this.game.add.audio('5-5'),
            '6-0-1': this.game.add.audio('6-0-1'),
            '6-0-2': this.game.add.audio('6-0-2'),
            '6-0-3': this.game.add.audio('6-0-3'),
            '6-0-4': this.game.add.audio('6-0-4'),
            '7-0-1': this.game.add.audio('7-0-1'),
            '7-0-2': this.game.add.audio('7-0-2'),
            '7-1': this.game.add.audio('7-1'),
            '7-2': this.game.add.audio('7-2'),
            '7-3': this.game.add.audio('7-3'),
            '7-4': this.game.add.audio('7-4'),
            '7-5': this.game.add.audio('7-5'),
            '7-6': this.game.add.audio('7-6'),
            '7-7': this.game.add.audio('7-7'),
            '8-0-1': this.game.add.audio('8-0-1'),
            '8-0-2': this.game.add.audio('8-0-2'),
            '8-1': this.game.add.audio('8-1'),
            '8-2': this.game.add.audio('8-2'),
            '8-3': this.game.add.audio('8-3'),
            '8-5': this.game.add.audio('8-5'),
            '9-0-1': this.game.add.audio('9-0-1'),
            '9-0-2': this.game.add.audio('9-0-2'),
            '9-0-3': this.game.add.audio('9-0-3'),
            '10': this.game.add.audio('10'),
            '11-0-1': this.game.add.audio('11-0-1'),
            '11-0-2': this.game.add.audio('11-0-2')
         };


        // Kente.sounds.push(Kente.theSounds['1-start']);
        // Kente.sounds.push(Kente.theSounds['1-1']);
        // Kente.sounds.push(Kente.theSounds['2-0-1']);
        // Kente.sounds.push(Kente.theSounds['2-0-2']);
        // Kente.sounds.push(Kente.theSounds['2-0-3']);
        // Kente.sounds.push(Kente.theSounds['3-0-1']);
        // Kente.sounds.push(Kente.theSounds['3-0-2']);
        // Kente.sounds.push(Kente.theSounds['3-0-3']);
        // Kente.sounds.push(Kente.theSounds['4-0']);
        // Kente.sounds.push(Kente.theSounds['5-0-1']);
        // Kente.sounds.push(Kente.theSounds['5-0-2']);
        // Kente.sounds.push(Kente.theSounds['5-2']);
        // Kente.sounds.push(Kente.theSounds['5-1-0']);
        // Kente.sounds.push(Kente.theSounds['5-1-1']);
        // Kente.sounds.push(Kente.theSounds['6-0-1']);
        // Kente.sounds.push(Kente.theSounds['6-0-2']);
        // Kente.sounds.push(Kente.theSounds['6-0-4']);
        // Kente.sounds.push(Kente.theSounds['6-0-5']);
        // Kente.sounds.push(Kente.theSounds['7-0-1']);
        // Kente.sounds.push(Kente.theSounds['7-0-2']);
        // Kente.sounds.push(Kente.theSounds['7-1']);
        // Kente.sounds.push(Kente.theSounds['7-2']);
        // Kente.sounds.push(Kente.theSounds['7-3']);
        // Kente.sounds.push(Kente.theSounds['7-4']);
        // Kente.sounds.push(Kente.theSounds['7-5']);
        // Kente.sounds.push(Kente.theSounds['7-6']);
        // Kente.sounds.push(Kente.theSounds['8-0-1']);
        // Kente.sounds.push(Kente.theSounds['8-0-2']);
        // Kente.sounds.push(Kente.theSounds['8-2']);
        // Kente.sounds.push(Kente.theSounds['9-0-1']);
        // Kente.sounds.push(Kente.theSounds['9-0-2']);
        // Kente.sounds.push(Kente.theSounds['9-0-3']);
        // Kente.sounds.push(Kente.theSounds['10-0']);
        // Kente.sounds.push(Kente.theSounds['11-0-1']);
        // Kente.sounds.push(Kente.theSounds['11-0-2']);

        Kente.sounds.push(Kente.theSounds['1-0-1']);
        Kente.sounds.push(Kente.theSounds['1-0-2']);
        Kente.sounds.push(Kente.theSounds['1-0-3']);
        Kente.sounds.push(Kente.theSounds['1-1']);
        Kente.sounds.push(Kente.theSounds['2-0']);
        Kente.sounds.push(Kente.theSounds['3-0-1']);
        Kente.sounds.push(Kente.theSounds['3-0-2']);
        Kente.sounds.push(Kente.theSounds['3-0-3']);
        Kente.sounds.push(Kente.theSounds['4-0']);
        Kente.sounds.push(Kente.theSounds['5-0-1']);
        Kente.sounds.push(Kente.theSounds['5-0-2']);
        Kente.sounds.push(Kente.theSounds['5-1-1-a']);
        Kente.sounds.push(Kente.theSounds['5-1-1-b']);
        Kente.sounds.push(Kente.theSounds['5-1-2']);
        Kente.sounds.push(Kente.theSounds['5-1-3']);
        Kente.sounds.push(Kente.theSounds['5-1-4']);
        Kente.sounds.push(Kente.theSounds['5-2']);
        Kente.sounds.push(Kente.theSounds['5-3']);
        Kente.sounds.push(Kente.theSounds['5-4']);
        Kente.sounds.push(Kente.theSounds['5-5']);
        Kente.sounds.push(Kente.theSounds['6-0-1']);
        Kente.sounds.push(Kente.theSounds['6-0-2']);
        Kente.sounds.push(Kente.theSounds['6-0-3']);
        Kente.sounds.push(Kente.theSounds['6-0-4']);
        Kente.sounds.push(Kente.theSounds['7-0-1']);
        Kente.sounds.push(Kente.theSounds['7-0-2']);
        Kente.sounds.push(Kente.theSounds['7-1']);
        Kente.sounds.push(Kente.theSounds['7-2']);
        Kente.sounds.push(Kente.theSounds['7-4']);
        // Kente.sounds.push(Kente.theSounds['7-5']);
        // Kente.sounds.push(Kente.theSounds['7-6']);
        // Kente.sounds.push(Kente.theSounds['7-7']);
        // Kente.sounds.push(Kente.theSounds['8-0-1']);
        // Kente.sounds.push(Kente.theSounds['8-0-2']);
        // Kente.sounds.push(Kente.theSounds['8-1']);
        // Kente.sounds.push(Kente.theSounds['8-2']);
        // Kente.sounds.push(Kente.theSounds['8-3']);
        // Kente.sounds.push(Kente.theSounds['8-5']);
        // Kente.sounds.push(Kente.theSounds['9-0-1']);
        // Kente.sounds.push(Kente.theSounds['9-0-2']);
        // Kente.sounds.push(Kente.theSounds['9-0-3']);
        // Kente.sounds.push(Kente.theSounds['10']);
        // Kente.sounds.push(Kente.theSounds['11-0-1']);

        

        this.game.sound.setDecodedCallback(Kente.sounds, this.loadMainMenuState, this);
    }, 
    loadMainMenuState : function(){
        this.state.start('SlideShow',true,false);
    }

};