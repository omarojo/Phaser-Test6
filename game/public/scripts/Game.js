Kente.Game = function(game){
	this.upperContainer;
	this.lowerContainer;
	this.subtitles;
	this.currentInstruction;
	this.shuttleSprite;
	this.warp;
};

Kente.Game.prototype = {
	preload: function(){
		this.warpSprite = null;
		this.timer_AreYouThere = null;
		this.timer_resetGame = null;
		this.instruction_step = 1;
		this.currentPlayingInstruction = null;
		this.beaterPosition = 'up'; 
		this.tempSelectedColor = '';
		this.selectedBackgroundColor = '';
		this.selectedPatternColor = '';
	},
	create: function(){
		console.log('::Game Loaded');
		Kente.removeAllSocketListeners();

		var self = this;
		Kente.socket.on('threadTouch', function(data){
			self.threadTouched(data);
		});
		Kente.socket.on('beaterClick', function(data){
			self.beaterMoved(data);
		});

		////// KEYBOARD
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


	    // UI
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

		//Shuttle Image
	    this.shuttleSprite = this.game.make.sprite(this.game.world.centerX,this.game.world.centerY/2+200,'shuttle_vector');
	    this.shuttleSprite.anchor.set(0.5);
	    this.upperContainer.addChild(this.shuttleSprite);

	    //Subtitles
	    this.showInstruction("In Kente tradition, each color has a symbolic meaning that matches the occasion for which they are worn.");

		//LOWER Container
		this.warp = new WarpGroup(this.game,false);
		this.warp.onReadyForReplication.addOnce(function(){
			console.log('>> READY FOR REPLICATION >>>>>>>>>>>>>>');
			//Temporal callback, just for this time
			Kente.theSounds["9-0-1"].onStop.addOnce(function(){ //Instruction 11
				//Lets Replicate
				this.warp.replicatePattern();
			},this);
			
			this.instruction_step = 5;
			console.log('>> Instruction STEP: '+this.instruction_step);				
			this.playInstructionAudio(11); // 9-0-1
		},this);

		this.lowerContainer.addChild(this.warp);

	    //Start the Global timer
		this.resetGameResetTimer();

		//Play Instruction #1
		this.playInstructionAudio(1);
	},
	update: function(){

	},
	canisterTouched: function(data){
		//Reset Global timer
		this.resetGameResetTimer();
		if(this.instruction_step == 1){ // PICKING YOUR BACKGROUND COLOR
			this.stopCurrentAudio();
			if(this.tempSelectedColor == data.color){ // They selected the color for second time.. lets go for next color selection
				this.selectedBackgroundColor = data.color;//this.getColorCode(data.color);
				console.log(">> Selected Background Color: "+ data.color);
				//Play audio to ask for pattern color
				this.playInstructionAudio(6);

				this.instruction_step = 2;
				console.log('>> Instruction STEP: '+this.instruction_step);
				this.tempSelectedColor = ''; //clean the temporal selected color, to allow the pattern color selection process thats going to happen next.
			}else{
				this.tempSelectedColor = data.color;
				//Play Color definition depending on selected color.
				if(data.color == 'red') this.playInstructionAudio(2);
				else if(data.color == 'blue') this.playInstructionAudio(3);
				else if(data.color == 'green') this.playInstructionAudio(4);
				else if(data.color == 'yellow') this.playInstructionAudio(5);
			}
		}
		else if(this.instruction_step == 2){ // PICKING YOUR Pattern COLOR
			this.stopCurrentAudio();
			if(this.tempSelectedColor == data.color){ // They selected the color for second time.. lets go for next color selection
				this.selectedPatternColor = data.color//this.getColorCode(data.color);
				console.log(">> Selected Pattern Color: "+ data.color);
				//Play audio to suggest pattern to be weaved or do your own
				this.playInstructionAudio(7);
				//Show patterns on screen for suggestion

				this.instruction_step = 3;
				console.log('>> Instruction STEP: '+this.instruction_step);
				this.tempSelectedColor = ''; //clean the temporal selected color
			}else{
				this.tempSelectedColor = data.color;
				//Play Color definition depending on selected color.
				if(data.color == 'red') this.playInstructionAudio(2);
				else if(data.color == 'blue') this.playInstructionAudio(3);
				else if(data.color == 'green') this.playInstructionAudio(4);
				else if(data.color == 'yellow') this.playInstructionAudio(5);
			}
		}else if(this.instruction_step == 5){ // GAME IS OVER.. RESET EVERYTHING
			this.stopCurrentAudio();
			this.playInstructionAudio(13); //Thanks for sharing
			Kente.theSounds["11-0-2"].onStop.addOnce(function(){
					this.game.state.start('SlideShow', true, false);	
			},this);
			this.instruction_step = 6; //Its over dont even try to tap again.. nothing will happen
		}

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
		if(this.warp.weftWaitingTobeTighten && Kente.beaterPosition == 'down'){
			this.warp.tightWeft();
		}
	},
	threadTouched: function(data){
		//Reset Global timer
		this.resetGameResetTimer();

		if(this.warp != undefined){
			this.warp.threadTouched(data);
		}

	},
	shuttleTouched: function(data){
		//Reset global timer
		this.resetGameResetTimer();

		if(this.instruction_step == 3){
			//Do some screen feedback... there isnt much to do in this step. Is just a confirmation step.
			this.stopCurrentAudio();
			this.instruction_step = 4;
			console.log('>> Instruction STEP: '+this.instruction_step);
		}
		else if(this.instruction_step == 4){ //BUILDING YOUR PATTERN
			if(Kente.beaterPosition == 'up'){
				if(!this.warp.weftWaitingTobeTighten){ //Check first if there is not already a weft string on screen
					//Send shuttle
					var colors = [this.selectedBackgroundColor, this.selectedPatternColor];
					this.warp.sendShuttles(null,colors);
				}else{
					//Advice to move the beater down
					this.stopCurrentAudio();
					this.playInstructionAudio(10);
				}
			}else{
				this.stopCurrentAudio();
				this.playInstructionAudio(8); //Remember to put the beater up
			}
		}else if(this.instruction_step == 5){
			//SEND IMAGE TO COMMUNITY WALL
			this.stopCurrentAudio();
			this.playInstructionAudio(12);
			Kente.theSounds["11-0-2"].onStop.addOnce(function(){
					this.game.state.start('SlideShow', true, false);	
			},this);
			Kente.postImage(this.game);

			this.instruction_step = 6; //Its over, dont even try to tap again.. nothing will happen
		}
	},
	readyForReplication: function(){
		console.log('>> READY FOR REPLICATION >>>>>>>>>>>>>>');
		//Temporal callback, just for this time
		Kente.theSounds["9-0-1"].onStop.addOnce(function(){ //Instruction 11
			//Lets Replicate
			this.warp.replicatePattern();
		},this);

		this.playInstructionAudio(11);

	},
	glowThread: function(key){
		if(key.isDown)
			this.warp.glowThread(key.thread, true);
		if(key.isUp)
			this.warp.glowThread(key.thread, false);
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
	    					50);
		intrBox.present();
		this.currentInstruction = intrBox;
	},
	resetGameResetTimer : function(){
			if(this.timer_resetGame){
				this.game.time.events.remove(this.timer_resetGame);
			}
			//Reset are you there timer
			this.resetAreYouThere();
			// 2 minutes timer
			this.timer_resetGame = this.game.time.events.add(60000, this.resetGame, this);
			console.log(':: Global Timer reseted');
	},
	resetAreYouThere: function(){
		this.game.time.events.remove(this.timer_AreYouThere);
		this.timer_AreYouThere = this.game.time.events.add(30000, this.playInstructionAudio, this,9); // case 9
		console.log(':: Are You There Timer reseted');
	},
	resetGame: function(){
		Kente.sounds.forEach(function(sound) { //Clean functions added to the onStop Phaser.signal
		    sound.onStop.removeAll();
		});
		this.game.state.start('SlideShow', true,false);
	},
	playInstructionAudio: function(id){
		switch (id){
			case 1:{
				this.game.time.events.remove(this.timer_AreYouThere);
				console.log(':: Playing: In Kente tradition, each color has .. 7-0-1');
				Kente.theSounds["7-0-1"].play();
				this.currentPlayingInstruction = Kente.theSounds["7-0-1"];
				Kente.theSounds["7-0-1"].onStop.addOnce(function(){
					console.log(':: Playing: First you can choose .. 7-0-2');
					Kente.theSounds["7-0-2"].play();
					this.currentPlayingInstruction = Kente.theSounds["7-0-2"];
					Kente.theSounds["7-0-2"].onStop.addOnce(function(){	
						this.resetAreYouThere();	
					}, this);
				},this);
				break;
			}
			case 2:{
				this.game.time.events.remove(this.timer_AreYouThere);
				console.log(':: Playing: RED definition ... 7-1');
				Kente.theSounds["7-1"].play();
				this.currentPlayingInstruction = Kente.theSounds["7-1"];
				Kente.theSounds["7-1"].onStop.addOnce(function(){
					console.log(':: Playing: Tap the color again to select it .. 7-5');
					Kente.theSounds["7-5"].play();
					this.currentPlayingInstruction = Kente.theSounds["7-5"];
					Kente.theSounds["7-5"].onStop.addOnce(function(){	
						this.resetAreYouThere();	
					}, this);
				},this);
				break;
			}
			case 3:{
				this.game.time.events.remove(this.timer_AreYouThere);
				console.log(':: Playing: BLUE definition ... 7-2');
				Kente.theSounds["7-2"].play();
				this.currentPlayingInstruction = Kente.theSounds["7-2"];
				Kente.theSounds["7-2"].onStop.addOnce(function(){
					console.log(':: Playing: Tap the color again to select it .. 7-5');
					Kente.theSounds["7-5"].play();
					this.currentPlayingInstruction = Kente.theSounds["7-5"];
					Kente.theSounds["7-5"].onStop.addOnce(function(){	
						this.resetAreYouThere();	
					}, this);
				},this);
				break;
			}
			case 4:{
				this.game.time.events.remove(this.timer_AreYouThere);
				console.log(':: Playing: GREEN definition ... 7-3');
				Kente.theSounds["7-3"].play();
				this.currentPlayingInstruction = Kente.theSounds["7-3"];
				Kente.theSounds["7-3"].onStop.addOnce(function(){
					console.log(':: Playing: Tap the color again to select it .. 7-5');
					Kente.theSounds["7-5"].play();
					this.currentPlayingInstruction = Kente.theSounds["7-5"];
					Kente.theSounds["7-5"].onStop.addOnce(function(){	
						this.resetAreYouThere();	
					}, this);
				},this);
				break;
			}
			case 5:{
				this.game.time.events.remove(this.timer_AreYouThere);
				console.log(':: Playing: YELLOW definition ... 7-4');
				Kente.theSounds["7-4"].play();
				this.currentPlayingInstruction = Kente.theSounds["7-4"];
				Kente.theSounds["7-4"].onStop.addOnce(function(){
					console.log(':: Playing: Tap the color again to select it .. 7-5');
					Kente.theSounds["7-5"].play();
					this.currentPlayingInstruction = Kente.theSounds["7-5"];
					Kente.theSounds["7-5"].onStop.addOnce(function(){	
						this.resetAreYouThere();	
					}, this);
				},this);
				break;
			}
			case 6:{
				this.game.time.events.remove(this.timer_AreYouThere);
				console.log(':: Playing: Now select pattern color ... 7-6');
				Kente.theSounds["7-6"].play();
				this.currentPlayingInstruction = Kente.theSounds["7-6"];
				Kente.theSounds["7-6"].onStop.addOnce(function(){
						this.resetAreYouThere();	
				},this);
				break;
			}
			case 7:{
				this.game.time.events.remove(this.timer_AreYouThere);
				console.log(':: Playing: There are six patterns to choose ... 8-0-1');
				Kente.theSounds["8-0-1"].play();
				this.currentPlayingInstruction = Kente.theSounds["8-0-1"];
				Kente.theSounds["8-0-1"].onStop.addOnce(function(){
					console.log(':: Playing: Tap tap the shuttle to start .. 8-0-2');
					Kente.theSounds["8-0-2"].play();
					this.currentPlayingInstruction = Kente.theSounds["8-0-2"];
					Kente.theSounds["8-0-2"].onStop.addOnce(function(){	
						this.resetAreYouThere();	
					}, this);
				},this);
				break;
			}
			case 8:{
				this.game.time.events.remove(this.timer_AreYouThere);
				console.log(':: Playing: Remember to move beater up .. 8-3');
				Kente.theSounds["8-3"].play();
				this.currentPlayingInstruction = Kente.theSounds["8-3"];
				Kente.theSounds["8-3"].onStop.addOnce(function(){
					this.resetAreYouThere();
				},this);
				break;
			}
			case 9:{
				console.log(':: Playing are you there');
				Kente.theSounds['1-1'].play(); //are you there
				this.currentPlayingInstruction = Kente.theSounds["1-1"];
				break;
			}
			case 10:{
				this.game.time.events.remove(this.timer_AreYouThere);
				console.log(':: Playing: You will need to move the beater down .. 8-2');
				Kente.theSounds["8-2"].play();
				this.currentPlayingInstruction = Kente.theSounds["8-2"];
				Kente.theSounds["8-2"].onStop.addOnce(function(){
					this.resetAreYouThere();
				},this);
				break;
			}
			case 11:{
				this.game.time.events.remove(this.timer_AreYouThere);
				console.log(':: Playing: Well Now.. thats an interesting pattern .. 9-0-1');
				Kente.theSounds["9-0-1"].play();
				this.currentPlayingInstruction = Kente.theSounds["9-0-1"];
				Kente.theSounds["9-0-1"].onStop.addOnce(function(){
					console.log(':: Playing: The museum of anthropology is collecting .. 9-0-2');
					Kente.theSounds["9-0-2"].play();
					this.currentPlayingInstruction = Kente.theSounds["9-0-2"];
					Kente.theSounds["9-0-2"].onStop.addOnce(function(){	
						console.log(':: Playing: If you would like to share.. or finish .. 9-0-3');
						Kente.theSounds["9-0-3"].play();
						this.currentPlayingInstruction = Kente.theSounds["9-0-3"];
						Kente.theSounds["9-0-3"].onStop.addOnce(function(){	
							this.resetAreYouThere();	
						}, this);
					}, this);
				},this);
				break;
			}
			case 12:{
				this.game.time.events.remove(this.timer_AreYouThere);
				console.log(':: Playing: Thanks for sharing .. 10');
				Kente.theSounds["10"].play();
				this.currentPlayingInstruction = Kente.theSounds["10"];
				Kente.theSounds["10"].onStop.addOnce(function(){
					console.log(':: Playing: We hope you enjoyed learning .. 11-0-1');
					Kente.theSounds["11-0-1"].play();
					this.currentPlayingInstruction = Kente.theSounds["11-0-1"];
					Kente.theSounds["11-0-1"].onStop.addOnce(function(){
						console.log(':: Playing: Enjoy the rest of your visit at MOA .. 11-0-2');
						Kente.theSounds["11-0-2"].play();
						this.currentPlayingInstruction = Kente.theSounds["11-0-2"];
						Kente.theSounds["11-0-2"].onStop.addOnce(function(){
							this.resetAreYouThere();
						},this);
					},this);
				},this);
				break;
			}
			case 13:{
				this.game.time.events.remove(this.timer_AreYouThere);
				console.log(':: Playing: We hope you enjoyed learning .. 11-0-1');
				Kente.theSounds["11-0-1"].play();
				this.currentPlayingInstruction = Kente.theSounds["11-0-1"];
				Kente.theSounds["11-0-1"].onStop.addOnce(function(){
					console.log(':: Playing: Enjoy the rest of your visit at MOA .. 11-0-2');
					Kente.theSounds["11-0-2"].play();
					this.currentPlayingInstruction = Kente.theSounds["11-0-2"];
					Kente.theSounds["11-0-2"].onStop.addOnce(function(){
						this.resetAreYouThere();
					},this);
				},this);
				break;
			}
		}
	},
	getColorCode: function(colorWord){
		if(colorWord == 'red') return '0xf44f45';
		if(colorWord == 'blue') return '0x1a7df5';
		if(colorWord == 'green') return '0x00f990';
		if(colorWord == 'yellow') return '0xf7c73e';
	}

}

