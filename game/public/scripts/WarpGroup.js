WarpGroup = function (game, tutorial) {
	if(tutorial != undefined ) this.isTutorial = tutorial; else this.isTutorial = false;
	var threadWidth = 25;//22; If you change this  value remember to change the WarpGroup.threadWidth value too.. scroll down in this file.
	var warpWidth = threadWidth * 17; //number of columns
	Phaser.Group.call(this, game, null); //pass second parameter as null if you need the group not be added to the game automatically
	this.thegame = game;
	this.threads = [];
	this.liftedThreads = [];
	this.requiredThreadsToWeave = 17; //number of threads to be weaved
	this.currentWovenThreads = 0;
	this.upperT = null; //The horizontal weaved thread
	this.lowerT = null; // The lower horizontal weaved thread, this are the ones that get tighten down in the warp
	this.weftWaitingTobeTighten = false;

	this.onReadyForReplication = new Phaser.Signal();

	if(this.isTutorial == true){ 
		this.requiredThreadsToWeave = 6
	}


	this.weftContainer = this.game.make.group();

	//Add Wood Piece marker
	var tiny_wood = this.game.make.sprite(this.game.world.centerX,this.game.world.centerY+ 500,'tiny_wood_piece');
	tiny_wood.anchor.set(0.5,0.5);
	this.addChild(tiny_wood);

	//Add the weft threads on screen
	for(var i= 0; i<9; i++){
		this.threads[i] = this.create((i*threadWidth*2)+(game.world.centerX-(warpWidth/2)), 
			1010, 'thread');
		this.threads[i].width = threadWidth;
	}
	this.add(this.weftContainer);
	// this.addChild(this.mainContainer);
	var sWidth = 672;
	var sHeight = 144;
	//Add the shuttle 1 on screen (THE LOWER one)
	this.shuttle1 = this.create(game.world.width, 1300, 'shuttle_vector');
	this.shuttle1.width = sWidth;
	this.shuttle1.height = sHeight;
	this.shuttle1.isRight = true;
	//Add the shuttle 2 on screen (THE UPPER one)
	this.shuttle2 = this.create(-this.shuttle1.width,1250, 'shuttle_vector');
	this.shuttle2.width = sWidth;
	this.shuttle2.height = sHeight;
	this.shuttle2.isRight = false;
	// this.shuttle2.tint = Math.random() * 0xffffff;

	//Counter
	var style = { font: "25px Arial", fill: "#fffeee", align: "center", wordWrap: true, wordWrapWidth: 550};
	this.tcounter = this.thegame.add.text(0, 0, "", style);
	this.tcounter.anchor.set(0.5);
	this.tcounter.y = 955;
	this.tcounter.x = this.game.world.centerX;
	this.tcounter.alpha = 0.0;
	// this.add(tcounter);


	//Temporal Keyboard triggers
	this.key1 = this.game.input.keyboard.addKey(Phaser.Keyboard.ONE);
	this.key1.onDown.add(function(){
		this.glowThread(0, true);
		this.liftedThreads.push(1);
	}, this);
	this.key1.onUp.add(function(){
		this.glowThread(0,false);
		this.removeLiftedThread(1);
	}, this);
	this.key2 = this.game.input.keyboard.addKey(Phaser.Keyboard.TWO);
	this.key2.onDown.add(function(){
		this.glowThread(1, true);
		this.liftedThreads.push(2);
	}, this);
	this.key2.onUp.add(function(){
		this.glowThread(1,false);
		this.removeLiftedThread(2);
	}, this);
	this.key3 = this.game.input.keyboard.addKey(Phaser.Keyboard.THREE);
	this.key3.onDown.add(function(){
		this.glowThread(2, true);
		this.liftedThreads.push(3);
	}, this);
	this.key3.onUp.add(function(){
		this.glowThread(2,false);
		this.removeLiftedThread(3);
	}, this);
	this.key4 = this.game.input.keyboard.addKey(Phaser.Keyboard.FOUR);
	this.key4.onDown.add(function(){
		this.glowThread(3, true);
		this.liftedThreads.push(4);
	}, this);
	this.key4.onUp.add(function(){
		this.glowThread(3,false);
		this.removeLiftedThread(4);
	}, this);
	this.key5 = this.game.input.keyboard.addKey(Phaser.Keyboard.FIVE);
	this.key5.onDown.add(function(){
		this.glowThread(4, true);
		this.liftedThreads.push(5);
	}, this);
	this.key5.onUp.add(function(){
		this.glowThread(4,false);
		this.removeLiftedThread(5);
	}, this);
	this.key6 = this.game.input.keyboard.addKey(Phaser.Keyboard.SIX);
	this.key6.onDown.add(function(){
		this.glowThread(5, true);
		this.liftedThreads.push(6);
	}, this);
	this.key6.onUp.add(function(){
		this.glowThread(5,false);
		this.removeLiftedThread(6);
	}, this);
	this.key7 = this.game.input.keyboard.addKey(Phaser.Keyboard.SEVEN);
	this.key7.onDown.add(function(){
		this.glowThread(6, true);
		this.liftedThreads.push(7);
	}, this);
	this.key7.onUp.add(function(){
		this.glowThread(6,false);
		this.removeLiftedThread(7);
	}, this);
	this.key8 = this.game.input.keyboard.addKey(Phaser.Keyboard.EIGHT);
	this.key8.onDown.add(function(){
		this.glowThread(7, true);
		this.liftedThreads.push(8);
	}, this);
	this.key8.onUp.add(function(){
		this.glowThread(7,false);
		this.removeLiftedThread(8);
	}, this);
	this.key9 = this.game.input.keyboard.addKey(Phaser.Keyboard.NINE);
	this.key9.onDown.add(function(){
		this.glowThread(8, true);
		this.liftedThreads.push(9);
	}, this);
	this.key9.onUp.add(function(){
		this.glowThread(8,false);
		this.removeLiftedThread(9);
	}, this);
	
};

