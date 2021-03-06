import { ThunkAction } from 'redux-thunk';
import { State } from '../reducers';
import { SignalingClient } from '../signaling';
import { CONNECTION_STATE_CHANGE, QUEUE_TELEMETRY, RECEIVED_CONFIG, RECEIVED_CONFIG_ERROR, SIGNALING_CLIENT, SIGNALING_CLIENT_SHUTDOWN, TELEMETRY_SUCCESS } from '../Constants';
import { APIConfig } from '../Definitions';
export declare function sleep<T>(timeout: number, throwError?: boolean): Promise<T>;
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
export declare function fetchConfig(configUrl: string, userData: string | undefined, maxTries?: number, delay?: number, timeout?: number): Promise<any>;
export interface CreateSignalingClient {
    payload: SignalingClient;
    type: typeof SIGNALING_CLIENT;
}
export interface ShutdownSignalingClient {
    type: typeof SIGNALING_CLIENT_SHUTDOWN;
}
export interface ConnectionStateChange {
    payload: string;
    type: typeof CONNECTION_STATE_CHANGE;
}
export interface ReceivedConfig {
    payload: {
        configUrl: string;
        config: APIConfig;
        token?: string;
    };
    type: typeof RECEIVED_CONFIG;
}
export interface ReceivedConfigError {
    type: typeof RECEIVED_CONFIG_ERROR;
}
export interface QueueTelemetry {
    payload: any;
    type: typeof QUEUE_TELEMETRY;
}
export interface TelemetrySuccess {
    payload: number;
    type: typeof TELEMETRY_SUCCESS;
}
export interface TelemetryEvent {
    eventType: string;
    roomId: string;
    peerId: string;
    data: any;
}
export declare type Actions = CreateSignalingClient | ConnectionStateChange | ReceivedConfig | ReceivedConfigError | QueueTelemetry | TelemetrySuccess;
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
export declare function connect(configUrl: string, userData?: string): ThunkAction<any, State, void, ConnectionStateChange | ReceivedConfig | ReceivedConfigError | CreateSignalingClient>;
/**
 * @description
 * Leaves all rooms and disconnects from the SimpleWebRTC service.
 *
 * @public
 */
export declare function disconnect(): ThunkAction<void, State, void, any>;
/**
 * Service configuration fetched from the API.
 *
 * @private
 *
 * @param config APIConfig
 */
export declare function receivedConfig(configUrl: string, config: APIConfig, userData?: string): ReceivedConfig;
export declare function receivedConfigError(err: Error): ReceivedConfigError;
/**
 * Queue a telemetry event to be sent in the next reporting batch.
 *
 * @private
 */
export declare function queueTelemetry(eventType: string, { roomId, peerId, data }: TelemetryEvent): QueueTelemetry;
/**
 * Send queued telemetry events as a single batch.
 *
 * @private
 */
export declare function sendQueuedTelemetry(): ThunkAction<void, State, void, TelemetrySuccess>;
/**
 * Report the number of successfully posted telemetry events.
 *
 * @private
 *
 * @param batchSize number
 */
export declare function telemetrySucess(batchSize: number): TelemetrySuccess;
/**
 * Start the telemetry reporting interval timer.
 *
 * @private
 *
 * @param interval number
 */
export declare function enableTelemetry(interval?: number): ThunkAction<void, State, void, TelemetrySuccess>;
/**
 * Clear the telemetry reporting interval timer.
 *
 * @private
 */
export declare function disableTelemetry(): void;
/**
 * The connection state of the signaling client changed.
 *
 * @private
 *
 * @param connectionState string
 */
export declare function connectionStateChanged(connectionState: string): ThunkAction<void, State, void, ConnectionStateChange>;
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
export declare function sendRoomCommand(roomAddress: string, datatype: string, command?: any): ThunkAction<void, State, void, any>;
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
export declare function sendPeerCommand(peerAddress: string, datatype: string, command?: any): ThunkAction<void, State, void, any>;
