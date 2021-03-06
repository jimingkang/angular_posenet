import { combineReducers, createStore as createStore$1, compose, applyMiddleware } from 'redux';
import Thunk from 'redux-thunk';
import { __awaiter } from 'tslib';
import webrtcAdapter from 'webrtc-adapter';
import { Namespaces, JXT, JID, Utils, createClient, RTT, Constants } from 'stanza';
import { priorityQueue } from 'async';
import { EventEmitter } from 'events';
import { splitSections, parseMLine, matchPrefix } from 'sdp';
import { Component, createElement, Fragment } from 'react';
import { connect as connect$1 } from 'react-redux';

// Action Names
// ====================================================================
const SET_USER_PREFERENCE = '@andyet/SET_USER_PREFERENCE';
const JOIN_ROOM = '@andyet/JOIN_ROOM';
const LEAVE_ROOM = '@andyet/LEAVE_ROOM';
const LOCK_ROOM = '@andyet/LOCK_ROOM';
const UNLOCK_ROOM = '@andyet/UNLOCK_ROOM';
const DESTROY_ROOM = '@andyet/DESTROY_ROOM';
const SELF_UPDATED = '@andyet/SELF_UPDATED';
const JOIN_ROOM_FAILED = '@andyet/JOIN_ROOM_FAILED';
const JOIN_ROOM_SUCCESS = '@andyet/JOIN_ROOM_SUCCESS';
const ROOM_LOCKED = '@andyet/ROOM_LOCKED';
const ROOM_UNLOCKED = '@andyet/ROOM_UNLOCKED';
const KICK_PEER = '@andyet/KICK_PEER';
const PEER_ONLINE = '@andyet/PEER_ONLINE';
const PEER_OFFLINE = '@andyet/PEER_OFFLINE';
const PEER_UPDATED = '@andyet/PEER_UPDATED';
const CHAT_INCOMING = '@andyet/CHAT_INCOMING';
const CHAT_OUTGOING = '@andyet/CHAT_OUTGOING';
const CHAT_STATE_OUTGOING = '@andyet/CHAT_STATE_OUTGOING';
const RTT_OUTGOING = '@andyet/RTT_OUTGOING';
const ADD_MEDIA = '@andyet/ADD_MEDIA';
const REMOVE_MEDIA = '@andyet/REMOVE_MEDIA';
const MEDIA_UPDATED = '@andyet/MEDIA_UPDATED';
const SIGNALING_CLIENT = '@andyet/SIGNALING_CLIENT';
const SIGNALING_CLIENT_SHUTDOWN = '@andyet/SIGNALING_CLIENT_SHUTDOWN';
const CONNECTION_STATE_CHANGE = '@andyet/CONNECTION_STATE_CHANGE';
const RECEIVED_CONFIG = '@andyet/RECEIVED_CONFIG';
const RECEIVED_CONFIG_ERROR = '@andyet/RECEIVED_CONFIG_ERROR';
const QUEUE_TELEMETRY = '@andyet/QUEUE_TELEMETRY';
const TELEMETRY_SUCCESS = '@andyet/TELEMETRY_SUCCESS';
const JOIN_CALL = '@andyet/JOIN_CALL';
const LEAVE_CALL = '@andyet/LEAVE_CALL';
const SET_CALL_PREFERENCE = '@andyt/SET_CALL_PREFERENCE';
const PEER_CONNECTION_UPDATED = '@andyet/PEER_CONNECTION_UPDATED';
const PEER_CONNECTION_ADDED = '@andyet/PEER_CONNECTION_ADDED';
const PEER_CONNECTION_REMOVED = '@andyet/PEER_CONNECTION_REMOVED';
const DEVICES = '@andyet/DEVICES';
const CAMERA_PERMISSION_DENIED = '@andyet/CAMERA_PERMISSION_DENIED';
const MICROPHONE_PERMISSION_DENIED = '@andyet/MICROPHONE_PERMISSION_DENIED';
const DEVICE_CAPTURE = '@andyet/DEVICE_CAPTURE';
const SET_VIDEO_RESOLUTION_TIERS = '@andyet/SET_VIDEO_RESOLUTION_TIERS';
// Constants
// ====================================================================
const SDK_VERSION = '1.23.0';
const DIRECTION_INCOMING = 'incoming';
const DIRECTION_OUTGOING = 'outgoing';

// getConnectionForMedia
/**
 * @description
 *
 * @public
 *
 */
function getAPIConfig(state) {
    return state.simplewebrtc.api.config;
}
/**
 * @description
 *
 * @public
 *
 */
function getUserToken(state) {
    return state.simplewebrtc.api.token;
}
/**
 * @description
 *
 * @public
 *
 */
function getUser(state) {
    return state.simplewebrtc.user;
}
/**
 * @description
 *
 * @public
 *
 */
function getUserCustomerData(state) {
    return getAPIConfig(state).customerData;
}
/**
 * @description
 *
 * @public
 *
 */
function getConfigURL(state) {
    return state.simplewebrtc.api.configUrl;
}
/**
 * @description
 *
 * @public
 *
 */
function getClient(state) {
    return state.simplewebrtc.api.signalingClient;
}
/**
 * @description
 *
 * @public
 *
 */
function getQueuedTelemetry(state) {
    return state.simplewebrtc.api.queuedTelemetry;
}
/**
 * @description
 *
 * @public
 *
 */
function getConnectionState(state) {
    return state.simplewebrtc.api.connectionState;
}
/**
 * @description
 *
 * @public
 *
 */
function getUserDisplayName(state) {
    return state.simplewebrtc.user.displayName;
}
/**
 * @description
 *
 * @public
 *
 */
function getUserDataForRoom(state, roomAddress) {
    const config = getAPIConfig(state);
    const room = getRoomByAddress(state, roomAddress);
    const call = getCallForRoom(state, roomAddress);
    const localAudio = getLocalMedia(state, 'audio');
    const recentSpeaking = localAudio
        .filter(a => a.lastSpokeAt)
        .sort((a, b) => {
        const lastA = a.lastSpokeAt ? a.lastSpokeAt.valueOf() : 0;
        const lastB = b.lastSpokeAt ? b.lastSpokeAt.valueOf() : 0;
        return lastA - lastB;
    });
    return {
        address: room.selfAddress,
        affiliation: room.selfAffiliation,
        chatState: 'active',
        customerData: getAPIConfig(state).customerData,
        displayName: getUserDisplayName(state),
        id: config.id,
        joinedCall: call.joined,
        joinedCallAt: call.joinedAt,
        joinedRoomAt: room.joinedAt,
        lastSpokeAt: recentSpeaking.length ? recentSpeaking[0].lastSpokeAt : undefined,
        muted: false,
        requestingAttention: false,
        requestingMedia: getDesiredMediaTypes(state, roomAddress),
        role: room.selfRole,
        roomAddress,
        rtt: '',
        speaking: userIsSpeaking(state, true),
        volume: 0,
        volumeLimit: 0.8
    };
}
/**
 * @description
 *
 * @public
 *
 */
function getDesiredMediaTypes(state, roomAddress) {
    const defaultRequest = state.simplewebrtc.user.requestingMedia;
    if (roomAddress) {
        const call = getCallForRoom(state, roomAddress);
        if (call) {
            return call.requestingMedia || defaultRequest;
        }
    }
    return defaultRequest;
}
/**
 * @description
 *
 * @public
 *
 */
function getPushToTalkEnabled(state) {
    return state.simplewebrtc.user.pushToTalk;
}
/**
 * @description
 *
 * @public
 *
 */
function getPeerByAddress(state, peerAddress) {
    return state.simplewebrtc.peers[peerAddress];
}
/**
 * @description
 *
 * @public
 *
 */
function getRooms(state) {
    return state.simplewebrtc.rooms;
}
/**
 * @description
 *
 * @public
 *
 */
function getRoomByAddress(state, roomAddress) {
    return state.simplewebrtc.rooms[roomAddress];
}
/**
 * @description
 *
 * @public
 *
 */
function getRoomByProvidedName(state, roomName) {
    for (const roomAddress of Object.keys(state.simplewebrtc.rooms)) {
        if (state.simplewebrtc.rooms[roomAddress].providedName === roomName) {
            return state.simplewebrtc.rooms[roomAddress];
        }
    }
}
/**
 * @description
 *
 * @public
 *
 */
function getPeersForRoom(state, roomAddress) {
    const peers = [];
    for (const peerAddress of Object.keys(state.simplewebrtc.peers)) {
        if (state.simplewebrtc.peers[peerAddress].roomAddress === roomAddress) {
            peers.push(state.simplewebrtc.peers[peerAddress]);
        }
    }
    return peers;
}
/**
 * @description
 *
 * @public
 *
 */
function getChatsForRoom(state, roomAddress) {
    const chats = [];
    for (const id of Object.keys(state.simplewebrtc.chats)) {
        const chat = state.simplewebrtc.chats[id];
        if (chat.roomAddress === roomAddress) {
            chats.push(chat);
        }
    }
    return chats.sort((a, b) => (a.time < b.time ? -1 : a.time > b.time ? 1 : 0));
}
/**
 * @description
 *
 * @public
 *
 */
function getGroupedChatsForRoom(state, roomAddress, maxDuration = 5 * 60) {
    const groupedChats = [];
    const chats = getChatsForRoom(state, roomAddress);
    let lastGroup;
    for (const chat of chats) {
        const newSender = !lastGroup || chat.senderAddress !== lastGroup.senderAddress;
        const prevChat = lastGroup ? lastGroup.chats[lastGroup.chats.length - 1] : undefined;
        const newDisplayName = !lastGroup || (prevChat && chat.displayName && chat.displayName !== prevChat.displayName);
        let expired = false;
        if (maxDuration) {
            // Also start a new group if the current group has lasted for a significant amount of time.
            expired =
                !lastGroup || Number(chat.time) > Number(lastGroup.chats[0].time) + maxDuration * 1000;
        }
        if (newSender || newDisplayName || expired) {
            let peer = getPeerByAddress(state, chat.senderAddress) || {};
            if (chat.direction === 'outgoing') {
                peer = getUserDataForRoom(state, roomAddress);
            }
            lastGroup = {
                chats: [chat],
                direction: chat.direction,
                displayName: peer.displayName || chat.displayName,
                endTime: chat.time,
                peer,
                senderAddress: chat.senderAddress,
                startTime: chat.time
            };
            groupedChats.push(lastGroup);
        }
        else if (lastGroup) {
            lastGroup.chats.push(chat);
            lastGroup.endTime = chat.time;
        }
    }
    return groupedChats;
}
/**
 * @description
 *
 * @public
 *
 */
function getLastSentChat(state, roomAddress) {
    const chats = getChatsForRoom(state, roomAddress);
    return chats.filter(c => c.direction === DIRECTION_OUTGOING).slice(-1)[0];
}
/**
 * @description
 *
 * @public
 *
 */
function getChatComposers(state, roomAddress) {
    const results = [];
    for (const id of Object.keys(state.simplewebrtc.peers)) {
        const peer = state.simplewebrtc.peers[id];
        if (peer.roomAddress === roomAddress && peer.chatState === 'composing') {
            results.push(peer);
        }
    }
    return results;
}
/**
 * @description
 *
 * @public
 *
 */
function getCallForRoom(state, roomAddress) {
    return state.simplewebrtc.calls[roomAddress];
}
/**
 * @description
 *
 * @public
 *
 */
function getMedia(state) {
    return state.simplewebrtc.media;
}
/**
 * @description
 *
 * @public
 *
 */
function getMediaTrack(state, id) {
    return state.simplewebrtc.media[id];
}
/**
 * @description
 *
 * @public
 *
 */
function getDeviceForMediaTrack(state, id) {
    const track = getMediaTrack(state, id);
    if (!track) {
        return;
    }
    let deviceId;
    const deviceLabel = track.track.label;
    const deviceKind = `${track.kind}input`;
    if (track.track.getSettings) {
        const settings = track.track.getSettings();
        deviceId = settings.deviceId;
    }
    const devices = state.simplewebrtc.devices.devices;
    if (deviceId) {
        for (const device of devices) {
            if (device.deviceId === deviceId) {
                return device;
            }
        }
    }
    for (const device of devices) {
        if (deviceLabel === device.label && deviceKind === device.kind) {
            return device;
        }
    }
}
/**
 * @description
 *
 * @public
 *
 */
function getDevices(state, kind) {
    const devices = state.simplewebrtc.devices.devices;
    if (!kind) {
        return devices;
    }
    return devices.filter(device => device.kind === kind);
}
/**
 * @description
 *
 * @public
 *
 */
function getDevicePermissions(state) {
    const devices = state.simplewebrtc.devices;
    return {
        cameraPermissionDenied: devices.cameraPermissionDenied,
        cameraPermissionGranted: devices.cameraPermissionGranted,
        hasAudioOutput: devices.hasAudioOutput,
        hasCamera: devices.hasCamera,
        hasMicrophone: devices.hasMicrophone,
        microphonePermissionDenied: devices.microphonePermissionDenied,
        microphonePermissionGranted: devices.microphonePermissionGranted,
        requestingCameraCapture: devices.requestingCameraCapture,
        requestingCapture: devices.requestingCapture,
        requestingMicrophoneCapture: devices.requestingMicrophoneCapture
    };
}
/**
 * @description
 *
 * @public
 *
 */
function getMediaForPeer(state, peerAddress, kind) {
    const results = [];
    for (const id of Object.keys(state.simplewebrtc.media)) {
        const media = state.simplewebrtc.media[id];
        if (media.owner === peerAddress) {
            if (!kind || kind === media.kind) {
                results.push(media);
            }
        }
    }
    return results;
}
/**
 * @description
 *
 * @public
 *
 */
function getLocalMedia(state, kind) {
    const results = [];
    for (const id of Object.keys(state.simplewebrtc.media)) {
        const media = state.simplewebrtc.media[id];
        if (media.source === 'local') {
            if (!kind || kind === media.kind) {
                results.push(media);
            }
        }
    }
    return results.sort((a, b) => a.createdAt - b.createdAt);
}
/**
 * @description
 *
 * @public
 *
 */
function getRemoteMedia(state, kind) {
    const results = [];
    for (const id of Object.keys(state.simplewebrtc.media)) {
        const media = state.simplewebrtc.media[id];
        if (media.source === 'remote') {
            if (!kind || kind === media.kind) {
                results.push(media);
            }
        }
    }
    return results;
}
/**
 * @description
 *
 * @public
 *
 */
function getSharedMedia(state, kind) {
    const results = [];
    for (const id of Object.keys(state.simplewebrtc.media)) {
        const media = state.simplewebrtc.media[id];
        if (media.source === 'local' && media.shared) {
            if (!kind || kind === media.kind) {
                results.push(media);
            }
        }
    }
    return results;
}
/**
 * @description
 *
 * @public
 *
 */
function getAudioOutputDevice(state) {
    return state.simplewebrtc.user.audioOutputDeviceId;
}
/**
 * @description
 *
 * @public
 *
 */
function getGlobalVolumeLimit(state) {
    return state.simplewebrtc.user.globalVolumeLimit;
}
/**
 * @description
 *
 * @public
 *
 */
function getJoinedCalls(state) {
    const results = [];
    for (const id of Object.keys(state.simplewebrtc.calls)) {
        const call = state.simplewebrtc.calls[id];
        const room = getRoomByAddress(state, call.roomAddress);
        if (call.joined && room && room.joined) {
            results.push(call);
        }
    }
    return results;
}
/**
 * @description
 *
 * @public
 *
 */
function getPeersForCall(state, roomAddress) {
    const results = [];
    for (const id of Object.keys(state.simplewebrtc.peers)) {
        const peer = state.simplewebrtc.peers[id];
        if (peer.roomAddress === roomAddress && peer.joinedCall) {
            results.push(peer);
        }
    }
    return results;
}
/**
 * @description
 *
 * @public
 *
 */
function getActiveSpeakersForCall(state, roomAddress) {
    const results = [];
    for (const id of Object.keys(state.simplewebrtc.peers)) {
        const peer = state.simplewebrtc.peers[id];
        if (peer.roomAddress === roomAddress && peer.joinedCall && peer.speaking) {
            results.push(peer);
        }
    }
    return results;
}
/**
 * @description
 *
 * @public
 *
 */
function getConnections(state) {
    return state.simplewebrtc.connections;
}
/**
 * @description
 *
 * @public
 *
 */
function getConnectionsForPeer(state, peerAddress) {
    const results = [];
    const connections = getConnections(state);
    for (const id of Object.keys(connections)) {
        const connection = connections[id];
        if (connection.peerAddress === peerAddress) {
            results.push(connection);
        }
    }
    return results;
}
/**
 * @description
 *
 * @public
 *
 */
function countPeersWantingAudio(state) {
    let count = 0;
    for (const id of Object.keys(state.simplewebrtc.peers)) {
        const peer = state.simplewebrtc.peers[id];
        if (peer.requestingMedia === 'audio') {
            count += 1;
        }
    }
    return count;
}
/**
 * @description
 *
 * @public
 *
 */
function countPeersWantingVideo(state) {
    let count = 0;
    for (const id of Object.keys(state.simplewebrtc.peers)) {
        const peer = state.simplewebrtc.peers[id];
        if (peer.requestingMedia === 'video') {
            count += 1;
        }
    }
    return count;
}
/**
 * @description
 *
 * @public
 */
function isSupportedBrowser(state) {
    return !!('RTCPeerConnection' in window) && !!('mediaDevices' in navigator);
}
/**
 * @description
 *
 * @private
 */
function userIsSpeaking(state, sharedAudioOnly = true) {
    const localAudio = getLocalMedia(state, 'audio');
    return (localAudio.filter(a => !a.localDisabled && !a.externalDisabled && a.speaking && (sharedAudioOnly ? a.shared : true)).length > 0);
}
/**
 * @description
 *
 * @private
 */
function userIsSpeakingWhileMuted(state, sharedAudioOnly = true) {
    const localAudio = getLocalMedia(state, 'audio');
    return (localAudio.filter(a => (a.localDisabled || a.externalDisabled) && a.speaking && (sharedAudioOnly ? a.shared : true)).length > 0);
}
/**
 * @description
 *
 * @private
 */
function getVideoResolutionTiers(state) {
    return state.simplewebrtc.api.videoResolutionTiers || [];
}

var Selectors = /*#__PURE__*/Object.freeze({
    __proto__: null,
    getAPIConfig: getAPIConfig,
    getUserToken: getUserToken,
    getUser: getUser,
    getUserCustomerData: getUserCustomerData,
    getConfigURL: getConfigURL,
    getClient: getClient,
    getQueuedTelemetry: getQueuedTelemetry,
    getConnectionState: getConnectionState,
    getUserDisplayName: getUserDisplayName,
    getUserDataForRoom: getUserDataForRoom,
    getDesiredMediaTypes: getDesiredMediaTypes,
    getPushToTalkEnabled: getPushToTalkEnabled,
    getPeerByAddress: getPeerByAddress,
    getRooms: getRooms,
    getRoomByAddress: getRoomByAddress,
    getRoomByProvidedName: getRoomByProvidedName,
    getPeersForRoom: getPeersForRoom,
    getChatsForRoom: getChatsForRoom,
    getGroupedChatsForRoom: getGroupedChatsForRoom,
    getLastSentChat: getLastSentChat,
    getChatComposers: getChatComposers,
    getCallForRoom: getCallForRoom,
    getMedia: getMedia,
    getMediaTrack: getMediaTrack,
    getDeviceForMediaTrack: getDeviceForMediaTrack,
    getDevices: getDevices,
    getDevicePermissions: getDevicePermissions,
    getMediaForPeer: getMediaForPeer,
    getLocalMedia: getLocalMedia,
    getRemoteMedia: getRemoteMedia,
    getSharedMedia: getSharedMedia,
    getAudioOutputDevice: getAudioOutputDevice,
    getGlobalVolumeLimit: getGlobalVolumeLimit,
    getJoinedCalls: getJoinedCalls,
    getPeersForCall: getPeersForCall,
    getActiveSpeakersForCall: getActiveSpeakersForCall,
    getConnections: getConnections,
    getConnectionsForPeer: getConnectionsForPeer,
    countPeersWantingAudio: countPeersWantingAudio,
    countPeersWantingVideo: countPeersWantingVideo,
    isSupportedBrowser: isSupportedBrowser,
    userIsSpeaking: userIsSpeaking,
    userIsSpeakingWhileMuted: userIsSpeakingWhileMuted,
    getVideoResolutionTiers: getVideoResolutionTiers
});

