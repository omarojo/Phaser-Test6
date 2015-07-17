/* **********************************************
  Sensate - Fabric Project
  Middleware WebSocket server
*/
var express = require('express'); //Web Server
var mongoose = require('mongoose'); // Mongoose 
var cors = require('cors'); //CROSS DOMAIN REQUESTS
var bodyParser = require('body-parser'); //To ready Body JSON data
// Load Express Server and Socket IO
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var fs = require('fs');
var path = require('path');

app.use('/',express.static(path.join(__dirname, '/public')));


app.use(bodyParser.json({limit: '50mb'})); // for parsing application/json
app.use(bodyParser.urlencoded({limit: '50mb',extended: true })); // for parsing application/x-www-form-urlencoded
//CROSS DOMAIN
app.use(cors());
//Start server
server.listen(3000);

/********************************************************
 * Database connection configuracion
 * Mongoose connection to MongoDB
*********************************************************/
mongoose.connect('mongodb://localhost:'+'27017'+'/kentedb', function (error) { //Local
// mongoose.connect('mongodb://omarojo:connyojo@novus.modulusmongo.net:27017/ogU4vasy', function (error) {    // MODULUS
    if (error) {
        console.log("Cant Connect to mongoDB: "+error);
    }
});
// Mongoose Schema definition
var Schema = mongoose.Schema;
var PatternSchema = new Schema({
    url: String,
    first_color: String,
    second_color: String,
    created_at: { type: Date, default: Date.now }
});
// Mongoose Model definition
var PatternModel = mongoose.model('pattern', PatternSchema);




app.route('/kente') //standard response
    .post(function(req,res, next){
        console.log("::: Receiving base64 Image") // form files
        //console.log(req.body.image64);
        if(req.body.image64 != undefined){
	        var base64Data = req.body.image64.replace(/^data:image\/png;base64,/, "");
	        var buff = new Buffer(base64Data, 'base64');
	        //console.log(base64Data);
	        // fs.writeFile("out.png", base64Data, 'base64', function(err) {
	        var filename = Date.now();
	        fs.writeFile("public/community_uploads/"+filename+".png", buff, function(err) {
	          if(err == null){
		          //SAVING IN DATA BASE
		          var thePattern = new PatternModel({
	                    url: filename + ".png" 
	                    });
	                thePattern.save(function(err){
	                    if(!err){
	                        console.log(">Pattern saved");
	                        var pttrn = {id:thePattern.id,
	                        	url:thePattern.url,
	                        	first_color: null,
	                        	second_color: null,
	                        	created_at: thePattern.created_at};
	                        io.emit('patternSaved', pttrn);
	                        return sendErrorResponse(res, 200, 'Pattern Saved !');  
	                    } else {
	                        return sendErrorResponse(res, 400, err);
	                    }
	                });
            	}else console.log("Error Saving to Disk Image: "+ err);
	        });
    }else{
    	return sendErrorResponse(res, 400, 'Missing base 64 image');
    }
    });



function sendErrorResponse(res, statuscode, message){
    var feedback = {'message': message};
    res.status(statuscode).send({'feedback':feedback});
}

/**********************************************************

Arduino + Johnny Five module to read states of sensors

************************************************************/
// Johnny-Five module install
var five = require("johnny-five");

// A board needs to be initialized for handling components using Johnny-Five
var board = new five.Board();;

// Defining pin numbers for switches. Change following values to reflect connection of switches attached to pins on the board
var thread1Pin = 2;
var thread2Pin = 3;
var thread3Pin = 4;
var thread4Pin = 5;
var thread5Pin = 6;
var thread6Pin = 7;
var thread7Pin = 8;
var thread8Pin = 9;
var thread9Pin = 10;
var beaterTopPin = 11;
var beaterBottomPin = 12;

