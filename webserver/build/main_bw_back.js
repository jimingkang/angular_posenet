'use strict'
import * as posenet from '@tensorflow-models/posenet';
import {bindPage,detectPoseInRealTime} from './camera';

var localVideo = document.querySelector('video#localvideo');
var local_output = document.querySelector('canvas#local_output');

//posenet 
const imageScaleFactor = 0.50;
const flipHorizontal = false;
const outputStride = 16;
const imageElement = localVideo;
const scaleFactor=0.5;
// load the posenet model
/*const model =  posenet.load({
        architecture: 'MobileNetV1',
        outputStride: 16,
        multiplier: 0.75
    });
*/
//end posenet
const defaultQuantBytes = 2;

const defaultMobileNetMultiplier =  0.50 ;
const defaultMobileNetStride = 16;
const defaultMobileNetInputResolution = 500;

const defaultResNetMultiplier = 1.0;
const defaultResNetStride = 32;
const defaultResNetInputResolution = 250;

var div_remotes=document.getElementById("remotes");




//var local_output = document.querySelector('canvas#local_output');

//var remoteVideo = document.querySelector('video#remotevideo');
//var remote_output = document.querySelector('canvas#remote_output');
//    var context = canvas.getContext('2d');


var btnConn =  document.querySelector('button#connserver');
var btnLeave = document.querySelector('button#leave');

var offer = document.querySelector('textarea#offer');
var answer = document.querySelector('textarea#answer');

var shareDeskBox  = document.querySelector('input#shareDesk');

var bandwidth = document.querySelector('select#bandwidth');

var localStream = null;
var remoteStream = null;



var roomid;
var socket = null;

var offerdesc = null;
var state = 'init';

var  peerConnections = {};
 //var pc = null;
var ids=new Map();   

var pcConfig = {
  'iceServers': [{
	  
  

   'urls': 'turn:stun.al.learningrtc.cn:3478',
    'credential': "mypasswd",
    'username': "garrylea"
  }]
};



function sendMessage(roomid, data){

	console.log('send message to other end', roomid, data);
	if(!socket){
		console.log('socket is null');
	}
	socket.emit('message', roomid, data);
}

function conn(){

	socket = io.connect();

	socket.on('joined', (roomid, id) => {
		console.log('receive joined message!', roomid, id);
		state = 'joined';
		if(ids[roomid]==null)
		{	var room=new Map();
			room.add(id);
			ids.add(room);
		}else{
			 room=ids.get(roomid);
			room.add(id);
		}
		

		//?????????????????????????????????????????????????????????peerConnection
		//?????????????????????otherjoin????????????
		//????????????????????????????????????????????????????????????
		//
		//create conn and bind media track
		createPeerConnection(id);
		bindTracks();

		btnConn.disabled = true;
		btnLeave.disabled = false;
		console.log('receive joined message, state=', state);
	});

	socket.on('otherjoin', (roomid) => {
		console.log('receive joined message:', roomid, state);

		//?????????????????????????????????????????????????????????????????? peerConnection
		//
		if(state === 'joined_unbind'){
			createPeerConnection(id);
			bindTracks();
		}

		state = 'joined_conn';
		call();

		console.log('receive other_join message, state=', state);
	});

	socket.on('full', (roomid, id) => {
		console.log('receive full message', roomid, id);
		socket.disconnect();
		hangup();
		closeLocalMedia();
		state = 'leaved';
		console.log('receive full message, state=', state);
		alert('the room is full!');
	});

	socket.on('leaved', (roomid, id) => {
		console.log('receive leaved message', roomid, id);
		state='leaved'
		socket.disconnect();
		console.log('receive leaved message, state=', state);

		btnConn.disabled = false;
		btnLeave.disabled = true;
	});

	socket.on('bye', (room, id) => {
		console.log('receive bye message', roomid, id);
		//state = 'created';
		//????????????????????????????????????????????????????????????
		//????????????????????????????????? 2, ?????????????????????
		//??????????????????????????????????????????peerconnection
		//??????????????????????????????peerconnection????????????
		//??????key:value????????????key=userid, value=peerconnection
		state = 'joined_unbind';
		hangup();
		console.log('receive bye message, state=', state);
	});

	socket.on('disconnect', (socket) => {
		console.log('receive disconnect message!', roomid);
		if(!(state === 'leaved')){
			hangup();
			closeLocalMedia();

		}
		state = 'leaved';
	
	});

	socket.on('message', (roomid, data) => {
		console.log('receive message!', roomid, data);

		if(data === null || data === undefined){
			console.error('the message is invalid!');
			return;	
		}

		if(data.hasOwnProperty('type') && data.type === 'offer') {
			
			pc.setRemoteDescription(new RTCSessionDescription(data));
			//create answer
			pc.createAnswer()
				.then(getAnswer)
				.catch(handleAnswerError);

		}else if(data.hasOwnProperty('type') && data.type === 'answer'){
			pc.setRemoteDescription(new RTCSessionDescription(data));
			bandwidth.disabled = false;
		
		}else if (data.hasOwnProperty('type') && data.type === 'candidate'){
			var candidate = new RTCIceCandidate({
				sdpMLineIndex: data.label,
				candidate: data.candidate
			});
			pc.addIceCandidate(candidate)
				.then(()=>{
					console.log('Successed to add ice candidate');	
				})
				.catch(err=>{
					console.error(err);	
				});
		
		}else{
			console.log('the message is invalid!', data);
		
		}
	
	});


	roomid = '111111'; 
	socket.emit('join', roomid);

	return true;
}

