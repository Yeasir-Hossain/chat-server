import { auth } from '../middlewares';
import { entry, getAllChat, getSingleChat, registerChat, removeChat, updateChat } from './chat.entity';

export default function Chat() {

	/**
	 * POST /chat
	 * @description this route is insert a Chat.
	 * @response the Chat.
	 */
	this.route.post('/chat', auth, registerChat(this));

	/**
	 * GET /chat
	 * @description this route is used to get all Chat.
	 * @response all the Chat.
	 */
	this.route.get('/chat', auth, getAllChat(this));

	/**
	 * GET /chat/:id
	 * @description this route is used to get a single Chat.
	 * @response the Chat that the user is looking for.
	 */
	this.route.get('/chat/:id', auth, getSingleChat(this));

	/**
 * PATCH /chat/:id
 * @description this route is used to update a single Chat.
 * @response the Chat that has been updated.
 */
	this.route.patch('/chat/:id', auth, updateChat(this));

	/**
	 * DELETE /deleteChat/:id
	 * @description this route is used to delete a single Chat.
	 * @response success or failed
	 */
	this.route.delete('/chat/:id', auth, removeChat(this));
}

export const entryEvent = (app) => {
	app.register('entry', entry);
};