import { io } from "socket.io-client";
import gdata from "./data/rawData";
import { UserInfo } from "./data/userInfo";
//https://socket.io/docs/v4/client-api/
const socket = io("http://localhost:8080", {
    reconnectionDelayMax: 10000
});

socket.emit('chat message', { information: "test infomation from client" });

// socket.on('datatest', function(msg){
//   console.log('message: ' + msg);
// });

socket.io.on('reconnect', (socket) => {
    console.log('reconnect to server');
});

socket.on("connect", () => {
    console.log("connected to server: " + socket.connected); // true
});

// receive data package, if the event name is emit_method test
socket.on('emit_method test', function (e) {
    console.log("Receive message from server test");
    console.log(e);
});

//for debug
socket.onAny(function (eventName, e) {
    console.log("Receive " + eventName);
    console.log(e);
    console.log("------------")
});

//========================================================
// send data
function getTime() {
    return (new Date()).valueOf();
}
// single data
socket.sendData = function (data) {
    socket.emit('data', { time: getTime(), data: data });
}

//========================================================
// receive data

// parameters for window control
const windowSize = 3000;
// client local buffer for mainting the packet sequences:
let packetBuffer = [];

/**
 * Process packet once a time
 * @param {*} packet data include{stime, time, uid, data}
 * @returns {Number} return index of redo operation means redo [index...length]
 */
function processReceiveData(packet) {

    //TODO: process data and send command to UI
    let p = packet.stime;
    console.log(p);

    if (p < packetBuffer[0]) {
        packetBuffer(0, 0, packet);
        return 0;
    }
    else if (p > packetBuffer.slice(-1).stime) {
        packetBuffer.push(packet);
        return -1;
    }
    else {
        console.log("sorting...");
        // sort
        let arr = [];
        for (let i of packetBuffer)
            arr.push(i.stime);
        let index = BrutalInsert(arr, p)
        packetBuffer.splice(index, 0, packet);
        console.log("sorting finished");

        return index + 1;
    }
}

/**
 * Process packets at the beginning for reading history
 * @param {Array} packets data include{stime, time, uid, data}
 */
function processReceiveDatas(packets) {
    packetBuffer.concat(packets);
    return packetBuffer.length;
}


/**
 * Brutal Insert
 * @param array array wait for sorting
 * @param target input element
 * @returns the index of insert element
 */
function BrutalInsert(array, target) {
    let index = 0;
    for (let e of array) {
        if (target < e)
            return index;
        else
            index++;
    }
    return index;
}

socket.on("data", (e) => {
    console.log("Obtain single data from " + e.uid);

    processReceiveData(e)
});
socket.on("datas", (e) => {
    console.log("Obtain a bunch of data from server history ");

    processReceiveDatas(e.operationRecord)
});

socket.on("uid", (e) => {
    console.log("Obtain uid " + e.uid);
    gdata.uid = e.uid;
    //TODO: store UID information
});

socket.on("users", (e) => {
    console.log("Obtain userList ");
    console.log(e.userList)
    gdata.userList.addUser(e.userList);
    //TODO: store UID information
});

socket.on("user_join", (e) => {
    console.log("User Joined " + e.uid);
    gdata.userList.addUser(new UserInfo(e.uid));
    //TODO: store UID information
});

socket.on("user_exit", (e) => {
    console.log("User exited " + e.uid);
    gdata.userList.removeUser(e.uid);
    //TODO: remove UID information
});

export { socket }