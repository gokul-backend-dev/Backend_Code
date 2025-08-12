import jwt from 'jsonwebtoken';
import User from '../modules/user.js'
import dotenv from 'dotenv';
dotenv.config();
export const generateTokens = async (userId) => {
    console.log("🚀 ~ generateTokens ~ userId:", userId)
    console.log("🚀 ~ generateTokens ~ process.env.JWT_SECRET:", process.env.JWT_SECRET)
    const accessToken = jwt.sign(
        { id: userId },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
    );
    console.log("🚀 ~ generateTokens ~ accessToken:", accessToken)
    return accessToken;
};

export const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];

        console.log("🚀 ~ authenticateToken ~ token:", token)
        if (!token) {
            return res.status(401).json({ message: 'Access token required' });
        }

        console.log("🚀 ~ authenticateToken ~ process.env.JWT_SECRET:", process.env.JWT_SECRET)
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');
        console.log("🚀 ~ authenticateToken ~ user:", user)

        if (!user) {
            return res.status(401).json({ message: 'Invalid or expired token' });
        }

        req.user = user;
        next();
    } catch (error) {
        console.log("🚀 ~ authenticateToken ~ error:", error)
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid token' });
        } else if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired' });
        }
        return res.status(500).json({ message: 'Token verification failed' });
    }
};

export const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];
        console.log("🚀 ~ authenticateToken ~ token:", token)

        if (token) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.id).select('-password -refreshTokens');

            if (user && user.isActive) {
                req.user = user;
            }
        }

        next();
    } catch (error) {
        // Ignore token errors for optional auth
        next();
    }
};