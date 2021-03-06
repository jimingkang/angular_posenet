"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const React = tslib_1.__importStar(require("react"));
const react_redux_1 = require("react-redux");
/**
 * @description
 *
 * @public
 */
class Notifications extends React.Component {
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
function mapStateToProps(state, props) {
    return {
        chats: state.simplewebrtc.chats,
        peers: state.simplewebrtc.peers
    };
}
exports.default = react_redux_1.connect(mapStateToProps)(Notifications);
