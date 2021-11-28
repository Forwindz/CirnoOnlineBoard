import { io } from "socket.io-client";
//https://socket.io/docs/v4/client-api/
const socket = io("http://localhost:8080",{
  reconnectionDelayMax: 10000
});

socket.emit('chat message', {information:"test infomation from client"});

socket.io.on('reconnect', (socket) => {
    console.log('reconnect to server');
  });

socket.on("connect", () => {
  console.log("connected to server: "+socket.connected); // true
});

// receive data package, if the event name is emit_method test
socket.on('emit_method test',function(e){
  console.log("Receive message from server test");
  console.log(e);
});

export {socket}