WarpGroup.prototype = Object.create(Phaser.Group.prototype);
WarpGroup.prototype.constructor = WarpGroup;

WarpGroup.threadWidth = 25;
WarpGroup.warpWidth = WarpGroup.threadWidth * 17;

WarpGroup.prototype.threadTouched = function(data){
	if(data.state == 'held'){
		this.glowThread(data.thread-1, true);
		this.liftedThreads.push(data.thread);
	}else if(data.state == 'loose'){
		this.glowThread(data.thread-1,false);
		this.removeLiftedThread(data.thread);
	}
}
WarpGroup.prototype.glowThread = function(threadnum, status){
	if(threadnum >= 0 && threadnum <= this.threads.length){
		if(status == true){
			// this.threads[threadnum].blendMode = PIXI.blendModes.ADD;}
			this.threads[threadnum].tint = '0xbce7f4';
		}
		else{
			// this.threads[threadnum].blendMode = PIXI.blendModes.NORMAL;	
			this.threads[threadnum].tint = '0xFFFFFF'; //white
		}
	}
}
WarpGroup.prototype.blinkThreads = function(threads){
	for(var i=0; i<this.threads.length; i++){
		if(this.threads[i].blinkTween != undefined) this.threads[i].blinkTween.stop();
	}
	if(threads.length > 0){
		for(var i=0; i<threads.length ; i++){
			//properties, duration, ease, autoStart, delay, repeat, yoyo
			this.threads[threads[i]].blinkTween = this.game.add.tween(this.threads[threads[i]]).to({alpha: 0.3},
				1000,Phaser.Easing.Linear.None,true,0, 1000).yoyo(true);
		}
	}
}
WarpGroup.prototype.stopBlinkingAllThreads = function(){
	for(var i=0; i<this.threads.length; i++){
		if(this.threads[i].blinkTween != undefined){
			this.threads[i].blinkTween.stop();
			this.threads[i].alpha = 1.0;
		};
	}
}
WarpGroup.prototype.sendShuttles = function(liftedThreads, colors){
	console.log("Sending shuttles");
	if(this.shuttle1.isRight == true && this.currentWovenThreads <this.requiredThreadsToWeave && this.weftWaitingTobeTighten == false){ //With this, we prevent the user from overlaping thread animations
		var lockedLiftedThreads = [];
		for (var i=0; i<this.liftedThreads.length; i++ ){
			lockedLiftedThreads[i] = this.liftedThreads[i];
		}
		// var lockedLiftedThreads = this.liftedThreads; //Lets lock the threads that are liften when the shuttle was pressed
		//Draw the Thread #1
		var thread_low = new ThreadGroup(this.thegame, lockedLiftedThreads, this.getColorCode(colors[0]));
		this.shuttle1.loadTexture(colors[0]);
		thread_low.y = this.shuttle1.y + this.shuttle1.height/2; 
		this.weftContainer.addChild(thread_low);
		thread_low.revealToLeft();

		this.lowerT = thread_low;
		//Bring Shuttle to front
		// var ind = this.getChildIndex(thread_low);
		// this.setChildIndex(this.shuttle1,ind);
		// this.setChildIndex(this.shuttle1,this.children.length-1);


		this.shuttle1.isRight = false;
		//Animate shuttle 1 to the left
		tween1 = this.thegame.add.tween(this.shuttle1).to( { x: this.shuttle2.x }, 700, Phaser.Easing.Quadratic.In, true);
		tween1.onComplete.addOnce(function(){
			//Draw the Thread #2
			var thread_upper = new ThreadGroup(this.thegame, lockedLiftedThreads, this.getColorCode(colors[1]), true);
			this.shuttle2.loadTexture(colors[1]);
			thread_upper.y = this.shuttle2.y + this.shuttle1.height/2; 
			this.weftContainer.addChild(thread_upper);
			thread_upper.revealToRight();
			this.upperT = thread_upper;
			//Bring Shuttle to front
			// var ind = this.getChildIndex(thread_upper);
			// this.setChildIndex(this.shuttle2,this.children.length-1);

			//Animate shuttle 2 to the right
			tween2 = this.thegame.add.tween(this.shuttle2).to( { x: this.thegame.world.width }, 700, Phaser.Easing.Quadratic.In, true);
			tween2.onComplete.addOnce(function(){
				this.shuttle1.x = this.thegame.world.width;
				this.shuttle2.x = -this.shuttle2.width;

				this.shuttle1.isRight = true;
				this.shuttle2.isRight = false;
				
				this.currentWovenThreads++;
				this.weftWaitingTobeTighten = true;
			}, this);
		},this);	
	}
}
WarpGroup.prototype.tightWeft = function(){
	if(this.upperT != null){
		console.log(this.upperT.isWeaving);
		console.log(this.weftWaitingTobeTighten);
		if(this.upperT.isTight == false ){//&& this.upperT.isWeaving == false){
			this.tcounter.text = this.currentWovenThreads + "/" + this.requiredThreadsToWeave;
			var ypos = this.thegame.world.height-(WarpGroup.threadWidth*this.currentWovenThreads);
			//Tight up the 2 threads
			this.upperT.tightUpTo_Y(ypos, this.currentWovenThreads, this);
			this.lowerT.tightUpTo_Y(ypos, this.currentWovenThreads, this);

			this.weftWaitingTobeTighten = false;
		}
	}else console.log('>> Weft is already tighten');
}
WarpGroup.prototype.threadFinishedWeaving = function(){
	console.log('Finished weaving thread');
	//Lets check if the users has finished weaving all the required threads
	
	if(this.currentWovenThreads == this.requiredThreadsToWeave){
		this.onReadyForReplication.dispatch();
		// this.replicatePattern();
	}

	// if(this.currentWovenThreads == this.requiredThreadsToWeave){
	// 	//Tell the parent, that we are done and we can now replicate on screen a will.
	// 	if(this.myparent != undefined){
	// 		if(typeof this.myparent.readyForReplication === 'function') {
	// 		    this.myparent.readyForReplication();
	// 		} else if (typeof this.myparent.readyForReplication === 'undefined') {
	// 		    alert("It's undefined");
	// 		} else {
	// 		    alert("It's neither undefined nor a function. It's a " + typeof myObj.prop2);
	// 		}
	// 	}
		
	//  }
}
WarpGroup.prototype.replicatePattern = function(){
	if(this.currentWovenThreads == this.requiredThreadsToWeave){
		console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>\n>>>> Generating REPLICATION >>>>>>>>>");
		var upperSpaceHeight = (this.game.world.height/2 - 52);

		var maskedContainerGroup = this.game.make.group();
		var mask = this.game.make.graphics(0, 0);
	    mask.beginFill(0xffffff); //	Shapes drawn to the Graphics object must be filled.
	    mask.drawRect(0, 0, this.game.world.width, upperSpaceHeight);
	    maskedContainerGroup.addChild(mask);
	    maskedContainerGroup.mask = mask;


		var copyText = this.weftContainer.generateTexture(1,this.game.renderer);
		// var copyText = this.game.world.generateTexture(1,this.game.renderer);
	    var copy = new Phaser.Sprite(this.game,0,0,copyText);
	    // var graph = new Phaser.Rectangle(this.thegame.world.centerX-(WarpGroup.warpWidth/2),0, WarpGroup.warpWidth , this.height);
	    // var graph = new Phaser.Rectangle(1085,0, WarpGroup.warpWidth , this.height);
	    var heightOfPatternSection = WarpGroup.threadWidth * this.currentWovenThreads;
	    var graph = new Phaser.Rectangle(387,0, WarpGroup.warpWidth , heightOfPatternSection);
	    copy.cropRect = graph;
	    copy.updateCrop();
	    // copy.scale.setTo (0.5,0.5); //Scale the sprite, this could be useful later
	    
	    // copy.inputEnabled = true;
		// copy.events.onInputDown.add(this.crop, this);
		

		var w = this.game.world.width/5;
		var h = upperSpaceHeight/3; //52 is half the wooden sprite

		if(!this.isTutorial){
			copy.height = h;
			copy.width = w;
		}
		var cTexture = copy.generateTexture(1,this.game.renderer);
		
		// if(!this.isTutorial){
		// 	for(var i=0; i<5; i++){
		// 		var x = i * (w);
		// 		for(var j=0; j<3; j++){
		// 			var y = j * h;
		// 			var s = new Phaser.Sprite(this.game,x,y,cTexture);
		// 			s.width = w;
		// 			s.height = h;
		// 			this.game.add.existing(s);
		// 		}
		// 	}
		// }else{ 
			var verticalCopiesCount = this.game.world.width/WarpGroup.warpWidth;
			var horizontalCopiesCount = upperSpaceHeight/(heightOfPatternSection);
			for(var i=0; i<verticalCopiesCount; i++){
				var x = i * (WarpGroup.warpWidth);
				for(var j=0; j<horizontalCopiesCount; j++){
					var y = j * heightOfPatternSection;
					var s = new Phaser.Sprite(this.game,x,y,cTexture);
					console.log('adding');
					maskedContainerGroup.addChild(s);
				}
			}
		// }
		this.game.add.existing(maskedContainerGroup);
	    // this.thegame.add.existing(copy);
	}
}
WarpGroup.prototype.addThread = function(liftedThreads, color){


}

