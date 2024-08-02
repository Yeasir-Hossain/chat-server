import { sendMessageEvent } from './message.functions';
import Message from './message.schema';

// these are the set to validate the request query.
const allowedQuery = new Set(['chat', 'page', 'limit']);

/**
 * @param sendMessage function is used to recieve message from the user
 * @param {Object} req This is the req object.
 * @returns the message
 */
export const sendMessage = ({ ws, db }) => async (req, res) => {
	try {
		const validobj = Object.keys(req.body).every((k) => req.body[k] !== '' || req.body[k] !== undefined);
		if (!validobj) res.status(400).send({ message: 'Bad Request', status: false });
		const messageDoc = {
			chat: req.params.id,
			message: req.body.message,
			sender: req.user.id,
		};
		const message = await db.create({ table: Message, key: messageDoc });
		if (!message) return res.status(400).send({ message: 'Bad Request', status: false });
		await sendMessageEvent(ws, req.params.id, message);
		res.status(200).send(message);
	}
	catch (err) {
		console.log(err);
		res.status(500).send({ message: 'Something went wrong', status: false });
	}
};

/**
 * @param getMessage function is used to create a message for the chat chat
 * @param {Object} req - The request object have the information about page and any other filter.
 * @returns the messages of the chat chat
 */
export const getMessage = ({ db }) => async (req, res) => {
	try {
		if (!req.params.id) return res.status(400).send({ message: 'Bad Request', status: false });
		const message = await db.find({ table: Message, key: { query: { chat: req.params.id }, allowedQuery: allowedQuery } });
		message ? res.status(200).send(message) : res.status(400).send({ message: 'Bad Request', status: false });
	}
	catch (err) {
		console.log(err);
		res.status(500).send({ message: 'Something went wrong', status: false });
	}
};