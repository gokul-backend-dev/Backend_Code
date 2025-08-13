import passport from 'passport';
import { GoogleStrategy } from 'passport-google-oauth20';
import User from '../modules/user';

console.log("🚀 ~ process.env.GOOGLE_CLIENT_ID:", process.env.GOOGLE_CLIENT_ID)
console.log("🚀 ~ process.env.GOOGLE_CLIENT_SECRET:", process.env.GOOGLE_CLIENT_SECRET)
console.log("🚀 ~ process.env.CALLBACK_URL:", process.env.CALLBACK_URL)
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL || 'http://localhost:3004/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
    console.log("🚀 ~ accessToken:", accessToken)
    console.log("🚀 ~ profile:", profile)
    try {

        let user = await User.findOne({ googleId: profile.id });
        if (user) {
            user = new User({
                googleId: profile.id,
                email: profile.emails[0].value,
                firstName: profile.displayName,
                avatar: profile.photos[0].value,
                providers: ['google'],
                isVerified: true
            }).save()
        }
        return done(null, user);
    } catch (err) {
        console.log("🚀 ~ err:", err)
        return done(err, null);
    }
}));



passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));
