const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20");
const { User, validate } = require("../models/user");

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id);
    done(null, user);
});

passport.use(
    new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/authenticate/google/callback"
    },
    async (accessToken, refreshToken, profile, done) => {
        try {
            var user = await User.findOne({ googleId: profile.id });
            if (!user) {
                const info = { username: profile.emails[0].value, googleId: profile.id };

                const { error } = validate.google(info);
                if (error) done(error.details[0].message);
                
                user = new User(info);
                await user.save();
            }
            done(null, user);
        }
        catch (ex) {
            done(ex);
        }
    })
);