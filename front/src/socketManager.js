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

//==========客户端接口在这里定义，在export处使用================

//**一次获取一个包**
//也就是说，undo是MYX来撤销前端已有的操作，redo是GX来做,MYX每次只是fetch包然后照旧执行
function fetchPacket() {
    redoCount--;
    let pack = packetBuffer.shift();
    maintainBuffer.push(pack);
    console.log(pack.uid);
    return pack;
}

//获取当前队列所有数据（不一定非要用）,以供debug
function getBuffer() {
    return packetBuffer;
}
//获取本地历史所有数据（不一定非要用）,以供debug
function getHistory() {
    return maintainBuffer;
}

//========================================================


//========================================================
// receive data

// parameters for window control
const windowSize = 36000; // 10s * 3 people(depends on how many people linked) * 1200 opts
let redoCount = 0; // redo opt rest count

// buffer with undo-redo sign for fetching
let packetBuffer = [];
// local history (without undo-redo sign)
let maintainBuffer = [];


/**
 * Process packet once a time (without lock)
 * @param {*} packet data include{stime, time, uid, data}
 */
function processReceiveData(packet) {

    let packetTimestamp = packet.stime;

    if (packetTimestamp < packetBuffer[0].stime) {
        let buffermap = maintainBuffer.map(a => a.stime);
        let index = BrutalInsert(buffermap, packetTimestamp);
        if (index < buffermap.length) {
            // redo index in history buffer, then let packetBuffer have part of history for redo
            maintainBuffer.splice(index, 0, packet);
            redoCount = maintainBuffer.length - index;
            console.log("index", index);
            console.log("redoCount", redoCount);
            packetBuffer = maintainBuffer.splice(-redoCount, redoCount).concat(packetBuffer);
            //console.log("m",maintainBuffer);
            //console.log("p",packetBuffer);
        }
        else {
            packetBuffer.unshift(packet);
            console.log("unshift", packetTimestamp);
            console.log(packetBuffer);
        }
    }
    else if (packetTimestamp > packetBuffer.slice(-1).stime) {
        // simple add to rear
        packetBuffer.push(packet);
    }
    else {
        // sorting the packetBuffer
        let buffermap = packetBuffer.map(a => a.stime);
        let index = BrutalInsert(buffermap, packetTimestamp);
        packetBuffer.splice(index, 0, packet);
    }
}

/**
 * Process packets at the beginning for reading history
 * @param {Array} packets data include{stime, time, uid, data}
 */
function processReceiveDatas(packets) {
    packetBuffer = packetBuffer.concat(packets);
    console.log("初次连接包长度:", packetBuffer.length);
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
    console.log("Obtain uid " + e.userInfo.uid);
    gdata.uid = e.userInfo.uid;
    gdata.userInfo = e.userInfo;
    //TODO: store UID information
});

socket.on("users", (e) => {
    console.log("Obtain userList ");
    console.log(e.userList)
    gdata.userList.setUsers(e.userList);
    //TODO: store UID information
});

socket.on("user_join", (e) => {
    console.log("User Joined " + e.userInfo.uid);
    gdata.userList.addUser(e.userInfo);
    //TODO: store UID information
});

socket.on("user_exit", (e) => {
    console.log("User exited " + e.uid);
    gdata.userList.removeUser(e.uid);
    //TODO: remove UID information
});

export {
    socket,
    fetchPacket,
    getBuffer,
    getHistory
}


// /**
//  * Process packet once a time (without lock)
//  * @param {*} packet data include{stime, time, uid, data}
//  */
//  function processReceiveData(packet) {

//     let packetTimestamp = packet.stime;
//     //console.log(p);

//     //cut packetBuffer half then save to history in case too big
//     if (packetBuffer.length > windowSize && redoCount == 0) {
//         maintainBuffer = maintainBuffer.concat(packetBuffer.splice(0, windowSize / 2));
//     }

//     if (packetTimestamp < packetBuffer[0].stime) {
//         let buffermap = maintainBuffer.map(a => a.stime);
//         let index = BrutalInsert(buffermap, packetTimestamp)
//         if (index != buffermap.length) {
//             // redo index in history buffer, then let packetBuffer have part of history for redo
//             redoCount = maintainBuffer.length - index;
//             packetBuffer = maintainBuffer.splice(index, redoCount, packet).concat(packetBuffer);
//         }
//         else {
//             // simply add to head
//             packetBuffer.unshift(packet);
//         }
//     }
//     else if (packetTimestamp > packetBuffer.slice(-1).stime) {
//         // simple add to rear
//         packetBuffer.push(packet);
//     }
//     else {
//         // sorting the packetBuffer
//         let buffermap = packetBuffer.map(a => a.stime);
//         let index = BrutalInsert(buffermap, packetTimestamp);
//         packetBuffer.splice(index, 0, packet);
//     }
// }