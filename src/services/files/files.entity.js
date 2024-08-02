import path from 'path';

/**
 * @param getFile function is used to serve an file
 * @param req.params contains the file id.
 * @returns the file
 */
export const getFile = () => async (req, res) => {
	try {
		const fileId = req.params.fileId;
		fileId ? res.status(200).sendFile(path.join(path.resolve(), 'files', fileId)) : res.status(400).send({ message: 'Bad Request', status: false });
	}
	catch (err) {
		console.log(err);
		res.status(500).send({ message: 'Something went wrong', status: false });
	}
};