WarpGroup.prototype.removeLiftedThread = function(num){
	// var index = this.liftedThreads.indexOf(num);
	// if(index > -1){
	// 	this.liftedThreads = this.liftedThreads.splice(index,1);
	// }
	this.removeLiftedThread2(num);
}

WarpGroup.prototype.removeLiftedThread2 = function(num){
	this.liftedThreads = this.removeFromArr(this.liftedThreads,num);
	//console.log(this.liftedThreads);
}

WarpGroup.prototype.removeFromArr = function(arr,elem){
    var i, len = arr.length, new_arr = [],
    sort_fn = function (a, b) { return a - b; };
    for (i = 0; i < len; i += 1) {
        if (typeof elem === 'object' && typeof arr[i] === 'object') {
            if (arr[i].toString() === elem.toString()) {
                continue;
            } else {                    
                if (arr[i].sort(sort_fn).toString() === elem.sort(sort_fn).toString()) {
                    continue;
                }
            }
        }
        if (arr[i] !== elem) {
            new_arr.push(arr[i]);
        }
    }
    return new_arr;
}


WarpGroup.prototype.showAttention = function(){
	
	var origTint = this.tint;
	

	// for(var i=0; i<this.threads.length; i++){
	// 	this.threads[i].anchor.set(0.5);
	// 	this.game.add.tween(this.threads[i].scale).to({x:1.3,y:1.3},1000,Phaser.Easing.Back.InOut,true,0,false).onComplete.addOnce(function(){
	// 		this.game.add.tween(this.threads[i].scale).to({x:1,y:1},1000,Phaser.Easing.Back.InOut,true,0,false).onComplete.addOnce(function(){
	// 			this.thread[i].anchor.set(0.5);
	// 		},this);
	// 	},this);
	// }



}

WarpGroup.prototype.getColorCode = function(colorWord){
		if(colorWord == 'red') return '0xf44f45';
		if(colorWord == 'blue') return '0x1a7df5';
		if(colorWord == 'green') return '0x00f990';
		if(colorWord == 'yellow') return '0xf7c73e';
}


















