/*
	In this state, the user is presented with a introduction sound..when sounds finishes 
	It Starts a timer and If the user doesnt do anything for 15 seconds, it plays a sound asking if you are there in a loop of 15 seconds each 
	If the user makes an action, it plays another sound and the timer for the previous notice gets reInstantiated with a nother timer that plays a different notice ("Are you ready to start?")
	If the user makes the last action... the timer stop(true), destroy() and removeAll(). 
	If the user doesnt make anything for 1 minute (this is a different timer), the notice timer gets stop(true), destroy() and removeAll(). 
	and it goes to MainMenu state.
	When the user gets back to the Tutorial screen, everything starts again but the timers
	start behaving super weird. If you wait for the first notice to do something and you press a Key while sound is playing..
	it doesnt recognize the sound is playing (it should stop the sound).. and then you get overlapping sounds.

	Looks like timers never completely die. They keep playing the NOTICE sounds again and again.
	stop(true), destroy() and removeAll(). Make nothing to the timer.


*/
Kente.Tutorial = function(game){
	
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
		// KeyBoard
		this.key1 = this.game.input.keyboard.addKey(Phaser.Keyboard.ONE);
	    this.key1.onDown.add(this.threadTouched, this);

	    this.key2 = this.game.input.keyboard.addKey(Phaser.Keyboard.TWO);
	    this.key2.onDown.add(this.shuttleTouched, this);

	    this.key9 = this.game.input.keyboard.addKey(Phaser.Keyboard.NINE);
	    this.key9.onDown.add(this.canisterTouched, this);
	    this.key0 = this.game.input.keyboard.addKey(Phaser.Keyboard.ZERO);
	    this.key0.onDown.add(this.canisterTouched, this);


		//Add the Background
		this.add.sprite(0,0,'background');

		this.warpSprite = this.make.sprite(0,0,'bg_Tutorial');

		//Start the Global timer
		this.resetGameResetTimer();
		//Play Instruction #2
		Kente.sounds[1].play(); 
		Kente.sounds[1].onStop.add(function(){ //First lets learn
			// this.timer_AreYouThere = this.game.time.create(false);
			// this.timer_AreYouThere.loop(15000, this.playAreYourThere, this);
			// this.timer_AreYouThere.start();
			this.timer_AreYouThere = this.game.time.events.loop(15000, this.playAreYourThere, this);
		}, this);
	},
	update: function(){
		
	},
	canisterTouched: function(data){
		//Reset Global timer
		this.resetGameResetTimer();
		
	},
	threadTouched: function(data){
		console.log(data);
		// this.game.state.start('MainMenu', true, false);
		// console.log(this.slides);
		//Reset Global timer
		this.resetGameResetTimer();
	},
	shuttleTouched: function(data){
		console.log(data);
		// this.game.state.start('MainMenu', true, false);
		// console.log(this.slides);
		//Reset global timer
		this.resetGameResetTimer();

		if(this.tutorial_step == 1 && !Kente.sounds[1].isPlaying){
			this.stopAreYouThere();
			this.showWarp();
			this.tutorial_step = 2;
		}
		if(this.tutorial_step == 2 && !Kente.sounds[2].isPlaying){ //Move Weft
			this.stopAreYouThere();
			//Weft moves down
			console.log(":: Weft animating Right to Left");
			this.tutorial_step = 3;
			
		}
		
		//console.log(Kente.sounds[3].isPlaying); //When this sound is playing this print is FALSE ! why??
		if(Kente.sounds[3].isPlaying){ //Are you there ?
			Kente.sounds[3].stop();
		};
		if(Kente.sounds[4].isPlaying){ //Ready to start? 
			Kente.sounds[4].stop();
		};
		console.log('::Current Tutorial Step:'+ this.tutorial_step); 	 	
	},
	resetGameResetTimer : function(){
			// if(this.timer_resetGame){
				// this.timer_resetGame.destroy();
				// this.timer_resetGame.removeAll();
				this.game.time.events.remove(this.timer_resetGame);
			// }
			//One minute Timer
			// this.timer_resetGame = this.game.time.create(false);
			// this.timer_resetGame.add(60000, this.resetGame, this);
			// this.timer_resetGame.start();
			this.timer_resetGame = this.game.time.events.loop(60000, this.resetGame, this);
			console.log(':: Global Timer reseted');
	},
	resetGame: function(){
		this.stopAreYouThere();
		Kente.sounds.forEach(function(sound) { //Clean functions added to the onStop Phaser.signal
		    sound.onStop.removeAll();
		});
		this.game.state.start('MainMenu', true,false);
	}, 
	showWarp: function(){
		console.log(':: Playing Instr 3');
		Kente.sounds[2].play();
		this.game.add.existing(this.warpSprite);
		this.warpSprite.alpha = 0;
		this.add.tween(this.warpSprite).to( { alpha: 1 }, 3000, Phaser.Easing.Sinusoidal.Out, true, 0);

		Kente.sounds[2].onStop.add(function(){
			// this.timer_AreYouThere = this.game.time.create(false);
			// this.timer_AreYouThere.loop(15000, this.playReadyToStart, this);
			// this.timer_AreYouThere.start();
			this.timer_AreYouThere = this.game.time.events.loop(15000, this.playReadyToStart, this);
		},this);
	},
	playAreYourThere: function(){
		console.log(':: Playing are you there');
		Kente.sounds[3].play(); //are you there
	},
	playReadyToStart: function(){
		console.log(':: Playing Ready to start?');
		Kente.sounds[4].play(); //Are you ready to start...
	},
	stopAreYouThere: function(){
		this.game.time.events.remove(this.timer_AreYouThere);
		// this.timer_AreYouThere.stop(true);
		// this.timer_AreYouThere.destroy();
		// this.timer_AreYouThere.removeAll();
	}

};