board.on("ready", function() {

  	console.log(">> Board is on");

//  Initializing Components of Johnny-Five
//  Note - Switches are READ-ONLY
    var thread1 = new five.Switch(thread1Pin);
    var thread2 = new five.Switch(thread2Pin);
    var thread3 = new five.Switch(thread3Pin);
    var thread4 = new five.Switch(thread4Pin);
    var thread5 = new five.Switch(thread5Pin);
    var thread6 = new five.Switch(thread6Pin);
    var thread7 = new five.Switch(thread7Pin);
    var thread8 = new five.Switch(thread8Pin);
    var thread9 = new five.Switch(thread9Pin);

    var beaterTop = new five.Switch(beaterTopPin);
    var beaterBottom = new five.Switch(beaterBottomPin);
/*
// Events are triggered based on the state of switches attached to board.
// Switch.on("open", function() {
      // Switch is read open
// })
// Switch.on("close", function() {
      // Switch is read close
// })
*/
    thread1.on("open", function() {
      console.log("Thread 1 released");
      emitSocket_ThreadState(1,'loose');
    });
    thread1.on("close", function() {
      console.log("Thread 1 pulled");
      emitSocket_ThreadState(1,'held');
    });

    thread2.on("open", function() {
      console.log("Thread 2");
      emitSocket_ThreadState(2,'loose');
    });
    thread2.on("close", function() {
      console.log("Thread 2");
      emitSocket_ThreadState(2,'held');
    });

    thread3.on("open", function() {
      console.log("Thread 3");
      emitSocket_ThreadState(3,'loose');
    });
    thread3.on("close", function() {
      console.log("Thread 3");
      emitSocket_ThreadState(3,'held');
    });

    thread4.on("open", function() {
      console.log("Thread 4");
      emitSocket_ThreadState(4,'loose');
    });
    thread4.on("close", function() {
      console.log("Thread 4");
      emitSocket_ThreadState(4,'held');
    });

    thread5.on("open", function() {
      console.log("Thread 5");
      emitSocket_ThreadState(5,'loose');
    });
    thread5.on("close", function() {
      console.log("Thread 5");
      emitSocket_ThreadState(5,'held');
    });

    thread6.on("open", function() {
      console.log("Thread 6");
      emitSocket_ThreadState(6,'loose');
    });
    thread6.on("close", function() {
      console.log("Thread 6");
      emitSocket_ThreadState(6,'held');
    });

    thread7.on("open", function() {
      console.log("Thread 7");
      emitSocket_ThreadState(7,'loose');
    });
    thread7.on("close", function() {
      console.log("Thread 7");
      emitSocket_ThreadState(7,'held');
    });

    thread8.on("open", function() {
      console.log("Thread 8");
      emitSocket_ThreadState(8,'loose');
    });
    thread8.on("close", function() {
      console.log("Thread 8");
      emitSocket_ThreadState(8,'held');
    });

    thread9.on("open", function() {
      console.log("Thread 9");
      emitSocket_ThreadState(9,'loose');
    });
    thread9.on("close", function() {
      console.log("Thread 9");
      emitSocket_ThreadState(9,'held');
    });

    beaterTop.on("open", function() {
      console.log("Top Beater open circuit");

    });
    beaterTop.on("close", function() {
      console.log("Top Beater close circuit");
      emitSocket_BeaterState('up');
    });

    beaterBottom.on("open", function() {
      console.log("Bottom Beater open circuit");
    });
    beaterBottom.on("close", function() {
      console.log("Bottom Beater close circuit");
      emitSocket_BeaterState('down');
    });
});


/**********************************************************

WebSockets Callbacks (Socket.IO)

************************************************************/

io.on('connection', function (socket) {
  console.log("Someone connected");
  //socket.emit('string_1', { string: 1, state: 'held' });
  socket.on('threadTouch', function (data) {
    console.log(data);
    io.emit('threadTouch', data);
  });
  socket.on('beaterClick', function (data) {
    console.log('Beater: %j', data);
    io.emit('beaterClick', data);
  });
  socket.on('shuttleTouch', function (data) {
    console.log('Shuttle: %j', data);
    io.emit('shuttleTouch', data);
  });
  
});

function emitSocket_ThreadState(threadNum, status){ //threadNum 1-9 status 'held' or 'loose'
	io.emit('threadTouch',{thread:threadNum,state:status});
}
function emitSocket_BeaterState(status){ //status: 'up' or 'down'
	io.emit('beaterClick',{state:status});
}