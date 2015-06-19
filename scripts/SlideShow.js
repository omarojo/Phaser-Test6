Kente.SlideShow = function (game) {

	this.slides = [];
	this.photos;
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
		//this.add.sprite(0,0,'background');
		this.add.existing(Kente.background);
		Kente.background.events.onInputDown.removeAll(); //removes all events (the click event)
	    //Position all Photos
	    // var slide1 = this.add.sprite(0,0, 'slide6');
	    // slide1.scale.set(2.0);
	    // this.add.tween(slide1.scale).to( { x: 2, y: 2 }, 2000, Phaser.Easing.Linear.None, true);
	    // var slide2 = this.add.sprite(0,0, 'slide2');
	    // var slide3 = this.add.sprite(0,0, 'slide3');
	    // var slide4 = this.add.sprite(0,0, 'slide4');
	    // var slide5 = this.add.sprite(0,0, 'slide5');
	    // var slide6 = this.add.sprite(0,0, 'slide6');

	    this.photos = this.add.group();
	    
	    for(var i=0;i<6;i++){
	    	var slide = this.make.sprite(this.game.world.centerX,this.game.world.centerY,'slide'+(i+1));
	    	slide.anchor.x = 0.5; slide.anchor.y = 0.5;
	    	this.photos.addChild(slide);
	    	slide.width = this.game.world._width+300;
	    	slide.height = this.game.world._height+300;
	    	slide.twAlpha = this.add.tween(slide).to( { alpha: 0 }, 3000, "Linear",undefined,3000);
	    	var x = Phaser.Utils.randomChoice(100, -100);
	    	var y = Phaser.Utils.randomChoice(100, -100);
	    	slide.twPos = this.add.tween(slide).to( { x: slide.x+x, y:slide.y+y }, 8000, Phaser.Easing.Sinusoidal.Out, true, 0,-1, true);
	    	slide.twAlpha.onComplete.add(this.reStack, this);
	    	
	    	this.slides[i] = slide;
	    };

	    this.slides[5].twAlpha.start();
	    this.slides[5].twPos.start();
	    // this.slides[5].tw2.start();
	    console.log(this.slides);
		
		var style = { font: "65px Arial", fill: "#ff0044", align: "center" };
	    var text = this.game.add.text(this.game.world.centerX, this.game.world.centerY, "Pull a String \nto begin", style);
	    text.anchor.set(0.5);

	    var button = new Phaser.Sprite(this.game,1000,1400,'btn');
	    this.add.existing(button);
	    button.inputEnabled = true;
	    button.events.onInputDown.add(this.crop,this);

	},
	update: function(){
		// this.slides.forEach(function(item){
		// 	item.x -= 10;
		// });
	},
	crop:function(){
		var copyText = this.photos.generateTexture(1,this.game.renderer);
	    var copy = new Phaser.Sprite(this.game,0,0,copyText);
	    var graph = new Phaser.Rectangle(0,0, 1200,1920);
	    copy.cropRect = graph;
	    copy.updateCrop();
	    copy.scale.setTo (0.5,0.5);
	    
	 //    copy.inputEnabled = true;
		// copy.events.onInputDown.add(this.crop, this);

	    this.add.existing(copy);
	},
	reStack: function(){
		this.photos.sendToBack(this.photos.getTop());
		this.photos.getBottom().alpha = 1;
		this.photos.getTop().twAlpha.start();
	}
};
