import Chat from './chat.schema';
import Message from '../messages/message.schema';
import { sendMessageEvent } from '../message/message.function';

/**
 * these are the set to validate the request body or query.
 */
const chatUpdateAllowed = new Set(['creator', 'users', 'type']);

/**
 * @param registerChat function is used to create a chat chat
 * @param {Object} req This is the req object.
 * @returns the chat and the message sent by user and emits a message in admin
 */
export const registerChat = ({ db, ws }) => async (req, res) => {
	try {
		const validobj = Object.keys(req.body).every((k) => req.body[k] !== '' || req.body[k] !== undefined);
		if (!validobj) res.status(400).send({ message: 'Bad Request', status: false });
		const chatDoc = {
			creator: req.user.id,
			...(req.body.type && { type: req.body.type })
		};
		const chat = await db.create({ table: Chat, key: chatDoc });
		const messageDoc = {
			chat: chat.id,
			message: req.body.message,
			sender: req.user.id,
		};
		const message = await db.create({ table: Message, key: messageDoc });
		if (!chat) return res.status(400).send({ message: 'Bad Request', status: false });
		await sendMessageEvent(ws, chat.id, message);
		res.status(200).send(chat);
	}
	catch (err) {
		console.log(err);
		res.status(500).send({ message: 'Something went wrong', status: false });
	}
};

/**
 * @param getAllChat function is used to get all the Chat
 * @param {Object} req - The request object have the information filter.
 * @returns all the chat
 */
export const getAllChat = ({ db }) => async (req, res) => {
	try {
		const chat = await db.find({
			table: Chat, key: { paginate: false, populate: { path: 'creator users', select: 'name email' } }
		});
		chat ? res.status(200).send(chat) : res.status(400).send({ message: 'Bad Request', status: false });
	}
	catch (err) {
		console.log(err);
		res.status(500).send({ message: 'Something went wrong', status: false });
	}
};

/**
 * @param getSingleChat function is used to get a signle chat
 * @param req.params.id This is the id of the request.
 * @returns the request request
 */
export const getSingleChat = ({ db }) => async (req, res) => {
	try {
		if (!req.params.id) return res.status(400).send({ message: 'Bad Request', status: false });
		const chat = await db.findOne({
			table: Chat, key: {
				id: req.params.id, paginate: false, populate: {
					path: 'creator users', select: 'name email'
				}
			}
		});
		chat ? res.status(200).send(chat) : res.status(400).send({ message: 'Bad Request', status: false });
	}
	catch (err) {
		console.log(err);
		res.status(500).send({ message: 'Something went wrong', status: false });
	}
};

/**
 * @param updateChat function updates the single order by id
 * @param req.params.id is the id of the chat sent in the params
 * @returns the chat
 */
export const updateChat = ({ db }) => async (req, res) => {
	try {
		const isValid = Object.keys(req.body).every(k => chatUpdateAllowed.has(k));
		if (!isValid) return res.status(400).send({ message: 'Bad Request', status: false });
		const chat = await db.update({ table: Chat, key: { id: req.params.id, body: req.body } });
		chat ? res.status(200).send(chat) : res.status(400).send({ message: 'Bad Request', status: false });
	}
	catch (err) {
		console.log(err);
		res.status(500).send({ message: 'Something went wrong', status: false });
	}
};

/**
 * @param removeChat function removes the chat by the id array
 * @param req.params.id is the id of the Chat sent in the params
 * @returns success or failed
 */
export const removeChat = ({ db }) => async (req, res) => {
	try {
		if (!req.params.id) return res.send(400).send({ message: 'Bad Request', status: false });
		const chat = await db.remove({ table: Chat, key: { id: req.params.id } });
		chat.deletedCount < 1 ? res.status(400).send({ message: 'Coupon not found' }) : res.status(200).send({ message: 'Deleted Successfully', status: true });
	} catch (err) {
		console.log(err);
		res.status(500).send({ message: 'Something went wrong', status: false });
	}
};

/**
 * @param entry function is used to join a user/staff to the room
 * @param {Object} req - The request object have the information about page and any other filter.
 * @returns the messages of the chat chat
 */
export const entry = async ({ data, session }) => {
	try {
		const { entry, room } = data;
		if (!session.user) throw new Error({ message: 'Bad Request', status: false });
		if (entry) {
			return session.join(room);
		}
		session.leave(room);
	}
	catch (err) {
		console.log(err);
	}
};