import fs from 'fs';
import path from 'path';
import { randomBytes } from 'crypto';

// const uniq = () => new Date().getTime().toString() + Math.ceil(Math.random() * 1000).toString();
const filesDir = `${path.resolve()}/files`;

/**
 * Saves an file to the server from the provided link.
 *
 * @param {string} link - The link to the file.
 * @returns {string} The file path of the saved file.
 */
export const fileUp = async link => {
	try {
		if (!link) return null;
		const extIndex = link.lastIndexOf('.');// Check if link has a file extension
		if (extIndex === -1) throw new Error('Link does not contain a file extension.');
		const ext = link.substring(extIndex + 1);// Get file extension
		if (!['png', 'jpg', 'jpeg', 'svg', 'gif', 'avif', 'webp', 'mp4', 'mp3', 'webm'].includes(ext.toLowerCase())) throw new Error('Invalid file extension.');// Check if file extension is valid
		const fileName = randomBytes(16).toString('hex') + '.' + ext;// Generate a unique file name
		if (!fs.existsSync(filesDir)) fs.mkdirSync(filesDir);
		const buffer = fs.readFileSync(link);// Read file file from link
		const filePath = `${filesDir}/${fileName}`;// Write file file to files directory
		fs.writeFileSync(filePath, buffer);
		return `files/${fileName}`;// Return file path
	} catch (e) {
		console.error(e);
		throw new Error('Failed to save file.');
	}
};