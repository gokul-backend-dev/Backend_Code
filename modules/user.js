import mongoose from 'mongoose';
import bcrypt from 'bcrypt'

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: function () {
            return !this.googleId && !this.githubId;
        }
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    role: {
        type: String,
        default: null
    },
    avatar: {
        type: String,
        default: null
    },
    // OAuth providers
    googleId: {
        type: String,
        default: null
    },
    githubId: {
        type: String,
        default: null
    },

    providers: [{
        type: String,
        enum: ['local', 'google', 'github']
    }],
    // Account status
    isVerified: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: true
    },
});
// Hash password before saving
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Compare password method
UserSchema.methods.comparePassword = async function (candidatePassword) {
    if (!this.password) return false;
    return await bcrypt.compare(candidatePassword, this.password);
};
const User = mongoose.model('User', UserSchema);
export default User;
