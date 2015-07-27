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
		
		this.warp = new WarpGroup(this.game, true);
		this.lowerContainer.addChild(this.warp);

		this.warp.onReadyForReplication.addOnce(function(){
			console.log('>> READY FOR REPLICATION >>>>>>>>>>>>>>');
			//Temporal callback, just for this time
			Kente.theSounds["6-0-1"].onStop.addOnce(function(){ //
				//Lets Replicate, should be in tutorial step 15 by now
				this.warp.replicatePattern();
			},this);
			
			
			// this.playInstructionAudio(11); // 9-0-1
		},this);


		
		//Start the Global timer
		this.resetGameResetTimer();

		

		//Play Instruction #1
		Kente.theSounds['1-start'].play();
		this.currentPlayingInstruction = Kente.theSounds["1-start"]; 
		Kente.theSounds['1-start'].onStop.addOnce(function(){ //Welcome to the interactive...
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

		// var thread_upper = new ThreadGroup(this.game, [], '0xFFFFF', false);
		// thread_upper.y = 500; 
		// // this.game.add.existing(thread_upper);
		// thread_upper.revealToRight();

		// var copyText = this.game.world.generateTexture(1,this.game.renderer);
	 //    var copy = new Phaser.Sprite(this.game,0,0,copyText);
	    // var graph = new Phaser.Rectangle(this.game.world.centerX-(this.warp.warpWidth/2)+466,1010, this.warp.warpWidth , 1900);
	  

	    this.game.add.existing(copy);

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
		console.log('>> Tut step is ' + this.tutorial_step);
		if(this.tutorial_step == 3 && beaterUp == false){ // Beater going down
			if(this.warp != undefined){
				console.log('>> Is waiting: '+this.warp.weftWaitingTobeTighten.toString());
				if(this.warp.weftWaitingTobeTighten){
					console.log('>> trying to beat down');
					this.stopCurrentAudio();
					this.warp.tightWeft();
					this.tutorial_step = 4;
					this.playInstructionAudio(4);
				}
			}
				
		}
		if(this.tutorial_step == 4 && beaterUp == true){ // Beater moving up
			this.stopCurrentAudio();
			//Play next audio
			if(this.warp != undefined){
				this.playInstructionAudio(5);
				//Glow the first threads to be lifted
				this.warp.blinkThreads([4]); //blink middle thread starting from 0 
				this.tutorial_step = 5;
				console.log('::Current Tutorial Step:'+ this.tutorial_step);
			}	
		}
		if(this.tutorial_step == 6 && beaterUp == false){ //Corrects threads where lifted now lets move Beater is moving down.
			if(this.warp != undefined){
				console.log('>> Is waiting: '+this.warp.weftWaitingTobeTighten.toString());
				if(this.warp.weftWaitingTobeTighten){
					console.log('>> trying to beat down');
					this.warp.tightWeft();
					this.stopCurrentAudio();
					this.playInstructionAudio(7); //Lift the glowing threads
					this.warp.blinkThreads([3,5]); //blinkthread starting from 0 
					this.tutorial_step = 7;
				}
			}
		}
		if(this.tutorial_step == 8 && beaterUp == false){ //Corrects threads where lifted now lets move Beater is moving down.
			if(this.warp != undefined){
				console.log('>> Is waiting: '+this.warp.weftWaitingTobeTighten.toString());
				if(this.warp.weftWaitingTobeTighten){
					console.log('>> trying to beat down');
					this.warp.tightWeft();
					this.stopCurrentAudio();
					this.playInstructionAudio(7); //Lift the glowing threads
					this.warp.blinkThreads([2,6]); //blinkthread starting from 0 
					this.tutorial_step = 9;
				}
			}
		}
		if(this.tutorial_step == 10 && beaterUp == false){ //Corrects threads where lifted now lets move Beater is moving down.
			if(this.warp != undefined){
				console.log('>> Is waiting: '+this.warp.weftWaitingTobeTighten.toString());
				if(this.warp.weftWaitingTobeTighten){
					console.log('>> trying to beat down');
					this.warp.tightWeft();
					this.stopCurrentAudio();
					this.playInstructionAudio(7); //Lift the glowing threads
					this.warp.blinkThreads([3,5]); //blinkthread starting from 0 
					this.tutorial_step = 11;
				}
			}
		}
		if(this.tutorial_step == 12 && beaterUp == false){ //Corrects threads where lifted now lets move Beater is moving down.
			if(this.warp != undefined){
				console.log('>> Is waiting: '+this.warp.weftWaitingTobeTighten.toString());
				if(this.warp.weftWaitingTobeTighten){
					console.log('>> trying to beat down');
					this.warp.tightWeft();
					this.stopCurrentAudio();
					this.playInstructionAudio(7); //Lift the glowing threads
					this.warp.blinkThreads([4]); //blinkthread starting from 0 
					this.tutorial_step = 13;
				}
			}
		}
		if(this.tutorial_step == 14 && beaterUp == false){ //Corrects threads where lifted now lets move Beater is moving down.
			if(this.warp != undefined){
				console.log('>> Is waiting: '+this.warp.weftWaitingTobeTighten.toString());
				if(this.warp.weftWaitingTobeTighten){
					console.log('>> trying to beat down');
					this.warp.tightWeft();
					this.stopCurrentAudio();
					this.playInstructionAudio(10); //Lift the glowing threads
					// this.warp.blinkThreads([4]); //blinkthread starting from 0 
					this.tutorial_step = 15;
				}
			}
		}

	},
	threadTouched: function(data){
		//Reset Global timer
		this.resetGameResetTimer();

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
		colors[1] = '0xFFFF00'; //yellow
		colors[0] = '0x47D147'; //green
		
		
		if(this.tutorial_step == 1){ //Finished - Welcome to the interactive.. 
			this.stopCurrentAudio();
			this.playInstructionAudio(2); //Play - These vertical threads here are called...
			//Animate the warp
			this.warp.showAttention();
			this.tutorial_step = 2;
		}
		else if(this.tutorial_step == 2 ){ //
			this.stopCurrentAudio();
			//Sending the shuttle for demonstration
			console.log(':: Step 3 > Sending demonstration shuttle');
			this.warp.sendShuttles(null,colors);

			this.playInstructionAudio(3); // 
			this.tutorial_step = 3;
		}
		//Step 3 is the Beater
		// ....
		//////
		else if(this.tutorial_step == 5) //holding the first thread for pattern
		{
			if(this.beaterPosition == 'up'){
				if(this.checkTutorialThreadsLifted([5])){ //Check if thread 5 (starting from 1) is lifted
					console.log('>> GOOD JOB !');
					this.warp.stopBlinkingAllThreads();
					//PLay next threads to be lifted
					this.stopCurrentAudio();
					this.playInstructionAudio(8); //Move the beater down and up... 
					//Send shuttle
					this.warp.sendShuttles(null, colors);
					this.tutorial_step = 6;
				}else this.announceWrongThreads();//Play wrong threads try again
			}else{ this.stopCurrentAudio(); this.playInstructionAudio(9);}
		}
		else if(this.tutorial_step == 7) //holding threads
		{
			// console.log(this.beaterPosition);
			if(this.beaterPosition == 'up'){
				if(this.checkTutorialThreadsLifted([4,6])){ //Check if threads 4 and 5 (starting from 1) are lifted
					console.log('>> GOOD JOB !');
					this.warp.stopBlinkingAllThreads();
					//PLay next threads to be lifted
					this.stopCurrentAudio();
					this.playInstructionAudio(8); //Move the beater down and up... 
					//Send shuttle
					this.warp.sendShuttles(null, colors);
					this.tutorial_step = 8;
				}else this.announceWrongThreads();//Play wrong threads try again
			}else{ this.stopCurrentAudio(); this.playInstructionAudio(9);}
		}
		else if(this.tutorial_step == 9) //holding threads
		{
			// console.log(this.beaterPosition);
			if(this.beaterPosition == 'up'){
				if(this.checkTutorialThreadsLifted([3,7])){ //Check if threads 4 and 5 (starting from 1) are lifted
					console.log('>> GOOD JOB !');
					this.warp.stopBlinkingAllThreads();
					//PLay next threads to be lifted
					this.stopCurrentAudio();
					this.playInstructionAudio(8); //Move the beater down and up... 
					//Send shuttle
					this.warp.sendShuttles(null, colors);
					this.tutorial_step = 10;
				}else this.announceWrongThreads();//Play wrong threads try again
			}else{ this.stopCurrentAudio(); this.playInstructionAudio(9);}
		}
		else if(this.tutorial_step == 11) //holding threads
		{
			// console.log(this.beaterPosition);
			if(this.beaterPosition == 'up'){
				if(this.checkTutorialThreadsLifted([4,6])){ //Check if threads 4 and 5 (starting from 1) are lifted
					console.log('>> GOOD JOB !');
					this.warp.stopBlinkingAllThreads();
					//PLay next threads to be lifted
					this.stopCurrentAudio();
					this.playInstructionAudio(8); //Move the beater down and up... 
					//Send shuttle
					this.warp.sendShuttles(null, colors);
					this.tutorial_step = 12;
				}else this.announceWrongThreads();//Play wrong threads try again
			}else{ this.stopCurrentAudio(); this.playInstructionAudio(9);}
		}
		else if(this.tutorial_step == 13) //holding threads
		{
			// console.log(this.beaterPosition);
			if(this.beaterPosition == 'up'){
				if(this.checkTutorialThreadsLifted([5])){ //Check if threads 4 and 5 (starting from 1) are lifted
					console.log('>> GOOD JOB !');
					this.warp.stopBlinkingAllThreads();
					//PLay next threads to be lifted
					this.stopCurrentAudio();
					this.playInstructionAudio(8); //Move the beater down and up..
					//Send shuttle
					this.warp.sendShuttles(null, colors);
					this.tutorial_step = 14;
				}else this.announceWrongThreads();//Play wrong threads try again
			}else{ this.stopCurrentAudio(); this.playInstructionAudio(9);}
		}else if(this.tutorial_step == 15) // Lets leave the Tutorial
		{	
			this.game.state.start('Game', true, false);	
		}

		
		if(Kente.theSounds["1-1"].isPlaying){ //Are you there ?
			Kente.theSounds["1-1"].onStop.removeAll();
			Kente.theSounds["1-1"].stop();
		};
		
		console.log('::Current Tutorial Step:'+ this.tutorial_step); 

		
		// console.log('pre shut');
		// this.warp.sendShuttles(null,colors);	 	
	},
	announceWrongThreads: function(){
		console.log('>> WRONG THREADS TRY AGAIN !');
		this.stopCurrentAudio();
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
			this.timer_resetGame = this.game.time.events.add(240000, this.resetGame, this);
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
				Kente.theSounds['1-1'].play(); //are you there
				this.currentPlayingInstruction = Kente.theSounds["1-1"];
				// Kente.sounds[id].onStop.add(function(){
				// 	// this.timer_AreYouThere = this.game.time.events.add(10000, this.resetGame, this);
				// },this);
				break;
			}
			case 2:{
				this.game.time.events.remove(this.timer_AreYouThere);
				console.log(':: Playing: These Vertical Threads .. 2-0-1');
				Kente.theSounds["2-0-1"].play();
				this.currentPlayingInstruction = Kente.theSounds["2-0-1"];
				Kente.theSounds["2-0-1"].onStop.addOnce(function(){
					console.log(":: Playing: The device you just pressed is called a Shuttle")
					Kente.theSounds["2-0-2"].play();
					this.currentPlayingInstruction = Kente.theSounds["2-0-2"];
					Kente.theSounds["2-0-2"].onStop.addOnce(function(){
						console.log(':: Playing: Touch the shuttle now to see it in action');
						Kente.theSounds["2-0-3"].play();
						this.currentPlayingInstruction = Kente.theSounds["2-0-3"];
						this.resetAreYouThere();		
					},this);
				},this);
				break;
			}
			case 3:{
				this.game.time.events.remove(this.timer_AreYouThere);
				console.log(':: Playing: Great ! Weavers use a device called the beater .. 3-0-1');
				Kente.theSounds["3-0-1"].play();
				this.currentPlayingInstruction = Kente.theSounds["3-0-1"];
				Kente.theSounds["3-0-1"].onStop.addOnce(function(){
					console.log(":: Playing: Hold the beater down... 3-0-2")
					Kente.theSounds["3-0-2"].play();
					this.currentPlayingInstruction = Kente.theSounds["3-0-2"];
					this.resetAreYouThere();
				},this);
				break;
			}
			case 4:{
				this.game.time.events.remove(this.timer_AreYouThere);
				console.log(':: Playing: Now ! move the beater up .. 3-0-3');
				Kente.theSounds["3-0-3"].play();
				this.currentPlayingInstruction = Kente.theSounds["3-0-3"];
				Kente.theSounds["3-0-3"].onStop.addOnce(function(){
					this.resetAreYouThere();
				},this);
				break;
			}
			case 5:{
				this.game.time.events.remove(this.timer_AreYouThere);
				console.log(':: Playing: Great, now lets use this process .. 4-0');
				Kente.theSounds["4-0"].play();
				this.currentPlayingInstruction = Kente.theSounds["4-0"];
				Kente.theSounds["4-0"].onStop.addOnce(function(){
					console.log(':: Playing: To make a pattern .. 5-0-1');
					Kente.theSounds["5-0-1"].play();
					this.currentPlayingInstruction = Kente.theSounds["5-0-1"];
					Kente.theSounds["5-0-1"].onStop.addOnce(function(){	
						console.log(':: Playing: With your left hand .. 5-0-2');
						Kente.theSounds["5-0-2"].play();
						this.currentPlayingInstruction = Kente.theSounds["5-0-2"];
						this.resetAreYouThere();	
					}, this);
				},this);
				break;
			}
			case 6: {
				this.game.time.events.remove(this.timer_AreYouThere);
				console.log(':: Playing: WRONG THREADS .. 5-2');
				Kente.theSounds["5-2"].play();
				this.currentPlayingInstruction = Kente.theSounds["5-2"];
				Kente.theSounds["5-2"].onStop.addOnce(function(){
					this.resetAreYouThere();
				},this);
				break;
			}
			case 7: {
				this.game.time.events.remove(this.timer_AreYouThere);
				console.log(':: Playing: With your left hand .. 5-0-2');
				Kente.theSounds["5-0-2"].play();
				this.currentPlayingInstruction = Kente.theSounds["5-0-2"];
				Kente.theSounds["5-0-2"].onStop.addOnce(function(){
					this.resetAreYouThere();
				},this);
				break;
			}
			case 8: {
				this.game.time.events.remove(this.timer_AreYouThere);
				console.log(':: Playing: Now move the beater down and up again .. 5-1-0');
				Kente.theSounds["5-1-0"].play();
				this.currentPlayingInstruction = Kente.theSounds["5-1-0"];
				Kente.theSounds["5-1-0"].onStop.addOnce(function(){
					this.resetAreYouThere();
				},this);
				break;
			}
			case 9: {
				this.game.time.events.remove(this.timer_AreYouThere);
				console.log(':: Playing: Remember to move beater up .. 5-1-1');
				Kente.theSounds["5-1-1"].play();
				this.currentPlayingInstruction = Kente.theSounds["5-1-1"];
				Kente.theSounds["5-1-1"].onStop.addOnce(function(){
					this.resetAreYouThere();
				},this);
				break;
			}
			case 10: {
				this.game.time.events.remove(this.timer_AreYouThere); //DIABLE THE TIMER.. until all the audio files finish and starte it again
				console.log(':: Playing: Great! you finished your pattern .. 6-0-1');
				Kente.theSounds["6-0-1"].play();
				this.currentPlayingInstruction = Kente.theSounds["6-0-1"];
				Kente.theSounds["6-0-1"].onStop.addOnce(function(){
					console.log(':: Playing: In Kente this diamond .. 6-0-2');
					Kente.theSounds["6-0-2"].play();
					this.currentPlayingInstruction = Kente.theSounds["6-0-2"];
					Kente.theSounds["6-0-2"].onStop.addOnce(function(){
						console.log(':: Playing: Kente is complex .. 6-0-4');
						Kente.theSounds["6-0-4"].play();
						this.currentPlayingInstruction = Kente.theSounds["6-0-4"];
						Kente.theSounds["6-0-4"].onStop.addOnce(function(){
							console.log(':: Playing: When you are ready to move on .. 6-0-5');
							Kente.theSounds["6-0-5"].play();
							this.currentPlayingInstruction = Kente.theSounds["6-0-5"];
							Kente.theSounds["6-0-5"].onStop.addOnce(function(){
								this.resetAreYouThere();
							},this);
						},this);
					},this);
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
