
/**
 * @param sendMessageEvent function is used to emit a message
 * @returns the message
 */
export const sendMessageEvent = async (ws, room, message) => {
	try {
		ws.to(room).emit('message', message);
		return message;
	}
	catch (err) {
		console.log(err);
	}
};