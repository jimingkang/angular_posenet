'use strict'

var log4js = require('log4js');
var http = require('http');
var https = require('https');
var fs = require('fs');
var socketIo = require('socket.io');
 const { createProxyMiddleware } = require('http-proxy-middleware');
//var camera=require("camera");

var express = require('express');
var serveIndex = require('serve-index');
var easyrtc = require("./lib/easyrtc_server"); // EasyRTC internal module

var USERCOUNT = 10;

log4js.configure({
    appenders: {
        file: {
            type: 'file',
            filename: 'app.log',
            layout: {
                type: 'pattern',
                pattern: '%r %p - %m',
            }
        }
    },
    categories: {
       default: {
          appenders: ['file'],
          level: 'debug'
       }
    }
});

var logger = log4js.getLogger();

var app = express();
var options = {
  target: 'http://localhost:3001', //转发到的地址
  changeOrigin: true, // needed for virtual hosted sites
  //ws: true, // 代理websocket
   secure: false,
    logLevel: 'debug',
  pathRewrite: {
   // '^/api': '', // rewrite path
  },
  router: {
    // 当请求localhost:3000/api时，会转发到http://localhost:8080,
    'localhost:80': 'http://localhost:3001'
  }
}
var exampleProxy = createProxyMiddleware(options);
app.use(['/banner','/playlist/hot','/personalized','/artist/list','/playlist/detail'], exampleProxy);

app.use(serveIndex('./public/dist'));
app.use(express.static('./public/dist'));



//http server
//var http_server = http.createServer(app);
//http_server.listen(80, '0.0.0.0');

//var webServer = http.createServer(app);
//var webServer = https.createServer(app);
// Start Socket.io so it attaches itself to Express server
var webServer = https.createServer({
    key:  fs.readFileSync(__dirname + "/certs/localhost.key"),
    cert: fs.readFileSync(__dirname + "/certs/localhost.crt")
}, app);

var socketServer = socketIo.listen(webServer, {"log level":1});

easyrtc.setOption("logLevel", "debug");

// Overriding the default easyrtcAuth listener, only so we can directly access its callback
easyrtc.events.on("easyrtcAuth", function(socket, easyrtcid, msg, socketCallback, callback) {
    easyrtc.events.defaultListeners.easyrtcAuth(socket, easyrtcid, msg, socketCallback, function(err, connectionObj){
        if (err || !msg.msgData || !msg.msgData.credential || !connectionObj) {
            callback(err, connectionObj);
            return;
        }

        connectionObj.setField("credential", msg.msgData.credential, {"isShared":false});

        console.log("["+easyrtcid+"] Credential saved!", connectionObj.getFieldValueSync("credential"));

        callback(err, connectionObj);
    });
});

// To test, lets print the credential to the console for every room join!
easyrtc.events.on("roomJoin", function(connectionObj, roomName, roomParameter, callback) {
    console.log("["+connectionObj.getEasyrtcid()+"] Credential retrieved!", connectionObj.getFieldValueSync("credential"));
    easyrtc.events.defaultListeners.roomJoin(connectionObj, roomName, roomParameter, callback);
});

// Start EasyRTC server
var rtc = easyrtc.listen(app, socketServer, null, function(err, rtcRef) {
    console.log("Initiated");

    rtcRef.events.on("roomCreate", function(appObj, creatorConnectionObj, roomName, roomOptions, callback) {
        console.log("roomCreate fired! Trying to create: " + roomName);

        appObj.events.defaultListeners.roomCreate(appObj, creatorConnectionObj, roomName, roomOptions, callback);
    });
});

// Listen on port 8080
//webServer.listen(80, function () {
 //   console.log('listening on http://localhost:80');
//});
webServer.listen(443, function () {
    console.log('listening on https://localhost:443');
});


/*

var options = {
	key : fs.readFileSync('./cert/1557605_www.learningrtc.cn.key'),
	cert: fs.readFileSync('./cert/1557605_www.learningrtc.cn.pem')
}

//https server

var https_server = https.createServer(options, app);
var io = socketIo.listen(https_server);

io.sockets.on('connection', (socket)=> {

	socket.on('message', (room, data)=>{
		socket.to(room).emit('message',room, data);
	});

	socket.on('join', (room)=>{
		socket.join(room);
		var myRoom = io.sockets.adapter.rooms[room]; 
		var users = (myRoom)? Object.keys(myRoom.sockets).length : 0;
		logger.debug('the user number of room is: ' + users);

		if(users < USERCOUNT){
			socket.emit('joined', room, socket.id); //发给除自己之外的房间内的所有人
			if(users > 1){
				socket.to(room).emit('otherjoin', room, socket.id);
			}
		
		}else{
			socket.leave(room);	
			socket.emit('full', room, socket.id);
		}
		//socket.emit('joined', room, socket.id); //发给自己
		//socket.broadcast.emit('joined', room, socket.id); //发给除自己之外的这个节点上的所有人
		//io.in(room).emit('joined', room, socket.id); //发给房间内的所有人
	});

	socket.on('leave', (room)=>{
		var myRoom = io.sockets.adapter.rooms[room]; 
		var users = (myRoom)? Object.keys(myRoom.sockets).length : 0;
		logger.debug('the user number of room is: ' + (users-1));
		//socket.emit('leaved', room, socket.id);
		//socket.broadcast.emit('leaved', room, socket.id);
		socket.to(room).emit('bye', room, socket.id);
		socket.emit('leaved', room, socket.id);
		//io.in(room).emit('leaved', room, socket.id);
	});

});

https_server.listen(443, '0.0.0.0');

*/




