import * as React from 'react';
import { Chat, Peer } from '../Definitions';
import { ChatState } from '../reducers/Chats';
import { PeerState } from '../reducers/Peers';
export interface NotificationProps {
    onChatSent?: (chat: Chat) => void;
    onChatReceived?: (chat: Chat) => void;
    onPeerEntered?: (peer: Peer) => void;
    onPeerLeft?: (peer: Peer) => void;
    chats?: ChatState;
    peers?: PeerState;
    render?: () => React.ReactNode;
    children?: React.ReactNode | (() => React.ReactNode);
}
/**
 * @description
 *
 * @public
 */
declare class Notifications extends React.Component<NotificationProps, any> {
    render(): {} | null | undefined;
    componentDidUpdate(prevProps: NotificationProps): void;
}
declare const _default: import("react-redux").ConnectedComponent<typeof Notifications, Pick<React.ClassAttributes<Notifications> & NotificationProps, "key" | "ref"> & NotificationProps>;
export default _default;