async function connSignalServer(){
	
	//??????????????????
	start();
	
	/*
	const net = await posenet.load({
    architecture: 'MobileNetV1',
    outputStride: defaultMobileNetStride,
    inputResolution: defaultMobileNetInputResolution,
    multiplier: defaultMobileNetMultiplier,
    quantBytes: defaultQuantBytes
  });
	detectPoseInRealTime(localVideo,net);
	*/
	
	

	/*setupWebcam().then(
        () => {
            console.log("shoq");
			conn();
            showResult();
        },
        (err) => {
            console.log(err);
        }
    )
	*/
	
	

	return true;
}

 function getMediaStream(stream){
	localStream = stream;	
	localVideo.srcObject = localStream;

	conn();

   bindPage(localVideo,local_output);
	
	
}

function getDeskStream(stream){
	localStream = stream;
}

function handleError(err){
	console.error('Failed to get Media Stream!', err);
}

function shareDesk(){

	if(IsPC()){
		navigator.mediaDevices.getDisplayMedia({video: true})
			.then(getDeskStream)
			.catch(handleError);

		return true;
	}

	return false;

}

function start(){

	if(!navigator.mediaDevices ||
		!navigator.mediaDevices.getUserMedia){
		console.error('the getUserMedia is not supported!');
		return;
	}else {

		var constraints = {
			video: true,
			audio: false 
		}



		navigator.mediaDevices.getUserMedia(constraints)
					.then(getMediaStream)
					.catch(handleError);
	}

}

function getRemoteStream(e){
	
	//remoteVideo.srcObject = e.streams[0];
	
	
	for(var i=0;i<e.length;i++)
	{
		remoteStream = e.streams[i];
		
		var remoteVideo = document.createElement('video');
		remoteVideo.srcObject = e.streams[i];
		remoteVideo.style.display=none;
		div_remotes.appendChild(remoteVideo);
		var remote_output = document.createElement('canvas');
		remote_output.id="remote_output_"+i;
		div_remotes.appendChild(remote_output);
		bindPage(remoteVideo,remote_output);
	}
	
}

function handleOfferError(err){
	console.error('Failed to create offer:', err);
}

function handleAnswerError(err){
	console.error('Failed to create answer:', err);
}

function getAnswer(desc){
	pc.setLocalDescription(desc);
	bandwidth.disabled = false;

	//send answer sdp
	sendMessage(roomid, desc);
}

function getOffer(desc){
	pc.setLocalDescription(desc);
	offerdesc = desc;

	//send offer sdp
	sendMessage(roomid, offerdesc);	

}

