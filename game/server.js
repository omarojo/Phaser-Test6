/* **********************************************
  Sensate - Fabric Project
  Middleware WebSocket server
*/
var express = require('express'); //Web Server
var mongoose = require('mongoose'); // Mongoose 
var easyimg = require('easyimage'); //Cropping images
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
server.listen(process.env.PORT || 3000);

/********************************************************
 * Database connection configuracion
 * Mongoose connection to MongoDB
*********************************************************/
var options = { server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } }, 
                replset: { socketOptions: { keepAlive: 1, connectTimeoutMS : 30000 } } };
//commented for testing purposes
//mongoose.connect('mongodb://localhost:'+'27017'+'/kentedb', options, function (error) { //Localf
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
	        fs.writeFile(__dirname + "/public/community_uploads/"+filename+".png", buff, function(err) {
	          if(err == null){
              easyimg.crop({
                   src: __dirname + "/public/community_uploads/"+filename+".png", dst: __dirname + "/public/community_uploads/"+filename+".png",
                   // width:260, height:260,
                   cropwidth:426, cropheight:426,
                   gravity: 'NorthWest',
                   x:387, y:1495
                }).then(
                function(image) {
                    console.log('Cropped');
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
                }
              );
		          
            	}else console.log("Error Saving to Disk Image: "+ err);
	        });
        }else{
        	return sendErrorResponse(res, 400, 'Missing base 64 image');
        }
    });

app.route('/kente') //standard response
    .get(function(req,res, next){
      console.log("::: Sending recent Patterns"); 
      PatternModel.find().sort('-created_at').limit(13).exec(function(err, posts){
          if(err == null){
            res.status(200).send({'patterns':posts.reverse()});
          }
          else{
            return sendErrorResponse(res, 400, err);
          }

          
      });

    });

function sendErrorResponse(res, statuscode, message){
    var feedback = {'message': message};
    res.status(statuscode).send({'feedback':feedback});
}

/**********************************************************

Arduino + Johnny Five module to read states of sensors

************************************************************/
//Johnny-Five module install
// var five = require("johnny-five");

// // A board needs to be initialized for handling components using Johnny-Five
// var board = new five.Board({port: "/dev/cu.usbmodem1471"});//{ port: "/dev/cu.usbmodem****" }

// process.on('uncaughtException', function(err) {
//   console.log('Caught exception: ' + err);
// });

// // Defining pin numbers for switches. Change following values to reflect connection of switches attached to pins on the board
// // var thread1Pin = 2;
// // var thread2Pin = 3;
// // var thread3Pin = 4;
// // var thread4Pin = 5;
// // var thread5Pin = 6;
// // var thread6Pin = 7;
// // var thread7Pin = 8;
// // var thread8Pin = 9;
// // var thread9Pin = 10;

// //inverted threads because of erroneus physical installation
// var thread1Pin = 10;
// var thread2Pin = 9;
// var thread3Pin = 8;
// var thread4Pin = 7;
// var thread5Pin = 6;
// var thread6Pin = 5;
// var thread7Pin = 4;
// var thread8Pin = 3;
// var thread9Pin = 2;

// var beaterBottomPin = 12;
// var beaterTopPin = 11;

// board.on("ready", function() {

//   	console.log(">> Board is on");

// //  Initializing Components of Johnny-Five
// //  Note - Switches are READ-ONLY
//     var thread1 = new five.Switch(thread1Pin);
//     var thread2 = new five.Switch(thread2Pin);
//     var thread3 = new five.Switch(thread3Pin);
//     var thread4 = new five.Switch(thread4Pin);
//     var thread5 = new five.Switch(thread5Pin);
//     var thread6 = new five.Switch(thread6Pin);
//     var thread7 = new five.Switch(thread7Pin);
//     var thread8 = new five.Switch(thread8Pin);
//     var thread9 = new five.Switch(thread9Pin);

//     var beaterTop = new five.Switch(beaterTopPin);
//     var beaterBottom = new five.Switch(beaterBottomPin);
// /*
// // Events are triggered based on the state of switches attached to board.
// // Switch.on("open", function() {
//       // Switch is read open
// // })
// // Switch.on("close", function() {
//       // Switch is read close
// // })
// */
//     thread1.on("open", function() {
//       console.log("Thread 1 state open");
//       emitSocket_ThreadState(1,'loose');
//     });
//     thread1.on("close", function() {
//       console.log("Thread 1 state close");
//       emitSocket_ThreadState(1,'held');
//     });

