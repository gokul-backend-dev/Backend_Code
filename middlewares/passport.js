import passport from 'passport';
import GoogleStrategy from 'passport-google-oauth20';
import User from '../modules/user.js';
import dotenv from 'dotenv';
dotenv.config();

// console.log("🚀 ~ process.env.GOOGLE_CLIENT_ID:", process.env.GOOGLE_CLIENT_ID)
// console.log("🚀 ~ process.env.GOOGLE_CLIENT_SECRET:", process.env.GOOGLE_CLIENT_SECRET)
// console.log("🚀 ~ process.env.CALLBACK_URL:", process.env.CALLBACK_URL)
// passport.use(new GoogleStrategy({
//     clientID: process.env.GOOGLE_CLIENT_ID,
//     clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     callbackURL: process.env.CALLBACK_URL || 'http://localhost:3004/auth/google/callback',
//     passReqToCallback: true
// }, async (accessToken, refreshToken, profile, done) => {
//     console.log("🚀 ~ accessToken:", accessToken)
//     console.log("🚀 ~ profile:", profile)
//     try {

//         let user = await User.findOne({ googleId: profile.id });
//         if (user) {
//             user = new User({
//                 googleId: profile.id,
//                 email: profile.emails[0].value,
//                 firstName: profile.displayName,
//                 avatar: profile.photos[0].value,
//                 providers: ['google'],
//                 isVerified: true
//             }).save()
//         }
//         return done(null, user);
//     } catch (err) {
//         console.log("🚀 ~ err:", err)
//         return done(err, null);
//     }
// }));



// passport.serializeUser((user, done) => done(null, user));
// passport.deserializeUser((obj, done) => done(null, obj));

// export default passport;



passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:3001/auth/google/callback',
    passReqToCallback: true
}, async (req, accessToken, refreshToken, profile, done) => {
    try {
        let user = await User.findOne({ googleId: profile.id });
        if (user) {
            return done(null, user);  // User already exists, proceed to login
        } else {
            user = await new User({
                googleId: profile.id,
                displayName: profile.displayName,
                email: profile.emails[0].value,
                profilePhoto: profile.photos[0].value,
            }).save();
            return done(null, user);  // User does not exist, create a new user
        }
    } catch (error) {
        console.error('Error during user creation:', error);
        return done(error, null);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
    done(null, id);
});

export default passport;