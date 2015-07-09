ThreadGroup = function (game, liftedThreads, color, isPatternThread) {
	Phaser.Group.call(this, game, null); //pass second parameter as null if you need the group not be added to the game automatically
	this.thegame = game;
	this.chunks = [];
	if(isPatternThread != undefined) this.isPatternThread = isPatternThread; else
	this.isPatternThread = false; //is this the lower thread or the upper thread ?
	
	this.chunksGroup = game.make.group();
	//Add the weft threads on group
	for(var i= 0; i<19; i++){
		if(i==0 || i==18){ //First and last long Chunks
			var x = (i == 0 ? 0 : game.world.centerX+127);
			// this.chunks[i] = this.chunksGroup.create(x,1250,'weftChunk_large');
			this.chunks[i] = this.chunksGroup.create(x,0,'weftChunk_large');
		}
		else{ //Normal chunk
			// this.chunks[i] = this.create((i*15)+game.world.centerX-142, 1250, 'weftChunk');
			this.chunks[i] = this.chunksGroup.create((i*15)+game.world.centerX-142, 0, 'weftChunk');
		}
		this.chunks[i].tint = color;
		
		//this.chunksGroup.addChild(this.chunks[i]);
	}
	//Make the chunks transparent acoording to the lifted threads
	if(liftedThreads != undefined){
			console.log(liftedThreads);
			if(this.isPatternThread){ //Thransparent chunks for the UPPER Thread
				console.log('Im thread 2');
				for(var i=1; i<=18; i++){ 
					if(i%2 != 0) this.chunks[i].alpha = 0.0;
					if(liftedThreads.indexOf(i) != -1) // is in array
					{
						this.chunks[i].alpha = 1.0;
					}
				}
			}else{ //Transparent chunks for the LOWER thread
				console.log('Im thread 1');
				for(var i=0; i<liftedThreads.length; i++){
					//console.log(liftedThreads[i]);
					var t = liftedThreads[i];
					var y = t + (t-1);
					this.chunks[y].alpha = 0.0;	
				}	
			}
			
	}
	
	this.addChild(this.chunksGroup);

	this.mask = game.make.graphics(game.world.width+50, 0);
	    this.mask.beginFill(0xffffff); //	Shapes drawn to the Graphics object must be filled.
	    this.mask.drawRect(0, 0, this.game.world.width+466, this.game.world.height);
	    this.addChild(this.mask);
	    this.chunksGroup.mask = this.mask;
};

ThreadGroup.prototype = Object.create(Phaser.Group.prototype);
ThreadGroup.prototype.constructor = ThreadGroup;

ThreadGroup.prototype.glowThread = function(threadnum, status){
	
}
ThreadGroup.prototype.revealToLeft = function(){
	var maskTween = this.thegame.add.tween(this.mask).to( { x: -466 }, 2000, Phaser.Easing.Quadratic.InOut, true, 200);
}
ThreadGroup.prototype.revealToRight = function(){
	this.mask.x = -this.mask.width; //First move the mask all the way to the left outside screen, because its default position is on the right
	//Then we animate it back to the right
	var maskTween = this.thegame.add.tween(this.mask).to( { x: this.game.world.width }, 2000, Phaser.Easing.Quadratic.InOut, true, 200);
}




