class Mesh {
    constructor(client) {
        this.jingle = client.jingle;
        this.dispatch = client.dispatch;
        this.getState = client.getState;
        this.sfu = client.sfu;
        this.updateQueue = priorityQueue((time, done) => __awaiter(this, void 0, void 0, function* () {
            const state = this.getState();
            const audioPeersCount = countPeersWantingAudio(state);
            const videoPeersCount = countPeersWantingVideo(state);
            const calls = getJoinedCalls(state);
            const media = getMedia(state);
            const sharedMedia = getSharedMedia(state);
            const sharedVideoCount = sharedMedia.filter(m => m.kind === 'video').length;
            const totalVideosCount = sharedVideoCount * videoPeersCount;
            this.sfu.setPeerCount(Math.max(audioPeersCount, videoPeersCount));
            try {
                if (this.sfu.enabled) {
                    yield this.sfu.ready;
                }
                yield Promise.all(sharedMedia.map(track => this.sfu.sendMedia(track.track, track.stream, track.screenCapture)));
            }
            catch (err) {
                if (done) {
                    done();
                }
                return;
            }
            const activeCalls = new Set();
            for (const call of calls) {
                if (call.joined) {
                    activeCalls.add(call.roomAddress);
                }
            }
            const videoResolutionTiers = getVideoResolutionTiers(state);
            let appliedTier = videoResolutionTiers[0];
            if (!this.sfu.enabled) {
                for (let i = 0; i < videoResolutionTiers.length; i++) {
                    const tier = videoResolutionTiers[i];
                    const nextTier = videoResolutionTiers[i + 1];
                    if (tier[0] === totalVideosCount || !nextTier) {
                        appliedTier = tier;
                        break;
                    }
                    if (nextTier[0] > totalVideosCount) {
                        appliedTier = tier;
                        break;
                    }
                }
            }
            if (appliedTier) {
                const { width, height, frameRate } = appliedTier[1];
                this.dispatch(adjustVideoCaptureResolution(width, height, frameRate));
            }
            // The total bandwidth we want to send depends on the number of outgoing
            // video tracks. It is specified in kilobits per second.
            const totalMaxBitrate = 1800000;
            const sessionMaxBitrate = totalMaxBitrate / ((this.sfu.enabled ? 1 : videoPeersCount) * sharedVideoCount);
            // Dispose of any orphaned connections after leaving a call
            const allConnections = getConnections(state);
            for (const connId of Object.keys(allConnections)) {
                const conn = allConnections[connId];
                const sess = this.jingle.sessions[conn.id];
                if (sess && !activeCalls.has(conn.roomAddress)) {
                    sess.end();
                }
            }
            for (const call of calls) {
                const peers = getPeersForCall(state, call.roomAddress);
                for (const peer of peers) {
                    const needsVideo = new Set();
                    const needsAudio = new Set();
                    const wantsVideo = peer.requestingMedia === 'video';
                    const wantsAudio = peer.requestingMedia === 'video' || peer.requestingMedia === 'audio';
                    const peerSharedMedia = new Map();
                    const overSharedSessions = new Set();
                    const connections = getConnectionsForPeer(state, peer.address);
                    for (const conn of connections) {
                        if (conn.sendingAudioMediaId) {
                            peerSharedMedia.set(conn.sendingAudioMediaId, 'audio');
                            if (!wantsAudio ||
                                !media[conn.sendingAudioMediaId] ||
                                !media[conn.sendingAudioMediaId].shared) {
                                overSharedSessions.add(conn.id);
                                if (conn.sendingVideoMediaId && wantsVideo) {
                                    needsVideo.add(conn.sendingVideoMediaId);
                                }
                            }
                        }
                        if (conn.sendingVideoMediaId) {
                            const sess = this.jingle.sessions[conn.id];
                            if (sess) {
                                sess.setMaximumBitrate(sessionMaxBitrate);
                            }
                            peerSharedMedia.set(conn.sendingVideoMediaId, 'video');
                            const video = media[conn.sendingVideoMediaId];
                            if ((!wantsVideo && !video.screenCapture) || !video || !video.shared) {
                                overSharedSessions.add(conn.id);
                                if (conn.sendingAudioMediaId && wantsAudio) {
                                    needsAudio.add(conn.sendingAudioMediaId);
                                }
                            }
                        }
                    }
                    for (const track of sharedMedia) {
                        if (!peerSharedMedia.has(track.id)) {
                            if (track.kind === 'audio' && wantsAudio) {
                                needsAudio.add(track.id);
                            }
                            if (track.kind === 'video' && wantsVideo) {
                                needsVideo.add(track.id);
                            }
                            if (track.kind === 'video' && track.screenCapture && wantsAudio) {
                                needsVideo.add(track.id);
                            }
                        }
                    }
                    for (const sessionId of overSharedSessions) {
                        const session = this.jingle.sessions[sessionId];
                        if (session) {
                            session.end();
                        }
                    }
                    const pairedTracks = new Map();
                    for (const id of [...needsAudio, ...needsVideo]) {
                        const track = media[id];
                        if (track) {
                            const pair = pairedTracks.get(track.stream.id) || {};
                            pair[track.kind] = track;
                            pairedTracks.set(track.stream.id, pair);
                        }
                    }
                    for (const pair of pairedTracks.values()) {
                        const session = this.jingle.createMediaSession(peer.address);
                        if (pair.audio) {
                            session.addTrack(pair.audio.track, pair.audio.stream);
                            this.dispatch(updateConnection(peer.address, session.sid, {
                                sendingAudioMediaId: pair.audio.id
                            }));
                        }
                        if (pair.video) {
                            session.addTrack(pair.video.track, pair.video.stream);
                            this.dispatch(updateConnection(peer.address, session.sid, {
                                sendingVideoMediaId: pair.video.id
                            }));
                        }
                        session.onDescriptionInfo = (changes, cb) => {
                            for (const content of changes.contents || []) {
                                const app = content.application;
                                if (!app) {
                                    continue;
                                }
                                const profile = app.simulcast && app.simulcast.profile;
                                if (profile) {
                                    this.sfu.setProfile(session.sid, app.simulcast.profile);
                                }
                            }
                            cb();
                        };
                        session.start({
                            offerToReceiveAudio: false,
                            offerToReceiveVideo: false
                        }, () => {
                            if (pair.video) {
                                session.setMaximumBitrate(sessionMaxBitrate);
                            }
                            if (pair.audio && pair.audio.localDisabled) {
                                session.mute(session.role, 'audio');
                            }
                            if (pair.video && pair.video.localDisabled) {
                                session.mute(session.role, 'video');
                            }
                            if (pair.video && pair.video.screenCapture) {
                                const creator = 'initiator';
                                session.send('description-info', {
                                    contents: [
                                        {
                                            application: {
                                                applicationType: Namespaces.NS_JINGLE_RTP_1,
                                                screenCaptures: [{ id: pair.video.id }]
                                            },
                                            creator,
                                            name: 'video'
                                        }
                                    ]
                                });
                            }
                        });
                    }
                }
            }
            if (done) {
                done();
            }
        }), 1);
        // We use multiple uni-directional media sessions, so don't
        // perform tie-breaking on session initiate requests
        this.jingle.performTieBreak = () => false;
        this.jingle.createPeerConnection = (session, opts) => {
            return this.sfu.createPeerConnection(session, opts);
        };
        this.updateICEServers();
    }
    updateICEServers() {
        this.jingle.resetICEServers();
        const config = getAPIConfig(this.getState());
        for (const server of config.iceServers) {
            this.jingle.addICEServer(server);
        }
    }
    updateConnections(reason) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!RTCPeerConnection) {
                return;
            }
            // A lot of situations trigger multiple changes that
            // will need connections updated. A very brief delay
            // allows those changes to get batched together.
            setTimeout(() => {
                // We don't need to have more than 1 queued update
                // at a time.
                if (this.updateQueue.length() > 1) {
                    return;
                }
                this.updateQueue.push(reason || Date.now(), 0);
            }, 100);
        });
    }
    plugin() {
        return () => {
            this.jingle.on('incoming', (session) => {
                const state = this.getState();
                const call = getCallForRoom(state, session.peerID.split('/')[0]);
                if (call && call.joined) {
                    session.accept();
                }
                else {
                    session.end();
                }
                session.onDescriptionInfo = (changes, cb) => {
                    const connections = getConnections(this.getState());
                    for (const content of changes.contents || []) {
                        const app = content.application;
                        if (!app) {
                            continue;
                        }
                        const screenCapture = app.screenCaptures && app.screenCaptures.length;
                        if (screenCapture) {
                            this.dispatch(updateMedia(connections[session.sid].receivingVideoMediaId, {
                                screenCapture
                            }));
                        }
                    }
                    cb();
                };
            });
            this.jingle.on('terminated', (session, reason) => {
                this.dispatch(removeConnection(session.peerID, session.sid));
                const reasonCondition = reason.condition;
                if (reasonCondition && reasonCondition !== 'success' && reasonCondition !== 'gone') {
                    console.error('Session terminated with error:', session.sid, reason);
                    this.dispatch({
                        payload: {
                            peerAddress: session.peerID,
                            updated: {
                                sessionFailed: true
                            }
                        },
                        type: PEER_UPDATED
                    });
                }
                // Probably terminated session because the peer is gone. Give the rest of
                // the system a chance to update before attempting to restart connections.
                setTimeout(() => {
                    this.updateConnections('session-ended');
                }, reasonCondition === 'failed-transport' ? 500 : 2000);
            });
            this.jingle.on('createdSession', (session) => {
                this.dispatch(addConnection(session.peerID, session.sid));
            });
            this.jingle.on('peerTrackAdded', (session, track, stream) => {
                // Track IDs can get reused across sessions, so we prefix with the session ID for
                // remote tracks. Local tracks always have unique IDs.
                const remoteTrackId = `${session.sid}#${track.id}`;
                this.dispatch(addRemoteMedia(session.peerID.split('/')[0], session.peerID, remoteTrackId, track, stream, false));
                if (track.kind === 'audio') {
                    this.dispatch(updateConnection(session.peerID, session.sid, {
                        receivingAudioMediaId: remoteTrackId
                    }));
                }
                if (track.kind === 'video') {
                    this.dispatch(updateConnection(session.peerID, session.sid, {
                        receivingVideoMediaId: remoteTrackId
                    }));
                }
            });
            this.jingle.on('peerTrackRemoved', (session, track) => {
                // Track IDs can get reused across sessions, so we prefix with the session ID for
                // remote tracks. Local tracks always have unique IDs.
                const remoteTrackId = `${session.sid}#${track.id}`;
                this.dispatch(removeMedia(remoteTrackId));
            });
            this.jingle.on('connectionState', (session) => {
                this.dispatch(updateConnection(session.peerID, session.sid, {
                    connectionState: session.connectionState
                }));
                if (session.connectionState === 'connected') {
                    this.dispatch(peerUpdated(session.peerID, {
                        sessionFailed: false
                    }));
                }
                // If we detect a failed ICE state and we are the responder, that means we
                // were using ICE Lite with the SFU. End the session to have the peer
                // trigger resending from the SFU.
                if (session.role === 'responder' && session.connectionState === 'failed') {
                    session.end('failed-transport');
                    return;
                }
                // Responder side doesn't restart ICE. Give initiator a chance, but do eventually end.
                if ((session.role === 'responder' && session.connectionState === 'disconnected') ||
                    session.connectionState === 'interrupted') {
                    setTimeout(() => {
                        if (session.connectionState === 'disconnected' ||
                            session.connectionState === 'interrupted') {
                            session.end('failed-transport');
                        }
                    }, 5000);
                }
            });
            this.jingle.on('mute', (session, info) => {
                const state = this.getState();
                const connections = getConnections(state);
                if (info.name === 'audio') {
                    this.dispatch(updateMedia(connections[session.sid].receivingAudioMediaId, {
                        remoteDisabled: true
                    }));
                }
                else if (info.name === 'video') {
                    this.dispatch(updateMedia(connections[session.sid].receivingVideoMediaId, {
                        remoteDisabled: true
                    }));
                }
                else {
                    throw new Error('Invalid mute property');
                }
            });
            this.jingle.on('unmute', (session, info) => {
                const state = this.getState();
                const connections = getConnections(state);
                if (info.name === 'audio') {
                    this.dispatch(updateMedia(connections[session.sid].receivingAudioMediaId, {
                        remoteDisabled: false
                    }));
                }
                else if (info.name === 'video') {
                    this.dispatch(updateMedia(connections[session.sid].receivingVideoMediaId, {
                        remoteDisabled: false
                    }));
                }
                else {
                    throw new Error('Invalid mute property');
                }
            });
        };
    }
    notifyPeers(media, action) {
        const state = this.getState();
        const connections = getConnections(state);
        Object.values(getClient(state).jingle.sessions).forEach(session => {
            const conn = connections[session.sid];
            if (conn &&
                (conn.sendingAudioMediaId === media.id || conn.sendingVideoMediaId === media.id)) {
                switch (action) {
                    case 'mute':
                        session.mute(session.role, media.kind);
                        break;
                    case 'unmute':
                        session.unmute(session.role, media.kind);
                        break;
                }
            }
        });
    }
}

// --------------------------------------------------------------------
const MMUC_NS = 'http://andyet.net/xmlns/mmuc';
const TALKY_CORE_NS = 'https://talky.io/ns/core';
const defs = [
    {
        element: 'transport',
        fields: {
            iceLite: JXT.childBoolean(TALKY_CORE_NS, 'ice-lite')
        },
        namespace: Namespaces.NS_JINGLE_ICE_0,
        path: 'iq.jingle.contents.transport',
        type: Namespaces.NS_JINGLE_ICE_0,
        typeField: 'transportType'
    },
    {
        element: 'transport',
        fields: {
            iceLite: JXT.childBoolean(TALKY_CORE_NS, 'ice-lite')
        },
        namespace: Namespaces.NS_JINGLE_ICE_UDP_1,
        path: 'iq.jingle.contents.transport',
        type: Namespaces.NS_JINGLE_ICE_UDP_1,
        typeField: 'transportType'
    },
    {
        element: 'user',
        fields: {
            customerData: JXT.textJSON(),
            roomId: JXT.attribute('rid'),
            sessionId: JXT.attribute('sid'),
            type: JXT.attribute('type')
        },
        namespace: TALKY_CORE_NS,
        path: 'presence.talkyUserInfo'
    },
    {
        aliases: [
            {
                multiple: true,
                path: 'iq.jingle.contents.application.screenCaptures',
                selector: Namespaces.NS_JINGLE_RTP_1
            }
        ],
        element: 'screen',
        fields: {
            id: JXT.attribute('id')
        },
        namespace: TALKY_CORE_NS
    },
    {
        aliases: [
            {
                path: 'iq.jingle.contents.application.simulcast',
                selector: Namespaces.NS_JINGLE_RTP_1
            }
        ],
        element: 'simulcast',
        fields: {
            profile: JXT.attribute('profile')
        },
        namespace: TALKY_CORE_NS
    },
    {
        element: 'conf',
        fields: {
            bridged: JXT.booleanAttribute('bridged'),
            media: JXT.attribute('media')
        },
        namespace: MMUC_NS,
        path: 'presence.mmuc'
    },
    {
        element: 'status',
        fields: {
            active: JXT.booleanAttribute('active'),
            media: JXT.attribute('media'),
            mode: JXT.attribute('mode'),
            ready: JXT.booleanAttribute('ready'),
            recordable: JXT.booleanAttribute('recordable'),
            stamp: JXT.dateAttribute('stamp')
        },
        namespace: MMUC_NS,
        path: 'message.mmucStatus'
    },
    {
        element: 'recording',
        fields: {
            active: JXT.booleanAttribute('active'),
            stamp: JXT.dateAttribute('stamp'),
            state: JXT.attribute('state'),
            uri: JXT.attribute('uri')
        },
        namespace: MMUC_NS,
        path: 'message.mmucStats.recording'
    },
    {
        element: 'state',
        fields: {
            speaking: JXT.booleanAttribute('speaking')
        },
        namespace: MMUC_NS,
        path: 'message.mmuc'
    },
    {
        element: 'query',
        fields: {
            endMedia: JXT.childBoolean(null, 'end-media'),
            startRecording: JXT.childBoolean(null, 'start-recording')
        },
        namespace: MMUC_NS,
        path: 'iq.mmuc'
    },
    {
        element: 'start-media',
        fields: {
            media: JXT.attribute('media')
        },
        namespace: MMUC_NS,
        path: 'iq.mmuc.startMedia'
    },
    {
        element: 'end-recording',
        fields: {
            uri: JXT.attribute('uri')
        },
        namespace: MMUC_NS,
        path: 'iq.mmuc.endRecording'
    }
];

class SFU extends EventEmitter {
    constructor(client, browser) {
        super();
        this.minimumPeerCount = 2;
        this.peerCount = 0;
        this.enabled = false;
        this.ready = Promise.resolve();
        this.sessions = new Set();
        this.sharedMedia = new Map();
        this.jingle = client.jingle;
        this.getState = client.getState;
        this.browser = browser;
        this.jingle.on('terminated', session => {
            this.sessions.delete(session.sid);
        });
        const config = getAPIConfig(this.getState()).sfuServer;
        if (config && config.url) {
            this.rpcUrl = config.url;
            this.minimumPeerCount = config.minimumPeers;
            this.client = new SFUClient(this.rpcUrl, config.password);
            this.client.on('iceConnectionState', ({ consumerId, iceConnectionState }) => {
                const session = this.jingle.sessions[consumerId];
                if (session) {
                    const pc = session.pc;
                    pc.iceConnectionState = iceConnectionState;
                    pc.emit('iceconnectionstatechange');
                }
            });
            this.ready = this.client.connect();
        }
        this.setPeerCount(0);
    }
    setPeerCount(count) {
        this.peerCount = count;
        if (!this.rpcUrl) {
            return false;
        }
        clearTimeout(this.shutdownTimeout);
        if (count >= this.minimumPeerCount && !this.enabled) {
            this.enabled = true;
            return true;
        }
        if (count < this.minimumPeerCount && this.enabled) {
            // Allow some leeway in case a peer dropped and is rejoining.
            this.shutdownTimeout = setTimeout(() => {
                // If we're still below our peer threshold, now we can shutdown.
                if (this.peerCount < this.minimumPeerCount) {
                    this.enabled = false;
                    for (const sid of this.sessions) {
                        this.jingle.sessions[sid].end();
                    }
                    this.sessions = new Set();
                    for (const [id, shared] of this.sharedMedia) {
                        this.client.send('DISPOSE', {
                            id
                        });
                        shared.pc.close();
                    }
                    this.sharedMedia = new Map();
                    this.emit('disabled');
                }
            }, 5000);
        }
        return false;
    }
    sendMedia(track, stream, screenCapture) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.enabled || this.sharedMedia.has(stream.id)) {
                return;
            }
            const pc = new RTCPeerConnection({
                iceServers: this.jingle.iceServers
            });
            this.sharedMedia.set(stream.id, { pc, ready: false });
            pc.oniceconnectionstatechange = () => {
                if (pc.iceConnectionState === 'connected' || pc.iceConnectionState === 'completed') {
                    this.sharedMedia.set(stream.id, { pc, ready: true });
                    this.emit('media-ready:' + stream.id);
                    const connections = getConnections(this.getState());
                    for (const [sid, conn] of Object.entries(connections)) {
                        if (conn.sendingAudioMediaId === track.id || conn.sendingVideoMediaId === track.id) {
                            this.jingle.sessions[sid].end();
                        }
                    }
                    this.emit('media-ready');
                }
                if (pc.iceConnectionState === 'failed') {
                    this.sharedMedia.delete(stream.id);
                    this.emit('media-failed:' + stream.id);
                    this.emit('media-failed');
                }
            };
            try {
                for (const streamTrack of stream.getTracks()) {
                    if (streamTrack.kind === 'audio') {
                        pc.addTrack(streamTrack, stream);
                    }
                    else {
                        pc.addTransceiver(streamTrack, {
                            sendEncodings: !screenCapture
                                ? [
                                    { rid: 'low', active: true, scaleResolutionDownBy: 4 },
                                    { rid: 'medium', active: true, scaleResolutionDownBy: 2 },
                                    { rid: 'high', active: true }
                                ]
                                : undefined,
                            streams: [stream]
                        });
                    }
                }
                const offer = yield pc.createOffer();
                if (!screenCapture && (this.browser === 'chrome' || this.browser === 'safari')) {
                    const sections = splitSections(offer.sdp);
                    const header = sections.shift();
                    for (const [sdpMlineIndex, media] of sections.entries()) {
                        const mline = parseMLine(media);
                        if (mline.kind !== 'video') {
                            continue;
                        }
                        const match = media.match(/a=ssrc:(\d+) cname:(.*)\r\n/);
                        const msid = media.match(/a=ssrc:(\d+) msid:(.*)\r\n/);
                        if (match && msid) {
                            const lines = media
                                .trim()
                                .split('\r\n')
                                .filter(line => {
                                return !(line.startsWith('a=ssrc:') || line.startsWith('a=ssrc-group:FID'));
                            });
                            const videoSSRC1 = parseInt(match[1], 10);
                            const rtxSSRC1 = matchPrefix(media, 'a=ssrc-group:FID ')[0].split(' ')[2];
                            lines.push('a=ssrc:' + videoSSRC1 + ' cname:' + match[2]);
                            lines.push('a=ssrc:' + videoSSRC1 + ' msid:' + msid[2]);
                            lines.push('a=ssrc:' + rtxSSRC1 + ' cname:' + match[2]);
                            lines.push('a=ssrc:' + rtxSSRC1 + ' msid:' + msid[2]);
                            const videoSSRC2 = videoSSRC1 + 1;
                            const rtxSSRC2 = videoSSRC1 + 2;
                            lines.push('a=ssrc:' + videoSSRC2 + ' cname:' + match[2]);
                            lines.push('a=ssrc:' + videoSSRC2 + ' msid:' + msid[2]);
                            lines.push('a=ssrc:' + rtxSSRC2 + ' cname:' + match[2]);
                            lines.push('a=ssrc:' + rtxSSRC2 + ' msid:' + msid[2]);
                            const videoSSRC3 = videoSSRC1 + 3;
                            const rtxSSRC3 = videoSSRC1 + 4;
                            lines.push('a=ssrc:' + videoSSRC3 + ' cname:' + match[2]);
                            lines.push('a=ssrc:' + videoSSRC3 + ' msid:' + msid[2]);
                            lines.push('a=ssrc:' + rtxSSRC3 + ' cname:' + match[2]);
                            lines.push('a=ssrc:' + rtxSSRC3 + ' msid:' + msid[2]);
                            lines.push('a=ssrc-group:FID ' + videoSSRC1 + ' ' + rtxSSRC1);
                            lines.push('a=ssrc-group:FID ' + videoSSRC2 + ' ' + rtxSSRC2);
                            lines.push('a=ssrc-group:FID ' + videoSSRC3 + ' ' + rtxSSRC3);
                            lines.push('a=ssrc-group:SIM ' + videoSSRC1 + ' ' + videoSSRC2 + ' ' + videoSSRC3);
                            sections[sdpMlineIndex] = lines.join('\r\n') + '\r\n';
                            offer.sdp = [header, ...sections].join('');
                        }
                    }
                }
                yield pc.setLocalDescription(offer);
                yield this.ready;
                const answer = yield this.client.send('INGEST', {
                    id: stream.id,
                    sdp: offer.sdp
                });
                yield pc.setRemoteDescription({ type: 'answer', sdp: answer.sdp });
            }
            catch (err) {
                this.sharedMedia.delete(stream.id);
                this.emit('media-failed:' + stream.id);
                this.emit('media-failed');
            }
        });
    }
    setProfile(sessionId, profile) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.sessions.has(sessionId)) {
                return;
            }
            return this.client.send('SET_CONSUMER_PROFILE', {
                id: sessionId,
                profile
            });
        });
    }
    requestProfile(trackId, profile) {
        const connections = getConnections(this.getState());
        for (const [sessionId, conn] of Object.entries(connections)) {
            if (conn.receivingVideoMediaId === trackId) {
                return this.jingle.sessions[sessionId].send('description-info', {
                    contents: [
                        {
                            application: {
                                applicationType: Namespaces.NS_JINGLE_RTP_1,
                                simulcast: { profile }
                            },
                            creator: 'initiator',
                            name: 'video'
                        }
                    ]
                });
            }
        }
    }
    createPeerConnection(session, options) {
        if (this.enabled && session.isInitiator) {
            this.sessions.add(session.sid);
            const state = this.getState();
            const peer = getPeerByAddress(state, session.peerID);
            const room = getRoomByAddress(state, JID.toBare(session.peerID));
            return new ProxyPeerConnection(session.sid, room.id, peer.id, this, this.client);
        }
        else {
            return new RTCPeerConnection(options);
        }
    }
    getInfoForPeer(peerAddress) {
        return getPeerByAddress(this.getState(), peerAddress);
    }
    waitForMedia(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const shared = this.sharedMedia.get(id);
            if (!shared || !shared.ready) {
                return new Promise((resolve, reject) => {
                    const success = () => {
                        this.off('media-failed:' + id, failed);
                        resolve();
                    };
                    const failed = () => {
                        this.off('media-ready:' + id, success);
                        reject();
                    };
                    this.once('media-ready:' + id, success);
                    this.once('media-failed:' + id, failed);
                });
            }
        });
    }
}
class SFUClient extends EventEmitter {
    constructor(url, credential) {
        super();
        this.connected = false;
        this.disconnected = false;
        this.callbacks = new Map();
        this.url = url;
        this.credential = credential;
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.connected) {
                return;
            }
            if (this.connecting) {
                return this.connecting;
            }
            this.connecting = new Promise((resolve, reject) => {
                this.callbacks = new Map();
                this.socket = new WebSocket(this.url);
                this.socket.onopen = () => __awaiter(this, void 0, void 0, function* () {
                    this.send('AUTH', {
                        token: this.credential
                    }, true).then(() => {
                        this.connected = true;
                        this.connecting = undefined;
                        resolve();
                    });
                });
                this.socket.onmessage = event => {
                    const packet = JSON.parse(event.data);
                    if (this.callbacks.has(packet.id) && (packet.result || packet.error)) {
                        const { resolve: resolveMethod, reject: rejectMethod } = this.callbacks.get(packet.id);
                        if (packet.result) {
                            resolveMethod(packet.result);
                        }
                        else if (packet.error) {
                            rejectMethod(packet.error);
                        }
                    }
                    if (packet.method === 'CONSUMER_ICE_STATE') {
                        this.emit('iceConnectionState', {
                            consumerId: packet.params.id,
                            iceConnectionState: packet.params.iceConnectionState
                        });
                    }
                };
                this.socket.onclose = () => {
                    const wasConnected = this.connected;
                    this.callbacks = new Map();
                    this.connected = false;
                    if (!wasConnected) {
                        reject();
                    }
                };
            });
            return this.connecting;
        });
    }
    disconnect() {
        this.disconnected = true;
        this.socket.close();
    }
    send(method, params, immediate) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!immediate) {
                yield this.connect();
            }
            return new Promise((resolve, reject) => {
                const id = Utils.uuid();
                this.callbacks.set(id, { resolve, reject });
                this.socket.send(JSON.stringify({
                    id,
                    jsonrpc: '2.0',
                    method,
                    params
                }));
            });
        });
    }
}
class ProxyPeerConnection extends EventEmitter {
    constructor(id, roomId, peerId, sfu, client) {
        super();
        this.id = id;
        this.roomId = roomId;
        this.peerId = peerId;
        this.sfu = sfu;
        this.client = client;
        this.iceConnectionState = 'new';
        this.signalingState = 'stable';
        this.activated = false;
    }
    addTrack(track, stream) {
        this.sourceId = stream.id;
        this.includeAudio = this.includeAudio || track.kind === 'audio';
        this.includeVideo = this.includeVideo || track.kind === 'video';
    }
    close() {
        if (this.activated) {
            this.client
                .send('REMOVE_CONSUMER', {
                id: this.id
            })
                .catch(err => {
                this.activated = false;
            });
        }
    }
    getReceivers() {
        return [];
    }
    getSenders() {
        return [];
    }
    addEventListener(event, handler) {
        this.on(event, handler);
    }
    set onicecandidate(handler) {
        this.on('icecandidate', handler);
    }
    set oniceconnectionstatechange(handler) {
        this.on('iceconnectionstatechange', handler);
    }
    getStats() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Map();
        });
    }
    addIceCandidate(cand) {
        return __awaiter(this, void 0, void 0, function* () {
            return;
        });
    }
    createOffer() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.sfu.waitForMedia(this.sourceId);
            const offer = yield this.client.send('CREATE_CONSUMER', {
                audio: this.includeAudio,
                id: this.id,
                peerId: this.peerId,
                roomId: this.roomId,
                source: this.sourceId,
                video: this.includeVideo
            });
            this.activated = true;
            return {
                sdp: offer.sdp,
                type: 'offer'
            };
        });
    }
    createAnswer() {
        return __awaiter(this, void 0, void 0, function* () {
            return;
        });
    }
    setLocalDescription(desc) {
        return __awaiter(this, void 0, void 0, function* () {
            return;
        });
    }
    setRemoteDescription(desc) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.client.send('START_CONSUMER', {
                id: this.id,
                sdp: desc.sdp
            });
        });
    }
}

