// VIDEO PLAYER

Kente.VideoPlayer = function(game){
	
};

Kente.VideoPlayer.prototype = {
	preload: function(){
		// game.load.video('kentevideo', 'assets/kente_video.mp4');
	},
	create: function(){
		this.video = this.game.add.video('kentevideo');

	    //  See the docs for the full parameters
	    //  But it goes x, y, anchor x, anchor y, scale x, scale y
	    this.video.addToWorld(this.game.world.centerX, this.game.world.centerY, 0.5, 0.5, 1, 1);

	    this.counter = 0;
	    //  true = loop
	    this.video.play(false);
	    var self = this;
	    this.video.onComplete.addOnce(function(){
	    	self.video.play(false);
	    	self.video.onComplete.addOnce(function(){
	    		console.log('>> VIDEO ENDED for Second Time');
		    		self.goToGame();
	    	});

	    	
	    });
	},
	update: function(){

	},
	goToGame: function(){
		this.game.state.start('Game', true, false);
	}
}