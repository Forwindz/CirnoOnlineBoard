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

function removeItemOnce(arr, value) {
  var index = arr.indexOf(value);
  if (index > -1) {
    arr.splice(index, 1);
  }
  return arr;
}

app.use(express.static("static"));
app.use('/drawing-board/web/static', express.static(__dirname + '/dist/static'));
app.use('/static', express.static(__dirname + '/dist/static'));

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

const storeList = [];
const curUserList = [];

function getTime(){
  return (new Date()).valueOf();
}

io.on('connection',function(socket){  
    let uid = Math.floor(Math.random()*1000000000);
    curUserList.push(uid);
    console.log("A user is connected, send uid "+uid);
    socket.emit('uid',{uid:uid});
    socket.emit('users',{userList:curUserList});
    socket.emit('datas',{operationRecord:storeList})
    socket.broadcast.emit('user_join',{uid:uid});
    socket.on('disconnect', () => {
        console.log('user disconnected '+uid);
        removeItemOnce(curUserList,uid);
        socket.broadcast.emit('user_exit',{uid:uid});
      });
    socket.on('emit_method test', (msg) => {
      console.log('message from emit_method test: ' + msg.information);
      io.emit('emit_method test', { someProperty: 'some value', otherProperty: 'other value' });
    });
    socket.on('data',(msg)=>{
      msg["stime"]=getTime(); //server time
      console.log("Receive data from "+uid+" -> "+JSON.stringify(msg));
      msg["uid"] = uid; // sender id
      storeList.push(msg);
      socket.broadcast.emit('data',msg);
    });
});

