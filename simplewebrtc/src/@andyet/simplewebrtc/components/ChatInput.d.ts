import * as React from 'react';
import * as Stanza from 'stanza';
import * as Actions from '../actions';
declare type ChatState = 'active' | 'composing' | 'paused';
export interface ChatInputProps {
    room: string;
    autoFocus?: boolean;
    id?: string;
    className?: string;
    disabled?: boolean;
    rtt?: boolean;
    placeholder?: string;
    sendOnEnter?: boolean;
    onChat?: (opts: Actions.ChatOptions) => void;
    onChatState?: (state: ChatState) => void;
    onRtt?: (data: Stanza.Stanzas.RTT) => void;
    render?: (props: ChatInputRenderProps) => React.ReactNode;
    children?: React.ReactNode | ((props: ChatInputRenderProps) => React.ReactNode);
}
export interface ChatInputState {
    chatState: ChatState;
    message: string;
    rtt?: boolean;
}
export interface ChatInputRenderProps {
    id?: string;
    className?: string;
    autoFocus?: boolean;
    message?: string;
    placeholder?: string;
    disabled?: boolean;
    sendOnEnter?: boolean;
    rtt?: boolean;
    updateMessage: (newValue: string) => void;
    sendMessage: () => void;
    useRealtimeText: (enabled: boolean) => void;
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
export declare const ChatInputTextArea: React.SFC<ChatInputRenderProps>;
/**
 * @description
 *
 * @public
 *
 */
declare class ChatInput extends React.Component<ChatInputProps, ChatInputState> {
    state: ChatInputState;
    private rttBuffer;
    private pausedTimeout;
    private rttInterval;
    constructor(props: ChatInputProps);
    componentDidUpdate(prev: ChatInputProps, prevState: ChatInputState): void;
    startSendingRtt(): void;
    rttUpdate(data?: string): void;
    rttSend(): void;
    commitMessage(): void;
    updateChatState(chatState: ChatState): void;
    render(): {} | null | undefined;
}
declare const _default: import("react-redux").ConnectedComponent<typeof ChatInput, Pick<React.ClassAttributes<ChatInput> & ChatInputProps, "key" | "ref"> & ChatInputProps>;
export default _default;
