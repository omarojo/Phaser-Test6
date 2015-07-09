InstructionsGroup = function (game, text, fontsize) {
	Phaser.Group.call(this, game); //pass second parameter as null if you need the group not be added to the game automatically
	//this.anchor.set = 0.5;
	this.text = text;
	
	

	var style = { font: fontsize+"px Arial", fill: "#fffeee", align: "center", wordWrap: true, wordWrapWidth: 550};
	this.label = game.make.text(game.world.centerX, 0, this.text, style);
	this.label.anchor.set(0.5);
	this.label.y = this.label.height/2+10;
	
	this.x = 0;//game.world.centerX - this.label.width/2;
	this.y = -(this.label.height+100);
	// this.angle = 45;

	// this.addChild(sprite);
};

InstructionsGroup.prototype = Object.create(Phaser.Group.prototype);
InstructionsGroup.prototype.constructor = InstructionsGroup;

InstructionsGroup.prototype.present = function(){
	// var sprite = this.create(0, 0, 'shuttle_vector');

	var graphics = this.game.make.graphics(0, 0);

    // graphics.lineStyle(2, 0xffd900, 1);
    graphics.beginFill(0x0000000, 0.5);
    graphics.lineStyle(2, 0xfffeee, 1.0); //width, color, alpha
    graphics.drawRect(this.game.world.centerX-(this.label.width+100)/2, 0, this.label.width+100, this.label.height+20);
    this.add(graphics);
    this.add(this.label);

    this.game.add.tween(this).to({y:300},2000,Phaser.Easing.Sinusoidal.InOut, true, 0, 0, false);
    // this.game.add.tween(this).to({angle:0},2000,Phaser.Easing.Sinusoidal.InOut, true, 0, 0, false);
}