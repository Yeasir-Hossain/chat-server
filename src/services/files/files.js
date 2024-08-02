import { getFile } from './image.entity';

export default function image() {

	/**
	 * GET /files/:imageId
	 * @description this route is used to get an image.
	 * @response the image.
	 */
	this.route.get('/files/:fileId', getFile(this));
}
