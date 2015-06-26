/* **********************************************
  Sensate - Fabric Project
  Middleware WebSocket server
*/

var app = require('http').createServer(handler)
var io = require('socket.io')(app);
var fs = require('fs');


app.listen(3000);

function handler (req, res) {
  fs.readFile(__dirname + '/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });
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
