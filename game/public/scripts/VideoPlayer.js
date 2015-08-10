// VIDEO PLAYER

Kente.VideoPlayer = function(game){
	this.currentPlayingInstruction = null;
	this.timer_resetGame = null;
	this.timer_AreYouThere = null;
};

Kente.VideoPlayer.prototype = {
	preload: function(){
		// game.load.video('kentevideo', 'assets/kente_video.mp4');
		this.currentPlayingInstruction = null;
	},
	create: function(){
		//CANISTERS
	    this.keyQ = this.game.input.keyboard.addKey(Phaser.Keyboard.Q);
	    this.keyQ.onDown.add(function(){
	    	this.canisterTouched({color:'red'});
	    }, this);
	    this.keyW = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
	    this.keyW.onDown.add(function(){
	    	this.canisterTouched({color:'blue'});
	    }, this);
	    this.keyE = this.game.input.keyboard.addKey(Phaser.Keyboard.E);
	    this.keyE.onDown.add(function(){
	    	this.canisterTouched({color:'green'});
	    }, this);
	    this.keyR = this.game.input.keyboard.addKey(Phaser.Keyboard.R);
	    this.keyR.onDown.add(function(){
	    	this.canisterTouched({color:'yellow'});
	    }, this);


		this.video = this.game.add.video('kentevideo');

	    //  See the docs for the full parameters
	    //  But it goes x, y, anchor x, anchor y, scale x, scale y
	    this.video.addToWorld(this.game.world.centerX, this.game.world.centerY, 0.5, 0.5, 1, 1);

	    this.counter = 0;
	    //  true = loop
	    this.video.play(true);

	    // this.video.play(false);
	    // var self = this;
	    // this.video.onComplete.addOnce(function(){
	    // 	self.video.play(false);
	    // 	self.video.onComplete.addOnce(function(){
	    // 		console.log('>> VIDEO ENDED for Second Time');
		   //  		self.goToGame();
	    // 	});	
	    // });


	    ///AUDIO INSTRUCTIONS
	    console.log(':: Playing: As you can see, real Kente  .. 6-0-3');
		Kente.theSounds["6-0-3"].play();
		this.currentPlayingInstruction = Kente.theSounds["6-0-3"];
		Kente.theSounds["6-0-3"].onStop.addOnce(function(){
			console.log(':: Playing: Noew youre ready to make your own  .. 6-0-4');
			Kente.theSounds["6-0-4"].play();
			this.currentPlayingInstruction = Kente.theSounds["6-0-4"];
			Kente.theSounds["6-0-4"].onStop.addOnce(function(){
					this.resetGameResetTimer();
			},this);
		},this);

		this.resetGameResetTimer();
	},
	update: function(){

	},
	goToGame: function(){
		this.stopCurrentAudio();
		// this.game.time.events.removeAll();
		this.game.state.start('Game', true, false);
	},
	canisterTouched: function(data){
		this.video.stop();
		// this.video.destroy();
		this.goToGame();
	},
	stopCurrentAudio: function(){
		//console.log(this.currentPlayingInstruction);
		if(this.currentPlayingInstruction != undefined && this.currentPlayingInstruction != null && this.currentPlayingInstruction.isPlaying){
			console.log(">> Stopping sound before it finished");
			this.currentPlayingInstruction.onStop.removeAll();
			this.currentPlayingInstruction.stop();
		}
	},
	resetGameResetTimer : function(){
			if(this.timer_resetGame){
				this.game.time.events.remove(this.timer_resetGame);
			}
			//Reset are you there timer
			this.resetAreYouThere();
			// 1 minutes timer
			this.timer_resetGame = this.game.time.events.add(60000, this.resetGame, this);
			console.log(':: Global Timer reseted');
	},
	resetAreYouThere: function(){
		this.game.time.events.remove(this.timer_AreYouThere);
		this.timer_AreYouThere = this.game.time.events.add(20000, this.playInstructionAudio, this,1); // case 1
		console.log(':: Are You There Timer reseted');
	},
	resetGame: function(){
		Kente.sounds.forEach(function(sound) { //Clean functions added to the onStop Phaser.signal
		    sound.onStop.removeAll();
		});
		this.video.stop();
		// this.video.destroy();
		this.game.state.start('SlideShow', true,false);
	},
	playInstructionAudio: function(id){
		switch (id){
			case 1:{
				console.log(':: Playing are you there');
				

				Kente.theSounds['6-0-4'].play(); //are you there
				this.currentPlayingInstruction = Kente.theSounds["6-0-4"];
				Kente.sounds[id].onStop.add(function(){
					// this.timer_AreYouThere = this.game.time.events.add(10000, this.resetGame, this);
				},this);
				break;
			}
		}
	}
}