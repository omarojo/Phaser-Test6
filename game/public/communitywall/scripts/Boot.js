Kente = {
	socket : io('http://localhost:3000'),
    removeAllSocketListeners: function(){
        Kente.socket.removeAllListeners('threadTouch'); //Remove all previous listeners
    }

};

Kente.Boot = function (game) {

};

Kente.Boot.prototype = {

    preload: function () {
        this.p = [];
        this.lastTexture = null;
        this.textureIds = [];
        

        // this.load.image('verticalWarpThread', 'assets/vWarpThread.png');
        this.load.image('kentebg', 'assets/kentebg.png');

        var keyScreenshot = this.game.input.keyboard.addKey(Phaser.Keyboard.S);
        keyScreenshot.onDown.add(function(){
            // this.load.image('1436157481591', 'http://localhost:3000/community_uploads/1436157481591.png');
            // this.game.add.sprite(0,0,'1436157481591'); 
            this.loadNewImage('http://localhost:3000/community_uploads/1436157481591.png','1436157481591' );

        }, this);
    },
    create: function () {

      this.bg = this.game.add.sprite(0,0,'kentebg');
      this.bg.width = 1920;
      this.bg.height = 1080;

      this.patternGroup = this.game.add.group();

      this.size = 100;

      this.p[1] = this.patternGroup.create(0,0);
      this.p[2] = this.patternGroup.create(this.size,0);
      this.p[3] = this.patternGroup.create(this.size*5,0);
      this.p[4] = this.patternGroup.create(this.size*6,0);

      this.p[5] = this.patternGroup.create(0,this.size);
      this.p[6] = this.patternGroup.create(this.size,this.size);
      this.p[7] = this.patternGroup.create(this.size*5,this.size);
      this.p[8] = this.patternGroup.create(this.size*6,this.size);

      this.p[9] = this.patternGroup.create(0,this.size*2);
      this.p[10] = this.patternGroup.create(this.size,this.size*2);
      this.p[11] = this.patternGroup.create(this.size*5,this.size*2);
      this.p[12] = this.patternGroup.create(this.size*6,this.size*2);

      this.p[9].loadTexture('kentebg');
      this.p[9].width = 100;
      this.p[9].height = 100;

      this.p[10].loadTexture('kentebg');
        this.p[10].width = 100;
      this.p[10].height = 100;      
      ///...

      this.p[13] = this.patternGroup.create(this.size*2,0);
      this.p[14] = this.patternGroup.create(this.size*3,0);
      this.p[15] = this.patternGroup.create(this.size*4,0);
      this.p[16] = this.patternGroup.create(this.size*2,this.size);
      this.p[17] = this.patternGroup.create(this.size*3,this.size);
      this.p[18] = this.patternGroup.create(this.size*4,this.size);
      this.p[19] = this.patternGroup.create(this.size*2,this.size*2);
      this.p[20] = this.patternGroup.create(this.size*3,this.size*2);
      this.p[21] = this.patternGroup.create(this.size*4,this.size*2);

      this.olderPindex = 1;

    }, 
    update : function(){
        
    },
    loadNewImage: function(url, id){
        // console.log(url);
        var loader = new Phaser.Loader(this.game);
        loader.image(id,url);
        loader.onLoadComplete.addOnce(function(){
            console.log('Loaded');
            // this.game.add.sprite(0,0,id);
            // this.p[1].loadTexture(id);
            // this.p[1].width = this.size;
            // this.p[1].height = this.size;
            if(this.textureIds.length>0){
                var t = this.lastTexture;
                console.log(this.textureIds[0]);
                this.p[this.olderPindex].loadTexture(this.textureIds[this.olderPindex-1]);
                this.p[this.olderPindex].width = this.size;
                this.p[this.olderPindex].height = this.size;
                
                if(this.olderPindex == 12) this.olderPindex = 1;
                else this.olderPindex++;
            }

            for(var i=1; i<=12;i++){
                this.p[i].loadTexture(this.textureIds[i]);
                this.p[i].width = this.size;
                this.p[i].height = this.size;
            }
            
            for(var i=13; i<=21;i++){
                this.p[i].loadTexture(id);
                this.lastTexture = id;
                this.p[i].width = this.size;
                this.p[i].height = this.size;                
            }
            this.textureIds.push(id);
        },this);
        loader.start();
    }

};