//     thread2.on("open", function() {
//       console.log("Thread 2 state open");
//       emitSocket_ThreadState(2,'loose');
//     });
//     thread2.on("close", function() {
//       console.log("Thread 2 state close");
//       emitSocket_ThreadState(2,'held');
//     });

//     thread3.on("open", function() {
//       console.log("Thread 3 state open");
//       emitSocket_ThreadState(3,'loose');
//     });
//     thread3.on("close", function() {
//       console.log("Thread 3 state close");
//       emitSocket_ThreadState(3,'held');
//     });

//     thread4.on("open", function() {
//       console.log("Thread 4 state open");
//       emitSocket_ThreadState(4,'loose');
//     });
//     thread4.on("close", function() {
//       console.log("Thread 4 state close");
//       emitSocket_ThreadState(4,'held');
//     });

//     thread5.on("open", function() {
//       console.log("Thread 5 state open");
//       emitSocket_ThreadState(5,'loose');
//     });
//     thread5.on("close", function() {
//       console.log("Thread 5 state close");
//       emitSocket_ThreadState(5,'held');
//     });

//     thread6.on("open", function() {
//       console.log("Thread 6 state open");
//       emitSocket_ThreadState(6,'loose');
//     });
//     thread6.on("close", function() {
//       console.log("Thread 6 state close");
//       emitSocket_ThreadState(6,'held');
//     });

//     thread7.on("open", function() {
//       console.log("Thread 7 state open");
//       emitSocket_ThreadState(7,'loose');
//     });
//     thread7.on("close", function() {
//       console.log("Thread 7 state close");
//       emitSocket_ThreadState(7,'held');
//     });

//     thread8.on("open", function() {
//       console.log("Thread 8 state open");
//       emitSocket_ThreadState(8,'loose');
//     });
//     thread8.on("close", function() {
//       console.log("Thread 8 state close");
//       emitSocket_ThreadState(8,'held');
//     });

//     thread9.on("open", function() {
//       console.log("Thread 9 state open");
//       emitSocket_ThreadState(9,'loose');
//     });
//     thread9.on("close", function() {
//       console.log("Thread 9 state close");
//       emitSocket_ThreadState(9,'held');
//     });

//     beaterTop.on("open", function() {
//       console.log("Top Beater state open");
//       emitSocket_BeaterState('up');
//     });
//     beaterTop.on("close", function() {
//       console.log("Top Beater state close");
//     });

//     beaterBottom.on("open", function() {
//       console.log("Bottom Beater state open");
//       emitSocket_BeaterState('down');
//     });
//     beaterBottom.on("close", function() {
//       console.log("Bottom Beater state close");
//     });
// });
// /**********************************************************

// Johnny-Five board information messages

// ************************************************************/
// board.on("info", function(event) {
//   /*
//     Event {
//       type: "info"|"warn"|"fail",
//       timestamp: Time of event in milliseconds,
//       class: name of relevant component class,
//       message: message [+ ...detail]
//     }
//   */
//   console.log("%s sent an 'info' message: %s", event.class, event.message);
// });
// board.on("warn", function(event) {
//   /*
//     Event {
//       type: "info"|"warn"|"fail",
//       timestamp: Time of event in milliseconds,
//       class: name of relevant component class,
//       message: message [+ ...detail]
//     }
//   */
//   console.log("%s sent a 'warn' message: %s", event.class, event.message);
// });
// board.on("fail", function(event) {
//   /*
//     Event {
//       type: "info"|"warn"|"fail",
//       timestamp: Time of event in milliseconds,
//       class: name of relevant component class,
//       message: message [+ ...detail]
//     }
//   */
//   console.log("%s sent a 'fail' message: %s", event.class, event.message);
// });
// board.on("message", function(event) {
//   /*
//     Event {
//       type: "info"|"warn"|"fail",
//       timestamp: Time of event in milliseconds,
//       class: name of relevant component class,
//       message: message [+ ...detail]
//     }
//   */
//   console.log("Received a %s message, from %s, reporting: %s", event.type, event.class, event.message);
// });

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