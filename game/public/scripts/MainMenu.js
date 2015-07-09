Kente.MainMenu = function (game) {
	var here = this;
	this.music = null;
	this.playButton = null;
	//Sockets Test this design pattern is not being used right now
	this.socket = Kente.socket;		
};

Kente.MainMenu.prototype = {

	create: function () {
		console.log('::MainMenu Loaded');
		
		Kente.removeAllSocketListeners();
		var self = this;
		Kente.socket.on('threadTouch', function (data) {
	    	console.log(data);
	    	//self.threadTouched(data);
	 	});
	 	Kente.socket.on('patternSaved', function (data) {
	    	console.log(data);
	 	});
	 	//Send Screenshot
		var keyScreenshot = this.game.input.keyboard.addKey(Phaser.Keyboard.S);
    	keyScreenshot.onDown.add(function(){Kente.postImage(this.game)}, this);

		//this.game.time.events.add(Phaser.Timer.SECOND * 4, this.emitSomething, this);

		Kente.background = this.make.sprite(0,0,'background');
		this.add.existing(Kente.background);
		// console.log(Kente.background);

		//WELCOME MESSAGE
		var style = { font: "65px Arial", fill: "#ffffff", align: "center" };
	    var text = this.add.text(this.world.centerX, this.world.centerY, "- Kente inspired -\npattern generator\nby Sensate", style);
	    text.anchor.set(0.5);
	    
	    Kente.background.inputEnabled = true;
		Kente.background.events.onInputDown.add(this.startSlideShow, this);

	},

	update: function(){
		
	}, 
	shutdown: function(){
		console.log(this);
		// this.game.world.removeAll();
	},
	/////////////////////////////////////////////////////
	startSlideShow: function(){
		
		this.game.state.start('SlideShow', true, false);
	},
	threadTouched: function(data){
		this.startSlideShow();
		
	},
	postImage: function(){
		Kente.postImage(this.game);

		
		// var image64 = this.game.canvas.toDataURL('image/png');
		// // console.log(image64);
		// $.ajax({
		//     url: 'http://localhost:3000/kente',
		//     dataType: 'json',
		//     type: 'post',
		//     contentType: 'application/json',
		//     data: JSON.stringify( { "image64": image64}),
		//     processData: false,
		//     success: function( data, textStatus, jQxhr ){
		//         console.log(JSON.stringify( data ) );
		//     },
		//     error: function( jqXhr, textStatus, errorThrown ){
		//         console.log( errorThrown );
		//     }
		// });
	}
};