class SignalingClient {
    constructor(dispatch, getState, opts) {
        this.terminating = false;
        this.reconnectAttempts = 0;
        this.dispatch = dispatch;
        this.getState = getState;
        this.rttBuffers = new Map();
        this.xmpp = createClient(Object.assign({ allowResumption: false, transports: {
                websocket: opts.wsURL
            }, useStreamManagement: false }, opts));
        this.jingle = this.xmpp.jingle;
        this.xmpp.stanzas.define(defs);
        this.sfu = new SFU(this, webrtcAdapter.browserDetails.browser);
        this.mesh = new Mesh(this);
        this.sfu.on('media-ready', () => {
            this.mesh.updateConnections('sfu-media-ready');
        });
        this.sfu.on('media-failed', () => {
            this.mesh.updateConnections('sfu-media-failed');
        });
        this.sfu.on('disabled', () => {
            this.mesh.updateConnections('sfu-disabled');
        });
        this.xmpp.use(this.mesh.plugin());
        this.xmpp.on('session:started', () => {
            this.xmpp.sendPresence();
            this.xmpp.enableKeepAlive({
                interval: 90
            });
            this.reconnectAttempts = 0;
            this.dispatch(connectionStateChanged('connected'));
        });
        this.xmpp.on('disconnected', () => {
            if (this.terminating) {
                return;
            }
            this.reconnectAttempts += 1;
            this.dispatch(connectionStateChanged('disconnected'));
            if (this.reconnectTimer) {
                clearTimeout(this.reconnectTimer);
            }
            this.reconnectTimer = setTimeout(() => {
                const state = this.getState();
                const configUrl = getConfigURL(state);
                const userData = getUserToken(state);
                this.dispatch(connect(configUrl, userData));
            }, 1000 * (this.reconnectAttempts + 1) + Math.random() * 2000);
        });
        this.xmpp.on('muc:available', pres => {
            const roomAddress = JID.toBare(pres.from);
            const peerAddress = pres.from;
            const state = this.getState();
            const room = getRoomByAddress(state, roomAddress);
            if (!room) {
                return;
            }
            if (pres.muc && pres.muc.statusCodes.indexOf('110') >= 0) {
                this.dispatch(selfUpdated(roomAddress, peerAddress, room.id, pres.muc.role, pres.muc.affiliation));
                return;
            }
            if (!this.rttBuffers.has(peerAddress)) {
                const buffer = new RTT.DisplayBuffer(({ text }) => {
                    this.dispatch(peerUpdated(peerAddress, {
                        rtt: text
                    }));
                });
                this.rttBuffers.set(peerAddress, buffer);
            }
            const customerData = pres.talkyUserInfo.customerData || {};
            this.dispatch(peerOnline(roomAddress, peerAddress, {
                affiliation: pres.muc.affiliation,
                customerData,
                displayName: customerData.displayName || pres.nick,
                id: pres.talkyUserInfo.sessionId,
                joinedCall: !!pres.mmuc,
                requestingMedia: (pres.mmuc || {}).media,
                role: pres.muc.role,
                userAddress: pres.muc.jid
            }));
        });
        this.xmpp.on('muc:unavailable', pres => {
            if (pres.muc.statusCodes &&
                pres.muc.statusCodes.indexOf(Constants.MUCStatusCode.SelfPresence) >= 0) {
                let endMedia = true;
                if (pres.muc.destroy && pres.muc.destroy.jid) {
                    endMedia = false;
                    this.dispatch(roomReplaced(JID.toBare(pres.from), pres.muc.destroy.jid, pres.muc.destroy.password));
                }
                this.dispatch(leaveRoom(JID.toBare(pres.from), endMedia));
                return;
            }
            this.rttBuffers.delete(pres.from);
            this.dispatch(peerOffline(JID.toBare(pres.from), pres.from));
        });
        this.xmpp.on('chat:state', msg => {
            this.dispatch(peerUpdated(msg.from, {
                chatState: msg.chatState
            }));
        });
        this.xmpp.on('attention', msg => {
            this.dispatch(peerUpdated(msg.from, {
                requestingAttention: true
            }));
            setTimeout(() => {
                this.dispatch(peerUpdated(msg.from, {
                    requestingAttention: false
                }));
            }, 5000);
        });
        this.xmpp.on('message', msg => {
            if (msg.jsonPayloads) {
                const roomAddress = JID.toBare(msg.from);
                const peerAddress = msg.from;
                const room = getRoomByAddress(this.getState(), roomAddress);
                if (room && room.selfAddress === msg.from) {
                    // Skip processing our own reflected commands
                    return;
                }
                const peer = getPeerByAddress(this.getState(), peerAddress);
                if (!peer) {
                    return;
                }
                this.xmpp.emit('swrtc-command', {
                    data: msg.jsonPayloads[0].data,
                    peer,
                    room,
                    scope: msg.type === 'groupchat' ? 'room' : 'peer',
                    type: msg.jsonPayloads[0].type
                });
                return;
            }
            if (msg.type !== 'groupchat') {
                return;
            }
            if (msg.rtt) {
                const buffer = this.rttBuffers.get(msg.from);
                if (buffer) {
                    buffer.process(msg.rtt);
                }
            }
            if (msg.body) {
                const buffer = this.rttBuffers.get(msg.from);
                if (buffer) {
                    buffer.commit();
                }
                this.dispatch(receiveChat(JID.toBare(msg.from), msg.from, {
                    body: msg.body,
                    displayName: msg.nick,
                    id: msg.id,
                    replace: msg.replace,
                    time: msg.delay ? msg.delay.timestamp : new Date()
                }));
            }
        });
        this.xmpp.on('message', msg => this.processMessage(msg));
    }
    connect() {
        this.xmpp.connect();
    }
    disconnect() {
        this.terminating = true;
        this.dispatch(connectionStateChanged('disconnected'));
        this.xmpp.disconnect();
    }
    joinRoom(roomAddress, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const initialState = this.getState();
            const config = getAPIConfig(initialState);
            try {
                const joinedPresence = yield this.xmpp.joinRoom(roomAddress, config.id, {
                    muc: {
                        password,
                        type: 'join'
                    },
                    nick: getUserDisplayName(initialState)
                });
                const state = this.getState();
                const room = getRoomByAddress(state, roomAddress);
                if (!room) {
                    return;
                }
                yield this.checkLockStatus(roomAddress, room.providedPassword);
                this.dispatch(joinRoomSuccess(roomAddress, joinedPresence.from, joinedPresence.talkyUserInfo.roomId, joinedPresence.muc.role, joinedPresence.muc.affiliation));
                if (room && room.autoJoinCall) {
                    this.dispatch(joinCall(roomAddress, getDesiredMediaTypes(state, roomAddress)));
                }
            }
            catch (err) {
                this.dispatch(joinRoomFailed(roomAddress, {
                    banned: err.error && err.error.condition === 'forbidden',
                    passwordRequired: err.error && err.error.condition === 'not-authorized',
                    roomNotStarted: err.error && err.error.condition === 'recipient-unavailable'
                }));
            }
        });
    }
    destroyRoom(roomAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.xmpp.destroyRoom(roomAddress);
        });
    }
    kickPeerFromRoom(roomAddress, peerAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.xmpp.setRoomAffiliation(roomAddress, peerAddress, 'outcast');
        });
    }
    sendRoomPresence(roomAddress, opts = {}) {
        const state = this.getState();
        const displayName = getUserDisplayName(state);
        const room = getRoomByAddress(state, roomAddress);
        const call = getCallForRoom(state, roomAddress);
        const media = getDesiredMediaTypes(state, roomAddress);
        if (!room || !room.joined) {
            return;
        }
        this.xmpp.sendPresence(Object.assign({ mmuc: call && call.joined
                ? {
                    media
                }
                : undefined, nick: displayName, to: roomAddress }, opts));
    }
    sendAllRoomsPresence(opts = {}) {
        const state = this.getState();
        const rooms = Object.keys(getRooms(state));
        for (const roomAddress of rooms) {
            this.sendRoomPresence(roomAddress, opts);
        }
    }
    sendAllCallsSpeakingUpdate(speaking) {
        const state = this.getState();
        const calls = getJoinedCalls(state);
        for (const call of calls) {
            this.xmpp.sendMessage({
                mmuc: {
                    speaking
                },
                to: call.roomAddress,
                type: 'groupchat'
            });
        }
    }
    lockRoom(roomAddress, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const state = this.getState();
            const room = getRoomByAddress(state, roomAddress);
            if (!room || !room.joined || room.selfAffiliation !== 'owner') {
                return;
            }
            try {
                yield this.xmpp.configureRoom(roomAddress, {
                    fields: [
                        {
                            name: 'FORM_TYPE',
                            value: 'http://jabber.org/protocol/muc#roomconfig'
                        },
                        {
                            name: 'muc#roomconfig_whois',
                            value: 'moderators'
                        },
                        {
                            name: 'muc#roomconfig_roomsecret',
                            value: password
                        },
                        {
                            name: 'muc#roomconfig_passwordprotectedroom',
                            value: true
                        }
                    ]
                });
                this.dispatch(roomLocked(roomAddress, password));
            }
            catch (err) {
                console.error(err);
            }
        });
    }
    unlockRoom(roomAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            const state = this.getState();
            const room = getRoomByAddress(state, roomAddress);
            if (!room || !room.joined || room.selfAffiliation !== 'owner') {
                return;
            }
            try {
                yield this.xmpp.configureRoom(roomAddress, {
                    fields: [
                        {
                            name: 'FORM_TYPE',
                            type: 'hidden',
                            value: 'http://jabber.org/protocol/muc#roomconfig'
                        },
                        {
                            name: 'muc#roomconfig_whois',
                            type: 'text-single',
                            value: 'moderators'
                        },
                        {
                            name: 'muc#roomconfig_roomsecret',
                            type: 'text-single',
                            value: ''
                        },
                        {
                            name: 'muc#roomconfig_passwordprotectedroom',
                            type: 'boolean',
                            value: true
                        }
                    ]
                });
                this.dispatch(roomUnlocked(roomAddress));
            }
            catch (err) {
                console.error(err);
            }
        });
    }
    fetchRoomConfig(roomAddress, initial = false) {
        return __awaiter(this, void 0, void 0, function* () {
            const config = {};
            const state = this.getState();
            const room = getRoomByAddress(state, roomAddress);
            if (!initial && (!room || !room.joined)) {
                throw new Error('Room not joined');
            }
            const form = yield this.xmpp.getRoomConfig(roomAddress);
            for (const field of form.fields) {
                if (field.name === 'muc#roomconfig_roomsecret') {
                    if (field.value) {
                        config.password = field.value;
                    }
                    else {
                        config.password = undefined;
                    }
                }
            }
            return config;
        });
    }
    checkLockStatus(roomAddress, providedPassword, forceInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            const room = getRoomByAddress(this.getState(), roomAddress);
            if (!room) {
                return;
            }
            if (room.selfAffiliation === 'owner' && !forceInfo) {
                try {
                    const config = yield this.fetchRoomConfig(roomAddress, true);
                    if (config.password) {
                        this.dispatch(roomLocked(roomAddress, config.password));
                    }
                    else if (providedPassword) {
                        this.dispatch(lockRoom(roomAddress, providedPassword));
                    }
                    else {
                        this.dispatch(roomUnlocked(roomAddress));
                    }
                }
                catch (err) {
                    console.error(err);
                    return this.checkLockStatus(roomAddress, providedPassword, true);
                }
            }
            else {
                try {
                    const disco = yield this.xmpp.getDiscoInfo(roomAddress);
                    if (disco.features.indexOf('muc_passwordprotected') >= 0) {
                        this.dispatch(roomLocked(roomAddress));
                    }
                    else {
                        this.dispatch(roomUnlocked(roomAddress));
                    }
                }
                catch (err) {
                    console.error(err);
                }
            }
        });
    }
    processMessage(msg) {
        return __awaiter(this, void 0, void 0, function* () {
            const roomAddress = JID.toBare(msg.from);
            const room = getRoomByAddress(this.getState(), roomAddress);
            if (msg.type === 'groupchat' && msg.mmuc) {
                if (room && room.selfAddress !== msg.from && msg.mmuc) {
                    this.dispatch(peerUpdated(msg.from, {
                        speaking: msg.mmuc.speaking || false
                    }));
                }
            }
            if (!msg.muc || msg.muc.type === 'direct-invite') {
                return;
            }
            if (msg.muc.statusCodes && msg.muc.statusCodes.indexOf('104') >= 0) {
                yield this.checkLockStatus(roomAddress);
            }
        });
    }
}

let REPORTING_INTERVAL;
function sleep(timeout, throwError = false) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            setTimeout(() => (throwError ? reject() : resolve()), timeout);
        });
    });
}
/**
 * Fetch service configuration from the API.
 *
 * @private
 *
 * @param configUrl string
 * @param maxTries number
 * @param delay number
 * @param timeout number
 */
function fetchConfig(configUrl, userData, maxTries = 10, delay = 1000, timeout = 10000) {
    return __awaiter(this, void 0, void 0, function* () {
        let attemptCount = 0;
        let error;
        while (attemptCount <= maxTries) {
            try {
                const data = yield Promise.race([
                    fetch(configUrl, {
                        body: JSON.stringify({
                            clientVersion: SDK_VERSION,
                            token: userData
                        }),
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json'
                        },
                        method: 'POST'
                    }),
                    sleep(timeout, true)
                ]);
                if (!data.ok) {
                    throw new Error('SimpleWebRTC configuration request failed: ' + data.status);
                }
                const config = yield data.json();
                if (userData && !config.customerData) {
                    console.error('ESWRTC_003. View more information at https://docs.simplewebrtc.com');
                }
                return config;
            }
            catch (err) {
                error = err;
                attemptCount += 1;
                yield sleep(delay);
            }
        }
        if (error) {
            console.error('ESWRTC_001. View more information at https://docs.simplewebrtc.com');
            throw error;
        }
    });
}
// ====================================================================
/**
 * @description
 * Everything starts here.
 *
 * Connect to the API service.
 *
 * The `configUrl` value is provided to you as part of your SimpleWebRTC subscription.
 *
 * The `userData` value is a signed JWT, signed using the API secret provided to you as part of your SimpleWebRTC subscription.
 *
 * The data encoded in the `userData` JWT will be sent to the peers in any rooms joined. Likewise, `userData` from other peers will be made available in the `customerData` field of their peer objects. Uses for the `userData` JWT include providing an avatar URL or a custom username.
 *
 * The `userData` is _not_ used by SimpleWebRTC itself beyond making it available to you.
 *
 * @public
 *
 * @param configUrl The URL used to fetch the service configuration
 * @param userData A signed JWT containing the customer data you wish to have propragated to other peers
 */
function connect(configUrl, userData) {
    return (dispatch, getState) => __awaiter(this, void 0, void 0, function* () {
        let config;
        dispatch(connectionStateChanged('connecting'));
        try {
            config = yield fetchConfig(configUrl, userData);
            dispatch(receivedConfig(configUrl, config, userData));
        }
        catch (err) {
            dispatch(receivedConfigError());
            dispatch(connectionStateChanged('failed'));
            return;
        }
        const signalingClient = new SignalingClient(dispatch, getState, {
            jid: config.userId,
            password: config.credential,
            resource: config.id,
            wsURL: config.signalingUrl
        });
        dispatch({
            payload: signalingClient,
            type: SIGNALING_CLIENT
        });
        signalingClient.connect();
    });
}
/**
 * @description
 * Leaves all rooms and disconnects from the SimpleWebRTC service.
 *
 * @public
 */
function disconnect() {
    return (dispatch, getState) => {
        const signalingClient = getClient(getState());
        if (signalingClient) {
            signalingClient.disconnect();
        }
        dispatch({
            type: SIGNALING_CLIENT_SHUTDOWN
        });
    };
}
/**
 * Service configuration fetched from the API.
 *
 * @private
 *
 * @param config APIConfig
 */
function receivedConfig(configUrl, config, userData) {
    return {
        payload: {
            config,
            configUrl,
            token: userData
        },
        type: RECEIVED_CONFIG
    };
}
function receivedConfigError(err) {
    return {
        type: RECEIVED_CONFIG_ERROR
    };
}
/**
 * Queue a telemetry event to be sent in the next reporting batch.
 *
 * @private
 */
function queueTelemetry(eventType, { roomId, peerId, data }) {
    return {
        payload: {
            data: JSON.stringify(data),
            peerId,
            roomId
        },
        type: QUEUE_TELEMETRY
    };
}
/**
 * Send queued telemetry events as a single batch.
 *
 * @private
 */
function sendQueuedTelemetry() {
    return (dispatch, getState) => {
        const state = getState();
        const config = getAPIConfig(state);
        const telemetryUrl = config.telemetryUrl;
        const queuedTelemetry = getQueuedTelemetry(state);
        const batchSize = Math.min(queuedTelemetry.length, 10);
        if (batchSize === 0) {
            return;
        }
        const batch = queuedTelemetry.slice(0, batchSize);
        if (!telemetryUrl) {
            return;
        }
        const payload = {
            body: JSON.stringify({
                batch
            }),
            headers: {
                authorization: `Bearer ${config.credential}`
            },
            method: 'POST'
        };
        fetch(telemetryUrl, payload).then(() => {
            dispatch(telemetrySucess(batchSize));
        });
    };
}
/**
 * Report the number of successfully posted telemetry events.
 *
 * @private
 *
 * @param batchSize number
 */
function telemetrySucess(batchSize) {
    return {
        payload: batchSize,
        type: TELEMETRY_SUCCESS
    };
}
/**
 * Start the telemetry reporting interval timer.
 *
 * @private
 *
 * @param interval number
 */
function enableTelemetry(interval = 5000) {
    return dispatch => {
        disableTelemetry();
        REPORTING_INTERVAL = setInterval(() => {
            dispatch(sendQueuedTelemetry());
        }, interval);
    };
}
/**
 * Clear the telemetry reporting interval timer.
 *
 * @private
 */
function disableTelemetry() {
    clearInterval(REPORTING_INTERVAL);
}
/**
 * The connection state of the signaling client changed.
 *
 * @private
 *
 * @param connectionState string
 */
function connectionStateChanged(connectionState) {
    return (dispatch, getState) => {
        const client = getClient(getState());
        dispatch({
            payload: connectionState,
            type: CONNECTION_STATE_CHANGE
        });
        if (client) {
            client.mesh.updateConnections('connection-state-change');
        }
    };
}
/**
 * Send a custom command message to a room.
 *
 * Commands sent to a room will be broadcast to _all_ peers.
 *
 * Commands are not acknowledged; they are fire-and-forget.
 *
 * @private
 *
 * @param roomAddress string The room address that will receive the command.
 * @param datatype string A data type indicating how the command data should be interpreted by the receiver.
 * @param command any JSON-serializable command data.
 */
function sendRoomCommand(roomAddress, datatype, command = {}) {
    return sendCommand(roomAddress, 'groupchat', datatype, command);
}
/**
 * Send a custom command message to a peer.
 *
 * Commands are not acknowledged; they are fire-and-forget.
 *
 * @private
 *
 * @param peerAddress string The peer address that will receive the command.
 * @param datatype string A data type indicating how the command data should be interpreted by the receiver.
 * @param command any JSON-serializable command data.
 */
function sendPeerCommand(peerAddress, datatype, command = {}) {
    return sendCommand(peerAddress, 'normal', datatype, command);
}
/**
 * Send a custom command message to a room or peer.
 *
 * Commands sent to a room will be broadcast to _all_ peers.
 *
 * Commands are not acknowledged; they are fire-and-forget.
 *
 * @private
 *
 * @param destinationAddress string The room or peer address that will receive the command.
 * @param datatype string A data type indicating how the command data should be interpreted by the receiver.
 * @param command any JSON-serializable command data.
 */
function sendCommand(destinationAddress, messageType, datatype, command = {}) {
    return (dispatch, getState) => {
        const client = getClient(getState());
        if (client) {
            client.xmpp.sendMessage({
                jsonPayloads: [{ type: datatype, data: command }],
                to: destinationAddress,
                type: messageType
            });
        }
    };
}

const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
const AudioContext = window.AudioContext || window.webkitAudioContext;
// Check if the volume of fundamental freq is > threshold
function frequencyAnalyser(analyser, range, freqSpread, bins) {
    analyser.getFloatFrequencyData(bins);
    const start = range[0];
    const end = range[1];
    const startIndex = Math.round(start / freqSpread);
    const endIndex = Math.round(end / freqSpread);
    const fundamentalFreqArray = bins.slice(startIndex, endIndex);
    const avgVol = fundamentalFreqArray.reduce((a, b) => a + b, 0) / fundamentalFreqArray.length;
    return avgVol;
}
const defaultSettings = {
    threshold: -65
};
function setGlobalVoiceActivityThreshold(threshold) {
    defaultSettings.threshold = threshold;
}
class Hark extends EventEmitter {
    constructor(audioStream, opts = {}) {
        super();
        this.running = false;
        this.smoothing = 0.1;
        this.interval = 50;
        this.history = 10;
        this.speakingHistory = [];
        this.frequencyRange = [85, 300];
        this.fftSize = 512;
        this.speaking = false;
        this.previousVolume = -Infinity;
        this.stoppedReceivingVolume = Date.now();
        if (!AudioContext) {
            return;
        }
        if (!Hark.audioContext) {
            Hark.audioContext = new AudioContext();
            // workaround for Chrome 66+ suspending the audio context due to autoplay policy changes.
            // See https://bugs.chromium.org/p/chromium/issues/detail?id=835767
            const check = () => {
                if (!(this.running && Hark.audioContext) || Hark.audioContext.state !== 'suspended') {
                    return;
                }
                setTimeout(check, 1000);
                Hark.audioContext.resume();
            };
            setTimeout(check, 1000);
        }
        this.smoothing = opts.smoothing || 0.1;
        this.interval = opts.interval || 50;
        this.threshold = opts.threshold;
        this.history = opts.history || 10;
        this.frequencyRange = opts.frequencyRange || [85, 300]; // [85, 255] is the typical fundamental freq range for human speech
        this.fftSize = opts.fftSize || 512;
        if (isSafari) {
            this.threshold = -20;
        }
        this.analyser = Hark.audioContext.createAnalyser();
        this.analyser.fftSize = this.fftSize;
        this.analyser.smoothingTimeConstant = this.smoothing;
        this.fftBins = new Float32Array(this.analyser.frequencyBinCount);
        this.frequencySpread = Hark.audioContext.sampleRate / this.analyser.fftSize;
        this.sourceNode = Hark.audioContext.createMediaStreamSource(audioStream);
        this.sourceNode.connect(this.analyser);
        this.start();
    }
    stop() {
        this.running = false;
        this.emit('volume', -100, this.threshold || defaultSettings.threshold);
        if (this.speaking) {
            this.speaking = false;
            this.emit('stopped-speaking');
        }
        clearInterval(this.intervalTimer);
        this.analyser.disconnect();
        this.sourceNode.disconnect();
        return;
    }
    start() {
        this.running = true;
        this.speakingHistory = new Array(this.history).fill(0);
        this.intervalTimer = setInterval(() => {
            if (!this.running) {
                return;
            }
            const threshold = this.threshold || defaultSettings.threshold;
            const avgVolume = frequencyAnalyser(this.analyser, this.frequencyRange, this.frequencySpread, this.fftBins);
            const aboveThreshold = avgVolume > threshold ? 1 : 0;
            let stoppedReceivingVolume;
            if (!isFinite(avgVolume) || avgVolume <= -100) {
                if (isFinite(this.previousVolume) && this.previousVolume > -100) {
                    stoppedReceivingVolume = Date.now();
                }
                else {
                    stoppedReceivingVolume = this.stoppedReceivingVolume;
                }
            }
            this.emit('volume', avgVolume, threshold);
            if (stoppedReceivingVolume !== this.stoppedReceivingVolume) {
                if (stoppedReceivingVolume) {
                    this.emit('stopped-receiving-volume', stoppedReceivingVolume);
                }
                else {
                    this.emit('started-receiving-volume');
                }
            }
            this.previousVolume = avgVolume;
            this.stoppedReceivingVolume = stoppedReceivingVolume;
            let timesAboveThreshold = 0;
            for (const hist of this.speakingHistory) {
                timesAboveThreshold += hist;
            }
            if (aboveThreshold && !this.speaking) {
                if (timesAboveThreshold >= 5) {
                    this.speaking = true;
                    this.emit('speaking');
                }
            }
            else if (!aboveThreshold && this.speaking) {
                if (timesAboveThreshold === 0) {
                    this.speaking = false;
                    this.emit('stopped-speaking');
                }
            }
            this.speakingHistory.shift();
            this.speakingHistory.push(aboveThreshold);
        }, this.interval);
    }
}

