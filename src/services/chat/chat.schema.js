import { Schema, model } from 'mongoose';

const schema = new Schema({
	creator: { type: Schema.Types.ObjectId, ref: 'User', required: true },
	users: [{ type: Schema.Types.ObjectId, ref: 'User' }],
	type: { type: String, enum: ['private', 'group', 'public'], default: 'public' }
}, { timestamps: true });

schema.methods.toJSON = function () {
	const obj = this.toObject();
	delete obj.__v;
	return JSON.parse(JSON.stringify(obj).replace(/_id/g, 'id'));
};

export default model('Chat', schema);