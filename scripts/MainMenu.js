Kente.MainMenu = function (game) {

	this.music = null;
	this.playButton = null;
};

Kente.MainMenu.prototype = {

	create: function () {
		console.log('::MainMenu Loaded');
		Kente.background =  this.add.sprite(0,0,'background');

		//WELCOME MESSAGE
		var style = { font: "65px Arial", fill: "#ff0044", align: "center" };
	    var text = this.add.text(this.world.centerX, this.world.centerY, "- Fabric -\nwith a sprinkle of\nSensate", style);
	    text.anchor.set(0.5);
	    Kente.background.inputEnabled = true;
		Kente.background.events.onInputDown.add(this.startSlideShow, this);

	},

	update: function(){
		
	}, 
	shutdown: function(){
		console.log(this);
		this.game.world.removeAll();
	},
	/////////////////////////////////////////////////////
	startSlideShow: function(){
		
		this.game.state.start('SlideShow', false, false);
	}
};