function waitForMediaLoaded(track, stream, timeout = 500) {
    if (track.kind === 'audio') {
        return waitForAudioLoaded(stream);
    }
    if (track.kind === 'video') {
        return waitForVideoLoaded(stream, timeout);
    }
    return Promise.resolve({
        loaded: false
    });
}
function waitForAudioLoaded(stream) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise(resolve => {
            let player = document.createElement('audio');
            const onLoaded = () => {
                if (player) {
                    player.pause();
                    player.removeEventListener('oncanplay', onLoaded);
                    player.srcObject = null;
                    player = undefined;
                    resolve({
                        loaded: true
                    });
                }
            };
            player.muted = true;
            player.autoplay = true;
            player.oncanplay = onLoaded;
            player.srcObject = stream;
        });
    });
}
function waitForVideoLoaded(stream, timeout) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise(resolve => {
            let player = document.createElement('video');
            const onLoaded = () => {
                if (player) {
                    const height = player.videoHeight;
                    const width = player.videoWidth;
                    player.pause();
                    player.removeEventListener('oncanplay', onLoaded);
                    player.srcObject = null;
                    player = undefined;
                    resolve({
                        height,
                        loaded: true,
                        width
                    });
                }
            };
            player.setAttribute('playsinline', 'playsinline');
            player.muted = true;
            player.autoplay = true;
            player.oncanplay = onLoaded;
            player.srcObject = stream;
            setTimeout(onLoaded, timeout);
        });
    });
}

function isBrowser() {
    return typeof document !== 'undefined';
}

function createHarker(id, stream, dispatch) {
    const hark = new Hark(stream);
    hark.on('stopped-receiving-volume', inputLost => {
        dispatch(updateMedia(id, {
            inputLost
        }));
    });
    hark.on('started-receiving-volume', () => {
        dispatch(updateMedia(id, {
            inputDetected: true,
            inputLost: undefined
        }));
    });
    hark.on('speaking', () => {
        dispatch(updateMedia(id, {
            speaking: true
        }));
    });
    hark.on('stopped-speaking', () => {
        dispatch(updateMedia(id, {
            lastSpokeAt: new Date(Date.now()),
            speaking: false
        }));
    });
    return hark;
}
// ====================================================================
/**
 * Add a local media track.
 *
 * @private
 *
 * @param track
 * @param stream
 * @param replaces
 */
function addLocalMedia(media) {
    return (dispatch, getState) => {
        let newReplaces = media.replaces;
        if (media.replaces) {
            const state = getState();
            const prevMedia = getMediaTrack(state, media.replaces);
            if (prevMedia) {
                if (!prevMedia.shared) {
                    dispatch(removeMedia(prevMedia.id));
                    newReplaces = prevMedia.replaces;
                }
            }
        }
        media.track.onmute = () => {
            dispatch(updateMedia(media.id, {
                externalDisabled: true
            }));
        };
        media.track.onunmute = () => {
            dispatch(updateMedia(media.id, {
                externalDisabled: false
            }));
        };
        dispatch({
            payload: Object.assign(Object.assign({}, media), { replaces: newReplaces }),
            type: ADD_MEDIA
        });
    };
}
/**
 * @description
 * Adds a local audio track to the set of managed media.
 *
 * **NOTE:** Adding a local audio track does not immediately share the audio to peers. Use `shareLocalMedia()` with the track ID to do so after adding.
 *
 * @public
 *
 * @param track Local audio track
 * @param stream Stream containing the audio track
 * @param replaces
 */
function addLocalAudio(track, stream, replaces) {
    if (track.kind !== 'audio') {
        throw new Error('Incorrect media type. Expected audio, got: ' + track.kind);
    }
    return (dispatch, getState) => {
        let hark;
        let utilityStream;
        if (isBrowser()) {
            const audio = track.clone();
            utilityStream = new MediaStream();
            utilityStream.addTrack(audio);
            hark = createHarker(track.id, utilityStream, dispatch);
            track.onended = () => {
                if (hark) {
                    hark.stop();
                    audio.stop();
                }
                dispatch(stopSharingLocalMedia(track.id));
                dispatch(removeMedia(track.id));
            };
            waitForMediaLoaded(track, stream).then(info => {
                dispatch(updateMedia(track.id, info));
            });
        }
        else {
            track.onended = () => {
                dispatch(stopSharingLocalMedia(track.id));
                dispatch(removeMedia(track.id));
            };
        }
        dispatch(addLocalMedia({
            createdAt: Date.now(),
            externalDisabled: track.muted,
            hark,
            id: track.id,
            inputDetected: false,
            inputLost: Date.now(),
            kind: 'audio',
            localDisabled: !track.enabled,
            remoteDisabled: false,
            renderMirrored: false,
            replaces,
            screenCapture: false,
            shared: false,
            source: 'local',
            speaking: false,
            stream,
            track,
            utilityStream,
            volume: -Infinity
        }));
    };
}
/**
 * @description
 * Adds a local video track to the set of managed media.
 *
 * **NOTE:** Adding a local video track does not immediately share the video to peers. Use `shareLocalMedia()` with the track ID to do so after adding.
 *
 * @public
 *
 * @param track Local video track
 * @param stream Stream containing the video track
 * @param replaces
 */
function addLocalVideo(track, stream, mirror = true, replaces) {
    if (track.kind !== 'video') {
        throw new Error('Incorrect media type. Expected video, got: ' + track.kind);
    }
    return (dispatch, getState) => {
        track.onended = () => {
            dispatch(stopSharingLocalMedia(track.id));
            dispatch(removeMedia(track.id));
        };
        if (isBrowser()) {
            waitForMediaLoaded(track, stream).then(info => {
                dispatch(updateMedia(track.id, info));
            });
        }
        if (!isBrowser() && replaces) {
            // React-Native
            // Remove old video before adding the new one to prevent a mirroring
            // flash when going from 'user' to 'environment' and vice versa
            dispatch(removeMedia(replaces));
        }
        dispatch(addLocalMedia({
            createdAt: Date.now(),
            externalDisabled: track.muted,
            id: track.id,
            kind: 'video',
            localDisabled: !track.enabled,
            remoteDisabled: false,
            renderMirrored: mirror,
            replaces,
            screenCapture: false,
            shared: false,
            source: 'local',
            speaking: false,
            stream,
            track,
            volume: -Infinity
        }));
    };
}
/**
 * @description
 * Adds a local screenshare video track to the set of managed media.
 *
 * This action is similar to `addLocalVideo()`, but marks the video as a screen so it does not render mirrored like a user facing camera video.
 *
 * **NOTE:** Adding a local screenshare video track does not immediately share the video to peers. Use `shareLocalMedia()` with the track ID to do so after adding.
 *
 * @public
 *
 * @param track Local screenshare video track
 * @param stream Stream containing the video track
 * @param replaces
 */
function addLocalScreen(track, stream, replaces) {
    if (track.kind !== 'video') {
        throw new Error('Incorrect media type. Expected video, got: ' + track.kind);
    }
    return (dispatch, getState) => {
        track.onended = () => {
            dispatch(stopSharingLocalMedia(track.id));
            dispatch(removeMedia(track.id));
        };
        if (isBrowser()) {
            waitForMediaLoaded(track, stream).then(info => {
                dispatch(updateMedia(track.id, info));
            });
        }
        // Mark the track as detail content to encourage the browser to
        // prioritize image quality over frame rate.
        if ('contentHint' in track && !track.contentHint) {
            track.contentHint = 'detail';
        }
        dispatch(addLocalMedia({
            createdAt: Date.now(),
            externalDisabled: track.muted,
            id: track.id,
            kind: 'video',
            localDisabled: !track.enabled,
            remoteDisabled: false,
            renderMirrored: false,
            replaces,
            screenCapture: true,
            shared: false,
            source: 'local',
            speaking: false,
            stream,
            track,
            volume: -Infinity
        }));
    };
}
/**
 * Add a remote media track.
 *
 * @private
 *
 * @param track MediaStreamTrack
 * @param stream MediaStream
 * @param screen boolean
 */
function addRemoteMedia(roomAddress, peerAddress, id, track, stream, screen) {
    return (dispatch, getState) => {
        const state = getState();
        const owner = getPeerByAddress(state, peerAddress);
        track.onended = () => {
            dispatch(removeMedia(id));
        };
        if (isBrowser()) {
            waitForMediaLoaded(track, stream, 500).then(info => {
                dispatch(updateMedia(id, info));
            });
            setTimeout(() => {
                waitForMediaLoaded(track, stream, 500).then(info => {
                    dispatch(updateMedia(id, info));
                });
            }, 500);
        }
        const media = {
            createdAt: Date.now(),
            externalDisabled: track.muted,
            id,
            kind: track.kind,
            localDisabled: owner ? owner.muted : false,
            owner: peerAddress,
            profile: track.kind === 'video' ? 'low' : undefined,
            remoteDisabled: false,
            renderMirrored: false,
            roomAddress,
            screenCapture: track.kind === 'video' && screen,
            source: 'remote',
            speaking: false,
            stream,
            track,
            volume: -Infinity
        };
        dispatch({
            payload: media,
            type: ADD_MEDIA
        });
    };
}
/**
 * @description
 * Remove media.
 *
 * @public
 *
 * @param id Media track ID
 * @param endMedia Whether to end the media track
 */
function removeMedia(id, endMedia = true) {
    return (dispatch, getState) => {
        const media = getMediaTrack(getState(), id);
        if (!media) {
            return;
        }
        if (media.shared) {
            dispatch(stopSharingLocalMedia(id));
        }
        dispatch({
            payload: { id },
            type: REMOVE_MEDIA
        });
        if (media.source === 'local') {
            const client = getClient(getState());
            if (client) {
                client.mesh.updateConnections('remove-media');
            }
        }
        if (endMedia) {
            if (media.track) {
                media.track.stop();
            }
            if (media.utilityStream) {
                for (const track of media.utilityStream.getTracks()) {
                    track.stop();
                }
            }
        }
    };
}
/**
 * Update a media track.
 *
 * @private
 *
 * @param id string
 * @param updated Partial<Media>
 */
function updateMedia(id, updated) {
    return (dispatch, getState) => {
        const prevState = getState();
        const client = getClient(prevState);
        const wasSpeaking = userIsSpeaking(prevState);
        dispatch({
            payload: {
                id,
                updated
            },
            type: MEDIA_UPDATED
        });
        const newState = getState();
        const nowSpeaking = userIsSpeaking(newState);
        if (client) {
            if (wasSpeaking !== nowSpeaking) {
                client.sendAllCallsSpeakingUpdate(nowSpeaking);
            }
            if (updated.shared !== undefined) {
                client.mesh.updateConnections('update-shared-media');
            }
        }
        const oldMedia = getMediaTrack(prevState, id);
        const newMedia = getMediaTrack(newState, id);
        if (newMedia) {
            if (newMedia.track.enabled !== !newMedia.localDisabled) {
                newMedia.track.enabled = !newMedia.localDisabled;
            }
            if (oldMedia &&
                newMedia.source === 'local' &&
                newMedia.localDisabled !== oldMedia.localDisabled &&
                client) {
                client.mesh.notifyPeers(newMedia, newMedia.localDisabled === true ? 'mute' : 'unmute');
            }
            if (newMedia.source === 'remote' && newMedia.owner) {
                const peer = getPeerByAddress(newState, newMedia.owner);
                if (peer && peer.muted && !newMedia.localDisabled) {
                    dispatch({
                        payload: {
                            peerAddress: newMedia.owner,
                            updated: {
                                muted: false
                            }
                        },
                        type: PEER_UPDATED
                    });
                }
            }
        }
    };
}
/**
 * @description
 * Enable local playback of local or remote media.
 *
 * @public
 *
 * @param id Media track ID
 */
function enableMedia(id) {
    return updateMedia(id, {
        localDisabled: false
    });
}
/**
 * @description
 * Disable local playback of local or remote media.
 *
 * If the media has already been shared, it will continue to be shared, but will be silent or show a black frame.
 *
 * @public
 *
 * @param id A local media track ID
 */
function disableMedia(id) {
    return updateMedia(id, {
        localDisabled: true
    });
}
/**
 * @description
 * Share a local media track with interested peers.
 *
 * @public
 *
 * @param id The ID of the media track to start sharing
 */
function shareLocalMedia(id) {
    return (dispatch, getState) => {
        const state = getState();
        const media = getMediaTrack(state, id);
        if (!media) {
            return;
        }
        if (media.replaces) {
            dispatch(removeMedia(media.replaces));
        }
        dispatch(updateMedia(id, {
            replaces: undefined,
            shared: true
        }));
    };
}
/**
 * @description
 * Stop sending a media track to peers, but the media track will still exist and be tracked so that it can be re-shared later. Use `removeMedia()` to fully stop and remove a track.
 *
 * @public
 *
 * @param id The ID of the media track to stop sharing
 */
function stopSharingLocalMedia(id) {
    return (dispatch, getState) => {
        const state = getState();
        const potentialReplacements = getLocalMedia(state).filter(m => m.replaces === id);
        dispatch(updateMedia(id, {
            shared: false
        }));
        if (potentialReplacements.length) {
            dispatch(removeMedia(id));
        }
    };
}
/**
 * @private
 */
function constraintNeeded(trackSettings = {}, trackConstraints = {}, setting, target) {
    const currentSetting = trackSettings[setting];
    const currentConstraint = trackConstraints[setting];
    const nearlyEqual = (a, b) => a !== undefined && (a === b || Math.abs(a - b) < 1);
    if (currentSetting && nearlyEqual(currentSetting, target)) {
        return false;
    }
    if (!currentConstraint) {
        return true;
    }
    if (typeof currentConstraint === 'number') {
        return !nearlyEqual(currentConstraint, target);
    }
    return (!nearlyEqual(currentConstraint.ideal, target) && !nearlyEqual(currentConstraint.exact, target));
}
/**
 * @description
 * Adjust the capture resolution for local videos.
 *
 * Screen captures are _not_ affected.
 *
 * The values provided should be the _ideal_ values. The browser will attempt to adjust capture parameters to match as closely as possible, but in some cases may not exactly match what was requested.
 *
 * @public
 *
 * @param width The new, ideal, width for the video
 * @param height The new, ideal, height for the video
 * @param frameRate The new, ideal, frame rate for the video
 */
function adjustVideoCaptureResolution(width, height, frameRate = 30) {
    return (dispatch, getState) => {
        if (!isBrowser()) {
            return;
        }
        const state = getState();
        const localMedia = getLocalMedia(state, 'video');
        const supportedConstraints = navigator.mediaDevices.getSupportedConstraints();
        const newConstraints = {};
        let enabledConstraints = 0;
        if (supportedConstraints.frameRate) {
            newConstraints.frameRate = frameRate;
            enabledConstraints += 1;
        }
        if (supportedConstraints.height) {
            newConstraints.height = { ideal: height };
            enabledConstraints += 1;
        }
        if (supportedConstraints.width) {
            newConstraints.width = { ideal: width };
            enabledConstraints += 1;
        }
        if (enabledConstraints === 0) {
            return;
        }
        for (const video of localMedia) {
            if (video.screenCapture) {
                continue;
            }
            let settings = {};
            if (video.track.getSettings) {
                settings = video.track.getSettings();
            }
            const existingConstraints = video.track.getConstraints();
            if ((!newConstraints.frameRate ||
                !constraintNeeded(settings, existingConstraints, 'frameRate', frameRate)) &&
                (!newConstraints.width ||
                    !constraintNeeded(settings, existingConstraints, 'width', width)) &&
                (!newConstraints.height ||
                    !constraintNeeded(settings, existingConstraints, 'height', height))) {
                continue;
            }
            video.track.applyConstraints(newConstraints).catch(err => {
                console.error('Could not adjust video capture resolution:', err.message);
            });
        }
    };
}
/**
 * @description
 * Set the full table of video resolution tiers to use, based on the number of peers.
 *
 * Each tier looks like: [peerCount, { width, height, frameRate }]
 *
 * The tier with a peerCount matching the number of peers requesting video will be used.
 * (Or the tier with the smaller peerCount if the number of peers falls between tiers.)
 *
 * Screen captures are _not_ affected by video resolution tiers.
 *
 * The resolution values provided should be the _ideal_ values. The browser will attempt to adjust capture parameters to match as closely as possible, but in some cases may not exactly match what was requested.
 *
 * @public
 *
 * @param tiers Array of ideal video resolution tiers based on peer count
 */
function setVideoResolutionTiers(tiers) {
    return (dispatch, getState) => {
        dispatch({
            payload: {
                videoResolutionTiers: tiers
            },
            type: SET_VIDEO_RESOLUTION_TIERS
        });
    };
}
/**
 * @description
 * Request that video be sent at a different quality profile.
 *
 * The profile can be `low` for small size video, `medium` for mid-range, and `high` for full resolution.
 *
 * @public
 *
 * @param id string
 * @param profile 'high' | 'medium' | 'low'
 */
function requestQualityProfile(id, profile) {
    return (dispatch, getState) => {
        dispatch(updateMedia(id, {
            profile
        }));
        const client = getClient(getState());
        if (client) {
            client.sfu.requestProfile(id, profile);
        }
    };
}
/**
 * @description
 * Mute all audio for a given peer.
 *
 * @public
 *
 * @param peerAddress The address of the peer to mute
 */
function mutePeer(peerAddress) {
    return (dispatch, getState) => {
        const state = getState();
        const media = getMediaForPeer(state, peerAddress, 'audio');
        for (const audio of media) {
            dispatch(disableMedia(audio.id));
        }
        dispatch({
            payload: {
                peerAddress,
                updated: {
                    muted: true
                }
            },
            type: PEER_UPDATED
        });
    };
}
/**
 * @description
 * Unmute all audio for a given peer.
 *
 * @public
 *
 * @param peerAddress The address of the peer to unmute
 */
function unmutePeer(peerAddress) {
    return (dispatch, getState) => {
        const state = getState();
        const media = getMediaForPeer(state, peerAddress, 'audio');
        for (const audio of media) {
            dispatch(enableMedia(audio.id));
        }
        dispatch({
            payload: {
                peerAddress,
                updated: {
                    muted: false
                }
            },
            type: PEER_UPDATED
        });
    };
}
/**
 * @description
 * Disable all captured audio for the user.
 *
 * @public
 */
function muteSelf() {
    return (dispatch, getState) => {
        const state = getState();
        const media = getLocalMedia(state, 'audio');
        for (const audio of media) {
            dispatch(disableMedia(audio.id));
        }
    };
}
/**
 * @description
 * Enable all captured audio for the user.
 *
 * @public
 */
function unmuteSelf() {
    return (dispatch, getState) => {
        const state = getState();
        const media = getLocalMedia(state, 'audio');
        for (const audio of media) {
            dispatch(enableMedia(audio.id));
        }
    };
}
/**
 * @description
 * Disable all captured video for the user.
 *
 * @public
 *
 * @param opts.screenCapture boolean
 */
function pauseSelfVideo(opts = { screenCapture: true }) {
    return (dispatch, getState) => {
        const state = getState();
        const media = getLocalMedia(state, 'video');
        for (const video of media) {
            if (!video.screenCapture || (opts.screenCapture && video.screenCapture)) {
                dispatch(disableMedia(video.id));
            }
        }
    };
}
/**
 * @description
 * Enable all captured video for the user.
 *
 * @public
 *
 * @param opts.screenCapture boolean
 */
function resumeSelfVideo(opts = { screenCapture: true }) {
    return (dispatch, getState) => {
        const state = getState();
        const media = getLocalMedia(state, 'video');
        for (const video of media) {
            if (!video.screenCapture || (opts.screenCapture && video.screenCapture)) {
                dispatch(enableMedia(video.id));
            }
        }
    };
}
/**
 * @description
 * Remove all local media of a given kind.
 *
 * @public
 *
 * @param kind 'audio' | 'video' | undefined
 */
function removeAllMedia(kind) {
    return (dispatch, getState) => {
        const state = getState();
        const localMedia = getLocalMedia(state, kind);
        for (const media of localMedia) {
            dispatch(removeMedia(media.id));
        }
    };
}

// ====================================================================
function startCall() {
    return;
}
function endCall() {
    return;
}
/**
 * @description
 * Once joined to a room, using the `joinCall()` action will trigger joining the active call.
 *
 * The `desiredMedia` parameter can be used to control what media is received from peers. By default, it will use the type used in the global `setDesiredMedia()` action.
 *
 * **NOTE:** While the `desiredMedia` parameter controls what is _received_, what is _sent_ is determined by which tracks you have marked as shared via `shareLocalMedia()`. It is entirely possible to send audio and video while only receiving audio.
 *
 * @public
 *
 * @param roomAddress The address of a joined room
 * @param desiredMedia The media type to request from peers
 */
function joinCall(roomAddress, desiredMedia) {
    return (dispatch, getState) => {
        dispatch({
            payload: {
                desiredMedia,
                roomAddress
            },
            type: JOIN_CALL
        });
        const state = getState();
        const client = getClient(state);
        if (client) {
            client.sendRoomPresence(roomAddress);
            client.mesh.updateConnections('join-call');
        }
    };
}
/**
 * @description
 * @public
 *
 * @param roomAddress The address of the room hosting the call
 * @param endMedia If leaving the call results in no remaining calls, end user media.
 */
function leaveCall(roomAddress, endMedia) {
    return (dispatch, getState) => {
        const state = getState();
        const originalCalls = getJoinedCalls(state);
        dispatch({
            payload: {
                roomAddress
            },
            type: LEAVE_CALL
        });
        const updatedState = getState();
        const remainingCalls = getJoinedCalls(updatedState);
        const client = getClient(state);
        if (client) {
            client.sendRoomPresence(roomAddress);
            client.mesh.updateConnections('leave-call');
            const speaking = userIsSpeaking(state);
            if (speaking) {
                client.sendAllCallsSpeakingUpdate(true);
            }
        }
        if (endMedia && originalCalls.length > 0 && remainingCalls.length === 0) {
            dispatch(removeAllMedia());
        }
    };
}
function changeCallMode() {
    return;
}
function pauseCall() {
    return;
}
function resumeCall() {
    return;
}
function startRecording() {
    return;
}
function endRecording() {
    return;
}
function pauseRecording() {
    return;
}
function resumeRecording() {
    return;
}
/**
 * @description
 * Set the desired media preference for media received from peers in a specific call.
 *
 * Controls which media types are _received_ from peers. What media types are _sent_ to peers is left to you to control via `shareLocalMedia()` and `stopSharingLocalMedia()`.
 *
 * If set to 'video', full audio and video will be sent by peers when available.
 *
 * If set to 'audio', only audio and screen shares will be sent by peers.
 *
 * If set to 'none', peers will not send any media.
 *
 * @public
 *
 * @param roomAddress The address of the room hosting the call
 * @param mediaKind The kind of media you wish to receive from peers
 */
function setDesiredMediaForCall(roomAddress, desiredMedia) {
    return (dispatch, getState) => {
        dispatch({
            payload: {
                desiredMedia,
                roomAddress
            },
            type: SET_CALL_PREFERENCE
        });
        const state = getState();
        const client = getClient(state);
        if (client) {
            client.sendRoomPresence(roomAddress);
            client.mesh.updateConnections('set-desired-media-for-call');
        }
    };
}
function updateCallState() {
    return;
}

// ====================================================================
/**
 * @description
 * Send a chat message to a room.
 *
 * @public
 *
 * @param roomAddress The address of the room to send the chat
 * @param opts See ChatOptions below
 */
function sendChat(roomAddress, opts) {
    return (dispatch, getState) => {
        const state = getState();
        const client = getClient(state);
        const id = opts.id || Utils.uuid();
        const displayName = opts.displayName || getUserDisplayName(state);
        client.xmpp.sendMessage({
            body: opts.body,
            chatState: 'active',
            id,
            nick: displayName,
            replace: opts.replace,
            to: roomAddress,
            type: 'groupchat'
        });
        dispatch({
            payload: {
                acked: false,
                body: opts.body,
                direction: DIRECTION_OUTGOING,
                displayName,
                id,
                replace: opts.replace,
                roomAddress,
                time: new Date()
            },
            type: CHAT_OUTGOING
        });
    };
}
/**
 * @description
 * Send a chat state (typing) notification to a room.
 *
 * @public
 *
 * @param roomAddress The address of the room to send the chat state
 * @param chatState The state of the chat
 */
function sendChatState(roomAddress, chatState) {
    return (dispatch, getState) => {
        const client = getClient(getState());
        client.xmpp.sendMessage({
            chatState,
            to: roomAddress,
            type: 'groupchat'
        });
        dispatch({
            payload: {
                chatState,
                roomAddress
            },
            type: CHAT_STATE_OUTGOING
        });
    };
}
/**
 * Receive a chat message from a room.
 *
 * @private
 *
 * @param roomAddress string
 * @param senderAddress string
 * @param opts.body string
 * @param opts.displayName string
 * @param opts.id string
 * @param opts.replace string
 * @param opts.time Date
 */
