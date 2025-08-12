import { token } from 'morgan';
import { generateTokens } from '../middlewares/jwtAuth.js';
import User from '../modules/user.js'
import passport from "passport";

// require('../modules/user.js')


export async function createUser(req, res) {
    try {
        const { email, password, name } = req.body;

        if (!email || !password || !name) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({ message: 'User already exists' });
        }

        const result = await User.insertOne({ email, password, name, providers: ['local'] });

        res.status(201).json({
            message: 'User created successfully',
            userId: result._id
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

export async function login(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const UserRecord = await User.findOne({ email });

        if (!UserRecord) {
            return res.status(401).json({ message: 'user not found' });
        }

        const isValidPassword = await UserRecord.comparePassword(password);

        if (!isValidPassword) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Update last login
        UserRecord.lastLogin = new Date();

        const accessToken = await generateTokens(UserRecord._id);

        await UserRecord.save();

        res.status(200).json({
            message: 'Login successful',
            token: accessToken,
            user: {
                id: UserRecord._id,
                name: UserRecord.name,
                email: UserRecord.email,
                avatar: UserRecord.avatar,
                providers: UserRecord.providers
            },
        });

    } catch (error) {
        return false
    }
}

export async function googleCallback(req, res) {
    try {
        const { accessToken } = generateTokens(req.user._id);
        res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${accessToken}`);
    } catch (error) {
        console.error('Google callback error:', error);
        res.redirect(`${process.env.CLIENT_URL}/login?error=auth_callback_failed`);
    }
}

export async function githubCallback(req, res) {
    try {
        const { accessToken } = generateTokens(req.user._id);
        res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${accessToken}`);
    } catch (error) {
        console.error('GitHub callback error:', error);
        res.redirect(`${process.env.CLIENT_URL}/login?error=auth_callback_failed`);
    }
}

export async function getUser(req, res) {
    try {

        const UserRecord = await User.findOne({ _id: req.user._id });
        if (!UserRecord) {
            return res.status(401).json({ message: 'user not found' });
        }
        res.status(200).json({ UserRecord });

    } catch (error) {

    }

}

export async function deleteUser(req, res) {
    try {
        const { id } = req.params;

        const deleted = await User.findByIdAndDelete(id);

        if (!deleted) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User deleted successfully' });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
