ThreadGroup = function (game, liftedThreads, color, isPatternThread) {
	Phaser.Group.call(this, game, null); //pass second parameter as null if you need the group not be added to the game automatically
	// console.log("ESTOY SIENDO CREADO");
	this.thegame = game;
	this.isTight = false;
	this.isWeaving = false;
	this.chunks = [];
	this.visibleUpperThreads = [];
	if(isPatternThread != undefined) this.isPatternThread = isPatternThread; else
	this.isPatternThread = false; //is this the lower thread or the upper thread ?
	

	this.chunksGroup = game.make.group();
	//Add the weft threads on group
	for(var i= 0; i<19; i++){
		if(i==0 || i==18){ //First and last long Chunks
			var x = (i == 0 ? 0 : game.world.centerX+WarpGroup.warpWidth/2);
			
			this.chunks[i] = this.chunksGroup.create(x,0,'weftChunk_large');
			this.chunks[i].width = game.world.centerX-WarpGroup.warpWidth/2;	
			 this.chunks[i].height = WarpGroup.threadWidth;
		}
		else{ //Normal chunk
			// i-1 because the little chunks start at 1 and not 0, 0 is the first large chunk
			this.chunks[i] = this.chunksGroup.create(((i-1)*WarpGroup.threadWidth)+(game.world.centerX-WarpGroup.warpWidth/2), 0, 'weftChunk');
			this.chunks[i].width = WarpGroup.threadWidth;
			this.chunks[i].height = WarpGroup.threadWidth;
			// this.chunks[i].tint = color;
			// this.chunks[i].blendMode = PIXI.blendModes.MULTIPLY;
		}
		this.chunks[i].tint = color;
		
		//this.chunksGroup.addChild(this.chunks[i]);
	}
	//Make the chunks transparent acoording to the lifted threads
	if(liftedThreads != undefined){
			console.log(">> Lifted Threads:" + liftedThreads);
			if(this.isPatternThread){ //Thransparent chunks for the UPPER Thread
				console.log('Im weft 2');
				for(var i=1; i<=18; i++){ //MAKE ALL THE PAIRs invisible
					if(i%2 != 0) {
						this.chunks[i].alpha = 0.0;
					}
				}
				for(var i=1; i<=18; i++){ //Make the selected threads visible
					if(liftedThreads.indexOf(i) != -1) // is in array
					{
						var y = i + (i-1);	
						// this.chunks[y].tint = Math.random() * 0xffffff;
						this.chunks[y].alpha = 1.0;
						this.visibleUpperThreads.push(this.chunks[y]); //Save the threads that are visble for later use in the hiding animation
						if((y+1) != 18 && (y-1) != 0 ){
							this.visibleUpperThreads.push(this.chunks[y+1]);
							this.visibleUpperThreads.push(this.chunks[y-1]);
						}
						this.chunks[y].tint = this.shadeColor(-0.1,color);
					}
				}
			}else{ //Transparent chunks for the LOWER thread
				console.log('Im weft 1');
				//Apply dark shade over ODD chunks
				for(var i=1;i<18;i++){
					if(i%2 !=0)
						this.chunks[i].tint = this.shadeColor(-0.1,color);
				}
				//Make transparent the proper cunks for LOWER thread
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
	    this.mask.drawRect(0, 0, this.game.world.width+672, this.game.world.height);
	    this.addChild(this.mask);
	    this.chunksGroup.mask = this.mask;
};

ThreadGroup.prototype = Object.create(Phaser.Group.prototype);
ThreadGroup.prototype.constructor = ThreadGroup;

ThreadGroup.prototype.glowThread = function(threadnum, status){
	
}
ThreadGroup.prototype.revealToLeft = function(){
	this.isWeaving = true;
	var maskTween = this.thegame.add.tween(this.mask).to( { x: -672 }, 700, Phaser.Easing.Quadratic.In, true, 200);
	maskTween.onComplete.addOnce(function(){
		this.isWeaving = false;
	},this);
}
ThreadGroup.prototype.revealToRight = function(){
	this.isWeaving = true;
	this.mask.x = -(this.game.world.width+672); //First move the mask all the way to the left outside screen, because its default position is on the right
	//Then we animate it back to the right
	var maskTween = this.thegame.add.tween(this.mask).to( { x: 0 }, 700, Phaser.Easing.Quadratic.In, true, 200);
	maskTween.onComplete.addOnce(function(){
		this.isWeaving = false;
	},this);
}
ThreadGroup.prototype.tightUpTo_Y = function(ypos, currentWovenThreads, parentWarp){
	
	if(this.isTight == false)//Thread is still up.. lets bring it down.
	{	
		var animDuration = 2000 - (currentWovenThreads/30)*2000;
		//Hide the lateral threads begining and end
			this.thegame.add.tween(this.chunks[18]).to( { alpha: 0 }, animDuration, Phaser.Easing.Quadratic.InOut, true, 200);	
			this.thegame.add.tween(this.chunks[0]).to( { alpha: 0 }, animDuration, Phaser.Easing.Quadratic.InOut, true, 200);	
		if(this.isPatternThread){
			for(i=0;i<19;i++){
				if(this.visibleUpperThreads.indexOf(this.chunks[i]) == -1){ //Is not there

					this.thegame.add.tween(this.chunks[i]).to( { alpha: 0 }, animDuration, Phaser.Easing.Quadratic.InOut, true, 200);	
				}
				
			}
		}
		var dTween = this.thegame.add.tween(this).to( { y: ypos }, animDuration, Phaser.Easing.Quadratic.InOut, true, 200);
		//Simulate a signal, and tell the WARP that the weaved thread has finished animating.
		//This is used at the end of the weaving process to start the replication of pattern on screen
		dTween.onComplete.add(function(){
			this.isTight = true;
			this.remove( this.chunks[0]); //no difference :()
			this.remove(this.mask); //this is making no difference I dont know why
			this.mask.destroy(); // no difference :(
			if(parentWarp != undefined && this.isPatternThread)
				parentWarp.threadFinishedWeaving();
		}, this);
	}

}

ThreadGroup.prototype.shadeColor = function(p,colorHex,c1){
	//0x63C6FF
	var c0 = '#'+colorHex.substring(2,8);
	var n=p<0?p*-1:p,u=Math.round,w=parseInt;
    if(c0.length>7){
        var f=c0.split(","),t=(c1?c1:p<0?"rgb(0,0,0)":"rgb(255,255,255)").split(","),R=w(f[0].slice(4)),G=w(f[1]),B=w(f[2]);
        return "rgb("+(u((w(t[0].slice(4))-R)*n)+R)+","+(u((w(t[1])-G)*n)+G)+","+(u((w(t[2])-B)*n)+B)+")"
    }else{
        var f=w(c0.slice(1),16),t=w((c1?c1:p<0?"#000000":"#FFFFFF").slice(1),16),R1=f>>16,G1=f>>8&0x00FF,B1=f&0x0000FF;
        return "0x"+(0x1000000+(u(((t>>16)-R1)*n)+R1)*0x10000+(u(((t>>8&0x00FF)-G1)*n)+G1)*0x100+(u(((t&0x0000FF)-B1)*n)+B1)).toString(16).slice(1)
    }
}


