function receiveChat(roomAddress, senderAddress, opts) {
    return {
        payload: {
            acked: true,
            body: opts.body,
            direction: DIRECTION_INCOMING,
            displayName: opts.displayName,
            id: opts.id,
            replace: opts.replace,
            roomAddress,
            senderAddress,
            time: opts.time || new Date()
        },
        type: CHAT_INCOMING
    };
}
/**
 * @description
 * Send a realtime-text update to a room.
 *
 * @public
 *
 * @param roomAddress The address of the room to send the RTT update
 * @param rtt
 */
function sendRTT(roomAddress, rtt) {
    return (dispatch, getState) => {
        const client = getClient(getState());
        let chatState;
        if (rtt.event !== 'init' && rtt.event !== 'cancel') {
            chatState = 'composing';
        }
        client.xmpp.sendMessage({
            chatState,
            rtt,
            to: roomAddress,
            type: 'groupchat'
        });
        dispatch({
            payload: {
                roomAddress,
                rtt
            },
            type: RTT_OUTGOING
        });
    };
}

// ====================================================================
/**
 * Start tracking a peer connection.
 *
 * @private
 *
 * @param peerAddress string
 * @param sessionId string
 */
function addConnection(peerAddress, sessionId) {
    const roomAddress = JID.parse(peerAddress).bare;
    return {
        payload: {
            id: sessionId,
            peerAddress,
            roomAddress
        },
        type: PEER_CONNECTION_ADDED
    };
}
/**
 * Stop tracking a peer connection.
 *
 * @private
 *
 * @param peerAddress string
 * @param sessionId string
 */
function removeConnection(peerAddress, sessionId) {
    return {
        payload: {
            id: sessionId,
            peerAddress
        },
        type: PEER_CONNECTION_REMOVED
    };
}
/**
 * Update the state of a peer connection.
 *
 * @private
 *
 * @param peerAddress string
 * @param sessionId string
 * @param updated.connectionState string
 * @param updated.receivingAudioMediaId string
 * @param updated.receivingVideoMediaId string
 * @param updated.sendingAudioMediaId string
 * @param updated.sendingVideoMediaId string
 */
function updateConnection(peerAddress, sessionId, updated) {
    return {
        payload: {
            id: sessionId,
            peerAddress,
            updated
        },
        type: PEER_CONNECTION_UPDATED
    };
}

// =====================================================================
let deviceListener;
let devicePollInterval;
let pendingEnumerate;
// =====================================================================
/**
 * @description
 * Begin listening for media device changes.
 *
 * @public
 */
function listenForDevices() {
    return (dispatch, getState) => {
        if (!navigator.mediaDevices) {
            return;
        }
        if (!deviceListener) {
            deviceListener = () => {
                dispatch(fetchDevices());
            };
        }
        // Browsers will no longer emit devicechange before permissions
        // have been granted. Periodically poll for devices to detect if
        // the available categories have changed (e.g. go from no cameras
        // to some camera is available).
        //
        // Once permissions have been granted, polling will cease.
        if (!devicePollInterval) {
            devicePollInterval = setInterval(() => {
                dispatch(fetchDevices());
            }, 3000);
        }
        navigator.mediaDevices.addEventListener('devicechange', () => {
            stopPollingForDevices();
            if (deviceListener) {
                deviceListener();
            }
        });
        deviceListener();
    };
}
/**
 * @description
 * Fetch devices.
 *
 * @public
 */
function fetchDevices(polling) {
    return (dispatch, getState) => __awaiter(this, void 0, void 0, function* () {
        if (!navigator.mediaDevices) {
            return;
        }
        if (pendingEnumerate) {
            // We're already updating the device list, let that call handle the results.
            return;
        }
        pendingEnumerate = navigator.mediaDevices.enumerateDevices();
        const devices = yield pendingEnumerate;
        pendingEnumerate = undefined;
        // Remove polling if we detect we have permissions.
        for (const device of devices) {
            if (devicePollInterval && device.deviceId) {
                stopPollingForDevices();
                break;
            }
        }
        return dispatch(deviceList(devices));
    });
}
/**
 * @description
 * Stop listening for media device changes.
 *
 * @public
 */
function stopListeningForDevices() {
    if (deviceListener) {
        navigator.mediaDevices.removeEventListener('devicechange', deviceListener);
        deviceListener = undefined;
    }
    stopPollingForDevices();
}
/**
 * Stop polling for device changes before permission grant.
 *
 * @private
 */
function stopPollingForDevices() {
    if (devicePollInterval) {
        clearInterval(devicePollInterval);
        devicePollInterval = undefined;
    }
}
/**
 * Device list changed.
 *
 * @private
 *
 * @param devices Device[]
 */
function deviceList(devices) {
    devices = devices.filter(d => {
        // Work around Safari reporting the built-in speakers as a microphone
        if (d.kind === 'audioinput' && d.label === 'MacBook Pro Speakers') {
            return false;
        }
        return true;
    });
    // FIX: Safari 13 is mislabeling videoinput as an audioinput before device permissions have been granted
    // This detects the presence of multiple audioinputs before permission grant (during which time there
    // should only be one listed, regardless of actual device count), and corrects one to a videoinput.
    const doubleAudioPrePermission = devices.filter(d => !d.deviceId && d.kind === 'audioinput');
    if (doubleAudioPrePermission.length >= 2) {
        const fakeVideoInput = {
            deviceId: '',
            groupId: '',
            kind: 'videoinput',
            label: '',
            toJSON: () => fakeVideoInput
        };
        return {
            payload: [doubleAudioPrePermission[0], fakeVideoInput],
            type: DEVICES
        };
    }
    return {
        payload: devices,
        type: DEVICES
    };
}
/**
 * Camera permission denied
 *
 * @private
 *
 * @param error Error
 */
function cameraPermissionDenied(error) {
    return {
        payload: {
            error
        },
        type: CAMERA_PERMISSION_DENIED
    };
}
/**
 * Microphone permission denied
 *
 * @private
 *
 * @param error Error
 */
function microphonePermissionDenied(error) {
    return {
        payload: {
            error
        },
        type: MICROPHONE_PERMISSION_DENIED
    };
}
/**
 * Update device capture request status.
 *
 * @private
 *
 * @param error Error
 */
function deviceCaptureRequest(camera, microphone) {
    return {
        payload: {
            camera,
            microphone
        },
        type: DEVICE_CAPTURE
    };
}

// ====================================================================
/**
 * Fetch room configuration from the API.
 *
 * @private
 *
 * @param configUrl string
 * @param roomName string
 * @param auth string
 * @param maxTries number
 * @param timeout number
 */
function fetchRoomConfig(configUrl, roomName, auth, maxTries = 5, timeout = 1000) {
    return __awaiter(this, void 0, void 0, function* () {
        let attemptCount = 0;
        let error;
        if (!roomName) {
            console.error('ESWRTC_004. View more information at https://docs.simplewebrtc.com');
            throw new Error('Room name not provided.');
        }
        while (attemptCount <= maxTries) {
            try {
                const data = yield fetch(configUrl, {
                    body: JSON.stringify({ name: roomName }),
                    headers: {
                        authorization: `Bearer ${auth}`
                    },
                    method: 'POST'
                });
                if (!data.ok) {
                    throw new Error('SimpleWebRTC room configuration request failed: ' + data.status);
                }
                const config = (yield data.json());
                return config;
            }
            catch (err) {
                error = err;
                attemptCount += 1;
                yield sleep(timeout);
            }
        }
        console.error('ESWRTC_002. View more information at https://docs.simplewebrtc.com');
        if (error) {
            throw error;
        }
        else {
            throw new Error('Could not fetch room config');
        }
    });
}
// ====================================================================
/**
 * @description
 * Attempt to join a room.
 *
 * @public
 *
 * @param roomAddress A user-friendly name for a room
 */
function joinRoom(roomName, opts = {}) {
    return (dispatch, getState) => __awaiter(this, void 0, void 0, function* () {
        const state = getState();
        const client = getClient(state);
        const apiConfig = getAPIConfig(state);
        try {
            const config = yield fetchRoomConfig(apiConfig.roomConfigUrl, roomName, apiConfig.credential);
            const existingRoom = getRoomByAddress(state, config.roomAddress);
            if (!existingRoom || (existingRoom && !existingRoom.joined)) {
                dispatch({
                    payload: {
                        autoJoinCall: isSupportedBrowser(state) &&
                            (opts.autoJoinCall === undefined ? true : opts.autoJoinCall),
                        providedPassword: opts.password,
                        providedRoomName: roomName,
                        roomAddress: config.roomAddress
                    },
                    type: JOIN_ROOM
                });
                if (client) {
                    client.joinRoom(config.roomAddress, opts.password);
                }
            }
        }
        catch (err) {
            dispatch(joinRoomFailed('', false));
        }
    });
}
/**
 * An attempt to join a room failed.
 *
 * If a password is required to join the room, `passwordRequired` should be set to `true`.
 *
 * @private
 *
 * @param roomAddress string
 * @param passwordRequired boolean
 */
function joinRoomFailed(roomAddress, reasons) {
    if (typeof reasons === 'boolean') {
        reasons = {
            passwordRequired: reasons
        };
    }
    return {
        payload: {
            banned: reasons.banned,
            passwordRequired: reasons.passwordRequired,
            roomAddress,
            roomNotStarted: reasons.roomNotStarted
        },
        type: JOIN_ROOM_FAILED
    };
}
/**
 * The attempt to join a room succeeded.
 *
 * @private
 *
 * @param roomAddress string
 */
function joinRoomSuccess(roomAddress, selfAddress, roomId, role, affiliation) {
    return (dispatch, getState) => {
        dispatch({
            payload: {
                affiliation,
                id: roomId,
                role,
                roomAddress,
                selfAddress
            },
            type: JOIN_ROOM_SUCCESS
        });
        const client = getClient(getState());
        if (client) {
            client.mesh.updateConnections('join-room');
        }
    };
}
/**
 * Update the user's information for the room.
 *
 * @private
 *
 * @param roomAddress string
 */
function selfUpdated(roomAddress, selfAddress, roomId, role, affiliation) {
    return (dispatch, getState) => {
        dispatch({
            payload: {
                affiliation,
                id: roomId,
                role,
                roomAddress,
                selfAddress
            },
            type: SELF_UPDATED
        });
    };
}
/**
 * @description
 * Leave a room.
 *
 * @public
 *
 * @param roomAddress The address of the room to leave
 * @param endMedia If leaving the room would result in zero active calls, end user media
 */
function leaveRoom(roomAddress, endMedia = true) {
    return (dispatch, getState) => {
        const state = getState();
        const client = getClient(state);
        dispatch(leaveCall(roomAddress, endMedia));
        if (client) {
            client.sendRoomPresence(roomAddress, {
                type: 'unavailable'
            });
        }
        dispatch({
            payload: {
                roomAddress
            },
            type: LEAVE_ROOM
        });
        if (client) {
            client.mesh.updateConnections('leave-room');
        }
    };
}
/**
 * @description
 * Lock a room.
 *
 * @public
 *
 * @param roomAddress The address of the room to lock
 * @param password The new room password
 */
function lockRoom(roomAddress, password) {
    return (dispatch, getState) => {
        const state = getState();
        const client = getClient(state);
        if (client) {
            client.lockRoom(roomAddress, password);
        }
        dispatch({
            payload: {
                password,
                roomAddress
            },
            type: LOCK_ROOM
        });
    };
}
/**
 * @description
 * Unlock a room to allow anyone to enter without needing a password.
 *
 * @public
 *
 * @param roomAddress The address of the room to unlock
 */
function unlockRoom(roomAddress) {
    return (dispatch, getState) => {
        const state = getState();
        const client = getClient(state);
        if (client) {
            client.unlockRoom(roomAddress);
        }
        dispatch({
            payload: {
                roomAddress
            },
            type: UNLOCK_ROOM
        });
    };
}
/**
 * @description
 * Destroy a room.
 *
 * @public
 *
 * @param roomAddress  The address of the room to destroy
 */
function destroyRoom(roomAddress) {
    return (dispatch, getState) => __awaiter(this, void 0, void 0, function* () {
        const state = getState();
        const client = getClient(state);
        try {
            if (client) {
                yield client.destroyRoom(roomAddress);
            }
            dispatch({
                payload: {
                    roomAddress
                },
                type: DESTROY_ROOM
            });
        }
        catch (err) {
            console.error(err);
        }
    });
}
/**
 * Room has been locked.
 *
 * @private
 *
 * @param roomAddress string
 * @param password string
 */
function roomLocked(roomAddress, password) {
    return {
        payload: {
            password,
            roomAddress
        },
        type: ROOM_LOCKED
    };
}
/**
 * Room has been unlocked.
 *
 * @private
 *
 * @param roomAddress string
 */
function roomUnlocked(roomAddress) {
    return {
        payload: {
            roomAddress
        },
        type: ROOM_UNLOCKED
    };
}
/**
 * @private
 *
 * @param oldRoomAddress  The address of the room to destroy
 * @param newRoomAddress  The address of the new room to join
 * @param newRoomPassword  New password to use for the room
 */
function roomReplaced(oldRoomAddress, newRoomAddress, newRoomPassword) {
    return (dispatch, getState) => __awaiter(this, void 0, void 0, function* () {
        const state = getState();
        const client = getClient(state);
        const oldRoom = getRoomByAddress(state, oldRoomAddress);
        if (!oldRoom) {
            dispatch(joinRoom(newRoomAddress, {
                password: newRoomPassword
            }));
            return;
        }
        const existingNewRoom = getRoomByAddress(state, newRoomAddress);
        if (!existingNewRoom || (existingNewRoom && !existingNewRoom.joined)) {
            dispatch({
                payload: {
                    autoJoinCall: oldRoom.autoJoinCall,
                    providedPassword: newRoomPassword || oldRoom.providedPassword,
                    providedRoomName: oldRoom.providedName,
                    roomAddress: newRoomAddress
                },
                type: JOIN_ROOM
            });
            if (client) {
                client.joinRoom(newRoomAddress, newRoomPassword || oldRoom.password);
            }
        }
    });
}

// ====================================================================
/**
 * @description
 * Set the preferred display name for the user.
 *
 * Multiple people may have the same display name.
 *
 * Display names are _not_ unique.
 *
 * @public
 *
 * @param displayName The new display name that other peers will see
 */
function setDisplayName(displayName) {
    return (dispatch, getState) => {
        const state = getState();
        const client = getClient(state);
        dispatch({
            payload: {
                displayName
            },
            type: SET_USER_PREFERENCE
        });
        if (client) {
            client.sendAllRoomsPresence();
        }
    };
}
/**
 * @description
 * Set the default user preference for media received from peers.
 *
 * Controls which media types are _received_ from peers. What media types are _sent_ to peers is left to you to control via `shareLocalMedia()` and `stopSharingLocalMedia()`.
 *
 * If set to 'video', full audio and video will be sent by peers when available.
 *
 * If set to 'audio', only audio and screen shares will be sent by peers.
 *
 * If set to 'none', peers will not send any media.
 *
 * @public
 *
 * @param mediaKind The kind of media you wish to receive from peers
 */
function setDesiredMedia(mediaKind) {
    return (dispatch, getState) => {
        const state = getState();
        const client = getClient(state);
        dispatch({
            payload: {
                requestingMedia: mediaKind
            },
            type: SET_USER_PREFERENCE
        });
        const calls = getJoinedCalls(state);
        for (const call of calls) {
            dispatch(setDesiredMediaForCall(call.roomAddress, mediaKind));
        }
        if (client) {
            client.sendAllRoomsPresence();
        }
    };
}
/**
 * @description
 * Set the voice activity detection threshold.
 *
 * The number MUST be negative (defaults to -65).
 *
 * @public
 *
 * @param threshold The threshold to detect voice activity
 */
function setVoiceActivityThreshold(threshold = -65) {
    setGlobalVoiceActivityThreshold(threshold);
    return {
        payload: {
            voiceActivityThreshold: threshold
        },
        type: SET_USER_PREFERENCE
    };
}
/**
 * @description
 * Enable or disable the use of push-to-talk.
 *
 * @public
 *
 * @param enabled Whether to enable push-to-talk
 */
function setPushToTalk(enabled) {
    return {
        payload: {
            pushToTalk: enabled
        },
        type: SET_USER_PREFERENCE
    };
}
/**
 * @description
 * Set the preferred audio output device.
 *
 * Expicitly pick an audio output sink in supported browsers.
 *
 * By default, browsers will try to use the same device capturing the audio input (e.g. using headset output when the input is the headset mic)
 *
 * @public
 *
 * @param deviceId The id of the device
 */
function setAudioOutputDevice(deviceId) {
    return {
        payload: {
            audioOutputDeviceId: deviceId
        },
        type: SET_USER_PREFERENCE
    };
}
/**
 * @description
 * Set the global output volume limit.
 *
 * The number MUST be between 0 and 1, inclusive (defaults to 1).
 *
 * Scale audio output volume without needing to use the OS volume controls. Useful if your application is expected to be running alongside other applications playing audio.
 *
 * @public
 *
 * @param globalVolumeLimit A value between 0 and 1 inclusive for scaling audio volume
 */
function setGlobalVolumeLimit(globalVolumeLimit = 1) {
    return {
        payload: {
            globalVolumeLimit
        },
        type: SET_USER_PREFERENCE
    };
}

// ====================================================================
/**
 * Add a new peer for a room.
 *
 * @private
 *
 * @param roomAddress string
 * @param peerAddress string
 */
function peerOnline(roomAddress, peerAddress, opts) {
    return (dispatch, getState) => {
        dispatch({
            payload: {
                affiliation: opts.affiliation,
                customerData: opts.customerData,
                displayName: opts.displayName,
                id: opts.id,
                joinedCall: opts.joinedCall || false,
                peerAddress,
                requestingMedia: opts.requestingMedia || 'none',
                role: opts.role,
                roomAddress,
                userAddress: opts.userAddress
            },
            type: PEER_ONLINE
        });
        const client = getClient(getState());
        if (client) {
            client.mesh.updateConnections('peer-online');
        }
    };
}
/**
 * Mark a peer as offline.
 *
 * @private
 *
 * @param roomAddress string
 * @param peerAddress string
 */
function peerOffline(roomAddress, peerAddress) {
    return (dispatch, getState) => {
        dispatch({
            payload: {
                peerAddress,
                roomAddress
            },
            type: PEER_OFFLINE
        });
    };
}
/**
 * Update a peer's information.
 *
 * @private
 *
 * @param peerAddress string
 * @param updated.chatState 'active' | 'composing' | 'paused'
 * @param updated.displayName string
 * @param updated.speaking boolean
 * @param updated.requestingAttention boolean
 * @param updated.rtt string
 * @param updated.customerData object
 * @param updated.volumeLimit number
 * @param updated.joinedCall boolean
 * @param updated.requestingMedia 'video' | 'audio' | 'none'
 * @param updated.sessionFailed boolean
 */
function peerUpdated(peerAddress, updated) {
    return (dispatch, getState) => {
        dispatch({
            payload: {
                peerAddress,
                updated
            },
            type: PEER_UPDATED
        });
        const client = getClient(getState());
        if (client) {
            client.mesh.updateConnections('peer-updated');
        }
    };
}
/**
 * @description
 * Kick a peer from the room.
 *
 * Only takes effect if the kicker is a room moderator.
 *
 * @public
 *
 * @param roomAddress The address of the room
 * @param peerAddress The address of the peer to remove from the room
 */
function kickPeer(roomAddress, peerAddress) {
    return (dispatch, getState) => {
        dispatch({
            payload: {
                peerAddress,
                roomAddress
            },
            type: KICK_PEER
        });
        const client = getClient(getState());
        if (client) {
            client.kickPeerFromRoom(roomAddress, peerAddress);
        }
    };
}
/**
 * @description
 * Set the overall volume limit for a peer.
 *
 * The volume limit must be between 0 and 1.
 *
 * @public
 *
 * @param peerAddress The address of the peer to adjust
 * @param volumeLimit The new volume limit, from 0 to 1 inclusive
 */
function limitPeerVolume(peerAddress, volumeLimit) {
    return {
        payload: {
            peerAddress,
            updated: {
                volumeLimit
            }
        },
        type: PEER_UPDATED
    };
}



var index = /*#__PURE__*/Object.freeze({
    __proto__: null,
    sleep: sleep,
    fetchConfig: fetchConfig,
    connect: connect,
    disconnect: disconnect,
    receivedConfig: receivedConfig,
    receivedConfigError: receivedConfigError,
    queueTelemetry: queueTelemetry,
    sendQueuedTelemetry: sendQueuedTelemetry,
    telemetrySucess: telemetrySucess,
    enableTelemetry: enableTelemetry,
    disableTelemetry: disableTelemetry,
    connectionStateChanged: connectionStateChanged,
    sendRoomCommand: sendRoomCommand,
    sendPeerCommand: sendPeerCommand,
    startCall: startCall,
    endCall: endCall,
    joinCall: joinCall,
    leaveCall: leaveCall,
    changeCallMode: changeCallMode,
    pauseCall: pauseCall,
    resumeCall: resumeCall,
    startRecording: startRecording,
    endRecording: endRecording,
    pauseRecording: pauseRecording,
    resumeRecording: resumeRecording,
    setDesiredMediaForCall: setDesiredMediaForCall,
    updateCallState: updateCallState,
    sendChat: sendChat,
    sendChatState: sendChatState,
    receiveChat: receiveChat,
    sendRTT: sendRTT,
    addConnection: addConnection,
    removeConnection: removeConnection,
    updateConnection: updateConnection,
    listenForDevices: listenForDevices,
    fetchDevices: fetchDevices,
    stopListeningForDevices: stopListeningForDevices,
    stopPollingForDevices: stopPollingForDevices,
    deviceList: deviceList,
    cameraPermissionDenied: cameraPermissionDenied,
    microphonePermissionDenied: microphonePermissionDenied,
    deviceCaptureRequest: deviceCaptureRequest,
    fetchRoomConfig: fetchRoomConfig,
    joinRoom: joinRoom,
    joinRoomFailed: joinRoomFailed,
    joinRoomSuccess: joinRoomSuccess,
    selfUpdated: selfUpdated,
    leaveRoom: leaveRoom,
    lockRoom: lockRoom,
    unlockRoom: unlockRoom,
    destroyRoom: destroyRoom,
    roomLocked: roomLocked,
    roomUnlocked: roomUnlocked,
    roomReplaced: roomReplaced,
    setDisplayName: setDisplayName,
    setDesiredMedia: setDesiredMedia,
    setVoiceActivityThreshold: setVoiceActivityThreshold,
    setPushToTalk: setPushToTalk,
    setAudioOutputDevice: setAudioOutputDevice,
    setGlobalVolumeLimit: setGlobalVolumeLimit,
    peerOnline: peerOnline,
    peerOffline: peerOffline,
    peerUpdated: peerUpdated,
    kickPeer: kickPeer,
    limitPeerVolume: limitPeerVolume,
    addLocalMedia: addLocalMedia,
    addLocalAudio: addLocalAudio,
    addLocalVideo: addLocalVideo,
    addLocalScreen: addLocalScreen,
    addRemoteMedia: addRemoteMedia,
    removeMedia: removeMedia,
    updateMedia: updateMedia,
    enableMedia: enableMedia,
    disableMedia: disableMedia,
    shareLocalMedia: shareLocalMedia,
    stopSharingLocalMedia: stopSharingLocalMedia,
    adjustVideoCaptureResolution: adjustVideoCaptureResolution,
    setVideoResolutionTiers: setVideoResolutionTiers,
    requestQualityProfile: requestQualityProfile,
    mutePeer: mutePeer,
    unmutePeer: unmutePeer,
    muteSelf: muteSelf,
    unmuteSelf: unmuteSelf,
    pauseSelfVideo: pauseSelfVideo,
    resumeSelfVideo: resumeSelfVideo,
    removeAllMedia: removeAllMedia
});

/**
 * @description
 * Check if screensharing is available for this browser.
 *
 * @public
 */
function isAvailable() {
    if ('getDisplayMedia' in window.navigator.mediaDevices) {
        return true;
    }
    return false;
}
/**
 * @description
 * Check if screensharing requires a browser extension.
 *
 * @public
 */
function requiresExtension() {
    return false;
}
/**
 * Check if the screensharing extension has already been installed.
 *
 * This is an asynchronous install check that attempts to communicate with
 * the extension.
 *
 * The user gesture flag will be lost when an answer is received, so this
 * function can not be used when a user gesture is required. For those cases,
 * use `checkForExtensionSync` instead to know if the extension _might_ be
 * already installed.
 *
 * @param extensionId string WebStore ID of the screensharing extension
 */
function checkForExtension(extensionId) {
    return Promise.resolve(false);
}
/**
 * Check if the screensharing extension has _possibly_ been installed.
 *
 * This is a synchronous installation check so that user gesture status
 * can be retained.
 *
 * This only checks that the extension ID has been set in sessionStorage. If
 * the extension was removed while the session was active, this function will
 * still return `true` unless the sessionStorage key is manually cleared.
 *
 * @param extensionId string WebStore ID of the screensharing extension
 */
