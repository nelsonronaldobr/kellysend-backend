import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';
const linksSchema = Schema({
    url: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    original_name: {
        type: String,
        required: true
    },
    downloads: {
        type: Number,
        default: 1
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    extension: {
        type: String
    },
    password: {
        type: String,
        default: null
    },
    created_at: {
        type: Date,
        default: Date.now()
    }
});
linksSchema.pre('save', async function (next) {
    if (!this.password) return next();
    if (!this.isModified('password')) return next();

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});
linksSchema.methods.authentication = async function (password) {
    return bcrypt.compareSync(password, this.password);
};

export const Links = model('Link', linksSchema);
