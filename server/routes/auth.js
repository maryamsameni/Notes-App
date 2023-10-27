const express = require('express')
const router = express.Router()
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user')

passport.use(new GoogleStrategy({
    clientID: process.env.clientId,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
},
    async function (accessToken, refreshToken, profile, done) {
        const newUser = {
            googleId: profile.id,
            displayName: profile.displayName,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            profileImage: profile.photos[0].value
        }
        try {
            let user = await User.findOne({ googleId: profile.id })
            if (user) {
                done(null, user)
            } else {
                user = await User.create(newUser)
                done(null, user)
            }
        } catch (error) {
            console.log(error.message);
        }
    }
));

// Google Login Route
router.get("/auth/google", passport.authenticate("google", { scope: ["email", "profile"] }));

// Retrieve user data
router.get("/google/callback", passport.authenticate("google", {
    failureRedirect: "/fail",
    successRedirect: "/dashboard",
})
);

// router something wrong
router.get('/fail', (req, res) => {
    res.send('someThing went wrong ..!')
})

// Destory user session
router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.log(error)
            res.send('Error loggin out')
        } else {
            res.redirect('/')
        }
    })
})

// Persist user data after successful authentication
passport.serializeUser(function (user, done) {
    done(null, user);
});

// Retrieve user data from session.
passport.deserializeUser(function (id, done) {
    try {
        const user = User.findById(id)
        done(null, user)
    } catch (error) {
        done(error, null)
    }
})
// passport.deserializeUser(function (user, done) {
//     done(null, user);
// });

module.exports = router