function checkForExtensionSync(extensionId) {
    return false;
}
/**
 * Get the URL for the Chrome WebStore page for the screensharing extension.
 *
 * @param extensionId string WebStore ID of the screensharing extension
 */
function getExtensionURL(extensionId) {
    return `https://chrome.google.com/webstore/detail/${extensionId}`;
}

var ScreenSharingHelpers = /*#__PURE__*/Object.freeze({
    __proto__: null,
    isAvailable: isAvailable,
    requiresExtension: requiresExtension,
    checkForExtension: checkForExtension,
    checkForExtensionSync: checkForExtensionSync,
    getExtensionURL: getExtensionURL
});

const INITIAL_STATE = {
    config: {
        apiVersion: '',
        credential: '',
        customerData: {},
        iceServers: [],
        id: '',
        orgId: '',
        roomConfigUrl: '',
        screensharingExtensions: {
            chrome: ''
        },
        signalingUrl: '',
        telemetryUrl: '',
        userId: ''
    },
    configUrl: '',
    connectionAttempts: 0,
    connectionState: 'disconnected',
    queuedTelemetry: [],
    signalingClient: undefined,
    token: '',
    videoResolutionTiers: [
        [0, { width: 1280, height: 720, frameRate: 30 }],
        [1, { width: 800, height: 600, frameRate: 30 }],
        [2, { width: 640, height: 480, frameRate: 30 }],
        [3, { width: 320, height: 240, frameRate: 15 }],
        [5, { width: 320, height: 240, frameRate: 10 }]
    ]
};
function APIReducer (state = INITIAL_STATE, action) {
    switch (action.type) {
        case SIGNALING_CLIENT:
            return Object.assign(Object.assign({}, state), { signalingClient: action.payload });
        case SIGNALING_CLIENT_SHUTDOWN:
            return Object.assign(Object.assign({}, state), { connectionState: 'disconnected', signalingClient: undefined });
        case CONNECTION_STATE_CHANGE:
            return Object.assign(Object.assign({}, state), { connectionState: action.payload });
        case RECEIVED_CONFIG: {
            const config = action.payload.config;
            const configUrl = action.payload.configUrl;
            const token = action.payload.token || '';
            return Object.assign(Object.assign({}, state), { config: Object.assign(Object.assign({}, state.config), config), configUrl,
                token });
        }
        case QUEUE_TELEMETRY:
            return Object.assign(Object.assign({}, state), { queuedTelemetry: [...state.queuedTelemetry, action.payload] });
        case TELEMETRY_SUCCESS:
            return Object.assign(Object.assign({}, state), { queuedTelemetry: state.queuedTelemetry.slice(action.payload) });
        case SET_VIDEO_RESOLUTION_TIERS:
            return Object.assign(Object.assign({}, state), { videoResolutionTiers: action.payload.videoResolutionTiers });
    }
    return state;
}

const INITIAL_STATE$1 = {};
function addCall(state, action) {
    return Object.assign(Object.assign({}, state), { [action.payload.roomAddress]: {
            allowedAudioRoles: ['moderator', 'participant'],
            allowedMedia: 'video',
            allowedVideoRoles: ['moderator', 'participant'],
            joined: false,
            joinedAt: undefined,
            recordable: false,
            recordingState: 'offline',
            requestingMedia: undefined,
            roomAddress: action.payload.roomAddress,
            state: 'active'
        } });
}
function updatedCall(state, action) {
    if (!state[action.payload.roomAddress]) {
        state = addCall(state, action);
    }
    if (action.type === JOIN_CALL) {
        return Object.assign(Object.assign({}, state), { [action.payload.roomAddress]: Object.assign(Object.assign({}, state[action.payload.roomAddress]), { joined: true, joinedAt: new Date(Date.now()), requestingMedia: action.payload.desiredMedia }) });
    }
    if (action.type === LEAVE_CALL) {
        return Object.assign(Object.assign({}, state), { [action.payload.roomAddress]: Object.assign(Object.assign({}, state[action.payload.roomAddress]), { joined: false, joinedAt: undefined, requestingMedia: undefined }) });
    }
    if (action.type === SET_CALL_PREFERENCE) {
        return Object.assign(Object.assign({}, state), { [action.payload.roomAddress]: Object.assign(Object.assign({}, state[action.payload.roomAddress]), { requestingMedia: action.payload.desiredMedia }) });
    }
    return state;
}
function removeCall(state, action) {
    const result = Object.assign({}, state);
    delete result[action.payload.roomAddress];
    return result;
}
function CallsReducer (state = INITIAL_STATE$1, action) {
    switch (action.type) {
        case JOIN_CALL:
            return updatedCall(state, action);
        case LEAVE_CALL:
            return updatedCall(state, action);
        case LEAVE_ROOM:
            return removeCall(state, action);
        case JOIN_ROOM_SUCCESS:
            return updatedCall(state, action);
        case SET_CALL_PREFERENCE:
            return updatedCall(state, action);
    }
    return state;
}

const INITIAL_STATE$2 = {};
function addChat(state, action) {
    if (action.type === CHAT_INCOMING) {
        const chat = action.payload;
        const existing = state[chat.id];
        if (chat.replace) {
            const original = state[chat.replace];
            if (original && original.direction === DIRECTION_OUTGOING) {
                return Object.assign(Object.assign({}, state), { [chat.id]: Object.assign(Object.assign({}, existing), { acked: true, body: chat.body }) });
            }
        }
        if (!existing) {
            return Object.assign(Object.assign({}, state), { [chat.id]: chat });
        }
        if (existing.direction === DIRECTION_OUTGOING) {
            return Object.assign(Object.assign({}, state), { [chat.id]: Object.assign(Object.assign({}, existing), { acked: true, body: chat.body, time: chat.time }) });
        }
    }
    if (action.type === CHAT_OUTGOING) {
        const chat = action.payload;
        const existing = state[chat.id];
        return Object.assign(Object.assign({}, state), { [chat.id]: editChat(existing, chat) });
    }
    return state;
}
function editChat(original, replacement) {
    if (!original) {
        return replacement;
    }
    return Object.assign(Object.assign({}, replacement), { editedTime: replacement.time, time: original.time });
}
function ChatReducer (state = INITIAL_STATE$2, action) {
    switch (action.type) {
        case CHAT_INCOMING:
            return addChat(state, action);
        case CHAT_OUTGOING:
            return addChat(state, action);
    }
    return state;
}

const INITIAL_STATE$3 = {};
function addConnection$1(state, action) {
    return Object.assign(Object.assign({}, state), { [action.payload.id]: {
            connectionState: '',
            id: action.payload.id,
            peerAddress: action.payload.peerAddress,
            receivingAudioMediaId: '',
            receivingVideoMediaId: '',
            restarting: false,
            roomAddress: action.payload.roomAddress,
            sendingAudioMediaId: '',
            sendingVideoMediaId: '',
            sessionState: ''
        } });
}
function updateConnection$1(state, action) {
    if (!state[action.payload.id]) {
        return state;
    }
    return Object.assign(Object.assign({}, state), { [action.payload.id]: Object.assign(Object.assign(Object.assign({}, (state[action.payload.id] || {})), { peerAddress: action.payload.peerAddress }), action.payload.updated) });
}
function removeConnection$1(state, action) {
    const result = Object.assign({}, state);
    delete result[action.payload.id];
    return result;
}
function ConnectionsReducer (state = INITIAL_STATE$3, action) {
    switch (action.type) {
        case PEER_CONNECTION_ADDED:
            return addConnection$1(state, action);
        case PEER_CONNECTION_UPDATED:
            return updateConnection$1(state, action);
        case PEER_CONNECTION_REMOVED:
            return removeConnection$1(state, action);
    }
    return state;
}

const INITIAL_STATE$4 = {
    cameraPermissionDenied: false,
    cameraPermissionGranted: false,
    devices: [],
    hasAudioOutput: false,
    hasCamera: false,
    hasMicrophone: false,
    microphonePermissionDenied: false,
    microphonePermissionGranted: false,
    requestingCameraCapture: false,
    requestingCapture: false,
    requestingMicrophoneCapture: false
};
function DevicesReducer (state = INITIAL_STATE$4, action) {
    if (action.type === DEVICES) {
        const rawDevices = action.payload;
        const prevDevices = new Map(state.devices.map(d => [d.deviceId || d.kind, d]));
        let hasMicrophone = false;
        let hasCamera = false;
        let hasAudioOutput = false;
        let cameraPermissionGranted = false;
        let microphonePermissionGranted = false;
        let sameList = rawDevices.length === prevDevices.size;
        for (const device of rawDevices) {
            if (device.kind === 'audioinput') {
                hasMicrophone = true;
                microphonePermissionGranted =
                    microphonePermissionGranted || !!(device.label && device.deviceId);
            }
            if (device.kind === 'videoinput') {
                hasCamera = true;
                cameraPermissionGranted = cameraPermissionGranted || !!(device.label && device.deviceId);
            }
            if (device.kind === 'audiooutput') {
                hasAudioOutput = true;
            }
            sameList = sameList && prevDevices.has(device.deviceId || device.kind);
            if (!!device.label) ;
        }
        return Object.assign(Object.assign({}, state), { cameraPermissionGranted, devices: sameList ? state.devices : rawDevices.filter(d => !!d.label), hasAudioOutput,
            hasCamera,
            hasMicrophone,
            microphonePermissionGranted });
    }
    if (action.type === CAMERA_PERMISSION_DENIED) {
        return Object.assign(Object.assign({}, state), { cameraPermissionDenied: true });
    }
    if (action.type === MICROPHONE_PERMISSION_DENIED) {
        return Object.assign(Object.assign({}, state), { microphonePermissionDenied: true });
    }
    if (action.type === DEVICE_CAPTURE) {
        return Object.assign(Object.assign({}, state), { requestingCameraCapture: action.payload.camera, requestingCapture: action.payload.camera || action.payload.microphone, requestingMicrophoneCapture: action.payload.microphone });
    }
    return state;
}

const INITIAL_STATE$5 = {};
function addMedia(state, action) {
    return Object.assign(Object.assign({}, state), { [action.payload.id]: action.payload });
}
// TODO: typedoc merges this definition with the action of the same name making it
// impossible to generate docs for the action
function removeMediaReducer(state, action) {
    const result = Object.assign({}, state);
    delete result[action.payload.id];
    return result;
}
function updatedMedia(state, action) {
    const existing = state[action.payload.id];
    if (!existing) {
        return state;
    }
    return Object.assign(Object.assign({}, state), { [action.payload.id]: Object.assign(Object.assign({}, existing), action.payload.updated) });
}
function removeCallMedia(state, action) {
    const result = Object.assign({}, state);
    for (const id of Object.keys(state)) {
        const media = state[id];
        if (media.source === 'remote' && media.roomAddress === action.payload.roomAddress) {
            delete result[id];
        }
    }
    return result || {};
}
function MediaReducer (state = INITIAL_STATE$5, action) {
    switch (action.type) {
        case ADD_MEDIA:
            return addMedia(state, action);
        case REMOVE_MEDIA:
            return removeMediaReducer(state, action);
        case MEDIA_UPDATED:
            return updatedMedia(state, action);
        case LEAVE_CALL:
            return removeCallMedia(state, action);
    }
    return state;
}

const INITIAL_STATE$6 = {};
function addPeer(state, action) {
    if (state[action.payload.peerAddress]) {
        return updatePeer(state, {
            payload: {
                peerAddress: action.payload.peerAddress,
                updated: action.payload
            },
            type: PEER_UPDATED
        });
    }
    const now = new Date(Date.now());
    return Object.assign(Object.assign({}, state), { [action.payload.peerAddress]: {
            address: action.payload.peerAddress,
            affiliation: action.payload.affiliation,
            chatState: 'active',
            customerData: action.payload.customerData || {},
            displayName: action.payload.displayName || '',
            id: action.payload.id,
            joinedCall: action.payload.joinedCall || false,
            joinedCallAt: action.payload.joinedCall ? now : undefined,
            joinedRoomAt: now,
            lastSpokeAt: undefined,
            muted: false,
            requestingAttention: false,
            requestingMedia: action.payload.requestingMedia || 'none',
            role: action.payload.role,
            roomAddress: action.payload.roomAddress,
            rtt: '',
            speaking: false,
            userAddress: action.payload.userAddress,
            volume: -Infinity,
            volumeLimit: 0.8
        } });
}
function updatePeer(state, action) {
    const existingPeer = state[action.payload.peerAddress];
    if (!existingPeer) {
        return state;
    }
    const now = new Date(Date.now());
    let lastSpokeAt = existingPeer.lastSpokeAt;
    if (existingPeer.speaking && action.payload.updated.speaking === false) {
        lastSpokeAt = now;
    }
    let leftCall = false;
    if (existingPeer.joinedCall && action.payload.updated.joinedCall === false) {
        leftCall = true;
    }
    return Object.assign(Object.assign({}, state), { [action.payload.peerAddress]: Object.assign(Object.assign(Object.assign({}, existingPeer), action.payload.updated), { joinedCallAt: leftCall ? undefined : existingPeer.joinedCallAt || now, lastSpokeAt }) });
}
function removePeer(state, action) {
    const result = Object.assign({}, state);
    delete result[action.payload.peerAddress];
    return result;
}
function removeRoomPeers(state, action) {
    const result = Object.assign({}, state);
    for (const peerAddress of Object.keys(state)) {
        const peer = state[peerAddress];
        if (peer.roomAddress === action.payload.roomAddress) {
            delete result[peerAddress];
        }
    }
    return result;
}
function PeerReducer (state = INITIAL_STATE$6, action) {
    switch (action.type) {
        case CONNECTION_STATE_CHANGE:
            return action.payload === 'disconnected' ? {} : state;
        case PEER_ONLINE:
            return addPeer(state, action);
        case PEER_OFFLINE:
            return removePeer(state, action);
        case PEER_UPDATED:
            return updatePeer(state, action);
        case LEAVE_ROOM:
            return removeRoomPeers(state, action);
    }
    return state;
}

const INITIAL_STATE$7 = {};
function addRoom(state, action) {
    return Object.assign(Object.assign({}, state), { [action.payload.roomAddress]: {
            address: action.payload.roomAddress,
            autoJoinCall: !!action.payload.autoJoinCall,
            banned: false,
            id: '',
            joined: false,
            joinedAt: undefined,
            password: action.payload.password || '',
            passwordRequired: false,
            providedName: action.payload.providedRoomName,
            providedPassword: action.payload.providedPassword,
            roomNotStarted: false,
            roomState: 'joining',
            selfAddress: '',
            selfAffiliation: 'none',
            selfRole: 'none',
            unreadCount: 0
        } });
}
function updateRoom(state, action) {
    const existingRoom = state[action.payload.roomAddress];
    if (!existingRoom) {
        return state;
    }
    if (action.type === JOIN_ROOM_FAILED) {
        let roomState = 'failed';
        if (action.payload.passwordRequired) {
            roomState = 'password-required';
        }
        if (action.payload.roomNotStarted) {
            roomState = 'waiting';
        }
        if (action.payload.banned) {
            roomState = 'banned';
        }
        return Object.assign(Object.assign({}, state), { [action.payload.roomAddress]: Object.assign(Object.assign({}, existingRoom), { banned: !!action.payload.banned, joined: false, joinedAt: undefined, password: '', passwordRequired: !!action.payload.passwordRequired, roomNotStarted: !!action.payload.roomNotStarted, roomState }) });
    }
    return Object.assign(Object.assign({}, state), { [action.payload.roomAddress]: Object.assign(Object.assign({}, existingRoom), { id: action.payload.id, joined: true, joinedAt: existingRoom.joinedAt || new Date(Date.now()), roomState: 'joined', selfAddress: action.payload.selfAddress, selfAffiliation: action.payload.affiliation, selfRole: action.payload.role }) });
}
function updateRoomLock(state, action) {
    const existingRoom = state[action.payload.roomAddress];
    if (!existingRoom) {
        return state;
    }
    switch (action.type) {
        case LOCK_ROOM:
            return Object.assign(Object.assign({}, state), { [action.payload.roomAddress]: Object.assign(Object.assign({}, existingRoom), { providedPassword: action.payload.password || '' }) });
        case ROOM_LOCKED:
            return Object.assign(Object.assign({}, state), { [action.payload.roomAddress]: Object.assign(Object.assign({}, existingRoom), { password: action.payload.password || '', passwordRequired: true, providedPassword: undefined }) });
        case ROOM_UNLOCKED:
            return Object.assign(Object.assign({}, state), { [action.payload.roomAddress]: Object.assign(Object.assign({}, existingRoom), { password: '', passwordRequired: false, providedPassword: undefined }) });
    }
    return state;
}
function removeRoom(state, action) {
    const result = Object.assign({}, state);
    delete result[action.payload.roomAddress];
    return result;
}
function RoomsReducer (state = INITIAL_STATE$7, action) {
    if (action.type === CONNECTION_STATE_CHANGE) {
        if (action.payload !== 'disconnected') {
            return state;
        }
        const newState = {};
        for (const [roomAddress, room] of Object.entries(state)) {
            newState[roomAddress] = Object.assign(Object.assign({}, room), { joined: false, joinedAt: undefined, roomState: 'interrupted' });
        }
        return newState;
    }
    switch (action.type) {
        case SELF_UPDATED:
            return updateRoom(state, action);
        case JOIN_ROOM:
            return addRoom(state, action);
        case JOIN_ROOM_FAILED:
            return updateRoom(state, action);
        case JOIN_ROOM_SUCCESS:
            return updateRoom(state, action);
        case LEAVE_ROOM:
            return removeRoom(state, action);
        case LOCK_ROOM:
        case UNLOCK_ROOM:
        case ROOM_LOCKED:
        case ROOM_UNLOCKED:
            return updateRoomLock(state, action);
    }
    return state;
}

const INITIAL_STATE$8 = {
    displayName: '',
    globalVolumeLimit: 1,
    mediaEnabled: true,
    pushToTalk: false,
    requestingMedia: 'video',
    voiceActivityThreshold: -65
};
function updatePreference(state, action) {
    return Object.assign(Object.assign({}, state), action.payload);
}
function UserReducer (state = INITIAL_STATE$8, action) {
    switch (action.type) {
        case SET_USER_PREFERENCE:
            return updatePreference(state, action);
        case RECEIVED_CONFIG:
            return updatePreference(state, {
                payload: {
                    displayName: action.payload.config.displayName || state.displayName || 'Anonymous'
                },
                type: SET_USER_PREFERENCE
            });
        case DEVICES: {
            const outputDevice = state.audioOutputDeviceId;
            if (outputDevice) {
                for (const device of action.payload) {
                    if (device.deviceId === outputDevice) {
                        return state;
                    }
                }
                // Our output device is no longer available
                return updatePreference(state, {
                    payload: {
                        audioOutputDeviceId: ''
                    },
                    type: SET_USER_PREFERENCE
                });
            }
            return state;
        }
    }
    return state;
}

const reducer = combineReducers({
    api: APIReducer,
    calls: CallsReducer,
    chats: ChatReducer,
    connections: ConnectionsReducer,
    devices: DevicesReducer,
    media: MediaReducer,
    peers: PeerReducer,
    rooms: RoomsReducer,
    user: UserReducer
});

/**
 * @description
 * Local and remote audio tracks can be played with the `<Audio/>` component.
 *
 * The provided `media` property can include `remoteDisabled` and `localDisabled` fields. If either of those properties are `true`, audio playback will be muted.
 *
 * @public
 *
 * @example
 * <Audio
 *  media={getMediaTrack(store, 'some-media-id')}
 *  volume={getGlobalVolumeLimit(store)}
 *  outputDevice={getAudioOutputDevice(store)}
 * />
 */
class Audio extends Component {
    componentDidMount() {
        this.setup(true);
    }
    componentDidUpdate(prev) {
        if (prev.media && prev.media.id !== this.props.media.id) {
            this.setup(true);
        }
        else {
            this.setup(false);
        }
    }
    setup(newStream) {
        this.audio.oncontextmenu = e => {
            e.preventDefault();
        };
        // INTEROP ISSUE (8-02-19): Audio not playing in Safari if from a stream with paused video.
        // https://groups.google.com/forum/#!msg/discuss-webrtc/Gqo2MfnQWkw/x7nKi6UsFQAJ
        if (newStream) {
            if (window && window.safari) {
                this.stream = new MediaStream(this.props.media.stream.getAudioTracks());
            }
            else {
                this.stream = this.props.media.stream;
            }
            this.audio.srcObject = this.stream;
        }
        if (this.props.volume || this.props.volume === 0) {
            this.audio.volume = this.props.volume;
        }
        if (this.props.media.localDisabled ||
            this.props.media.remoteDisabled ||
            this.props.volume === 0) {
            this.audio.muted = true;
        }
        else {
            this.audio.muted = false;
        }
        if (this.props.outputDevice &&
            this.audio.sinkId !== this.props.outputDevice &&
            this.audio.setSinkId) {
            this.audio.pause();
            this.audio
                .setSinkId(this.props.outputDevice)
                .then(() => {
                this.audio.play();
            })
                .catch((err) => {
                this.audio.play();
                console.error(err);
            });
        }
        else {
            this.audio.autoplay = true;
        }
    }
    render() {
        return (createElement("audio", Object.assign({ ref: (el) => {
                this.audio = el;
            } }, { playsInline: true })));
    }
}

/**
 * @description
 *
 * @public
 *
 */
class PeerList extends Component {
    render() {
        const renderProps = {
            chatState: this.props.chatState || undefined,
            joinedCall: this.props.joinedCall || false,
            peers: this.props.peers || [],
            speaking: this.props.speaking || false
        };
        let render = this.props.render;
        if (!render && typeof this.props.children === 'function') {
            render = this.props.children;
        }
        return render ? render(renderProps) : this.props.children;
    }
}
function mapStateToProps(state, props) {
    const filters = [
        'joinedCall',
        'speaking',
        'chatState',
        'requestingAttention'
    ];
    const peers = getPeersForRoom(state, props.room).filter((peer) => {
        for (const filter of filters) {
            if (props[filter] !== undefined && peer[filter] !== props[filter]) {
                return false;
            }
        }
        return true;
    });
    return Object.assign(Object.assign({}, props), { peers });
}
var PeerList$1 = connect$1(mapStateToProps)(PeerList);

/**
 * @description
 *
 * @public
 *
 */
class ChatComposers extends Component {
    render() {
        const renderProps = {
            composers: this.props.composers || []
        };
        let render = this.props.render;
        if (!render && typeof this.props.children === 'function') {
            render = this.props.children;
        }
        if (render) {
            return (createElement(PeerList$1, { room: this.props.room, chatState: "composing", render: ({ peers }) => render({ composers: peers }) }));
        }
        else if (this.props.children) {
            return (createElement(PeerList$1, { room: this.props.room, chatState: "composing" }, this.props.children));
        }
        return (createElement(PeerList$1, { room: this.props.room, chatState: "composing", render: ({ peers }) => {
                switch (peers.length) {
                    case 0:
                        return null;
                    case 1: {
                        const peer0 = peers[0].displayName || 'Anonymous';
                        return createElement("div", { className: this.props.className }, `${peer0} is typing...`);
                    }
                    case 2: {
                        const peer0 = peers[0].displayName || 'Anonymous';
                        const peer1 = peers[1].displayName || 'Anonymous';
                        return (createElement("div", { className: this.props.className }, `${peer0} and ${peer1} are typing...`));
                    }
                    default:
                        return createElement("div", { className: this.props.className }, "People are typing...");
                }
            } }));
    }
}

/**
 * @description
 *
 * A basic textarea useful for custom rendering inside
 * of a <ChatInput /> component.
 *
 * The <ChatInput /> component renders this by default.
 *
 * @public
 *
 */
const ChatInputTextArea = props => (createElement("textarea", { id: props.id, className: props.className, autoFocus: props.autoFocus, value: props.message, placeholder: props.placeholder, disabled: props.disabled, onInput: event => {
        const value = event.target.value;
        props.updateMessage(value);
    }, onChange: () => null, onKeyPress: event => {
        if (event.key === 'Enter' && !event.shiftKey && props.sendOnEnter !== false) {
            event.preventDefault();
            props.sendMessage();
        }
    } }));
/**
 * @description
 *
 * @public
 *
 */
