/* **********************************************
  Sensate - Fabric Project
  Middleware WebSocket server
*/
var express = require('express'); //Web Server
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

// function handler (req, res) {
//   fs.readFile(__dirname + '/index.html',
//   function (err, data) {
//     if (err) {
//       res.writeHead(500);
//       return res.end('Error loading index.html');
//     }

//     res.writeHead(200);
//     res.end(data);
//   });
// }
app.route('/kente') //standard response
    .post(function(req,res, next){
        console.log("Receiving base64 Image") // form files
        //console.log(req.body.image64);
        var base64Data = req.body.image64.replace(/^data:image\/png;base64,/, "");
        var buff = new Buffer(base64Data, 'base64');
        console.log(base64Data);
        // fs.writeFile("out.png", base64Data, 'base64', function(err) {
        fs.writeFile("out.png", buff, function(err) {
          console.log(err);
        });


        return sendErrorResponse(res, 200, 'Todo bien');
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
