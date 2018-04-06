var express = require('express'),
    passport = require('passport'),
    GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
    config = require('./config'),
    app = express(),
    googleProfile = {},
    port = 3000;

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (obj, done) {
    done(null, obj);
});

passport.use(
    new GoogleStrategy({
            clientID: config.GOOGLE_CLIENT_ID,
            clientSecret: config.GOOGLE_CLIENT_SECRET,
            callbackURL: config.CALLBACK_URL
        },
        function (accessToken, refreshToken, profile, cb) {
            googleProfile = {
                id: profile.id,
                displayName: profile.displayName,
                mail: profile.emails[0].value
            };
            cb(null, profile);
        }
    ));

app.set('view engine', 'pug');

app.set('views', './views');

app.use(express.static('assets'));

app.use(passport.initialize());

app.use(passport.session());

app.get('/', function (req, res) {
    res.render('login', {
        user: req.user
    });
});

app.get('/logged', function (req, res) {
    res.render('logged', {
        user: googleProfile
    });
    console.log(googleProfile);
});

app.get('/auth/google',
    passport.authenticate('google', {
        scope: ['profile', 'email']
    }));

app.get('/auth/google/callback',
    passport.authenticate('google', {
        successRedirect: '/logged',
        failureRedirect: '/'
    }));

    var server = app.listen(port, function() {
        console.log('Serwer nasłuchuje na http://localhost:' + port);
    });