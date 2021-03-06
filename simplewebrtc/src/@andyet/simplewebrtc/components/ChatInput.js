"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const React = tslib_1.__importStar(require("react"));
const react_redux_1 = require("react-redux");
const Stanza = tslib_1.__importStar(require("stanza"));
const Actions = tslib_1.__importStar(require("../actions"));
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
exports.ChatInputTextArea = props => (React.createElement("textarea", { id: props.id, className: props.className, autoFocus: props.autoFocus, value: props.message, placeholder: props.placeholder, disabled: props.disabled, onInput: event => {
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
class ChatInput extends React.Component {
    constructor(props) {
        super(props);
        this.rttBuffer = new Stanza.RTT.InputBuffer();
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
        return React.createElement(exports.ChatInputTextArea, Object.assign({}, renderProps));
    }
}
function mapStateToProps(state, props) {
    return props;
}
function mapDispatchToProps(dispatch, props) {
    return {
        onChat: (opts) => dispatch(Actions.sendChat(props.room, opts)),
        onChatState: (state) => dispatch(Actions.sendChatState(props.room, state)),
        onRtt: (data) => dispatch(Actions.sendRTT(props.room, data))
    };
}
exports.default = react_redux_1.connect(mapStateToProps, mapDispatchToProps)(ChatInput);
