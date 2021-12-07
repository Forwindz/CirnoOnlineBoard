import { io } from "socket.io-client";
import gdata from "./data/rawData";
import { UserInfo } from "./data/userInfo";
//https://socket.io/docs/v4/client-api/
const socket = io("http://localhost:8080",{
  reconnectionDelayMax: 10000
});

socket.emit('chat message', {information:"test infomation from client"});

// socket.on('datatest', function(msg){
//   console.log('message: ' + msg);
// });

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

//for debug
socket.onAny(function(eventName,e){
  console.log("Receive "+eventName);
  console.log(e);
  console.log("------------")
});

//========================================================
// send data
function getTime(){
  return (new Date()).valueOf();
}
//
socket.sendData = function(data){
  socket.emit('data',{time:getTime(),data:data});
}

//========================================================
// receive data
/**
 * data:
 *  time: timestamp int
 *  uid: user id
 *  data:{....} 
 * @param {*} data 
 */
function processReceiveData(data){
  //TODO: process data and send command to UI
}

socket.on("data",(e)=>{processReceiveData(e)});
socket.on("datas",(e)=>{processReceiveData(e.operationRecord)});

socket.on("uid",(e)=>{
  console.log("Obtain uid "+e.uid);
  gdata.uid = e.uid;
  //TODO: store UID information
});

socket.on("users",(e)=>{
  console.log("Obtain userList ");
  console.log(e.userList)
  gdata.userList.addUser(e.userList);
  //TODO: store UID information
});

socket.on("user_join",(e)=>{
  console.log("User Joined "+e.uid);
  gdata.userList.addUser(new UserInfo(e.uid));
  //TODO: store UID information
});

socket.on("user_exit",(e)=>{
  console.log("User exited "+e.uid);
  gdata.userList.removeUser(e.uid);
  //TODO: remove UID information
});

export {socket}