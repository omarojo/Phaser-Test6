Kente = {
	socket : io(),
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
    },
    setFPSbalance: function(){

        // modify the game desired fps to match the current suggested fps
        if(this.game.time.suggestedFps != null){
            if(this.game.time.suggestedFps >=40)
                this.game.time.desiredFps = this.game.time.suggestedFps;
            else
                this.game.time.desiredFps = 40;
        }
        console.log(this.game.time.suggestedFps);
    
    }

};

Kente.Boot = function (game) {
};

Kente.Boot.prototype = {

    preload: function () {

        this.game.time.advancedTiming = true;
        this.game.fpsProblemNotifier.add(Kente.setFPSbalance, this);
    
       

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
        this.load.image('pttrn_bg', 'assets/pattern_select_background.png');
        this.load.image('pttrn_fore', 'assets/pattern_select_foreground.png');
        this.load.image('beater', 'assets/beater.png');
        this.load.image('weft_sample_vertical', 'assets/weft_sample_vertical.png');
        this.load.image('weft_sample_horizontal', 'assets/weft_sample_horizontal.png');
        this.load.image('six_patterns', 'assets/six_patterns.png');
        this.load.image('colour_canists', 'assets/colour_canists.png');
        this.load.image('title_game', 'assets/title_game.png');
        this.load.image('title_tutorial', 'assets/title_tutorial.png');
        this.load.image('title_slideshow', 'assets/title_slideshow.png');
        this.load.image('title_thank', 'assets/title_thank.png');
        this.load.image('tiny_wood_piece', 'assets/tiny_wood_piece.png');


        this.load.video('kentevideo', 'assets/kente_video.mp4');

        //Load all Sounds

        this.load.audio('1-0-1','assets/audio/1-0-1.mp3');
        this.load.audio('1-0-2','assets/audio/1-0-2.mp3');
        this.load.audio('1-0-3','assets/audio/1-0-3.mp3');
        this.load.audio('1-1','assets/audio/1-1.mp3');
        this.load.audio('2-0','assets/audio/2-0.mp3');
        this.load.audio('3-0-1','assets/audio/3-0-1.mp3');
        this.load.audio('3-0-2','assets/audio/3-0-2.mp3');
        this.load.audio('3-0-3','assets/audio/3-0-3.mp3');
        this.load.audio('4-0','assets/audio/4-0.mp3');
        this.load.audio('5-0-1','assets/audio/5-0-1.mp3');
        this.load.audio('5-0-2','assets/audio/5-0-2.mp3');
        this.load.audio('5-1-1-1','assets/audio/5-1-1-1.mp3');
        this.load.audio('5-1-1-2','assets/audio/5-1-1-2.mp3');
        this.load.audio('5-1-2','assets/audio/5-1-2.mp3');
        this.load.audio('5-1-3','assets/audio/5-1-3.mp3');
        this.load.audio('5-1-4','assets/audio/5-1-4.mp3');
        this.load.audio('5-2','assets/audio/5-2.mp3');
        this.load.audio('5-3','assets/audio/5-3.mp3');
        this.load.audio('5-4','assets/audio/5-4.mp3');
        this.load.audio('5-5','assets/audio/5-5.mp3');
        this.load.audio('6-0-1','assets/audio/6-0-1.mp3');
        this.load.audio('6-0-2','assets/audio/6-0-2.mp3');
        this.load.audio('6-0-3','assets/audio/6-0-3.mp3');
        this.load.audio('6-0-4','assets/audio/6-0-4.mp3');
        this.load.audio('7-0-1','assets/audio/7-0-1.mp3');
        this.load.audio('7-0-2','assets/audio/7-0-2.mp3');
        this.load.audio('7-0-3','assets/audio/7-0-3.mp3');
        this.load.audio('7-0-4','assets/audio/7-0-4.mp3');
        this.load.audio('7-1','assets/audio/7-1.mp3');
        this.load.audio('7-2','assets/audio/7-2.mp3');
        this.load.audio('7-3','assets/audio/7-3.mp3');
        this.load.audio('7-4','assets/audio/7-4.mp3');
        this.load.audio('8-0-1','assets/audio/8-0-1.mp3');
        this.load.audio('8-0-2','assets/audio/8-0-2.mp3');
        this.load.audio('8-1','assets/audio/8-1.mp3');
        this.load.audio('8-2','assets/audio/8-2.mp3');
        this.load.audio('8-3','assets/audio/8-3.mp3');
        this.load.audio('8-4','assets/audio/8-4.mp3');
        this.load.audio('8-5','assets/audio/8-5.mp3');
        this.load.audio('8-6','assets/audio/8-6.mp3');
        this.load.audio('9-0-1','assets/audio/9-0-1.mp3');
        this.load.audio('9-0-2','assets/audio/9-0-2.mp3');
        this.load.audio('9-0-3','assets/audio/9-0-3.mp3');
        this.load.audio('10-0','assets/audio/10-0.mp3');
        this.load.audio('11-0-1','assets/audio/11-0-1.mp3');
        this.load.audio('11-0-2','assets/audio/11-0-2.mp3');
        this.load.audio('12-optional','assets/audio/12-optional.mp3');
        this.load.audio('skip-tut','assets/audio/skip-tut.mp3');

    },
    create: function () {
        Kente.theSounds = {
        
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
            '5-1-1-1': this.game.add.audio('5-1-1-1'),
            '5-1-1-2': this.game.add.audio('5-1-1-2'),
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
            '7-0-3': this.game.add.audio('7-0-3'),
            '7-0-4': this.game.add.audio('7-0-4'),
            '7-1': this.game.add.audio('7-1'),
            '7-2': this.game.add.audio('7-2'),
            '7-3': this.game.add.audio('7-3'),
            '7-4': this.game.add.audio('7-4'),
            '8-0-1': this.game.add.audio('8-0-1'),
            '8-0-2': this.game.add.audio('8-0-2'),
            '8-1': this.game.add.audio('8-1'),
            '8-2': this.game.add.audio('8-2'),
            '8-3': this.game.add.audio('8-3'),
            '8-4': this.game.add.audio('8-4'),
            '8-5': this.game.add.audio('8-5'),
            '8-6': this.game.add.audio('8-6'),
            '9-0-1': this.game.add.audio('9-0-1'),
            '9-0-2': this.game.add.audio('9-0-2'),
            '9-0-3': this.game.add.audio('9-0-3'),
            '10-0': this.game.add.audio('10-0'),
            '11-0-1': this.game.add.audio('11-0-1'),
            '11-0-2': this.game.add.audio('11-0-2'),
            '12-optional': this.game.add.audio('12-optional'),
            'skip-tut': this.game.add.audio('skip-tut')

         };

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
        Kente.sounds.push(Kente.theSounds['5-1-1-1']);
        Kente.sounds.push(Kente.theSounds['5-1-1-2']);
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
        Kente.sounds.push(Kente.theSounds['7-0-3']);
        Kente.sounds.push(Kente.theSounds['7-0-4']);
        Kente.sounds.push(Kente.theSounds['7-1']);
        Kente.sounds.push(Kente.theSounds['7-2']);
        Kente.sounds.push(Kente.theSounds['7-3']);
        Kente.sounds.push(Kente.theSounds['7-4']);
        Kente.sounds.push(Kente.theSounds['8-0-1']);
        Kente.sounds.push(Kente.theSounds['8-0-2']);
        Kente.sounds.push(Kente.theSounds['8-1']);
        Kente.sounds.push(Kente.theSounds['8-2']);
        Kente.sounds.push(Kente.theSounds['8-3']);
        Kente.sounds.push(Kente.theSounds['8-4']);
        Kente.sounds.push(Kente.theSounds['8-5']);
        Kente.sounds.push(Kente.theSounds['8-6']);
        Kente.sounds.push(Kente.theSounds['9-0-1']);
        Kente.sounds.push(Kente.theSounds['9-0-2']);
        Kente.sounds.push(Kente.theSounds['9-0-3']);
        Kente.sounds.push(Kente.theSounds['10-0']);
        Kente.sounds.push(Kente.theSounds['11-0-1']);
        Kente.sounds.push(Kente.theSounds['11-0-2']);
        Kente.sounds.push(Kente.theSounds['12-optional']);
        Kente.sounds.push(Kente.theSounds['skip-tut']);


        this.game.sound.setDecodedCallback(Kente.sounds, this.loadMainMenuState, this);

         $("canvas").css("cursor", "none");
    }, 
    loadMainMenuState : function(){
        this.state.start('SlideShow',true,false);
    }

};