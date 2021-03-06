"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const signaling_1 = require("../signaling");
const Constants_1 = require("../Constants");
const Selectors_1 = require("../Selectors");
let REPORTING_INTERVAL;
async function sleep(timeout, throwError = false) {
    return new Promise((resolve, reject) => {
        setTimeout(() => (throwError ? reject() : resolve()), timeout);
    });
}
exports.sleep = sleep;
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
async function fetchConfig(configUrl, userData, maxTries = 10, delay = 1000, timeout = 10000) {
    let attemptCount = 0;
    let error;
    while (attemptCount <= maxTries) {
        try {
            const data = await Promise.race([
                fetch(configUrl, {
                    body: JSON.stringify({
                        clientVersion: Constants_1.SDK_VERSION,
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
            const config = await data.json();
            if (userData && !config.customerData) {
                console.error('ESWRTC_003. View more information at https://docs.simplewebrtc.com');
            }
            return config;
        }
        catch (err) {
            error = err;
            attemptCount += 1;
            await sleep(delay);
        }
    }
    if (error) {
        console.error('ESWRTC_001. View more information at https://docs.simplewebrtc.com');
        throw error;
    }
}
exports.fetchConfig = fetchConfig;
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
    return async (dispatch, getState) => {
        let config;
        dispatch(connectionStateChanged('connecting'));
        try {
            config = await fetchConfig(configUrl, userData);
            dispatch(receivedConfig(configUrl, config, userData));
        }
        catch (err) {
            dispatch(receivedConfigError(err));
            dispatch(connectionStateChanged('failed'));
            return;
        }
        const signalingClient = new signaling_1.SignalingClient(dispatch, getState, {
            jid: config.userId,
            password: config.credential,
            resource: config.id,
            wsURL: config.signalingUrl
        });
        dispatch({
            payload: signalingClient,
            type: Constants_1.SIGNALING_CLIENT
        });
        signalingClient.connect();
    };
}
exports.connect = connect;
/**
 * @description
 * Leaves all rooms and disconnects from the SimpleWebRTC service.
 *
 * @public
 */
function disconnect() {
    return (dispatch, getState) => {
        const signalingClient = Selectors_1.getClient(getState());
        if (signalingClient) {
            signalingClient.disconnect();
        }
        dispatch({
            type: Constants_1.SIGNALING_CLIENT_SHUTDOWN
        });
    };
}
exports.disconnect = disconnect;
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
        type: Constants_1.RECEIVED_CONFIG
    };
}
exports.receivedConfig = receivedConfig;
function receivedConfigError(err) {
    return {
        type: Constants_1.RECEIVED_CONFIG_ERROR
    };
}
exports.receivedConfigError = receivedConfigError;
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
        type: Constants_1.QUEUE_TELEMETRY
    };
}
exports.queueTelemetry = queueTelemetry;
/**
 * Send queued telemetry events as a single batch.
 *
 * @private
 */
function sendQueuedTelemetry() {
    return (dispatch, getState) => {
        const state = getState();
        const config = Selectors_1.getAPIConfig(state);
        const telemetryUrl = config.telemetryUrl;
        const queuedTelemetry = Selectors_1.getQueuedTelemetry(state);
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
exports.sendQueuedTelemetry = sendQueuedTelemetry;
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
        type: Constants_1.TELEMETRY_SUCCESS
    };
}
exports.telemetrySucess = telemetrySucess;
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
exports.enableTelemetry = enableTelemetry;
/**
 * Clear the telemetry reporting interval timer.
 *
 * @private
 */
function disableTelemetry() {
    clearInterval(REPORTING_INTERVAL);
}
exports.disableTelemetry = disableTelemetry;
/**
 * The connection state of the signaling client changed.
 *
 * @private
 *
 * @param connectionState string
 */
function connectionStateChanged(connectionState) {
    return (dispatch, getState) => {
        const client = Selectors_1.getClient(getState());
        dispatch({
            payload: connectionState,
            type: Constants_1.CONNECTION_STATE_CHANGE
        });
        if (client) {
            client.mesh.updateConnections('connection-state-change');
        }
    };
}
exports.connectionStateChanged = connectionStateChanged;
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
exports.sendRoomCommand = sendRoomCommand;
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
exports.sendPeerCommand = sendPeerCommand;
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
        const client = Selectors_1.getClient(getState());
        if (client) {
            client.xmpp.sendMessage({
                jsonPayloads: [{ type: datatype, data: command }],
                to: destinationAddress,
                type: messageType
            });
        }
    };
}
