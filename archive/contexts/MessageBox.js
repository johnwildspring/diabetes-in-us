import React from 'react';

export const MessageBoxDefaultState = {
	activeMessages: [],
	oldMessages: []
};
export const MessageBoxContext = React.createContext(MessageBoxDefaultState);
export const MessageBoxProvider = MessageBoxContext.Provider;
export const MessageBoxConsumer = MessageBoxContext.Consumer;

// Messages are in-app notifications that pop-up to give the user updates about what is happening.
// Messages have the following properties:
	// content: JSX content that is fed into the message.
	// selfDestruct: Determines whether or not the message will expire after a duration, or is pinned and must be X'd out by the user. True by default.
	// showTime: Determines whether or not the message will contain the time in which it was triggered. True by default if selfDestruct is false, else false.

export const MessageBoxActions = that => {
	return {
		addMessage(messages) {
			that.setState({
				MessageBox: {
					...that.state.MessageBox,
					activeMessages: (that.state.MessageBox.activeMessages || []).concat(messages)
				}
			}, () => this.saveToStorage());
		},
		removeMessage(messages) {
			const activeMessages = that.state.MessageBox.activeMessages || [];
			const removed = activeMessages.filter(Message => !messages.find(removeMessage => removeMessage.id == Message.id));
			that.setState({
				MessageBox: {
					...that.state.MessageBox,
					points: removed
				}
			}, () => this.saveToStorage());
		}
	}
}