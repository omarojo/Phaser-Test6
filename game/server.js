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
