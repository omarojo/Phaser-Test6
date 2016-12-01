/*
	THE FIRST PART OF TH TUTORIAL 


*/
Kente.Tutorial = function(game){
	this.upperContainer;
	this.lowerContainer;
	this.subtitles;
	this.currentInstruction;
	this.shuttleSprite;
	this.beaterSprite;
	this.warp;
};

Kente.Tutorial.prototype = {
	preload: function(){
		this.warpSprite = null;
		this.timer_AreYouThere = null;
		this.timer_resetGame = null;
		this.tutorial_step = 1;
		this.currentPlayingInstruction = null;
		this.beaterPosition = 'up'; 
	},
	create: function(){
		console.log('::Tutorial Loaded');
		Kente.removeAllSocketListeners();

		var self = this;
		Kente.socket.on('threadTouch', function(data){
			self.threadTouched(data);
		});
		Kente.socket.on('beaterClick', function(data){
			self.beaterMoved(data);
		});
		// Kente.socket.on('shuttleTouch', function(data){
		// 	self.shuttleTouched(data);
		// });
		//Send Screenshot
		var keyScreenshot = this.game.input.keyboard.addKey(Phaser.Keyboard.S);
    	keyScreenshot.onDown.add(function(){Kente.postImage(this.game)}, this);

		// KeyBoard
		// this.key1 = this.game.input.keyboard.addKey(Phaser.Keyboard.ONE);
	 //    this.key1.onDown.add(this.threadTouched, this);

	    this.keyZ = this.game.input.keyboard.addKey(Phaser.Keyboard.Z);
	    this.keyZ.onDown.add(this.shuttleTouched, this);
	    this.keyB = this.game.input.keyboard.addKey(Phaser.Keyboard.B);
	    this.keyB.onDown.add(function(){
	    	this.beaterMoved({state:'down'});
	    }, this);
	    this.keyU = this.game.input.keyboard.addKey(Phaser.Keyboard.U);
	    this.keyU.onDown.add(function(){
	    	this.beaterMoved({state:'up'});
	    }, this);

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
		//this.add.sprite(0,0,'bg_dottedguides');
		//CONTAINER SETUP
		this.upperContainer = this.add.group();
		this.lowerContainer = this.add.group();
		
		//UPPER CONTAINER
		this.upperContainer.height = this.game.world.height/2;
		this.upperContainer.width = this.game.world.width;

		//Upper container bg
		this.upperContainer.create(0,0,'kente_bg');
		this.upperContainer.create(0,905,'wooden_divider');
		this.upperContainer.create(0,0,'title_tutorial');

		// TEXT
	   	// var style = { font: "30px Arial", fill: "#ffffff", align: "center" };
	    // this.subtitles = this.game.make.text(this.game.world.centerX, this.game.world.centerY/2, "Welcome to the interactive weaving exhibit.\n Today you're going to experience a traditional weaving practice.\nThe principles of loom weaving are nearly universal to all cultures of the world.\nWhen you are ready to weave, touch the device to your right on the table.", style);
	    // this.subtitles.anchor.set(0.5);
	    // this.upperContainer.addChild(this.subtitles);

	    // TEXT TIME
	   	// var style = { font: "20px Arial", fill: "#fffeee", align: "center" };
	    // this.timeText = this.game.make.text(0, 0, "", style);
	    // this.upperContainer.addChild(this.timeText);

	    //Shuttle Image
	    // this.shuttleSprite = this.game.make.sprite(this.game.world.centerX,this.game.world.centerY/2,'shuttle_vector');
	    // this.shuttleSprite.anchor.set(0.5);
	    // this.shuttleSprite.alpha = 0.0;
	    // this.upperContainer.addChild(this.shuttleSprite);
	    this.shuttleSprite = this.game.make.sprite(this.game.world.centerX,this.game.world.centerY/2,'shuttle_spriteAnim');
	    this.shuttleSprite.animations.add('touching');
	    this.shuttleSprite.animations.play('touching', 1, true); //1 fps instead of 30fps and repeat
	    this.shuttleSprite.anchor.set(0.5);
	    this.shuttleSprite.alpha = 0.0;
	    this.upperContainer.addChild(this.shuttleSprite);

	    //Beater Image
	    // this.beaterSprite = this.game.make.sprite(this.game.world.centerX,this.game.world.centerY/2,'beater');
	    // this.beaterSprite.anchor.set(0.5);
	    // this.beaterSprite.alpha = 0.0;
	    // this.upperContainer.addChild(this.beaterSprite);
	    this.beaterSprite = this.game.make.sprite(this.game.world.centerX,this.game.world.centerY/2,'beater_spriteAnim');
	    this.beaterSprite.animations.add('touching');
	    this.beaterSprite.animations.play('touching', 2, true); //made this run 2fps cause it's 3 frames total
	    this.beaterSprite.anchor.set(0.5);
	    this.beaterSprite.alpha = 0.0;
	    this.upperContainer.addChild(this.beaterSprite);

	    //Weft Sample Group
	    this.weftSampleGroup = this.add.group();

	    this.weftHSprite = this.game.make.sprite(this.game.world.centerX,this.game.world.centerY/2,'weft_sample_horizontal');
	    this.weftHSprite.anchor.set(0.5);
	    this.weftHSprite.alpha = 0.0;
	    this.weftSampleGroup.addChild(this.weftHSprite);

	    this.weftVSprite = this.game.make.sprite(this.game.world.centerX,this.game.world.centerY/2,'weft_sample_vertical');
	    this.weftVSprite.anchor.set(0.5);
	    this.weftVSprite.alpha = 0.0;
	    this.weftSampleGroup.addChild(this.weftVSprite);
	    

	    this.upperContainer.addChild(this.weftSampleGroup);

	    //Beater Image
	    // this.beaterSprite = this.game.make.sprite(this.game.world.centerX,this.game.world.centerY/2,'beater');
	    // this.beaterSprite.anchor.set(0.5);
	    // this.beaterSprite.alpha = 0.0;
	    // this.upperContainer.addChild(this.beaterSprite);

	    //Subtitles
	    // this.showInstruction("Welcome to the virtual weaving loom where you can design your own patterned textile. Weaving is an interlocking of horizontal threads, called weft, with vertical threads called warp. Touch the shuttle to see how it works.");

		//LOWER Container
		
		this.warp = new WarpGroup(this.game, true);
		this.lowerContainer.addChild(this.warp);

		this.warp.onReadyForReplication.addOnce(function(){
			console.log('>> READY FOR REPLICATION >>>>>>>>>>>>>>');
			//Temporal callback, just for this time
			Kente.theSounds["6-0-1"].onStop.addOnce(function(){ // Great ! lets see a finished cloth.
				//Lets Replicate, should be in tutorial step 15 by now
				this.warp.replicatePattern();
			},this);
			Kente.theSounds["6-0-2"].onStop.addOnce(function(){ // As you can see, real kente
				//show video
				console.log(">> Will show video in this phase ?????");
			},this);
			
		},this);


		
		//Start the Global timer
		this.resetGameResetTimer();

		
		

		//Play Instruction #1
		console.log(':: Playing: Welcome to the virtual weaving loom .. 1-0-1');
		Kente.theSounds['1-0-1'].play();
		this.currentPlayingInstruction = Kente.theSounds["1-0-1"]; 
		Kente.theSounds['1-0-1'].onStop.addOnce(function(){ //Welcome to the interactive...
			console.log(':: Playing: If you have woven before .. skip-tut');
			Kente.theSounds['skip-tut'].play();
			this.currentPlayingInstruction = Kente.theSounds["skip-tut"];
			Kente.theSounds['skip-tut'].onStop.addOnce(function(){
				console.log(':: Playing: Lets begin with a quick tutorial .. 1-0-2');
				//Show Shuttle
				this.showShuttle();
				Kente.theSounds["1-0-2"].play();
				this.currentPlayingInstruction = Kente.theSounds["1-0-2"];
				Kente.theSounds['1-0-2'].onStop.addOnce(function(){	
					console.log(':: Playing: Touch the shuttle to see how it works .. 1-0-3');
					Kente.theSounds["1-0-3"].play();
					this.currentPlayingInstruction = Kente.theSounds["1-0-3"];
					Kente.theSounds['1-0-3'].onStop.addOnce(function(){
						this.resetAreYouThere();	
					},this);	
				}, this);
			},this); 
		}, this);
	},
	update: function(){
		// if(this.timer_resetGame != undefined)
		// 	this.timeText.text = this.timer_resetGame.tick;
	},
	canisterTouched: function(data){
		//Reset Global timer
		this.resetGameResetTimer();
	},
	showShuttle: function(){
		var sTween = this.game.add.tween(this.shuttleSprite).to( { alpha: 1 }, 900, Phaser.Easing.Quadratic.In, true, 4000);
		this.shuttleTween = sTween;
	},
	showWeftSample: function(){
		var sTween = this.game.add.tween(this.shuttleSprite).to( { alpha: 0 }, 900, Phaser.Easing.Quadratic.In, true, 100);
		var w1Tween = this.game.add.tween(this.weftHSprite).to( { alpha: 1 }, 900, Phaser.Easing.Quadratic.In, true, 1000);
		var w2Tween = this.game.add.tween(this.weftVSprite).to( { alpha: 1 }, 900, Phaser.Easing.Quadratic.In, true, 2000);
	},
	showBeaterSample: function(){
		var w1Tween = this.game.add.tween(this.weftHSprite).to( { alpha: 0 }, 900, Phaser.Easing.Quadratic.In, true, 100);
		var w2Tween = this.game.add.tween(this.weftVSprite).to( { alpha: 0 }, 900, Phaser.Easing.Quadratic.In, true, 100);
		var bTween = this.game.add.tween(this.beaterSprite).to( { alpha: 1 }, 900, Phaser.Easing.Quadratic.In, true, 1000);
	},
	hideAllInstruments: function(){
		var sTween = this.game.add.tween(this.shuttleSprite).to( { alpha: 0 }, 900, Phaser.Easing.Quadratic.In, true, 100);
		var w1Tween = this.game.add.tween(this.weftHSprite).to( { alpha: 0 }, 900, Phaser.Easing.Quadratic.In, true, 100);
		var w2Tween = this.game.add.tween(this.weftVSprite).to( { alpha: 0 }, 900, Phaser.Easing.Quadratic.In, true, 100);
		var bTween = this.game.add.tween(this.beaterSprite).to( { alpha: 0 }, 900, Phaser.Easing.Quadratic.In, true, 100);
	},
	beaterMoved: function(data){
		//Reset Global timer
		this.resetGameResetTimer();
		beaterUp = true;
		if(data != undefined){
			if(data.state == 'down'){ beaterUp = false; this.beaterPosition = 'down';};
			if(data.state == 'up'){ beaterUp = true; this.beaterPosition = 'up';};
			Kente.beaterPosition = this.beaterPosition;
		}
		console.log('>> BeaterUP is ' + beaterUp.toString());
		console.log(':: (Beater section) Current Tutorial Step:'+ this.tutorial_step);
		if(this.tutorial_step == 2 && beaterUp == false){ // Beater going down
			if(this.warp != undefined){
				console.log('>> Is waiting: '+this.warp.weftWaitingTobeTighten.toString());
				if(this.warp.weftWaitingTobeTighten){
					this.hideAllInstruments();
					console.log('>> trying to beat down');
					this.stopCurrentAudio();
					this.warp.tightWeft();
					this.playInstructionAudio(3);
					this.tutorial_step = 3;
				}
			}
				
		}
		else if(this.tutorial_step == 3 && beaterUp == true){ // Beater moving up
			this.stopCurrentAudio();
			//Play next audio
			if(this.warp != undefined){
				this.playInstructionAudio(4);
				//Glow the first threads to be lifted
				this.warp.blinkThreads([4]); //blink middle thread starting from 0 
				this.tutorial_step = 4;
				console.log('::Current Tutorial Step:'+ this.tutorial_step);
			}	
		}
		else if(this.tutorial_step == 5 && beaterUp == false){ //Corrects threads where lifted now lets move Beater is moving down.
			if(this.warp != undefined){
				console.log('>> Is waiting: '+this.warp.weftWaitingTobeTighten.toString());
				if(this.warp.weftWaitingTobeTighten){
					console.log('>> trying to beat down');
					this.warp.tightWeft();
					this.stopCurrentAudio();
					this.playInstructionAudio(8); //This tighten the weft .. and lift center most
					this.warp.blinkThreads([3,4,5]); //blinkthread starting from 0 
					this.tutorial_step = 6;
					console.log('::Current Tutorial Step:'+ this.tutorial_step);
				}
			}
		}
		else if(this.tutorial_step == 7 && beaterUp == false){ //Corrects threads where lifted now lets move Beater is moving down.
			if(this.warp != undefined){
				console.log('>> Is waiting: '+this.warp.weftWaitingTobeTighten.toString());
				if(this.warp.weftWaitingTobeTighten){
					console.log('>> trying to beat down');
					this.warp.tightWeft();
					this.stopCurrentAudio();
					this.playInstructionAudio(10); //Lift five
					this.warp.blinkThreads([2,3,4,5,6]); //blinkthread starting from 0 
					this.tutorial_step = 8;
					console.log('::Current Tutorial Step:'+ this.tutorial_step);
				}
			}
		}
		else if(this.tutorial_step == 9 && beaterUp == false){ //Corrects threads where lifted now lets move Beater is moving down.
			if(this.warp != undefined){
				console.log('>> Is waiting: '+this.warp.weftWaitingTobeTighten.toString());
				if(this.warp.weftWaitingTobeTighten){
					console.log('>> trying to beat down');
					this.warp.tightWeft();
					this.stopCurrentAudio();
					this.playInstructionAudio(11); //Lift four
					this.warp.blinkThreads([3,4,5]); //blinkthread starting from 0 
					this.tutorial_step = 10;
					console.log('::Current Tutorial Step:'+ this.tutorial_step);
				}
			}
		}
		else if(this.tutorial_step == 11 && beaterUp == false){ //Corrects threads where lifted now lets move Beater is moving down.
			if(this.warp != undefined){
				console.log('>> Is waiting: '+this.warp.weftWaitingTobeTighten.toString());
				if(this.warp.weftWaitingTobeTighten){
					console.log('>> trying to beat down');
					this.warp.tightWeft();
					this.stopCurrentAudio();
					this.playInstructionAudio(12); //lift 3
					this.warp.blinkThreads([4]); //blinkthread starting from 0 
					this.tutorial_step = 12;
					console.log('::Current Tutorial Step:'+ this.tutorial_step);
				}
			}
		}
		else if(this.tutorial_step == 13 && beaterUp == false){ //Corrects threads where lifted now lets move Beater is moving down.
			if(this.warp != undefined){
				console.log('>> Is waiting: '+this.warp.weftWaitingTobeTighten.toString());
				if(this.warp.weftWaitingTobeTighten){
					console.log('>> trying to beat down');
					this.warp.tightWeft();
					this.stopCurrentAudio();
					Kente.theSounds['6-0-2'].onStop.addOnce(function(){ // This is called a Kente cloth
						this.stopCurrentAudio();
						this.game.time.removeAll();
						this.game.state.start('VideoPlayer', true, false);
					}, this);
					this.playInstructionAudio(13); //Great You just created your first
					this.tutorial_step = 14;
					console.log('::Current Tutorial Step:'+ this.tutorial_step);
				}
			}
		}
		

	},
	threadTouched: function(data){
		//Reset Global timer
		this.resetGameResetTimer();
		//Reset Are you there
		this.resetAreYouThere();
		if(this.warp != undefined){
			this.warp.threadTouched(data);
		}

	},
	glowThread: function(key){
		if(key.isDown)
			this.warp.glowThread(key.thread, true);
		if(key.isUp)
			this.warp.glowThread(key.thread, false);
	},
	shuttleTouched: function(data){
		//Reset global timer
		this.resetGameResetTimer();

		var colors = [];
		colors[1] = 'yellow'; //yellow
		colors[0] = 'green'; //green
		
		if(this.currentPlayingInstruction == Kente.theSounds['skip-tut']){
			this.stopCurrentAudio();
			this.game.time.removeAll();
			this.game.state.start('Game', true, false);
		}
		else if(this.tutorial_step == 1){ //Finished - Welcome to the interactive.. 
			this.stopCurrentAudio();
			this.playInstructionAudio(2); 
			//Sending the shuttle for demonstration
			console.log('>> Sending demonstration shuttle');
			this.warp.sendShuttles(null,colors);
			this.tutorial_step = 2;
			//stop Show Shuttle animation, in case the user was rushing at the beginning of the game
			if(this.shuttleTween != undefined)
				this.shuttleTween.stop();
		}
		else if(this.tutorial_step == 4){ 
			
			if(this.beaterPosition == 'up'){
				if(this.checkTutorialThreadsLifted([5])){ //Check if thread 5 (starting from 1) is lifted
					console.log('>> GOOD JOB !');
					this.warp.stopBlinkingAllThreads();
					//PLay next threads to be lifted
					this.stopCurrentAudio();
					this.playInstructionAudio(5); //Move the beater down and up... 
					//Send shuttle
					this.warp.sendShuttles(null, colors);
					this.tutorial_step = 5;
				}else this.announceWrongThreads();//Play wrong threads try again
			}else{
				console.log(".... Beater position:"+ this.beaterPosition);
			 	this.playInstructionAudio(7);
			}
		}
		else if(this.tutorial_step == 6){ 
			if(this.beaterPosition == 'up'){
				if(this.checkTutorialThreadsLifted([4,5,6])){ 
					console.log('>> GOOD JOB !');
					this.warp.stopBlinkingAllThreads();
					//PLay next threads to be lifted
					this.stopCurrentAudio();
					this.playInstructionAudio(9); //Move the beater down and up... 
					//Send shuttle
					this.warp.sendShuttles(null, colors);
					this.tutorial_step = 7;
				}else this.announceWrongThreads();//Play wrong threads try again
			}else{ this.playInstructionAudio(7);}
		}
		else if(this.tutorial_step == 8){ 
			if(this.beaterPosition == 'up'){
				if(this.checkTutorialThreadsLifted([3,4,5,6,7])){  //CORRECT HERE after keyboard limitaion
					console.log('>> GOOD JOB !');
					this.warp.stopBlinkingAllThreads();
					//PLay next threads to be lifted
					this.stopCurrentAudio();
					this.playInstructionAudio(9); //Move the beater down and up... 
					//Send shuttle
					this.warp.sendShuttles(null, colors);
					this.tutorial_step = 9;
				}else this.announceWrongThreads();//Play wrong threads try again
			}else{ this.playInstructionAudio(7);}
		}
		else if(this.tutorial_step == 10){ 
			if(this.beaterPosition == 'up'){
				if(this.checkTutorialThreadsLifted([4,5,6])){ 
					console.log('>> GOOD JOB !');
					this.warp.stopBlinkingAllThreads();
					//PLay next threads to be lifted
					this.stopCurrentAudio();
					this.playInstructionAudio(9); //Move the beater down and up... 
					//Send shuttle
					this.warp.sendShuttles(null, colors);
					this.tutorial_step = 11;
				}else this.announceWrongThreads();//Play wrong threads try again
			}else{ this.playInstructionAudio(7);}
		}
		else if(this.tutorial_step == 12){ 
			if(this.beaterPosition == 'up'){
				if(this.checkTutorialThreadsLifted([5])){ 
					console.log('>> GOOD JOB !');
					this.warp.stopBlinkingAllThreads();
					//PLay next threads to be lifted
					this.stopCurrentAudio();
					this.playInstructionAudio(9); //Move the beater down and up... 
					//Send shuttle
					this.warp.sendShuttles(null, colors);
					this.tutorial_step = 13;
				}else this.announceWrongThreads();//Play wrong threads try again
			}else{ this.playInstructionAudio(7);}
		}
				
		if(Kente.theSounds["1-1"].isPlaying){ //Are you there ?
			Kente.theSounds["1-1"].onStop.removeAll();
			Kente.theSounds["1-1"].stop();
		};
		
		console.log('::Current Tutorial Step:'+ this.tutorial_step); 
	
	},
	announceWrongThreads: function(){
		console.log('>> WRONG THREADS TRY AGAIN !');
		// this.stopCurrentAudio();
		this.playInstructionAudio(6);
	},
	checkTutorialThreadsLifted: function(stringsToCheck){ // ex. [3,5,7,9]

		if(this.warp.liftedThreads.length == stringsToCheck.length){ 
			for(var j=0; j<stringsToCheck.length; j++){
				var isThere = false;
				for(var i=0; i<this.warp.liftedThreads.length; i++){
					if(this.warp.liftedThreads[i] == stringsToCheck[j]) isThere = true;
				}
				if(isThere == false) return false;
			}
			return true;
		}
		
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
			this.timer_resetGame = this.game.time.events.add(60000, this.resetGame, this);
			console.log(':: Global Timer reseted');
	},
	resetGame: function(){
		Kente.sounds.forEach(function(sound) { //Clean functions added to the onStop Phaser.signal
		    sound.onStop.removeAll();
		});
		this.game.state.start('SlideShow', true,false);
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
				this.currentPlayingInstruction.play();

				// Kente.theSounds['1-1'].play(); //are you there
				// this.currentPlayingInstruction = Kente.theSounds["1-1"];
				

				// Kente.sounds[id].onStop.add(function(){
				// 	// this.timer_AreYouThere = this.game.time.events.add(10000, this.resetGame, this);
				// },this);
				break;
			}
			case 2:{
				this.game.time.events.remove(this.timer_AreYouThere);
				console.log(':: Playing: The shuttle is used to weave a weft .. 2-0');
				this.shuttleSprite.animations.stop('touching'); 
				this.showWeftSample(); //animation
				Kente.theSounds["2-0"].play();
				this.currentPlayingInstruction = Kente.theSounds["2-0"];
				Kente.theSounds["2-0"].onStop.addOnce(function(){
					console.log(':: Playing: A wooden piece placed .. 3-0-1');
					this.showBeaterSample();
					Kente.theSounds["3-0-1"].play();
					this.currentPlayingInstruction = Kente.theSounds["3-0-1"];
					Kente.theSounds["3-0-1"].onStop.addOnce(function(){
						console.log(':: Playing: Pull the beater all .. 3-0-2');
						Kente.theSounds["3-0-2"].play();
						this.currentPlayingInstruction = Kente.theSounds["3-0-2"];
						Kente.theSounds["3-0-2"].onStop.addOnce(function(){
							this.resetAreYouThere();		
						},this);
					},this);
				},this);
				break;
			}
			case 3:{
				this.game.time.events.remove(this.timer_AreYouThere);
				console.log(':: Playing: Now move the beater up .. 3-0-3');
				Kente.theSounds["3-0-3"].play();
				this.currentPlayingInstruction = Kente.theSounds["3-0-3"];
				Kente.theSounds["3-0-3"].onStop.addOnce(function(){
					this.resetAreYouThere();
				},this);
				break;
			}
			case 4:{
				this.game.time.events.remove(this.timer_AreYouThere);
				console.log(':: Playing: Great ! Now youre ready .. 4-0');
				Kente.theSounds["4-0"].play();
				this.currentPlayingInstruction = Kente.theSounds["4-0"];
				Kente.theSounds["4-0"].onStop.addOnce(function(){
					console.log(':: Playing: Lift the center warp thread.. and touch shuttle 5-0-1');
					Kente.theSounds["5-0-1"].play();
					this.currentPlayingInstruction = Kente.theSounds["5-0-1"];
					Kente.theSounds["5-0-1"].onStop.addOnce(function(){
						this.resetAreYouThere();
					},this);
				},this);
				break;
			}
			case 5:{
				this.game.time.events.remove(this.timer_AreYouThere);
				console.log(':: Playing: The green weft threads pass under .. 5-0-2');
				Kente.theSounds["5-0-2"].play();
				this.currentPlayingInstruction = Kente.theSounds["5-0-2"];
				Kente.theSounds["5-0-2"].onStop.addOnce(function(){
					console.log(':: Playing: Now, pull the beater down and up .. 5-1-1-1');
					Kente.theSounds["5-1-1-1"].play();
					this.currentPlayingInstruction = Kente.theSounds["5-1-1-1"];
					Kente.theSounds["5-1-1-1"].onStop.addOnce(function(){
							this.resetAreYouThere();
					},this);
				},this);
				break;
			}
			case 6:{
				if(!Kente.theSounds["5-1-2"].isPlaying){
					this.game.time.events.remove(this.timer_AreYouThere);
					this.stopCurrentAudio();
					console.log(':: Playing: Those werent the right threads .. 5-1-2');
					Kente.theSounds["5-1-2"].play();
					this.currentPlayingInstruction = Kente.theSounds["5-1-2"];
					Kente.theSounds["5-1-2"].onStop.addOnce(function(){
							this.resetAreYouThere();
					},this);
				}
				break;
			}
			case 7:{
				if(!Kente.theSounds["5-1-4"].isPlaying){
					this.game.time.events.remove(this.timer_AreYouThere);
					this.stopCurrentAudio();
					console.log(':: Playing: Remember to push the beater up .. 5-1-4');
					Kente.theSounds["5-1-4"].play();
					this.currentPlayingInstruction = Kente.theSounds["5-1-4"];
					Kente.theSounds["5-1-4"].onStop.addOnce(function(){
							this.resetAreYouThere();
					},this);
				}
				break;
			}
			case 8:{
				this.game.time.events.remove(this.timer_AreYouThere);
				console.log(':: Playing: This tighten the weft thread into place .. 5-1-1-2');
				Kente.theSounds["5-1-1-2"].play();
				this.currentPlayingInstruction = Kente.theSounds["5-1-1-2"];
				Kente.theSounds["5-1-1-2"].onStop.addOnce(function(){
					console.log(':: Playing: Now lift the three .. 5-2');
					Kente.theSounds["5-2"].play();
					this.currentPlayingInstruction = Kente.theSounds["5-2"];
					Kente.theSounds["5-2"].onStop.addOnce(function(){
							this.resetAreYouThere();
					},this);
				},this);
				break;
			}
			case 9:{
				this.game.time.events.remove(this.timer_AreYouThere);
				console.log(':: Playing: Now pull the beater down and up again .. 5-1-1-1');
				Kente.theSounds["5-1-1-1"].play();
				this.currentPlayingInstruction = Kente.theSounds["5-1-1-1"];
				Kente.theSounds["5-1-1-1"].onStop.addOnce(function(){
						this.resetAreYouThere();
				},this);
				break;
			}
			case 10:{
				this.game.time.events.remove(this.timer_AreYouThere);
				console.log(':: Playing: Now lift the 5 .. 5-3');
				Kente.theSounds["5-3"].play();
				this.currentPlayingInstruction = Kente.theSounds["5-3"];
				Kente.theSounds["5-3"].onStop.addOnce(function(){
						this.resetAreYouThere();
				},this);
				break;
			}
			case 11:{
				this.game.time.events.remove(this.timer_AreYouThere);
				console.log(':: Playing: Good ! Once again lift  .. 5-4');
				Kente.theSounds["5-4"].play();
				this.currentPlayingInstruction = Kente.theSounds["5-4"];
				Kente.theSounds["5-4"].onStop.addOnce(function(){
						this.resetAreYouThere();
				},this);
				break;
			}
			case 12:{
				this.game.time.events.remove(this.timer_AreYouThere);
				console.log(':: Playing: Finally ! Lift threads  .. 5-5');
				Kente.theSounds["5-5"].play();
				this.currentPlayingInstruction = Kente.theSounds["5-5"];
				Kente.theSounds["5-5"].onStop.addOnce(function(){
						this.resetAreYouThere();
				},this);
				break;
			}
			case 13:{
				this.game.time.events.remove(this.timer_AreYouThere);
				console.log(':: Playing: Great you just created your first pattern  .. 6-0-1');
				Kente.theSounds["6-0-1"].play();
				this.currentPlayingInstruction = Kente.theSounds["6-0-1"];
				Kente.theSounds["6-0-1"].onStop.addOnce(function(){
					console.log(':: Playing: This is called a Kente cloth  .. 6-0-2');
					Kente.theSounds["6-0-2"].play();
					this.currentPlayingInstruction = Kente.theSounds["6-0-2"];
				},this);
				break;
			}
		}
	},
	stopCurrentAudio: function(){
		//console.log(this.currentPlayingInstruction);
		if(this.currentPlayingInstruction != undefined && this.currentPlayingInstruction != null && this.currentPlayingInstruction.isPlaying){
			console.log(">> Stopping sound before it finished");
			this.currentPlayingInstruction.onStop.removeAll();
			this.currentPlayingInstruction.stop();
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
