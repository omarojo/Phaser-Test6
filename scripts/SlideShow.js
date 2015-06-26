Kente.SlideShow = function (game) {
	var self = this;
	this.slides = []; //Array of slides
	this.photos; //Group container, has all the slide objects for rendering

	
};

Kente.SlideShow.prototype = {
	preload: function(){
		this.load.image('slide1', 'assets/slide1.jpg');
		this.load.image('slide2', 'assets/slide2.jpg');
		this.load.image('slide3', 'assets/slide3.jpg');
		this.load.image('slide4', 'assets/slide4.jpg');
		this.load.image('slide5', 'assets/slide5.jpg');
		this.load.image('slide6', 'assets/slide6.jpg');
	},
	create: function () {
		console.log('::SlideShow Loaded');
		// Kente.socket.removeAllListeners('threadTouch'); //Remove all previous listeners
		Kente.removeAllSocketListeners();
		var self = this;
		Kente.socket.on('threadTouch', function(data){
			self.threadTouched(data);
		});
		
		this.key2 = this.game.input.keyboard.addKey(Phaser.Keyboard.ONE);
	    this.key2.onDown.add(this.threadTouched, this);

		//this.add.sprite(0,0,'background');
		// this.add.existing(Kente.background);
		//Kente.background.events.onInputDown.removeAll(); //removes all events (the click event)

	    this.photos = this.add.group();
	    
	    for(var i=0;i<6;i++){
	    	var slide = this.make.sprite(this.game.world.centerX,this.game.world.centerY,'slide'+(i+1));
	    	slide.anchor.x = 0.5; slide.anchor.y = 0.5;
	    	this.photos.addChild(slide);
	    	slide.width = this.game.world._width+300;
	    	slide.height = this.game.world._height+300;
	    	slide.twAlpha = this.add.tween(slide).to( { alpha: 0 }, 3000, "Linear",undefined,3000);
	    	var x = Phaser.Utils.randomChoice(100, -100);
	    	var y = Phaser.Utils.randomChoice(100, -100);
	    	slide.twPos = this.add.tween(slide).to( { x: slide.x+x, y:slide.y+y }, 8000, Phaser.Easing.Sinusoidal.Out, true, 0,-1, true);
	    	slide.twAlpha.onComplete.add(this.reStack, this);
	    	
	    	this.slides[i] = slide;
	    };

	    this.slides[5].twAlpha.start();
	    this.slides[5].twPos.start();
	    // console.log(this.slides);
		
		// var style = { font: "65px Arial", fill: "#ff0044", align: "center" };
	 //    var text = this.game.add.text(this.game.world.centerX, this.game.world.centerY, "Pull a String \nto begin", style);
	 //    text.anchor.set(0.5);

	 	// Button to crop and scale
	    // var button = new Phaser.Sprite(this.game,1000,1400,'btn');
	    // this.add.existing(button);
	    // button.inputEnabled = true;
	    // button.events.onInputDown.add(this.crop,this);

	    // Instructional Timer 1 
	    Kente.sounds[0].active = false;
	},
	update: function(){
		//Replay Instruction #1 every 5 seconds
		if(!Kente.sounds[0].isPlaying && Kente.sounds[0].active == false){
			Kente.sounds[0].active = true;
			console.log(':: Will Play Instruction 1 in 5 secs');
			this.game.time.events.add(5000,function (){
					this.playInstructionAudio(0);
			}, this);
		}
	},
	threadTouched: function(data){
		console.log(data);
		Kente.sounds[0].stop();
		this.game.state.start('Tutorial', true, false);
		// console.log(this.slides);
	},
	crop:function(){
		var copyText = this.photos.generateTexture(1,this.game.renderer);
	    var copy = new Phaser.Sprite(this.game,0,0,copyText);
	    var graph = new Phaser.Rectangle(0,0, 1200,1920);
	    copy.cropRect = graph;
	    copy.updateCrop();
	    copy.scale.setTo (0.5,0.5);
	    
	    // copy.inputEnabled = true;
		// copy.events.onInputDown.add(this.crop, this);

	    this.add.existing(copy);
	},
	reStack: function(){
		this.photos.sendToBack(this.photos.getTop());
		this.photos.getBottom().alpha = 1;
		this.photos.getTop().twAlpha.start();
	},
	playInstructionAudio: function(id){
		switch (id){
			case 0:{
				Kente.sounds[0].play();
				Kente.sounds[0].active = false;
				break;
			}
		}

	}
};
