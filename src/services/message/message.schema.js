import { Schema, model } from 'mongoose';
import paginate from 'mongoose-paginate-v2';

const schema = new Schema({
	chat: { type: Schema.Types.ObjectId, ref: 'Chat', required: true },
	message: { type: String, required: true },
	sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

schema.plugin(paginate);
schema.methods.toJSON = function () {
	const obj = this.toObject();
	delete obj.__v;
	return JSON.parse(JSON.stringify(obj).replace(/_id/g, 'id'));
};

export default model('Message', schema);