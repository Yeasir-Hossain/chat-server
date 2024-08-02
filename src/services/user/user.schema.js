import { Schema, model } from 'mongoose';
import paginate from 'mongoose-paginate-v2';

const schema = new Schema({
	email: { type: String, required: true, unique: true },
	name: { type: String, required: true },
	password: { type: String, required: true },
	role: { type: String, enum: ['user', 'admin'], default: 'user' },
	chat: [{
		type: Schema.Types.ObjectId
	}],
}, { timestamps: true });

schema.plugin(paginate);
schema.methods.toJSON = function () {
	const obj = this.toObject();
	delete obj.__v;
	delete obj.createdAt;
	delete obj.updatedAt;
	delete obj.password;
	delete obj.notifySubs;
	return JSON.parse(JSON.stringify(obj).replace(/_id/g, 'id'));
};

export default model('User', schema);