const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
import UserModel from "../models/User";

passport.use(new LocalStrategy(async (username: string, password: string, done: any) => {
    try {
        const user = await UserModel.findOne({ username: username });
        if (!user) {
            return done(null, false, { message: 'Incorrect username.' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return done(null, false, { message: 'Incorrect password.' });
        }
        return done(null, user);
    } catch (err) {
        return done(err);
    }
}));

passport.serializeUser((user: any, done: any) => {
    done(null, user.id);
});

passport.deserializeUser(async (id: any, done: any) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err);
    }
});