function createPeerConnection(id){
	pc=peerConnections[id];
	if (pc) {
        return pc;
      }

	//????????????????????????????????????????????????????????????.
	//??????????????????????????????map?????????
	//key=userid, value=peerconnection
	
	if(!pc){
		console.log('create RTCPeerConnection!');
		pc = new RTCPeerConnection(pcConfig);
		 peerConnections[id] = pc;
		

		pc.onicecandidate = (e)=>{

			if(e.candidate) {
				sendMessage(roomid, {
					type: 'candidate',
					label:event.candidate.sdpMLineIndex, 
					id:event.candidate.sdpMid, 
					candidate: event.candidate.candidate
				});
			}else{
				console.log('this is the end candidate');
			}
		}

		pc.ontrack = getRemoteStream;
		
		
	
	}else {
		console.log('the pc have be created!');
	}

	return;	
}

//??????????????? peerconnection????????????
//??????????????????????????????????????????
function bindTracks(){

	console.log('bind tracks into RTCPeerConnection!');

	if( pc === null && localStream === undefined) {
		console.error('pc is null or undefined!');
		return;
	}

	if(localStream === null && localStream === undefined) {
		console.error('localstream is null or undefined!');
		return;
	}

	//add all track into peer connection
	localStream.getTracks().forEach((track)=>{
		pc.addTrack(track, localStream);	
	});

}

function call(){
	
	if(state === 'joined_conn'){

		var offerOptions = {
			offerToRecieveAudio: 1,
			offerToRecieveVideo: 1
		}

		pc.createOffer(offerOptions)
			.then(getOffer)
			.catch(handleOfferError);
	}
}

function hangup(){

	if(!pc) {
		return;
	}

	offerdesc = null;
	
	pc.close();
	pc = null;

}

function closeLocalMedia(){

	if(!(localStream === null || localStream === undefined)){
		localStream.getTracks().forEach((track)=>{
			track.stop();
		});
	}
	localStream = null;
}

function leave() {

	socket.emit('leave', roomid); //notify server

	hangup();
	closeLocalMedia();

	btnConn.disabled = false;
	btnLeave.disabled = true;
	bandwidth.disabled = true;
}

function change_bw(){
	bandwidth.disabled = true;
	var bw = bandwidth.options[bandwidth.selectedIndex].value;

	var vsender = null;
	var senders = pc.getSenders();

	senders.forEach(sender => {
		if(sender && sender.track.kind === 'video'){
			vsender = sender;
		}
	});

	var parameters = vsender.getParameters();
	
	if(!parameters.encodings){
		parameters.encodings=[{}];	
	}

	if(bw === 'unlimited'){
		delete parameters.encodings[0].maxBitrate;
	}else{
		parameters.encodings[0].maxBitrate = bw * 1000;	
	}

	vsender.setParameters(parameters)
		.then(()=>{
			bandwidth.disabled = false;	
		})
		.catch(err => {
			console.error(err)
		});

	return;
}

// query getStats every second
/*
window.setInterval(() => {
  if (!pc) {
    return;
  }
  const sender = pc.getSenders()[0];
  if (!sender) {
    return;
  }
  sender.getStats().then(res => {
    res.forEach(report => {
      let bytes;
      let packets;
      if (report.type === 'outbound-rtp') {
        if (report.isRemote) {
          return;
        }
        const now = report.timestamp;
        bytes = report.bytesSent;
        packets = report.packetsSent;
        if (lastResult && lastResult.has(report.id)) {
          // calculate bitrate
          const bitrate = 8 * (bytes - lastResult.get(report.id).bytesSent) /
            (now - lastResult.get(report.id).timestamp);

          // append to chart
          bitrateSeries.addPoint(now, bitrate);
          bitrateGraph.setDataSeries([bitrateSeries]);
          bitrateGraph.updateEndDate();

          // calculate number of packets and append to chart
          packetSeries.addPoint(now, packets -
            lastResult.get(report.id).packetsSent);
          packetGraph.setDataSeries([packetSeries]);
          packetGraph.updateEndDate();
        }
      }
    });
    lastResult = res;
  });
}, 1000);

*/
btnConn.onclick = connSignalServer
btnLeave.onclick = leave;
bandwidth.onchange = change_bw;
