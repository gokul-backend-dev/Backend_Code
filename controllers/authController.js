import passport from 'passport';

export const googleAuth = passport.authenticate('google', { scope: ['profile', 'email'] });

export const googleAuthCallback = passport.authenticate('google', { failureRedirect: '/login' });

export const googleAuthSuccess = (req, res) => {
    try {
        const { accessToken } = generateTokens(req.user._id);
        res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${accessToken}`);
    } catch (error) {
        console.error('Google callback error:', error);
        res.redirect(`${process.env.CLIENT_URL}/login?error=auth_callback_failed`);
    }
};

export const githubAuth = passport.authenticate('github', { scope: ['user:email'] });

export const githubAuthCallback = passport.authenticate('github', { failureRedirect: '/login' });

export const githubAuthSuccess = (req, res) => {
    try {
        const { accessToken } = generateTokens(req.user._id);
        res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${accessToken}`);
    } catch (error) {
        console.error('GitHub callback error:', error);
        res.redirect(`${process.env.CLIENT_URL}/login?error=auth_callback_failed`);
    }
};
