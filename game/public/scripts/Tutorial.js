/*
	THE FIRST PART OF TH TUTORIAL 


*/
Kente.Tutorial = function(game){
	this.upperContainer;
	this.lowerContainer;
	this.subtitles;
	this.currentInstruction;
	this.shuttleSprite;
	this.warp;
};

Kente.Tutorial.prototype = {
	preload: function(){
		this.warpSprite = null;
		this.timer_AreYouThere = null;
		this.timer_resetGame = null;
		this.tutorial_step = 1;
	},
	create: function(){
		console.log('::Tutorial Loaded');
		Kente.removeAllSocketListeners();

		var self = this;
		Kente.socket.on('threadTouch', function(data){
			self.threadTouched(data);
		});
		Kente.socket.on('shuttleTouch', function(data){
			self.shuttleTouched(data);
		});
		//Send Screenshot
		var keyScreenshot = this.game.input.keyboard.addKey(Phaser.Keyboard.S);
    	keyScreenshot.onDown.add(function(){Kente.postImage(this.game)}, this);

		// KeyBoard
		// this.key1 = this.game.input.keyboard.addKey(Phaser.Keyboard.ONE);
	 //    this.key1.onDown.add(this.threadTouched, this);

	    this.keyZ = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
	    this.keyZ.onDown.add(this.shuttleTouched, this);

	    this.keyQ = this.game.input.keyboard.addKey(Phaser.Keyboard.Q);
	    this.keyQ.onDown.add(this.canisterTouched, this);
	    this.keyW = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
	    this.keyW.onDown.add(this.canisterTouched, this);

	    // this.keyU = this.game.input.keyboard.addKey(Phaser.Keyboard.U);
	    // this.keyU.thread = 2;
	    // this.keyU.onDown.add(this.glowThread, this);
	    // this.keyU.onUp.add(this.glowThread, this);

		//Add the Background
		this.add.sprite(0,0,'background');
		//CONTAINER SETUP
		this.upperContainer = this.add.group();
		this.lowerContainer = this.add.group();
		
		//UPPER CONTAINER
		this.upperContainer.height = this.game.world.height/2;
		this.upperContainer.width = this.game.world.width;

		//Upper container bg
		this.upperContainer.create(0,0,'kente_bg');
		this.upperContainer.create(0,905,'wooden_divider');

		// TEXT
	   	// var style = { font: "30px Arial", fill: "#ffffff", align: "center" };
	    // this.subtitles = this.game.make.text(this.game.world.centerX, this.game.world.centerY/2, "Welcome to the interactive weaving exhibit.\n Today you're going to experience a traditional weaving practice.\nThe principles of loom weaving are nearly universal to all cultures of the world.\nWhen you are ready to weave, touch the device to your right on the table.", style);
	    // this.subtitles.anchor.set(0.5);
	    // this.upperContainer.addChild(this.subtitles);

	    // TEXT TIME
	   	var style = { font: "20px Arial", fill: "#fffeee", align: "center" };
	    this.timeText = this.game.make.text(0, 0, "", style);
	    this.upperContainer.addChild(this.timeText);

	    //Shuttle Image
	    this.shuttleSprite = this.game.make.sprite(this.game.world.centerX,this.game.world.centerY/2+200,'shuttle_vector');
	    this.shuttleSprite.anchor.set(0.5);
	    this.upperContainer.addChild(this.shuttleSprite);

	    //Subtitles
	    this.showInstruction("Welcome to the interactive weaving exhibit.\n Today you're going to experience a traditional weaving practice.\nThe principles of loom weaving are nearly universal to all cultures of the world.\nWhen you are ready to weave, touch the device to your right on the table.");

		//LOWER Container
		// this.lowerContainer.y = this.game.world.centerY;
		// this.warpSprite = this.make.sprite(0,0,'warp_placeholder');
		// this.lowerContainer.addChild(this.warpSprite);
		this.warp = new WarpGroup(this.game);
		this.lowerContainer.addChild(this.warp);
		this.warp.x = 100;


		
		//Start the Global timer
		this.resetGameResetTimer();

		

		//Play Instruction #1
		Kente.theSounds['1-start'].play(); 
		Kente.theSounds['1-start'].onStop.add(function(){ //Welcome to the interactive...
			// this.timer_AreYouThere = this.game.time.events.add(10000, this.playInstructionAudio(3), this);
			this.resetAreYouThere();
		}, this);
	},
	update: function(){
		if(this.timer_resetGame != undefined)
			this.timeText.text = this.timer_resetGame.tick;
	},
	canisterTouched: function(data){
		//Reset Global timer
		this.resetGameResetTimer();

	},
	threadTouched: function(data){
		//console.log(data);
		// this.game.state.start('MainMenu', true, false);
		// console.log(this.slides);
		//Reset Global timer
		this.resetGameResetTimer();
	},
	glowThread: function(key){
		if(key.isDown)
			this.warp.glowThread(key.thread, true);
		if(key.isUp)
			this.warp.glowThread(key.thread, false);
	},
	shuttleTouched: function(data){
		// console.log(data);
		
		//Reset global timer
		this.resetGameResetTimer();
		
		if(this.tutorial_step == 1 && !Kente.theSounds['1-start'].isPlaying){ //Finished - Welcome to the interactive.. 
			// this.stopAreYouThere();
			this.playInstructionAudio(2); //Play - These vertical threads here are called...
			this.tutorial_step = 2;
		}
		if(this.tutorial_step == 2 && !Kente.theSounds["2-0-1"].isPlaying){ //Finished - These vertical threads here ...
			// this.stopAreYouThere();
			//Weft moves down
			console.log(":: Shuttle animating Right to Left");
			this.tutorial_step = 3;
			
		}
		
		if(Kente.theSounds["1-1"].isPlaying){ //Are you there ?
			Kente.theSounds["1-1"].onStop.removeAll();
			Kente.theSounds["1-1"].stop();
		};
		console.log('::Current Tutorial Step:'+ this.tutorial_step); 

		var colors = [];
		colors[1] = '0xFFFF00'; //yellow
		colors[0] = '0x47D147'; //green
		console.log('pre shut');
		this.warp.sendShuttles(null,colors);	 	
	},
	resetGameResetTimer : function(){
			if(this.timer_resetGame){
				// this.timer_resetGame.destroy();
				// this.timer_resetGame.removeAll();
				this.game.time.events.remove(this.timer_resetGame);
			}
			//One minute Timer
			// this.timer_resetGame = this.game.time.create(false);
			// this.timer_resetGame.add(60000, this.resetGame, this);
			// this.timer_resetGame.start();
			this.timer_resetGame = this.game.time.events.add(240000, this.resetGame, this);
			console.log(':: Global Timer reseted');
	},
	resetGame: function(){
		Kente.sounds.forEach(function(sound) { //Clean functions added to the onStop Phaser.signal
		    sound.onStop.removeAll();
		});
		this.game.state.start('MainMenu', true,false);
	},
	resetAreYouThere: function(){
		this.game.time.events.remove(this.timer_AreYouThere);
		this.timer_AreYouThere = this.game.time.events.add(20000, this.playInstructionAudio, this,1);
		console.log(':: Are You There Timer reseted');
	},
	showWarp: function(){
		// console.log(':: Playing Instr 3');
		// Kente.sounds[2].play();
		// this.game.add.existing(this.warpSprite);
		// this.warpSprite.alpha = 0;
		// this.add.tween(this.warpSprite).to( { alpha: 1 }, 3000, Phaser.Easing.Sinusoidal.Out, true, 0);

		// Kente.sounds[2].onStop.add(function(){
		// 	this.timer_AreYouThere = this.game.time.events.loop(15000, this.playReadyToStart, this);
		// },this);
	},
	playInstructionAudio: function(id){
		switch (id){
			case 1:{
				console.log(':: Playing are you there');
				Kente.theSounds['1-1'].play(); //are you there
				// Kente.sounds[id].onStop.add(function(){
				// 	// this.timer_AreYouThere = this.game.time.events.add(10000, this.resetGame, this);
				// },this);
				break;
			}
			case 2:{
				this.game.time.events.remove(this.timer_AreYouThere);
				console.log(':: Playing These Vertical Threads');
				Kente.theSounds["2-0-1"].play(); //these vertical threads
				Kente.theSounds["2-0-1"].onStop.add(function(){
					this.resetAreYouThere();
				},this);
				break;
			}
		}
	},
	showInstruction: function(text) {
		if(this.currentInstruction) this.currentInstruction.destroy();
		var intrBox = new InstructionsGroup(this.game, text,
	    					25);
		intrBox.present();
		this.currentInstruction = intrBox;
	}


};
