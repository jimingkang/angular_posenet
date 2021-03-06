"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const webrtc_adapter_1 = tslib_1.__importDefault(require("webrtc-adapter"));
const Stanza = tslib_1.__importStar(require("stanza"));
const Actions = tslib_1.__importStar(require("../actions"));
const Selectors = tslib_1.__importStar(require("../Selectors"));
const Mesh_1 = tslib_1.__importDefault(require("./Mesh"));
const MMUC_1 = tslib_1.__importDefault(require("./MMUC"));
const SFU_1 = tslib_1.__importDefault(require("./SFU"));
class SignalingClient {
    constructor(dispatch, getState, opts) {
        this.terminating = false;
        this.reconnectAttempts = 0;
        this.dispatch = dispatch;
        this.getState = getState;
        this.rttBuffers = new Map();
        this.xmpp = Stanza.createClient({
            allowResumption: false,
            transports: {
                websocket: opts.wsURL
            },
            useStreamManagement: false,
            ...opts
        });
        this.jingle = this.xmpp.jingle;
        this.xmpp.stanzas.define(MMUC_1.default);
        this.sfu = new SFU_1.default(this, webrtc_adapter_1.default.browserDetails.browser);
        this.mesh = new Mesh_1.default(this);
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
            this.dispatch(Actions.connectionStateChanged('connected'));
        });
        this.xmpp.on('disconnected', () => {
            if (this.terminating) {
                return;
            }
            this.reconnectAttempts += 1;
            this.dispatch(Actions.connectionStateChanged('disconnected'));
            if (this.reconnectTimer) {
                clearTimeout(this.reconnectTimer);
            }
            this.reconnectTimer = setTimeout(() => {
                const state = this.getState();
                const configUrl = Selectors.getConfigURL(state);
                const userData = Selectors.getUserToken(state);
                this.dispatch(Actions.connect(configUrl, userData));
            }, 1000 * (this.reconnectAttempts + 1) + Math.random() * 2000);
        });
        this.xmpp.on('muc:available', pres => {
            const roomAddress = Stanza.JID.toBare(pres.from);
            const peerAddress = pres.from;
            const state = this.getState();
            const room = Selectors.getRoomByAddress(state, roomAddress);
            if (!room) {
                return;
            }
            if (pres.muc && pres.muc.statusCodes.indexOf('110') >= 0) {
                this.dispatch(Actions.selfUpdated(roomAddress, peerAddress, room.id, pres.muc.role, pres.muc.affiliation));
                return;
            }
            if (!this.rttBuffers.has(peerAddress)) {
                const buffer = new Stanza.RTT.DisplayBuffer(({ text }) => {
                    this.dispatch(Actions.peerUpdated(peerAddress, {
                        rtt: text
                    }));
                });
                this.rttBuffers.set(peerAddress, buffer);
            }
            const customerData = pres.talkyUserInfo.customerData || {};
            this.dispatch(Actions.peerOnline(roomAddress, peerAddress, {
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
                pres.muc.statusCodes.indexOf(Stanza.Constants.MUCStatusCode.SelfPresence) >= 0) {
                let endMedia = true;
                if (pres.muc.destroy && pres.muc.destroy.jid) {
                    endMedia = false;
                    this.dispatch(Actions.roomReplaced(Stanza.JID.toBare(pres.from), pres.muc.destroy.jid, pres.muc.destroy.password));
                }
                this.dispatch(Actions.leaveRoom(Stanza.JID.toBare(pres.from), endMedia));
                return;
            }
            this.rttBuffers.delete(pres.from);
            this.dispatch(Actions.peerOffline(Stanza.JID.toBare(pres.from), pres.from));
        });
        this.xmpp.on('chat:state', msg => {
            this.dispatch(Actions.peerUpdated(msg.from, {
                chatState: msg.chatState
            }));
        });
        this.xmpp.on('attention', msg => {
            this.dispatch(Actions.peerUpdated(msg.from, {
                requestingAttention: true
            }));
            setTimeout(() => {
                this.dispatch(Actions.peerUpdated(msg.from, {
                    requestingAttention: false
                }));
            }, 5000);
        });
        this.xmpp.on('message', msg => {
            if (msg.jsonPayloads) {
                const roomAddress = Stanza.JID.toBare(msg.from);
                const peerAddress = msg.from;
                const room = Selectors.getRoomByAddress(this.getState(), roomAddress);
                if (room && room.selfAddress === msg.from) {
                    // Skip processing our own reflected commands
                    return;
                }
                const peer = Selectors.getPeerByAddress(this.getState(), peerAddress);
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
                this.dispatch(Actions.receiveChat(Stanza.JID.toBare(msg.from), msg.from, {
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
        this.dispatch(Actions.connectionStateChanged('disconnected'));
        this.xmpp.disconnect();
    }
    async joinRoom(roomAddress, password) {
        const initialState = this.getState();
        const config = Selectors.getAPIConfig(initialState);
        try {
            const joinedPresence = await this.xmpp.joinRoom(roomAddress, config.id, {
                muc: {
                    password,
                    type: 'join'
                },
                nick: Selectors.getUserDisplayName(initialState)
            });
            const state = this.getState();
            const room = Selectors.getRoomByAddress(state, roomAddress);
            if (!room) {
                return;
            }
            await this.checkLockStatus(roomAddress, room.providedPassword);
            this.dispatch(Actions.joinRoomSuccess(roomAddress, joinedPresence.from, joinedPresence.talkyUserInfo.roomId, joinedPresence.muc.role, joinedPresence.muc.affiliation));
            if (room && room.autoJoinCall) {
                this.dispatch(Actions.joinCall(roomAddress, Selectors.getDesiredMediaTypes(state, roomAddress)));
            }
        }
        catch (err) {
            this.dispatch(Actions.joinRoomFailed(roomAddress, {
                banned: err.error && err.error.condition === 'forbidden',
                passwordRequired: err.error && err.error.condition === 'not-authorized',
                roomNotStarted: err.error && err.error.condition === 'recipient-unavailable'
            }));
        }
    }
    async destroyRoom(roomAddress) {
        await this.xmpp.destroyRoom(roomAddress);
    }
    async kickPeerFromRoom(roomAddress, peerAddress) {
        await this.xmpp.setRoomAffiliation(roomAddress, peerAddress, 'outcast');
    }
    sendRoomPresence(roomAddress, opts = {}) {
        const state = this.getState();
        const displayName = Selectors.getUserDisplayName(state);
        const room = Selectors.getRoomByAddress(state, roomAddress);
        const call = Selectors.getCallForRoom(state, roomAddress);
        const media = Selectors.getDesiredMediaTypes(state, roomAddress);
        if (!room || !room.joined) {
            return;
        }
        this.xmpp.sendPresence({
            mmuc: call && call.joined
                ? {
                    media
                }
                : undefined,
            nick: displayName,
            to: roomAddress,
            ...opts
        });
    }
    sendAllRoomsPresence(opts = {}) {
        const state = this.getState();
        const rooms = Object.keys(Selectors.getRooms(state));
        for (const roomAddress of rooms) {
            this.sendRoomPresence(roomAddress, opts);
        }
    }
    sendAllCallsSpeakingUpdate(speaking) {
        const state = this.getState();
        const calls = Selectors.getJoinedCalls(state);
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
    async lockRoom(roomAddress, password) {
        const state = this.getState();
        const room = Selectors.getRoomByAddress(state, roomAddress);
        if (!room || !room.joined || room.selfAffiliation !== 'owner') {
            return;
        }
        try {
            await this.xmpp.configureRoom(roomAddress, {
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
            this.dispatch(Actions.roomLocked(roomAddress, password));
        }
        catch (err) {
            console.error(err);
        }
    }
    async unlockRoom(roomAddress) {
        const state = this.getState();
        const room = Selectors.getRoomByAddress(state, roomAddress);
        if (!room || !room.joined || room.selfAffiliation !== 'owner') {
            return;
        }
        try {
            await this.xmpp.configureRoom(roomAddress, {
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
            this.dispatch(Actions.roomUnlocked(roomAddress));
        }
        catch (err) {
            console.error(err);
        }
    }
    async fetchRoomConfig(roomAddress, initial = false) {
        const config = {};
        const state = this.getState();
        const room = Selectors.getRoomByAddress(state, roomAddress);
        if (!initial && (!room || !room.joined)) {
            throw new Error('Room not joined');
        }
        const form = await this.xmpp.getRoomConfig(roomAddress);
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
    }
    async checkLockStatus(roomAddress, providedPassword, forceInfo) {
        const room = Selectors.getRoomByAddress(this.getState(), roomAddress);
        if (!room) {
            return;
        }
        if (room.selfAffiliation === 'owner' && !forceInfo) {
            try {
                const config = await this.fetchRoomConfig(roomAddress, true);
                if (config.password) {
                    this.dispatch(Actions.roomLocked(roomAddress, config.password));
                }
                else if (providedPassword) {
                    this.dispatch(Actions.lockRoom(roomAddress, providedPassword));
                }
                else {
                    this.dispatch(Actions.roomUnlocked(roomAddress));
                }
            }
            catch (err) {
                console.error(err);
                return this.checkLockStatus(roomAddress, providedPassword, true);
            }
        }
        else {
            try {
                const disco = await this.xmpp.getDiscoInfo(roomAddress);
                if (disco.features.indexOf('muc_passwordprotected') >= 0) {
                    this.dispatch(Actions.roomLocked(roomAddress));
                }
                else {
                    this.dispatch(Actions.roomUnlocked(roomAddress));
                }
            }
            catch (err) {
                console.error(err);
            }
        }
    }
    async processMessage(msg) {
        const roomAddress = Stanza.JID.toBare(msg.from);
        const room = Selectors.getRoomByAddress(this.getState(), roomAddress);
        if (msg.type === 'groupchat' && msg.mmuc) {
            if (room && room.selfAddress !== msg.from && msg.mmuc) {
                this.dispatch(Actions.peerUpdated(msg.from, {
                    speaking: msg.mmuc.speaking || false
                }));
            }
        }
        if (!msg.muc || msg.muc.type === 'direct-invite') {
            return;
        }
        if (msg.muc.statusCodes && msg.muc.statusCodes.indexOf('104') >= 0) {
            await this.checkLockStatus(roomAddress);
        }
    }
}
exports.default = SignalingClient;
