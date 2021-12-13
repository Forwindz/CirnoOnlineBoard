
//const express = require('express')
import express from 'express'
import http from 'http'
import gdata from "./lib/data/rawData.js"
import { UserInfo, UserList } from "./lib/data/userInfo.js"
import { Server, Socket } from "socket.io";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
//const http = require("http");
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:8080",
        methods: ["GET", "POST"],
        transports: ['websocket', 'polling'],
        credentials: true
    },
    allowEIO3: true
});
//manage website http request, like viewing the website
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

server.listen(8080, () => {
    console.log("Web server: listening 8080");
});

const storeList = [];

//utility functions

function getTime() {
    return (new Date()).valueOf();
}


function generateUser(){
    let user = new UserInfo(Math.floor(Math.random() * 1000000000));
    user.color = "#283";
    user.nick = "Guest_"+user.uid
    return user;
}

io.on('connection', function (socket) {
    
    let userInfo = generateUser();
    let uid = userInfo.uid;
    console.log("A user is connected. Information: "+JSON.stringify(userInfo));
    gdata.userList.addUser(userInfo);
    socket.emit('uid', { userInfo:userInfo }); //pass information to the user
    socket.emit('users', { userList: gdata.userList.users }); // pass user list information to the user
    socket.emit('datas', { operationRecord: storeList }); // pass whiteboard information to the user
    socket.broadcast.emit('user_join', { userInfo:userInfo });

    socket.on('disconnect', () => {
        console.log('user disconnected ' + uid);
        gdata.userList.removeUser(userInfo);
        socket.broadcast.emit('user_exit', { uid: uid });
    });

    socket.on('emit_method test', (msg) => {
        console.log('message from emit_method test: ' + msg.information);
        io.emit('emit_method test', { someProperty: 'some value', otherProperty: 'other value' });
    });

    socket.on('data', (msg) => {
        msg["stime"] = getTime(); //server time
        console.log("Receive data from " + uid + " -> " + JSON.stringify(msg));
        msg["uid"] = uid; // sender id
        storeList.push(msg);
        //socket.broadcast.emit('data', msg);
        io.emit('data', msg);
    });
});

