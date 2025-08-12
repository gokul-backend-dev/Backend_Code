import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github';
import User from '../modules/user';

passport.use(new GoogleStrategy({
    clientID: 'YOUR_GITHUB_CLIENT_ID',
    clientSecret: 'YOUR_GITHUB_CLIENT_SECRET',
    callbackURL: 'http://localhost:3000/auth/google/callback',
}, async (accessToken, refreshToken, profile, done) => {
    console.log("🚀 ~ profile:", profile)
    const newUser = {
        googleId: profile.id,
        name: profile.name?.givenName,
        email: profile.emails?.[0]?.value,
        image: profile.photos?.[0]?.value,
        providers: ['google'],
        isVerified: true
    };

    try {
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
            user = await User.create(newUser);
        }

        const accessToken = await generateTokens(UserRecord._id);
        user.lastLogin = new Date();
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
    } catch (err) {
        done(err, null);
    }
}));

passport.use(new GitHubStrategy({
    clientID: 'YOUR_GITHUB_CLIENT_ID',
    clientSecret: 'YOUR_GITHUB_CLIENT_SECRET',
    callbackURL: 'http://localhost:3000/auth/github/callback',
}, (accessToken, refreshToken, profile, done) => {
    // DB logic here
    done(null, profile);
}));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));
