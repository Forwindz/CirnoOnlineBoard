const express = require('express');
const app = express();
const http = require( "http" );
const server = http.createServer(app);
const io = require('socket.io')(server, {
    cors: {
        origin: "http://localhost:8080",
        methods: ["GET", "POST"],
        transports: ['websocket', 'polling'],
        credentials: true
    },
    allowEIO3: true
});

app.use(express.static("static"));
app.use('/drawing-board/web/static', express.static(__dirname + '/dist/static'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/dist/index.html');
  });

app.get('/socket.io/', (req, res) => {
    console.log("Get req");
    console.log(req);
  });

server.listen(8080,()=>{
    console.log("Web server: listening 8080");
});


io.on('connection',function(socket){  
    console.log("A user is connected");
    socket.on('disconnect', () => {
        console.log('user disconnected');
      });
    socket.on('emit_method test', (msg) => {
      console.log('message from emit_method test: ' + msg.information);
      io.emit('emit_method test', { someProperty: 'some value', otherProperty: 'other value' });
    });
});

