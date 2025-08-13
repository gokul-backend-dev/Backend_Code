import { Router } from 'express';
import { googleAuth, googleAuthCallback, googleAuthSuccess, } from '../controllers/authController.js';
import passport from 'passport';
import jwt from 'jsonwebtoken';
const router = Router();

// Routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
    passport.authenticate('google', { session: false }),
    (req, res) => {
        const accessToken = jwt.sign(
            { id: req.user._id },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );
        console.log("🚀 ~ accessToken:", accessToken)
        // Redirect to frontend with token
        res.redirect(`https://nc3c1dlb-5001.inc1.devtunnels.ms/google/callback?token=${accessToken}`);
    }
);
export default router;
