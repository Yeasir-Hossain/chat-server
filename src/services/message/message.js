import { auth } from '../middlewares';
import { getMessage, sendMessage, } from './message.entity';


export default function message() {

	/**
 * POST /support
 * @description this route is insert a Support.
 * @response the Support.
 */
	this.route.post('/sendmessage/:id', auth, sendMessage(this));

	/**
	 * GET /support
	 * @description this route is used to get all support.
	 * @response all the support.
	 */
	this.route.get('/getmessage/:id', auth, getMessage(this));
}