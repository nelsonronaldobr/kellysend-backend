import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';
const userSchema = Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    token: {
        type: String
    },
    confirmed: {
        type: Boolean,
        default: false
    },
    photo_profile: {
        type: String,
        default: ''
    }
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});
userSchema.methods.authentication = async function (password) {
    return bcrypt.compareSync(password, this.password);
};
export const User = model('User', userSchema);