class ChatInput extends Component {
    constructor(props) {
        super(props);
        this.rttBuffer = new RTT.InputBuffer();
        this.state = {
            chatState: 'active',
            message: '',
            rtt: props.rtt
        };
    }
    componentDidUpdate(prev, prevState) {
        let rttEnabled = this.state.rtt && !prevState.rtt;
        let rttDisabled = !this.state.rtt && prevState.rtt;
        if (this.props.rtt === true && !prev.rtt) {
            rttEnabled = true;
        }
        if (this.props.rtt === false && prev.rtt !== false) {
            rttDisabled = true;
        }
        if (rttEnabled) {
            this.props.onRtt(this.rttBuffer.start());
            this.rttBuffer.update(this.state.message);
        }
        if (rttDisabled) {
            this.props.onRtt(this.rttBuffer.stop());
            clearInterval(this.rttInterval);
            this.rttInterval = null;
        }
    }
    startSendingRtt() {
        if (!this.rttInterval && (this.props.rtt || this.state.rtt)) {
            this.rttInterval = setInterval(this.rttSend.bind(this), 700);
            setTimeout(this.rttSend.bind(this), 100);
        }
    }
    rttUpdate(data = '') {
        this.rttBuffer.update(data);
        this.startSendingRtt();
    }
    rttSend() {
        if (!this.props.rtt && !this.state.rtt) {
            return;
        }
        const diff = this.rttBuffer.diff();
        if (diff) {
            this.props.onRtt(diff);
        }
    }
    commitMessage() {
        if (this.props.disabled || this.state.message.length === 0) {
            return;
        }
        clearTimeout(this.pausedTimeout);
        this.pausedTimeout = null;
        clearInterval(this.rttInterval);
        this.rttInterval = null;
        const { message } = this.state;
        this.setState({ message: '', chatState: 'active' });
        this.rttBuffer.commit();
        if (this.props.onChat) {
            this.props.onChat({
                body: message
            });
        }
    }
    updateChatState(chatState) {
        if (this.pausedTimeout) {
            clearTimeout(this.pausedTimeout);
        }
        if (chatState === 'composing') {
            this.pausedTimeout = setTimeout(() => {
                this.updateChatState('paused');
            }, 10000);
        }
        else {
            this.pausedTimeout = null;
        }
        if (chatState !== this.state.chatState) {
            if (this.props.onChatState) {
                this.props.onChatState(chatState);
            }
        }
        this.setState({
            chatState
        });
    }
    render() {
        const renderProps = {
            autoFocus: this.props.autoFocus,
            className: this.props.className,
            disabled: this.props.disabled,
            id: this.props.id,
            message: this.state.message,
            placeholder: this.props.placeholder,
            rtt: !!this.state.rtt,
            sendMessage: () => {
                this.commitMessage();
            },
            sendOnEnter: this.props.sendOnEnter,
            updateMessage: value => {
                this.rttUpdate(value);
                if (value !== '') {
                    this.updateChatState('composing');
                }
                if (this.state.message !== '' && value === '') {
                    this.updateChatState('active');
                }
                this.setState({
                    message: value
                });
            },
            useRealtimeText: (enabled) => {
                this.setState({ rtt: enabled });
            }
        };
        let render = this.props.render;
        if (!render && typeof this.props.children === 'function') {
            render = this.props.children;
        }
        if (render) {
            return render(renderProps);
        }
        return createElement(ChatInputTextArea, Object.assign({}, renderProps));
    }
}
function mapStateToProps$1(state, props) {
    return props;
}
function mapDispatchToProps(dispatch, props) {
    return {
        onChat: (opts) => dispatch(sendChat(props.room, opts)),
        onChatState: (state) => dispatch(sendChatState(props.room, state)),
        onRtt: (data) => dispatch(sendRTT(props.room, data))
    };
}
var ChatInput$1 = connect$1(mapStateToProps$1, mapDispatchToProps)(ChatInput);

function StayDown(opts) {

    opts = opts || {};
    this.target = opts.target;
    this.interval = opts.interval | 1000;
    this.max = opts.max || 0;
    this.callback = opts.callback;
    this.userScroll = true;
    this.spinner = opts.spinner;
    this.spin_img = new Image();
    this.stickyHeight = opts.stickyHeight || 10;
    if (this.spinner) {
        this.spin_img.src = this.spinner;
    }
    var staydown = this;
    this.intend_down = true;

    this.emit('lock');

    window.addEventListener('resize', function (event) {
        staydown.emit('windowresize');
        staydown.checkdown();
    });

    this.target.addEventListener('scroll', function (event) {
        if (staydown.userScroll) {
            if (staydown.intend_down && !staydown.isdown()) {
                staydown.intend_down = false;
                staydown.emit('release');
            } else if (!staydown.intend_down && staydown.isdown()) {
                staydown.intend_down = true;
                staydown.emit('lock');
            }
        }
        staydown.userScroll = true;
    });

    if (window.MutationObserver) {
        //private function for getting images recursively from dom

        //mutation observer for whenever the overflow element changes
        this.mo = new MutationObserver(function (mutations) {
            var mut, idx, nidx, imgs, img, iidx, ilen, parent, spin;
            staydown.userScroll = false;
            //something changed, check scroll
            staydown.checkdown();
            //check to see if image was added, and add onload check
            for (idx = 0; idx < mutations.length; idx++) {
                mut = mutations[idx];
                for (nidx = 0; nidx < mut.addedNodes.length; nidx++) {
                    // Check if we appended a node type that isn't
                    // an element that we can search for images inside.
                    if (!mut.addedNodes[nidx].getElementsByTagName) {
                        continue;
                    }

                    imgs = mut.addedNodes[nidx].getElementsByTagName('img');
                    for (iidx = 0, ilen = imgs.length; iidx < ilen; iidx++) {
                        img = imgs[iidx];
                        if (!img.complete) {
                            parent = img.parentNode;
                            if (staydown.spinner) {
                                spin = staydown.spin_img.cloneNode();
                                parent.replaceChild(spin, img);
                            }
                            var onImageLoad = function (event) {
                                if (spin) {
                                    //image loads later, and isn't a mutation
                                    parent.replaceChild(img, spin);
                                }
                                staydown.emit('imageload');
                                staydown.checkdown();
                                event.target.removeEventListener('load', onImageLoad);
                            };
                            img.addEventListener('load', onImageLoad);
                        }
                    }
                }
            }
        });
        this.mo.observe(this.target, {attributes: true, childList: true, characterData: true, subtree: true});
    } else {
        var checkdown = function () {
            staydown.checkdown();
            window.setTimeout(checkdown, staydown.interval);
        };
        checkdown();
    }

}

(function () {

    this.isdown = function () {
        var position = this.target.scrollHeight - this.target.scrollTop - this.target.clientHeight;
        return position < this.stickyHeight;
    };

    this.append = function (newel) {
        this.emit('append');
        this.target.appendChild(newel);
        if (this.intend_down) {
            this.target.scrollTop = this.target.scrollHeight;
            this.emit('scrolldown');
        }
        while (this.max !== 0 && this.target.children.length > this.max) {
            this.target.removeChild(this.target.children[0]);
            this.emit('removechild');
        }
    };

    this.emit = function (type, msg) {
        if (typeof this.callback === 'function') {
            this.callback(type, msg);
        }
    };

    this.checkdown = function () {
        var position = this.target.scrollHeight - this.target.scrollTop - this.target.clientHeight;
        if (this.intend_down || position < this.stickyHeight) {
            this.target.scrollTop = this.target.scrollHeight;
            this.userScroll = false;
            this.emit('scrolldown');
        }
    };

}).call(StayDown.prototype);

/**
 * @description
 *  The `<StayDownContainer/>` component forces its view to stay pinned to the bottom of its scrollable area, unless the user scrolls away from the bottom.
 *
 * It's especially suited for chat UIs so that new messages are displayed at the bottom but still kept visible unless the user has scrolled back to read past messages.
 *
 * @public
 *
 */
class StayDownContainer extends Component {
    render() {
        return (createElement("div", Object.assign({}, this.props, { ref: (el) => {
                if (!el) {
                    return;
                }
                const staydown = new StayDown({ target: el, stickyHeight: 30 });
                if (this.staydown) {
                    staydown.intend_down = this.staydown.intend_down;
                    staydown.userScroll = this.staydown.userScroll;
                }
                this.staydown = staydown;
                this.staydown.checkdown();
            } })));
    }
}

class ChatListGroup extends Component {
    render() {
        let render = this.props.render;
        if (!render && typeof this.props.children === 'function') {
            render = this.props.children;
        }
        if (render) {
            return render(this.props);
        }
        if (this.props.children) {
            return this.props.children;
        }
        return (createElement("div", null,
            createElement("span", null, this.props.displayName),
            this.props.chats.map(chat => (createElement("div", null, chat.body)))));
    }
}
/**
 * @description
 *
 * @public
 *
 */
class ChatList extends Component {
    render() {
        const groups = this.props.groups || [];
        let render = this.props.render;
        if (!render && typeof this.props.children === 'function') {
            render = this.props.children;
        }
        if (render) {
            return render({ groups });
        }
        if (this.props.children) {
            return this.props.children;
        }
        return (createElement(StayDownContainer, { id: this.props.id, className: this.props.className }, groups.map(group => {
            if (this.props.renderGroup) {
                return this.props.renderGroup(group);
            }
            else {
                return createElement(ChatListGroup, Object.assign({}, group));
            }
        })));
    }
}
function mapStateToProps$2(state, props) {
    if (!props.room) {
        return Object.assign(Object.assign({}, props), { groups: [] });
    }
    return Object.assign(Object.assign({}, props), { groups: getGroupedChatsForRoom(state, props.room, props.maxGroupDuration) || [] });
}
var ChatList$1 = connect$1(mapStateToProps$2)(ChatList);

/**
 * @description
 *
 * @public
 */
class CustomCommands extends Component {
    constructor(props) {
        super(props);
        this.commandHandler = (event) => {
            if (!event.peer) {
                return;
            }
            if (event.scope === 'room' && this.props.onRoomCommand) {
                this.props.onRoomCommand(event);
            }
            if (event.scope === 'peer' && this.props.onPeerCommand) {
                this.props.onPeerCommand(event);
            }
        };
    }
    render() {
        const renderProps = {
            sendPeerCommand: this.props.sendPeerCommand,
            sendRoomCommand: this.props.sendRoomCommand
        };
        let render = this.props.render;
        if (!render && typeof this.props.children === 'function') {
            render = this.props.children;
        }
        return render ? render(renderProps) : this.props.children || null;
    }
    componentDidMount() {
        if (this.props.signalingClient) {
            this.props.signalingClient.xmpp.on('swrtc-command', this.commandHandler);
        }
    }
    componentDidUpdate(prev) {
        if (this.props.signalingClient !== prev.signalingClient) {
            this.props.signalingClient.xmpp.on('swrtc-command', this.commandHandler);
        }
    }
    componentWillUnmount() {
        if (this.props.signalingClient) {
            this.props.signalingClient.xmpp.off('swrtc-command', this.commandHandler);
        }
    }
}
function mapStateToProps$3(state, props) {
    return {
        signalingClient: getClient(state)
    };
}
function mapDispatchToProps$1(dispatch, props) {
    return {
        sendPeerCommand: (peerAddress, datatype, data = {}) => dispatch(sendPeerCommand(peerAddress, datatype, data)),
        sendRoomCommand: (datatype, data = {}) => dispatch(sendRoomCommand(props.room, datatype, data))
    };
}
var Commands = connect$1(mapStateToProps$3, mapDispatchToProps$1)(CustomCommands);

/**
 * @description
 *
 * @public
 *
 */
class DeviceList extends Component {
    componentDidMount() {
        this.props.listenForDevices();
        this.props.fetchDevices();
    }
    componentWillUnmount() {
        stopListeningForDevices();
    }
    render() {
        const renderProps = {
            audioInput: this.props.audioInput,
            audioOutput: this.props.audioOutput,
            cameraPermissionDenied: this.props.cameraPermissionDenied,
            cameraPermissionGranted: this.props.cameraPermissionGranted,
            devices: this.props.devices,
            hasAudioOutput: this.props.hasAudioOutput,
            hasCamera: this.props.hasCamera,
            hasMicrophone: this.props.hasMicrophone,
            microphonePermissionDenied: this.props.microphonePermissionDenied,
            microphonePermissionGranted: this.props.microphonePermissionGranted,
            requestingCameraCapture: this.props.requestingCameraCapture,
            requestingCapture: this.props.requestingCapture,
            requestingMicrophoneCapture: this.props.requestingMicrophoneCapture,
            videoInput: this.props.videoInput
        };
        let render = this.props.render;
        if (!render && typeof this.props.children === 'function') {
            render = this.props.children;
        }
        return render ? render(renderProps) : this.props.children;
    }
}
function mapStateToProps$4(state, props) {
    const devices = getDevices(state).filter(device => {
        return ((!props.audioInput && !props.videoInput && !props.audioOutput) ||
            (device.kind === 'audioinput' && props.audioInput) ||
            (device.kind === 'videoinput' && props.videoInput) ||
            (device.kind === 'audiooutput' && props.audioOutput));
    });
    const permissions = getDevicePermissions(state);
    return Object.assign(Object.assign(Object.assign({}, props), { devices }), permissions);
}
function mapDispatchToProps$2(dispatch) {
    return {
        fetchDevices: () => dispatch(fetchDevices()),
        listenForDevices: () => dispatch(listenForDevices())
    };
}
var DeviceList$1 = connect$1(mapStateToProps$4, mapDispatchToProps$2)(DeviceList);

const PREDEFINED_LAYOUTS = new Map([
    [1, ['"x0"', 1, 1]],
    [2, ['"x0 x1"', 1, 2]],
    [3, ['"x0 x1" "x0 x2"', 2, 2]]
]);
function getGridTemplateAreas(numberOfItems) {
    if (PREDEFINED_LAYOUTS.has(numberOfItems)) {
        return PREDEFINED_LAYOUTS.get(numberOfItems)[0];
    }
    const columns = getGridTemplateColumns(numberOfItems);
    const rows = getGridTemplateRows(numberOfItems);
    const gridTemplateRows = [];
    for (let i = 0; i < rows; i++) {
        const row = [];
        for (let j = 0; j < columns; j++) {
            row.push('x' + (i * columns + j).toString(16));
        }
        gridTemplateRows.push(`"${row.join(' ')}"`);
    }
    return gridTemplateRows.join(' ');
}
function getGridTemplateColumns(numberOfItems) {
    if (PREDEFINED_LAYOUTS.has(numberOfItems)) {
        return PREDEFINED_LAYOUTS.get(numberOfItems)[2];
    }
    return Math.ceil(Math.pow(numberOfItems, 0.5));
}
function getGridTemplateRows(numberOfItems) {
    if (PREDEFINED_LAYOUTS.has(numberOfItems)) {
        return PREDEFINED_LAYOUTS.get(numberOfItems)[1];
    }
    return Math.ceil(numberOfItems / Math.ceil(Math.pow(numberOfItems, 0.5)));
}
function getGridArea(index) {
    return 'x' + index.toString(16);
}
function CellContainer(props) {
    return (createElement("div", { style: {
            display: 'flex',
            gridArea: getGridArea(props.index),
            overflow: 'hidden'
        } }, props.content));
}
function GridContainer(props) {
    return (createElement("div", { id: props.id, className: props.className, style: {
            display: 'grid',
            gridTemplateAreas: getGridTemplateAreas(props.itemCount),
            gridTemplateColumns: `repeat(${getGridTemplateColumns(props.itemCount)}, 1fr)`,
            gridTemplateRows: `repeat(${getGridTemplateRows(props.itemCount)}, 1fr)`
        } }, props.content));
}
/**
 * @description
 *
 * @public
 *
 */
class GridLayout extends Component {
    render() {
        const items = this.props.items;
        const rendered = [];
        let index = 0;
        for (const item of items) {
            const renderedItem = this.props.renderCell(item);
            if (renderedItem) {
                rendered.push(createElement(CellContainer, { index: index, key: index, content: renderedItem }));
                index += 1;
            }
        }
        return (createElement(GridContainer, { id: this.props.id, className: this.props.className, itemCount: rendered.length, content: rendered }));
    }
}

/**
 * @description
 *
 * @public
 *
 */
class LocalMediaList extends Component {
    render() {
        const renderProps = {
            audio: this.props.audio,
            media: this.props.media || [],
            removeMedia: this.props.removeMedia,
            screen: this.props.screen,
            shareLocalMedia: this.props.shareLocalMedia,
            shared: this.props.shared,
            stopSharingLocalMedia: this.props.stopSharingLocalMedia,
            video: this.props.video
        };
        let render = this.props.render;
        if (!render && typeof this.props.children === 'function') {
            render = this.props.children;
        }
        return render ? render(renderProps) : this.props.children;
    }
}
function mapStateToProps$5(state, props) {
    let desiredMedia;
    if (props.audio && !props.video) {
        desiredMedia = 'audio';
    }
    if (!props.audio && props.video) {
        desiredMedia = 'video';
    }
    let media = [];
    if (props.shared) {
        media = getSharedMedia(state, desiredMedia);
    }
    else {
        media = getLocalMedia(state, desiredMedia);
    }
    media = media.filter(m => {
        if (m.kind === 'video' && props.screen !== undefined) {
            return m.screenCapture === props.screen;
        }
        if (m.shared && props.shared === false) {
            return false;
        }
        return true;
    });
    return Object.assign(Object.assign({}, props), { media });
}
function mapDispatchToProps$3(dispatch) {
    return {
        removeMedia: (id) => dispatch(removeMedia(id)),
        shareLocalMedia: (id) => dispatch(shareLocalMedia(id)),
        stopSharingLocalMedia: (id) => dispatch(stopSharingLocalMedia(id))
    };
}
var LocalMediaList$1 = connect$1(mapStateToProps$5, mapDispatchToProps$3)(LocalMediaList);

/**
 * @description
 *
 * @public
 *
 */
class MediaControls extends Component {
    render() {
        const renderProps = {
            disable: this.props.disableMedia,
            enable: this.props.enableMedia,
            isEnabled: !this.props.media.localDisabled && !this.props.media.remoteDisabled,
            isShared: this.props.media.source === 'local' && !!this.props.media.shared,
            media: this.props.media,
            remove: this.props.removeLocalMedia,
            share: this.props.shareLocalMedia,
            stopSharing: () => {
                this.props.stopSharingLocalMedia();
                if (this.props.autoRemove) {
                    this.props.removeLocalMedia();
                    this.props.media.track.stop();
                }
            }
        };
        let render = this.props.render;
        if (!render && typeof this.props.children === 'function') {
            render = this.props.children;
        }
        return render ? render(renderProps) : this.props.children;
    }
}
function mapStateToProps$6(state) {
    return {};
}
function mapDispatchToProps$4(dispatch, props) {
    return {
        disableMedia: () => dispatch(disableMedia(props.media.id)),
        enableMedia: () => dispatch(enableMedia(props.media.id)),
        removeLocalMedia: () => dispatch(removeMedia(props.media.id)),
        shareLocalMedia: () => dispatch(shareLocalMedia(props.media.id)),
        stopSharingLocalMedia: () => dispatch(stopSharingLocalMedia(props.media.id))
    };
}
var MediaControls$1 = connect$1(mapStateToProps$6, mapDispatchToProps$4)(MediaControls);

/**
 * @description
 *
 * @public
 */
class Notifications extends Component {
    render() {
        let render = this.props.render;
        if (!render && typeof this.props.children === 'function') {
            render = this.props.children;
        }
        return render ? render() : this.props.children || null;
    }
    componentDidUpdate(prevProps) {
        const chatLength = Object.keys(this.props.chats).length;
        const prevChatLength = Object.keys(prevProps.chats).length;
        if (chatLength > prevChatLength && (this.props.onChatReceived || this.props.onChatSent)) {
            let found = 0;
            for (const [id, chat] of Object.entries(this.props.chats)) {
                if (!prevProps.chats[id]) {
                    if (chat.direction === 'incoming' && this.props.onChatReceived) {
                        this.props.onChatReceived(chat);
                    }
                    if (chat.direction === 'outgoing' && this.props.onChatSent) {
                        this.props.onChatSent(chat);
                    }
                    found += 1;
                    if (chatLength >= prevChatLength + found) {
                        break;
                    }
                }
            }
        }
        const peerLength = Object.keys(this.props.peers).length;
        const prevPeerLength = Object.keys(prevProps.peers).length;
        if (peerLength > prevPeerLength && this.props.onPeerEntered) {
            let found = 0;
            for (const [id, peer] of Object.entries(this.props.peers)) {
                if (!prevProps.peers[id]) {
                    this.props.onPeerEntered(peer);
                    found += 1;
                    if (peerLength >= prevPeerLength + found) {
                        break;
                    }
                }
            }
        }
        if (peerLength < prevPeerLength && this.props.onPeerLeft) {
            let found = 0;
            for (const [id, peer] of Object.entries(prevProps.peers)) {
                if (!this.props.peers[id]) {
                    this.props.onPeerLeft(peer);
                    found += 1;
                    if (peerLength + found >= prevPeerLength) {
                        break;
                    }
                }
            }
        }
    }
}
function mapStateToProps$7(state, props) {
    return {
        chats: state.simplewebrtc.chats,
        peers: state.simplewebrtc.peers
    };
}
var Notifications$1 = connect$1(mapStateToProps$7)(Notifications);

/**
 * @description
 *
 * @public
 *
 */
class PeerControls extends Component {
    render() {
        const renderProps = {
            hasActiveMicrophone: this.props.hasActiveMicrophone,
            isMuted: this.props.isMuted,
            isSpeaking: this.props.isSpeaking,
            kick: this.props.kick,
            mute: this.props.mute,
            peer: this.props.peer,
            setVolumeLimit: this.props.setVolumeLimit,
            unmute: this.props.unmute
        };
        let render = this.props.render;
        if (!render && typeof this.props.children === 'function') {
            render = this.props.children;
        }
        return render ? render(renderProps) : this.props.children;
    }
}
function mapStateToProps$8(state, props) {
    const peer = getPeerByAddress(state, props.peer.address) || {};
    const media = getMediaForPeer(state, props.peer.address, 'audio');
    const anyRemoteEnabled = media.filter(audio => !audio.remoteDisabled).length > 0;
    return {
        hasActiveMicrophone: anyRemoteEnabled,
        isMuted: peer.muted || false,
        isSpeaking: peer.speaking || false
    };
}
function mapDispatchToProps$5(dispatch, props) {
    return {
        kick: () => dispatch(kickPeer(props.peer.roomAddress, props.peer.userAddress)),
        mute: () => dispatch(mutePeer(props.peer.address)),
        setVolumeLimit: (volume) => dispatch(limitPeerVolume(props.peer.address, volume)),
        unmute: () => dispatch(unmutePeer(props.peer.address))
    };
}
var PeerControls$1 = connect$1(mapStateToProps$8, mapDispatchToProps$5)(PeerControls);

function mapStateToProps$9(state) {
    return {
        connectionState: getConnectionState(state),
        isSupportedBrowser: isSupportedBrowser(),
        localMedia: getLocalMedia(state)
    };
}
function mapDispatchToProps$6(dispatch, props) {
    return {
        connect: () => dispatch(connect(props.configUrl, props.userData)),
        disconnect: () => dispatch(disconnect()),
        removeAllMedia: () => dispatch(removeAllMedia()),
        setDefaultValues: () => {
            if (props.desiredMedia) {
                dispatch(setDesiredMedia(props.desiredMedia));
            }
            if (props.displayName) {
                dispatch(setDisplayName(props.displayName));
            }
            if (props.videoResolutionTiers) {
                dispatch(setVideoResolutionTiers(props.videoResolutionTiers));
            }
        }
    };
}
/**
 * @description
 *
 * @public
 *
 */
class Provider extends Component {
    componentDidMount() {
        this.props.setDefaultValues();
        this.props.connect();
        if (isBrowser()) {
            window.addEventListener('online', () => {
                // Trigger reconnection attempt with up to 5 seconds of jitter
                setTimeout(() => {
                    if (this.props.connectionState !== 'connected' &&
                        this.props.connectionState !== 'connecting') {
                        this.props.disconnect();
                        this.props.connect();
                    }
                }, Math.random() * 5000);
            });
            window.addEventListener('offline', () => {
                // Trigger disconnected state without waiting for websocket connection to timeout
                setTimeout(() => {
                    if (!navigator.onLine) {
                        this.props.disconnect();
                    }
                }, 5000);
            });
        }
    }
    componentWillUnmount() {
        this.props.removeAllMedia();
        this.props.disconnect();
    }
    render() {
        const renderProps = {
            connectionState: this.props.connectionState
        };
        let render = this.props.render;
        if (!render && typeof this.props.children === 'function') {
            render = this.props.children;
        }
        return render ? render(renderProps) : this.props.children;
    }
}
function createConnectionStateComponent(connectionState) {
    return connect$1(mapStateToProps$9)(class extends Component {
        render() {
            const renderProps = {
                connectionState: this.props.connectionState
            };
            let render = this.props.render;
            if (!render && typeof this.props.children === 'function') {
                render = this.props.children;
            }
            if (this.props.connectionState === connectionState) {
                return render ? render(renderProps) : this.props.children;
            }
            return null;
        }
    });
}
/**
 * @description
 *
 * @public
 * @example
 * <NotSupported>
 *   <p>This browser does not support WebRTC media features.</p>
 * </NotSupported>
 */
const NotSupported = connect$1(mapStateToProps$9, mapDispatchToProps$6)(class extends Component {
    render() {
        if (!this.props.isSupportedBrowser) {
            return this.props.children;
        }
        return null;
    }
});
/**
 * @description
 *
 * @public
 * @example
 * <NotConnected>
 *   <p>The client is not connected. It might be connecting or disconnected.</p>
 * </NotConnected>
 */
