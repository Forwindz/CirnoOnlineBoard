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
    let p = packetBuffer.shift();
    if (p != null) {
        if (p.undo == false) {
            maintainBuffer.push(p);
        }
        return p;
    }
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


// buffer with undo-redo sign for fetching
let packetBuffer = [];
// local history (without undo-redo sign)
let maintainBuffer = [];

/**
 * Process packet once a time (without lock) 
// 这个业务逻辑，吐血都不想写第二遍(如果有时间戳相同的包，需要酌情处理)
 * @param {*} packet data include{stime, time, uid, data}
 */
function processReceiveData(packet) {
    packet.undo = false;
    let packetTimestamp = packet.stime;
    let temp = [];
    let reversetemp = [];
    let redoCount = 0; // 与undoCount不同，是当前redo的计数
    let undoCount = 0; // 检查过往是否有过undo的计数
    let undoBuffer = [];

    if (packetBuffer.length > 0) {
        if (packetBuffer[0].undo == true) {
            for (let p of packetBuffer) {
                if (p.undo == false)
                    break;
                undoCount++;
            }
        }
    }

    // 无历史
    if (maintainBuffer.length == 0) {
        // 无当前
        if (packetBuffer.length == 0) {
            packetBuffer.push(packet);
            return;
        }
        else { // 有当前
            if (undoCount > 0) {
                console.log("无历史但undo没有进行完");
                undoBuffer = packetBuffer.splice(0, undoCount); // cut undo then brutal insert
                let map = packetBuffer.map(a => a.stime);
                let index = BrutalInsert(map, packetTimestamp);
                packetBuffer.splice(index, 0, packet);
                packetBuffer = undoBuffer.concat(packetBuffer); // paste undo
            }
            else {
                let buffermap = packetBuffer.map(a => a.stime);
                let index = BrutalInsert(buffermap, packetTimestamp);
                packetBuffer.splice(index, 0, packet);
                return;
            }
        }
    }
    else { // 有历史
        // 无当前
        if (packetBuffer.length == 0) {
            let buffermap = maintainBuffer.map(a => a.stime);
            let index = BrutalInsert(buffermap, packetTimestamp);
            // redo index in history buffer, then let packetBuffer have part of history for undo no redo
            maintainBuffer.splice(index, 0, packet);
            redoCount = maintainBuffer.length - index;
            temp = maintainBuffer.splice(-redoCount, redoCount);
            reversetemp = JSON.parse(JSON.stringify(temp)); //被逼无奈的深拷贝
            reversetemp.shift(); //去除头部
            reversetemp.reverse();
            for (let i of reversetemp) i.undo = true;
            // 组装
            reversetemp = reversetemp.concat(temp);
            packetBuffer = reversetemp.concat(packetBuffer);
        }
        else {
            // 小于当前队列最小
            if (packetTimestamp < packetBuffer[0].stime) {
                console.log("小于当前队列最小");
                // 又在历史队列与当前队列之间
                let gapTime = 0
                if (maintainBuffer.length > 0) {
                    let gapPacket = maintainBuffer[maintainBuffer.length - 1];
                    gapTime = gapPacket.stime;
                }
                console.log(packetTimestamp, gapTime);
                if (packetTimestamp >= gapTime) { //可能相等（某些路由策略）
                    console.log("又在历史队列与当前队列之间");
                    // 当前队列已经undo过
                    if (undoCount > 0) {
                        console.log("当前队列已经undo过");
                        undoBuffer = packetBuffer.splice(0, undoCount); // cut undo then brutal insert
                        let map = packetBuffer.map(a => a.stime);
                        let index = BrutalInsert(map, packetTimestamp);
                        packetBuffer.splice(index, 0, packet);
                        packetBuffer = undoBuffer.concat(packetBuffer); // paste undo
                    } else { // 没undo就直接插入
                        console.log("没undo就直接插入");
                        //let map = packetBuffer.map(a => a.stime);
                        //let index = BrutalInsert(map, packetTimestamp);
                        //packetBuffer.splice(index,0,packet);
                        //packetBuffer.splice(0,0,packet);
                        packetBuffer.unshift(packet);
                        console.log("unshift", packetTimestamp);
                        console.log(packetBuffer);
                    }
                } else { // 还小于历史队列
                    console.log("还小于历史队列");
                    let buffermap = maintainBuffer.map(a => a.stime);
                    let index = BrutalInsert(buffermap, packetTimestamp);
                    // 已经undo过
                    if (undoCount > 0) { // 新的乱序包整理之后，加到undo之后和redo之前的中间位置
                        console.log("已经undo过");
                        maintainBuffer.splice(index, 0, packet); // insert ahead splice
                        redoCount = maintainBuffer.length - index;

                        temp = maintainBuffer.splice(-redoCount, redoCount);
                        reversetemp = JSON.parse(JSON.stringify(temp)); //被逼无奈的深拷贝
                        reversetemp.shift(); //去除头部
                        reversetemp.reverse();
                        for (let i of reversetemp) i.undo = true;
                        //组装
                        let rest = packetBuffer.splice(undoCount);
                        packetBuffer = packetBuffer.concat(reversetemp).concat(temp).concat(rest);
                        //console.log("packetBuffer", packetBuffer);
                    } else { // 没有undo过
                        console.log("没有undo过");
                        // redo index in history buffer, then let packetBuffer have part of history for undo then redo
                        maintainBuffer.splice(index, 0, packet);
                        redoCount = maintainBuffer.length - index;
                        temp = maintainBuffer.splice(-redoCount, redoCount);
                        reversetemp = JSON.parse(JSON.stringify(temp)); //被逼无奈的深拷贝
                        reversetemp.shift(); //去除头部
                        reversetemp.reverse();
                        for (let i of reversetemp) i.undo = true;
                        // 组装
                        reversetemp = reversetemp.concat(temp);
                        packetBuffer = reversetemp.concat(packetBuffer);
                    }
                }
            } else if (packetTimestamp > packetBuffer.slice(-1).stime) {
                console.log("在最后");
                // simple add to rear
                packetBuffer.push(packet);
            } else { // sorting the packetBuffer
                // 如果有undo就先去掉undo插入再补上undo
                if (undoCount > 0) {
                    console.log("如果有undo就先去掉undo插入再补上undo");
                    undoBuffer = packetBuffer.splice(0, undoCount); // cut undo then brutal insert
                    let map = packetBuffer.map(a => a.stime);
                    let index = BrutalInsert(map, packetTimestamp);
                    packetBuffer.splice(index, 0, packet);
                    packetBuffer = undoBuffer.concat(packetBuffer); // paste undo
                } else { // 直接插入到中间
                    console.log("直接插入到中间");
                    let buffermap = packetBuffer.map(a => a.stime);
                    let index = BrutalInsert(buffermap, packetTimestamp);
                    packetBuffer.splice(index, 0, packet);
                }
            }

        }

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