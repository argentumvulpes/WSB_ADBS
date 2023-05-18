const express = require("express");
const router = express.Router();

const passport = require("passport");
const LocalStrategy = require("passport-local");
const crypto = require("crypto");

const { getUser } = require("../data/users");

passport.use(
    new LocalStrategy(
        {
            usernameField: "username",
            passwordField: "password",
        },
        async function (username, password, done) {
            const { user, error } = await getUser(username);

            if (error) {
                return done(error);
            }

            if (!user) {
                return done(null, false);
            }

            // TODO zrobić sprawdzenie hasła bo jeszcze nie umiem xd

            return done(null, user);

            User.findOne({ username: username }, function (err, user) {
                if (err) {
                    return done(err);
                }
                if (!user) {
                    return done(null, false);
                }
                if (!user.verifyPassword(password)) {
                    return done(null, false);
                }
                return done(null, user);
            });
        }
    )
);

passport.serializeUser(function (user, cb) {
    process.nextTick(function () {
        cb(null, { id: user.id, username: user.properties.username });
    });
});

passport.deserializeUser(function ({ id, username }, cb) {
    process.nextTick(async function () {
        const { user, error } = await getUser(username);
        if (error) {
            return cb(error);
        }
        if (!user) {
            return cb(null, null);
        }

        return cb(null, user);
    });
});

router.get("/user", (req, res) => {
    res.send(req.user?.properties.username || null);
});

router.post("/login", passport.authenticate("local"), function (req, res) {
    res.send("ok");
});

module.exports = router;
