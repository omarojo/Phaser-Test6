Kente.MainMenu = function (game) {
	var here = this;
	this.music = null;
	this.playButton = null;
	//Sockets Test
	this.socket = Kente.socket;	

	this.socket.on('threadTouch', function (data) {
    	console.log(data);
    	here.threadTouched(data);
 	});
};

Kente.MainMenu.prototype = {

	create: function () {
		console.log('::MainMenu Loaded');
		Kente.removeAllSocketListeners();
		
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
		
	}
};
