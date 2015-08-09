Kente.SlideShow = function (game) {
	var self = this;
	this.slides = []; //Array of slides
	this.photos; //Group container, has all the slide objects for rendering

	this.upperContainer;
	this.lowerContainer;
};

Kente.SlideShow.prototype = {
	preload: function(){
		this.game.stage.disableVisibilityChange = true;
		this.load.image('slide1', 'assets/slide1.png');
		this.load.image('slide2', 'assets/slide2.png');
		this.load.image('slide3', 'assets/slide3.png');
		this.load.image('slide4', 'assets/slide4.png');
		this.load.image('slide5', 'assets/slide5.png');
		// this.load.image('slide6', 'assets/slide6.png');
	},
	create: function () {
		console.log('::SlideShow Loaded');
		// Kente.socket.removeAllListeners('threadTouch'); //Remove all previous listeners
		Kente.removeAllSocketListeners();
		var self = this;
		Kente.socket.on('threadTouch', function(data){
			self.threadTouched(data);
		});
		
		//Canisters
		this.keyQ = this.game.input.keyboard.addKey(Phaser.Keyboard.Q);
	    this.keyQ.onDown.add(this.threadTouched, this);
	    this.keyW = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
	    this.keyW.onDown.add(this.threadTouched, this);
	    this.keyE = this.game.input.keyboard.addKey(Phaser.Keyboard.E);
	    this.keyE.onDown.add(this.threadTouched, this);
	    this.keyR = this.game.input.keyboard.addKey(Phaser.Keyboard.R);
	    this.keyR.onDown.add(this.threadTouched, this);

	    //Shuttle
	    this.keyZ = this.game.input.keyboard.addKey(Phaser.Keyboard.Z);
	    this.keyZ.onDown.add(this.threadTouched, this);

	    //Beater Down
	    this.keyB = this.game.input.keyboard.addKey(Phaser.Keyboard.B);
	    this.keyB.onDown.add(this.threadTouched, this);

	    //Beater Up
	    this.keyU = this.game.input.keyboard.addKey(Phaser.Keyboard.U);
	    this.keyU.onDown.add(this.threadTouched, this);


	    //Send Screenshot
		var keyScreenshot = this.game.input.keyboard.addKey(Phaser.Keyboard.S);
    	keyScreenshot.onDown.add(this.crop, this);

		//this.add.sprite(0,0,'background');
		// this.add.existing(Kente.background);
		//Kente.background.events.onInputDown.removeAll(); //removes all events (the click event)
		this.add.sprite(0,0,'background');
		this.add.sprite(0,0,'kente_bg');
		//CONTAINERa SETUP
		this.upperContainer = this.add.group();
		this.lowerContainer = this.add.group();

		

		//Upper Mask
		var mask = this.game.add.graphics(0, 0);
	    mask.beginFill(0xffffff); //	Shapes drawn to the Graphics object must be filled.
	    // mask.drawRect(0, 0, this.game.world.width, this.game.world.height/2+49);
	    mask.drawRect(0, 0, this.game.world.width, this.game.world.height);
	    this.upperContainer.mask = mask;

	    // TEXT
	   	var style = { font: "50px Arial", fill: "#ffffff", align: "center" };
	    this.welcomeText = this.game.add.text(this.game.world.centerX, 500, "Touch any canister\nto create your own Kente-inspired pattern", style);
	    this.welcomeText.anchor.set(0.5);

	    
	    this.photos = this.add.group();
	    this.upperContainer.addChild(this.photos);

	    //LOWER CONTAINER
	    this.lowerContainer.y = this.game.world.height-50//this.game.world.centerY;
	    //Upper container bg
		// this.lowerContainer.create(0,905,'wooden_divider');
		this.lowerContainer.create(0,52,'halfbg');
		this.lowerContainer.create(0,-52,'wooden_divider');

	    // var warpPlahceholderSprite = this.game.make.sprite(0,0,'warp_placeholder');
	    // this.lowerContainer.addChild(warpPlahceholderSprite); 

	    for(var i=0;i<5;i++){
	    	var slide = this.make.sprite(this.game.world.centerX,this.game.world.centerY,'slide'+(i+1));
	    	slide.anchor.x = 0.5; slide.anchor.y = 0.5;
	    	this.photos.addChild(slide);
	    	// slide.width = this.game.world._width+300;
	    	// slide.height = this.game.world._height+300;
	    	slide.twAlpha = this.add.tween(slide).to( { alpha: 0 }, 3000, "Linear",undefined,3000);
	    	var x = Phaser.Utils.randomChoice(100, -100);
	    	var y = Phaser.Utils.randomChoice(100, -100);
	    	slide.twPos = this.add.tween(slide).to( { x: slide.x+x, y:slide.y+y }, 8000, Phaser.Easing.Sinusoidal.Out, true, 0,-1, true);
	    	slide.twAlpha.onComplete.add(this.reStack, this);
	    	
	    	this.slides[i] = slide;
	    };

	    this.slides[4].twAlpha.start();
	    this.slides[4].twPos.start();
	    // console.log(this.slides);
		


		//ADD THE WARP... although in this scene it is not used.
		this.warp = new WarpGroup(this.game);
		this.warp.y = -958;
		this.lowerContainer.addChild(this.warp);

	    // Instructional Timer 1 
	    // Kente.sounds[0].active = false;
	},
	update: function(){
		//Replay Instruction #1 every 5 seconds
		// if(!Kente.sounds[0].isPlaying && Kente.sounds[0].active == false){
		// 	Kente.sounds[0].active = true;
		// 	console.log(':: Will Play Instruction 1 in 5 secs');
		// 	this.game.time.events.add(5000,function (){
		// 			this.playInstructionAudio(0);
		// 	}, this);
		// }
	},
	threadTouched: function(data){
		console.log(data);
		
		var tween = this.add.tween(this.lowerContainer).to({y: this.game.world.centerY},2000,Phaser.Easing.Quadratic.InOut, true, 200);
		tween.onComplete.add(function(){
			this.add.tween(this.welcomeText).to({alpha: 0},1000,Phaser.Easing.Quadratic.InOut, true, 200);	
			this.add.tween(this.upperContainer).to({alpha: 0},1000,Phaser.Easing.Quadratic.InOut, true, 200).onComplete.add(function(){
				// this.game.state.start('Tutorial', true, false);	
				this.game.state.start('Tutorial', true, false);	
			},this);
			

			
		},this);
	},
	crop:function(){
		// var second_game = new Phaser.Game(175, 300, Phaser.CANVAS, 'second_game');
  //       second_game.preserveDrawingBuffer = true;

		// var copyText = this.photos.generateTexture(1,this.game.renderer);
	 //    var copy = new Phaser.Sprite(second_game,0,0,copyText);
	 //    var graph = new Phaser.Rectangle(0,0, 175,300);
	 //    copy.cropRect = graph;
	 //    copy.updateCrop();
	 //    // copy.scale.setTo (0.5,0.5); //Scale the sprite, this could be useful later
	    
	 //    // copy.inputEnabled = true;
		// // copy.events.onInputDown.add(this.crop, this);

		
	 //    second_game.add.existing(copy);

	 	console.log('CROPPING SCREENSHOT');
	    // this.postImage(second_game);


	},
	reStack: function(){
		this.photos.sendToBack(this.photos.getTop());
		this.photos.getBottom().alpha = 1;
		this.photos.getTop().twAlpha.start();
	},
	playInstructionAudio: function(id){
		switch (id){
			case 0:{
				// Kente.sounds[0].play();
				// Kente.sounds[0].active = false;
				break;
			}
		}

	},
	postImage: function(s_game){
		var image64 = s_game.canvas.toDataURL('image/png');
		console.log(image64);
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
