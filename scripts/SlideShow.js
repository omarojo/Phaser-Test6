Kente.SlideShow = function (game) {

	this.slides = [];
};

Kente.SlideShow.prototype = {
	preload: function(){
		this.load.image('slide1', 'assets/slide1.jpg');
		this.load.image('slide2', 'assets/slide2.jpg');
		this.load.image('slide3', 'assets/slide3.jpg');
		this.load.image('slide4', 'assets/slide4.jpg');
		this.load.image('slide5', 'assets/slide5.jpg');
		this.load.image('slide6', 'assets/slide6.jpg');
	},
	create: function () {
		console.log('::SlideShow Loaded');
		this.add.sprite(0,0,'background');

		//WELCOME MESSAGE
		var style = { font: "65px Arial", fill: "#ff0044", align: "center" };
	    var text = this.add.text(this.world.centerX, this.world.centerY, "- phaser -\nwith a sprinkle of\npixi dust", style);
	    text.anchor.set(0.5);

	    //Position all Photos
	    // var slide1 = this.add.sprite(0,0, 'slide6');
	    // slide1.scale.set(2.0);
	    // this.add.tween(slide1.scale).to( { x: 2, y: 2 }, 2000, Phaser.Easing.Linear.None, true);
	    // var slide2 = this.add.sprite(0,0, 'slide2');
	    // var slide3 = this.add.sprite(0,0, 'slide3');
	    // var slide4 = this.add.sprite(0,0, 'slide4');
	    // var slide5 = this.add.sprite(0,0, 'slide5');
	    // var slide6 = this.add.sprite(0,0, 'slide6');

	    for(var i=0;i<6;i++){
	    	var slide = this.add.sprite((i*1200),0,'slide'+(i+1));
	    	slide.width = this.game.world._width;
	    	slide.height = this.game.world._height; 
	    	this.slides[i] = slide;
	    }
	},

	update: function(){
		this.slides.forEach(function(item){
			item.x -= 10;
		});
	}
};