const NotConnected = connect$1(mapStateToProps$9, mapDispatchToProps$6)(class extends Component {
    render() {
        const renderProps = {
            connectionState: this.props.connectionState
        };
        let render = this.props.render;
        if (!render && typeof this.props.children === 'function') {
            render = this.props.children;
        }
        if (this.props.connectionState !== 'connected') {
            return render ? render(renderProps) : this.props.children;
        }
        return null;
    }
});
/**
 * @description
 * The `<Connected />` component renders its children when the SimpleWebRTC client is connected and ready.
 * @public
 * @example
 * <Connecting>
 *   <p>The client is connecting and not yet ready.</p>
 * </Connecting>
 */
const Connecting = createConnectionStateComponent('connecting');
/**
 * @description
 * The `<Connecting />` component renders its children when the SimpleWebRTC client is starting and attempting to connect to the service.
 * @public
 * @example
 * <Connected>
 *   <p>The client is now ready.</p>
 * </Connected>
 */
const Connected = createConnectionStateComponent('connected');
/**
 * @description
 * The `<Disconnected />` component renders its children when the SimpleWebRTC client has lost connection with the service.
 * @public
 * @example
 * <Disconnected>
 *   <p>The client lost access to the signaling service.</p>
 * </Disconnected>
 */
const Disconnected = createConnectionStateComponent('disconnected');
/**
 * @description
 * The `<Failed />` component renders its children when the SimpleWebRTC client failed to receive its service configuration and can not continue.
 * @public
 * @example
 * <Failed>
 *   <p>There was an error initializing the client. The service might not be available.</p>
 * </Failed>
 */
const Failed = createConnectionStateComponent('failed');
var Provider$1 = connect$1(mapStateToProps$9, mapDispatchToProps$6)(Provider);

/**
 * @description
 * The remote audio player component will play all enabled remote audio tracks. Only one instance needs to be used.
 *
 * @public
 *
 * @example
 * <div>
 *   {/* We can always keep the audio player around *\/}
 *   <RemoteAudioPlayer />
 *   <Connected>
 *     <p>Main app UI</p>
 *   </Connected>
 * </div>
 */
class RemoteAudioPlayer extends Component {
    render() {
        const sources = this.props.audioSources || [];
        const globalVolumeLimit = this.props.globalVolumeLimit;
        return (createElement(Fragment, null, sources.map(audio => (createElement(Audio, { key: audio.media.id, media: audio.media, volume: globalVolumeLimit * audio.volumeLimit, outputDevice: this.props.outputDevice })))));
    }
}
function mapStateToProps$a(state, props) {
    const media = getRemoteMedia(state, 'audio');
    const audioSources = [];
    for (const audio of media) {
        const peer = getPeerByAddress(state, audio.owner);
        audioSources.push({
            media: audio,
            volumeLimit: (peer ? peer.volumeLimit : 1) || 1
        });
    }
    return {
        audioSources,
        globalVolumeLimit: getGlobalVolumeLimit(state),
        outputDevice: getAudioOutputDevice(state)
    };
}
var RemoteAudioPlayer$1 = connect$1(mapStateToProps$a)(RemoteAudioPlayer);

/**
 * @description
 *
 * @public
 *
 */
class RemoteMediaList extends Component {
    render() {
        const renderProps = {
            audio: this.props.audio,
            media: this.props.media || [],
            peer: this.props.peer,
            video: this.props.video
        };
        let render = this.props.render;
        if (!render && typeof this.props.children === 'function') {
            render = this.props.children;
        }
        return render ? render(renderProps) : this.props.children;
    }
}
function mapStateToProps$b(state, props) {
    let desiredMedia;
    if (props.audio && !props.video) {
        desiredMedia = 'audio';
    }
    else if (!props.audio && props.video) {
        desiredMedia = 'video';
    }
    let media = [];
    if (props.peer) {
        media = getMediaForPeer(state, props.peer, desiredMedia);
    }
    else {
        media = getRemoteMedia(state, desiredMedia);
    }
    return Object.assign(Object.assign({}, props), { media });
}
var RemoteMediaList$1 = connect$1(mapStateToProps$b)(RemoteMediaList);

/**
 * @description
 *
 * @public
 *
 */
class RequestDisplayMedia extends Component {
    constructor(props) {
        super(props);
        this.state = {
            extensionInstalled: false,
            extensionInstalling: false,
            extensionRequired: false
        };
    }
    getDisplayMedia() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!navigator.mediaDevices.getDisplayMedia) {
                    throw new Error('getDisplayMedia not supported');
                }
                const stream = yield navigator.mediaDevices.getDisplayMedia({
                    audio: this.props.audio,
                    video: true
                });
                const video = stream.getVideoTracks()[0];
                if ('contentHint' in video) {
                    video.contentHint = this.props.videoTypeHint || 'detail';
                }
                this.props.addLocalScreen(video, stream);
                if (this.props.share !== false) {
                    this.props.shareLocalMedia(video.id);
                }
                const audio = stream.getAudioTracks()[0];
                if (audio) {
                    if ('contentHint' in audio) {
                        audio.contentHint = this.props.audioTypeHint;
                    }
                    this.props.addLocalAudio(audio, stream);
                    if (this.props.share !== false) {
                        this.props.shareLocalMedia(audio.id);
                    }
                }
            }
            catch (err) {
                console.log(err, err.message, err.name);
            }
        });
    }
    render() {
        if (this.props.render) {
            const available = 'getDisplayMedia' in navigator.mediaDevices;
            return this.props.render(this.getDisplayMedia.bind(this), {
                available,
                extensionId: this.props.extensionId,
                extensionInstalled: false,
                extensionInstalling: false,
                extensionRequired: false,
                listenForInstallation: (interval) => undefined,
                ready: available
            });
        }
        return createElement("button", { onClick: () => this.getDisplayMedia() }, "Start Screenshare");
    }
}
function mapStateToProps$c(state, ownProps) {
    const config = getAPIConfig(state);
    return {
        extensionId: ownProps.extensionId || config.screensharingExtensions.chrome
    };
}
function mapDispatchToProps$7(dispatch) {
    return {
        addLocalAudio: (track, stream) => dispatch(addLocalAudio(track, stream)),
        addLocalScreen: (track, stream) => dispatch(addLocalScreen(track, stream)),
        shareLocalMedia: (id) => dispatch(shareLocalMedia(id))
    };
}
var RequestDisplayMedia$1 = connect$1(mapStateToProps$c, mapDispatchToProps$7)(RequestDisplayMedia);

function mergeConstraints(defaults, provided, additional) {
    const disabled = additional === false || (!additional && !provided);
    if (disabled) {
        return false;
    }
    provided = provided === true ? {} : provided;
    additional = additional === true ? {} : additional;
    return Object.assign(Object.assign(Object.assign({}, defaults), provided), additional);
}
/**
 * @description
 * The `<RequestUserMedia />` component can be used to request user audio and video media.
 *
 * @public
 *
 * @example
 * <div>
 *   {/* Request audio and immediately share *\/}
 *   <RequestUserMedia audio auto share />
 *   {/* Request audio and video, but use custom renderer to trigger it *\/}
 *   <RequestUserMedia audio video share
 *    render={({ getUserMedia }) => (
 *    <button onClick={getUserMedia}>Get Media</button>
 *   )} />
 * </div>
 */
class RequestUserMedia extends Component {
    constructor(props) {
        super(props);
        this.errorCount = 0;
    }
    getMedia(additional = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            let stream;
            const defaultAudioConstraints = {};
            if (isBrowser()) {
                const supportedConstraints = navigator.mediaDevices.getSupportedConstraints();
                let audioProcessing = true;
                if (this.props.audioProcessing !== undefined) {
                    audioProcessing = this.props.audioProcessing;
                }
                for (const constraint of ['autoGainControl', 'echoCancellation', 'noiseSuppression']) {
                    if (supportedConstraints[constraint]) {
                        defaultAudioConstraints[constraint] =
                            audioProcessing && this.props.audioTypeHint !== 'music';
                    }
                }
            }
            const audioConstraints = mergeConstraints(defaultAudioConstraints, this.props.audio, additional.audio);
            const videoConstraints = mergeConstraints({}, this.props.video, additional.video);
            try {
                if (!navigator.mediaDevices) {
                    throw new Error('getUserMedia not supported');
                }
                this.props.deviceCaptureRequest(!!videoConstraints, !!audioConstraints);
                if (audioConstraints) {
                    // Multiple browser implementations only allow capturing one audio source at a time.
                    // As such, we stop all existing audio captures before requesting a new one.
                    yield this.props.removeAllMedia('audio');
                }
                stream = yield navigator.mediaDevices.getUserMedia({
                    audio: audioConstraints,
                    video: videoConstraints
                });
            }
            catch (err) {
                this.errorCount += 1;
                if (err.name === 'AbortError' && this.errorCount < 12) {
                    // We still sometimes can't start new audio after recently ending previous
                    // audio. So we will try to attempt the request again a few times.
                    setTimeout(() => this.getMedia(additional), 100 + Math.pow(2, this.errorCount));
                    return {};
                }
                if (err.name === 'NotAllowedError' || err.name === 'SecurityError') {
                    if (!!audioConstraints) {
                        this.props.microphonePermissionDenied();
                    }
                    if (!!videoConstraints) {
                        this.props.cameraPermissionDenied();
                    }
                }
                this.props.deviceCaptureRequest(false, false);
                if (this.props.onError) {
                    this.props.onError(err);
                }
                return {};
            }
            this.errorCount = 0;
            const audio = stream.getAudioTracks()[0];
            const video = stream.getVideoTracks()[0];
            if (audio) {
                if ('contentHint' in audio) {
                    audio.contentHint = this.props.audioTypeHint;
                }
                this.props.addLocalAudio(audio, stream, this.props.replaceAudio);
                if (this.props.share !== false) {
                    this.props.shareLocalMedia(audio.id);
                }
            }
            else if (!!audioConstraints) {
                this.props.microphonePermissionDenied();
            }
            if (video) {
                if ('contentHint' in video) {
                    video.contentHint = this.props.videoTypeHint;
                }
                if (this.props.screenCapture) {
                    this.props.addLocalScreen(video, stream, this.props.replaceVideo);
                }
                else {
                    this.props.addLocalVideo(video, stream, this.props.mirrored, this.props.replaceVideo);
                }
                if (this.props.share !== false) {
                    this.props.shareLocalMedia(video.id);
                }
            }
            else if (!!videoConstraints) {
                this.props.cameraPermissionDenied();
            }
            yield this.props.fetchDevices();
            yield this.props.deviceCaptureRequest(false, false);
            const trackIds = {
                audio: audio ? audio.id : undefined,
                video: video ? video.id : undefined
            };
            if (this.props.onSuccess) {
                this.props.onSuccess(trackIds);
            }
            return trackIds;
        });
    }
    componentDidMount() {
        if (this.props.auto) {
            this.getMedia();
        }
    }
    componentDidUpdate(prevProps) {
        if (this.props.auto && this.props.auto !== prevProps.auto) {
            this.getMedia();
        }
    }
    render() {
        const renderProps = this.getMedia.bind(this);
        const captureState = {
            requestingCameraCapture: this.props.requestingCameraCapture,
            requestingCapture: this.props.requestingCapture,
            requestingMicrophoneCapture: this.props.requestingMicrophoneCapture
        };
        let render = this.props.render;
        if (!render && typeof this.props.children === 'function') {
            render = this.props.children;
        }
        if (render) {
            return render(renderProps, captureState);
        }
        else if (this.props.children) {
            return this.props.children;
        }
        if (this.props.auto) {
            return null;
        }
        else {
            return createElement("button", { onClick: renderProps }, "Request Media");
        }
    }
}
function mapStateToProps$d(state, props) {
    const permissions = getDevicePermissions(state);
    return Object.assign(Object.assign({}, props), { requestingCameraCapture: permissions.requestingCameraCapture, requestingCapture: permissions.requestingCapture, requestingMicrophoneCapture: permissions.requestingMicrophoneCapture });
}
function mapDispatchToProps$8(dispatch) {
    return {
        addLocalAudio: (track, stream, replace) => dispatch(addLocalAudio(track, stream, replace)),
        addLocalScreen: (track, stream, replace) => dispatch(addLocalScreen(track, stream, replace)),
        addLocalVideo: (track, stream, mirrored, replace) => dispatch(addLocalVideo(track, stream, mirrored, replace)),
        cameraPermissionDenied: (err) => dispatch(cameraPermissionDenied(err)),
        deviceCaptureRequest: (camera, microphone) => dispatch(deviceCaptureRequest(camera, microphone)),
        fetchDevices: () => dispatch(fetchDevices()),
        microphonePermissionDenied: (err) => dispatch(microphonePermissionDenied(err)),
        removeAllMedia: (kind) => dispatch(removeAllMedia(kind)),
        shareLocalMedia: (id) => dispatch(shareLocalMedia(id))
    };
}
var RequestUserMedia$1 = connect$1(mapStateToProps$d, mapDispatchToProps$8)(RequestUserMedia);

/**
 * @description
 *
 * @public
 *
 */
class Room extends Component {
    componentDidMount() {
        if (this.props.connectionState === 'connected') {
            this.props.join();
        }
    }
    componentWillUnmount() {
        this.props.leave(this.props.roomAddress);
    }
    componentDidUpdate(prevProps) {
        if (this.props.connectionState !== 'connected') {
            return;
        }
        if (this.props.connectionState !== prevProps.connectionState) {
            this.props.join();
            return;
        }
        if (!this.props.room) {
            return;
        }
        if (this.props.password !== prevProps.password) {
            if (this.props.room.roomState === 'joined') {
                if (this.props.password) {
                    this.props.lock(this.props.roomAddress, this.props.password);
                }
                else {
                    this.props.unlock(this.props.roomAddress);
                }
            }
            else {
                this.props.join();
            }
        }
    }
    render() {
        const renderProps = {
            call: this.props.call || {},
            joined: this.props.room ? this.props.room.joined : false,
            localMedia: this.props.localMedia || [],
            peers: this.props.peers || [],
            remoteMedia: this.props.remoteMedia || [],
            room: this.props.room || {}
        };
        let render = this.props.render;
        if (!render && typeof this.props.children === 'function') {
            render = this.props.children;
        }
        return render ? render(renderProps) : this.props.children;
    }
}
function mapStateToProps$e(state, props) {
    let room;
    if (props.roomAddress) {
        room = getRoomByAddress(state, props.roomAddress);
    }
    if (!room && props.name) {
        room = getRoomByProvidedName(state, props.name);
    }
    return {
        call: room ? getCallForRoom(state, room.address) : undefined,
        connectionState: getConnectionState(state),
        localMedia: getLocalMedia(state),
        peers: room ? getPeersForRoom(state, room.address) : [],
        remoteMedia: getRemoteMedia(state),
        room,
        roomAddress: room ? room.address : undefined,
        roomState: room ? room.roomState : 'joining'
    };
}
function mapDispatchToProps$9(dispatch, props) {
    return {
        destroy: (roomAddress) => dispatch(destroyRoom(roomAddress)),
        join: () => dispatch(joinRoom(props.name, { password: props.password || undefined })),
        leave: (roomAddress) => dispatch(leaveRoom(roomAddress)),
        lock: (roomAddress, password) => dispatch(lockRoom(roomAddress, password)),
        unlock: (roomAddress) => dispatch(unlockRoom(roomAddress))
    };
}
var Room$1 = connect$1(mapStateToProps$e, mapDispatchToProps$9)(Room);

/**
 * @description
 *
 * @public
 *
 */
class UserControls extends Component {
    render() {
        const renderProps = {
            customerData: this.props.customerData || {},
            deafen: this.props.deafen,
            hasAudio: this.props.hasAudio || false,
            hasScreenCapture: this.props.hasScreenCapture || false,
            hasVideo: this.props.hasVideo || false,
            isDeafened: this.props.isDeafened || false,
            isMuted: this.props.isMuted || false,
            isPaused: this.props.isPaused || false,
            isScreenCapturePaused: this.props.isScreenCapturePaused || false,
            isSpeaking: this.props.isSpeaking || false,
            isSpeakingWhileMuted: this.props.isSpeakingWhileMuted || false,
            mute: this.props.mute,
            pauseVideo: this.props.pauseVideo,
            resumeVideo: this.props.resumeVideo,
            setAudioOutputDevice: this.props.setAudioOutputDevice,
            setDisplayName: this.props.setDisplayName,
            setGlobalVolumeLimit: this.props.setGlobalVolumeLimit,
            setVoiceActivityThreshold: this.props.setVoiceActivityThreshold,
            undeafen: this.props.undeafen,
            unmute: this.props.unmute,
            user: this.props.user
        };
        let render = this.props.render;
        if (!render && typeof this.props.children === 'function') {
            render = this.props.children;
        }
        if (render) {
            return render(renderProps);
        }
        return this.props.children;
    }
}
function mapStateToProps$f(state, props) {
    const localMedia = getLocalMedia(state);
    let isMuted = true;
    let isPaused = true;
    let isScreenCapturePaused = true;
    let hasAudio = false;
    let hasVideo = false;
    let hasScreenCapture = false;
    for (const media of localMedia) {
        if (media.kind === 'audio') {
            hasAudio = true;
            isMuted = isMuted && media.localDisabled;
        }
        if (media.kind === 'video') {
            if (!media.screenCapture) {
                hasVideo = true;
                isPaused = isPaused && media.localDisabled;
            }
            else {
                hasScreenCapture = true;
                isScreenCapturePaused = isScreenCapturePaused && media.localDisabled;
            }
        }
    }
    const customerData = getUserCustomerData(state);
    const user = getUser(state);
    const globalVolumeLimit = getGlobalVolumeLimit(state);
    const isSpeaking = userIsSpeaking(state, false);
    const isSpeakingWhileMuted = userIsSpeakingWhileMuted(state, false);
    return {
        customerData,
        hasAudio,
        hasScreenCapture,
        hasVideo,
        isDeafened: globalVolumeLimit === 0,
        isMuted,
        isPaused,
        isScreenCapturePaused,
        isSpeaking,
        isSpeakingWhileMuted,
        user
    };
}
function mapDispatchToProps$a(dispatch, props) {
    return {
        deafen: () => dispatch(setGlobalVolumeLimit(0)),
        mute: () => dispatch(muteSelf()),
        pauseVideo: (opts) => dispatch(pauseSelfVideo(opts)),
        resumeVideo: (opts) => dispatch(resumeSelfVideo(opts)),
        setAudioOutputDevice: (deviceId) => dispatch(setAudioOutputDevice(deviceId)),
        setDisplayName: (name) => dispatch(setDisplayName(name)),
        setGlobalVolumeLimit: (volumeLimit) => dispatch(setGlobalVolumeLimit(volumeLimit)),
        setVoiceActivityThreshold: (threshold) => dispatch(setVoiceActivityThreshold(threshold)),
        undeafen: () => dispatch(setGlobalVolumeLimit(1)),
        unmute: () => dispatch(unmuteSelf())
    };
}
var UserControls$1 = connect$1(mapStateToProps$f, mapDispatchToProps$a)(UserControls);

/**
 * @description
 * Local and remote video tracks can be played with the `<Video/>` component.
 *
 * The provided `media` property can include `remoteDisabled` and `localDisabled` fields. If either of those properties are `true`, video playback will be paused.
 *
 * The `qualityProfile` property can be used to request increasing or decreasing the video size/quality from the sending peer, if the media is from a remote source.
 *
 * Only one `Video` component with a `qualityProfile` should be rendered at a time for a given video track.
 *
 * @public
 *
 * @example
 * <Video media={getMediaTrack(store, 'some-media-id')} />
 */
class Video extends Component {
    componentDidMount() {
        this.setup();
    }
    componentDidUpdate(prev) {
        this.setup(prev);
    }
    componentWillUnmount() {
        if (this.props.qualityProfile) {
            this.props.requestQualityProfile('low');
        }
    }
    setup(prev) {
        if (!this.props.media || !this.video) {
            return;
        }
        this.video.oncontextmenu = e => {
            e.preventDefault();
        };
        this.video.muted = true;
        this.video.autoplay = true;
        let newSource = false;
        if (this.video.srcObject !== this.props.media.stream) {
            this.video.srcObject = this.props.media.stream;
            newSource = true;
        }
        if (this.props.media.source !== 'remote' ||
            !this.props.qualityProfile ||
            (prev && this.props.qualityProfile === prev.qualityProfile)) {
            return;
        }
        if (newSource || this.props.qualityProfile !== this.props.media.profile) {
            this.props.requestQualityProfile(this.props.qualityProfile);
        }
    }
    render() {
        if (!this.props.media || !this.props.media.loaded) {
            return null;
        }
        return (createElement("video", { ref: (el) => {
                this.video = el;
            }, style: this.props.media && this.props.media.renderMirrored
                ? {
                    transform: 'scaleX(-1)'
                }
                : {}, playsInline: true }));
    }
}
function mapDispatchToProps$b(dispatch, props) {
    return {
        requestQualityProfile: (profile) => dispatch(requestQualityProfile(props.media.id, profile))
    };
}
var Video$1 = connect$1((_, props) => props, mapDispatchToProps$b)(Video);

/**
 * @description
 * The volume meter component can be used to display the audio output volume of a track. Useful for showing that a user's microphone is live and sensitive enough to detect speech.
 *
 * @public
 *
 * @example
 * <VolumeMeter
 * media={getMediaTrack(store, 'some-media-id')}
 * render={({ volume, speaking }) => {
 *   // Render volume as a series of segments
 *
 *   const buckets = Math.abs(Math.max(volume / 10));
 *   let i = 0;
 *
 *   const segments = [];
 *   for (let i = 0; i < buckets; i++) {
 *       segments.push(<div key={i} className='volume-meter-segment' />);
 *   }
 *
 *   return (
 *     <div className={speaking ? 'volume-meter-speaking' : 'volume-meter-notspeaking'}>
 *       {segments}
 *     </div>
 *   );
 * }} />
 */
class VolumeMeter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            volume: -Infinity
        };
        this.onVolume = (volume) => {
            this.setState({
                volume
            });
        };
    }
    componentDidMount() {
        if (!this.props.media || !this.props.media.hark) {
            return;
        }
        this.attachHark();
    }
    componentWillUnmount() {
        this.detachHark();
    }
    componentDidUpdate(prevProps) {
        if (prevProps.media !== this.props.media) {
            this.detachHark();
            this.attachHark();
        }
    }
    attachHark() {
        this.setState({
            volume: -Infinity
        });
        if (this.props.media) {
            this.hark = this.props.media.hark;
        }
        if (this.hark) {
            this.hark.on('volume', this.onVolume);
        }
    }
    detachHark() {
        if (this.hark) {
            this.hark.removeListener('volume', this.onVolume);
            this.hark = undefined;
        }
        this.setState({
            volume: -Infinity
        });
    }
    render() {
        const media = this.props.media;
        const noInputTimeout = this.props.noInputTimeout || 7000;
        const noInput = media &&
            (media.externalDisabled ||
                (!!media.inputLost && Date.now() - media.inputLost > noInputTimeout));
        const renderProps = {
            loaded: media && !!media.loaded && !!media.inputDetected,
            media,
            muted: media && media.localDisabled,
            noInput,
            speaking: media && media.speaking,
            speakingWhileMuted: media && media.localDisabled && media.speaking,
            volume: media.externalDisabled ? -Infinity : this.state.volume
        };
        let render = this.props.render;
        if (!render && typeof this.props.children === 'function') {
            render = this.props.children;
        }
        if (render) {
            return render(renderProps);
        }
        return this.props.children;
    }
}

const isSupportedBrowser$1 = isSupportedBrowser();
const screensharing = ScreenSharingHelpers;
const initial = {
    simplewebrtc: {}
};
function createStore() {
    return createStore$1(combineReducers({
        simplewebrtc: reducer
    }), initial, compose(applyMiddleware(Thunk)));
}

export { index as Actions, Audio, ChatComposers, ChatInput$1 as ChatInput, ChatInputTextArea, ChatList$1 as ChatList, Commands, Connected, Connecting, DeviceList$1 as DeviceList, Disconnected, Failed, GridLayout, LocalMediaList$1 as LocalMediaList, MediaControls$1 as MediaControls, NotConnected, NotSupported, Notifications$1 as Notifications, PeerControls$1 as PeerControls, PeerList$1 as PeerList, Provider$1 as Provider, RemoteAudioPlayer$1 as RemoteAudioPlayer, RemoteMediaList$1 as RemoteMediaList, RequestDisplayMedia$1 as RequestDisplayMedia, RequestUserMedia$1 as RequestUserMedia, Room$1 as Room, Selectors, StayDownContainer, UserControls$1 as UserControls, Video$1 as Video, VolumeMeter, createStore, isSupportedBrowser$1 as isSupportedBrowser, reducer, screensharing };
