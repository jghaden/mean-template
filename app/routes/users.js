const express = require('express');
const router  = express.Router();

const User = require('../models/user');

const jwt          = require('jsonwebtoken');
const jwt_decode   = require('jwt-decode');
const nodemailer   = require('nodemailer');
const RandomString = require('randomstring');

// REMOVE - NOT FOR PRODUCTION - DEVELOPMENT ONLY //
var hostEmail = 'email@domain.tld';
var hostName  = 'localhost';
var hostPort  = 8080;

GenerateToken = (payload, secret, options) => {
    return jwt.sign(payload, secret, options);
}

GenerateTokenSecret = () => {
    return RandomString.generate({
        alphanumeric: true,
        length: 32,
    });
}

GetTokenPayload = (token) => {
    return jwt_decode(token);
}

IsValid = (tokens) => {
    for(let i = 0; i < tokens.length; i++) {
        if(tokens[i] === '' || tokens[i] === null || tokens[i] === undefined)
            return false;
    }

    return true;
}

// REMOVE - NOT FOR PRODUCTION - DEVELOPMENT ONLY //
var client = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: hostEmail,
        pass: 'app-specific-password'
    }
});

// User Registration Route
router.post('/', (req, res) => {
    var user = new User();

    let name = req.body.name.split(' ');

    user.nameFirst      = name[0];
    user.nameLast       = name[1];
    user.email          = req.body.email;
    user.username       = req.body.username;
    user.password       = req.body.password;
    

    if(!IsValid([user.nameFirst , user.nameLast ])) {
        res.json({ success: false, message: 'First and last name is required' });
    }
    else if(!IsValid([user.email, user.username, user.password])) {
        res.json({ success: false, message: 'Email or password was not provided.' });
    } else {
        user.token_secret   = GenerateTokenSecret();
        user.token_activate = GenerateToken({ email: user.email, username: user.username }, user.token_secret, { expiresIn: '24h' });

        user.save((err) => {
            if(err) {
                if(err.errors != null) {
                    if(err.errors.nameFirst) {
                        res.json({ success: false, message: err.errors.nameFirst.message });
                    } else if(err.errors.nameLast) {
                        res.json({ success: false, message: err.errors.nameLast.message });
                    } else if(err.errors.email) {
                        res.json({ success: false, message: err.errors.email.message });
                    } else if(err.errors.password) {
                        res.json({ success: false, message: err.errors.password.message });
                    } else {
                        res.json({ success: false, message: err });
                    }
                } else if(err) {
                    if(err.code == 11000) {
                        res.json({ success: false, message: 'Email already in use.' });
                    } else {
                        res.json({ success: false, message: err });
                    }
                }
            } else {
                res.json({ success: true, message: 'Confirm your email via our activation link.' });

                var email = {
                    from: hostEmail,
                    to: user.email,
                    subject: 'Email Verification',
                    text: 'EMPTY',
                    html: `<h3>Hello ${user.nameFirst},</h3>` +
                          '<p>Verify your email to activate your account</p><br>'+
                          `<a href="http://${hostName}:${hostPort}/activate/${user.token_activate}"><button style="background-color: #4682B4;  border: none;  color: white;  padding: 15px 32px;  text-align: center;  text-decoration: none;  display: inline-block;  font-size: 16px;  margin: 4px 2px;  cursor: pointer;">Confirm Email</button>`
                }
            
                client.sendMail(email, (err, info) => {
                    if(err) {
                        console.log(err);
                    } else {
                        console.log(info.response);
                    }
                });
            }
        });
    }
});

// Check Email Route
router.post('/check/email', (req, res) => {
    User.findOne({ email: req.body.email }).select('email')
        .exec((err, user) => {
            if(err) throw err;

            if(user) {
                res.json({ success: false, message: 'Email already in use' });
            } else {
                res.json({ success: true, message: 'Valid email' });
            }
        });
});

// Check Username Route
router.post('/check/username', (req, res) => {
    User.findOne({ username: req.body.username }).select('username')
        .exec((err, user) => {
            if(err) throw err;

            if(user) {
                res.json({ success: false, message: 'That username is already taken' });
            } else {
                res.json({ success: true, message: 'Valid username' });
            }
        });
});

// User Login Route
router.post('/auth', (req, res) => {
    User.findOne({ username: req.body.username }).select('email username password activated token_secret')
        .exec((err, user) => {
            if(err) throw err;

            if(user) {
                if(req.body.password) {
                    var validPassword = user.comparePassword(req.body.password);
                }
            }
            
            if(!user || !validPassword) {
                res.json({ success: false, message: 'Could not authenticate email or password' });
            } else if(!user.activated) {
                res.json({ success: false, message: 'Account is not yet activated.', expired: true });
            } else if(validPassword) {
                res.json({ success: true, message: 'User authenticated', username: user.username, token: GenerateToken({ email: user.email, username: user.username }, user.token_secret, {}) });
            }
        });
});

// User Activation Route
router.put('/activate/:token', (req, res) => {    
    User.findOne({ token_activate: req.params.token }).select('email nameFirst token_activate token_secret')
        .exec((err, user) => {
            if(err) throw err;

            if(user) {
                var token = req.params.token;

                jwt.verify(token, user.token_secret, (err, decoded) => {
                    if (err) {
                        res.json({ success: false, message: 'Activation link has expired.' });
                    } else if(!user) {
                        res.json({ success: false, message: 'Activation link has expired.' });
                    } else {
                        user.token_activate = false;
                        user.activated = true;
                        
                        user.save((err) => {
                            if(err) {
                                console.log(err);
                            } else {
                                var email = {
                                    from: hostEmail,
                                    to: user.email,
                                    subject: 'Account Activated',
                                    text: 'EMPTY',
                                    html: `<h3>Hello ${user.nameFirst},</h3>` +
                                        '<p>Your account has been activated.</p>'+
                                        `<a href="http://${hostName}:${hostPort}/login"><button style="background-color: #4682B4;  border: none;  color: white;  padding: 15px 32px;  text-align: center;  text-decoration: none;  display: inline-block;  font-size: 16px;  margin: 4px 2px;  cursor: pointer;">Login</button>`
                                }
                            
                                client.sendMail(email, (err, info) => {
                                    if(err) {
                                        console.log(err);
                                    } else {
                                        console.log(info.response);
                                    }
                                });

                                res.json({ success: true, message: 'Your account has been activated.' });
                            }
                        });                   
                    }
                });
            } else {
                res.json({ success: false, message: 'Activation link has expired.' });
            }
        })
});

// User resend activation code
router.put('/resend/activation/', (req, res) => {
    User.findOne({ email: req.body.email }).select('nameFirst email password activated token_activate token_secret')
        .exec((err, user) => {
            if(err) throw err;

            if(user && req.body.password) {
                var validPassword = user.comparePassword(req.body.password);
            }

            if(!user || !validPassword) {
                res.json({ success: false, message: 'Could not authenticate email or password'});
            } else if(user.activated) {
                res.json({ success: false, message: 'Account is already activated.' });
            } else if(validPassword) {
                user.token_activate = GenerateToken({ email: user.email }, user.token_secret, { expiresIn: '24h' });

                user.save((err) => {
                    if(err) {
                        console.log(err);
                    } else {
                        var email = {
                            from: hostEmail,
                            to: user.email,
                            subject: 'Activation Request',
                            text: 'EMPTY',
                            html: `<h3>Hello ${user.nameFirst},</h3>` +
                                  '<p>Here is the activation link you requested.</p><br>'+
                                  `<a href="http://${hostName}:${hostPort}/activate/${user.token_activate}"><button style="background-color: #4682B4;  border: none;  color: white;  padding: 15px 32px;  text-align: center;  text-decoration: none;  display: inline-block;  font-size: 16px;  margin: 4px 2px;  cursor: pointer;">Activate</button>`
                        }
                    
                        client.sendMail(email, (err, info) => {
                            if(err) {
                                console.log(err);
                            } else {
                                console.log(info.response);
                            }
                        });

                        res.json({ success: true, message: `Activation link has been sent to ${user.email}` });
                    }
                });
            }
        });
});

// User password reset request
router.put('/reset/password', (req, res) => {
    User.findOne({ email: req.body.email }).select('nameFirst email activated token_reset token_secret')
        .exec((err, user) => {
            if(err) {
                res.json({ success: false, message: err });
            } else {
                if(!user) {
                    res.json({ success: false, message: 'An account with that email was not found.' });
                } else if(!user.activated) {
                    res.json({ success: false, message: 'Account has not yet been activated.' });
                } else {
                    user.token_reset = GenerateToken({ email: user.email }, user.token_secret, { expiresIn: '24h' });
                    
                    user.save((err) => {
                        if(err) {
                            res.json({ success: false, message: err });
                        } else {
                            var email = {
                                from: hostEmail,
                                to: user.email,
                                subject: 'Password Reset Request',
                                text: 'EMPTY',
                                html: `<h3>Hello ${user.nameFirst},</h3>` +
                                      '<p>Click the button below to reset your password.</p><br>'+
                                      `<a href="http://${hostName}:${hostPort}/reset/${user.token_reset}"><button style="background-color: #4682B4;  border: none;  color: white;  padding: 15px 32px;  text-align: center;  text-decoration: none;  display: inline-block;  font-size: 16px;  margin: 4px 2px;  cursor: pointer;">Reset Password</button>`
                            }
                        
                            client.sendMail(email, (err, info) => {
                                if(err) {
                                    console.log(err);
                                } else {
                                    console.log(info.response);
                                }
                            });
                            
                            res.json({ success: true, message: 'Password reset link has been emailed.' });
                        }
                    });
                }
            }
        });
});

// User password reset verify token
router.get('/reset/password/:token', (req, res) => {
    User.findOne({ token_reset: req.params.token }).select('email token_secret')
        .exec((err, user) => {
            if (err) throw err;

            var token = req.params.token;

            jwt.verify(token, user.token_secret, (err, decoded) => {
                if (err) {
                    res.json({ success: false, message: 'Password reset link has expired.' });
                } else {
                    if(!user) {
                        res.json({ success: false, message: 'Password reset link has expired' });
                    } else {
                        bPasswordTokenReset = true;
                        res.json({ success: true, user: { _id: user._id, email: user.email } });
                    }
                }
            });
        });
});

// User password update
router.put('/update/password', (req, res) => {
    User.findOne({ email: req.body.email }).select('nameFirst email password token_reset')
        .exec((err, user) => {
            if (err) throw err;

            if(!IsValid([req.body.password])) {
                res.json({ success: false, message: 'Password was not provided.' });
            } else {
                user.password = req.body.password;
                user.token_reset = false;

                user.save((err) => {
                    if(err) {
                        res.json({ success: false, message: err });
                    } else {
                        var email = {
                            from: hostEmail,
                            to: user.email,
                            subject: 'Password Reset',
                            text: 'EMPTY',
                            html: `<h3>Hello ${user.nameFirst},</h3>` +
                                  '<p>Your password was recently reset.</p><br>'
                        }
                    
                        client.sendMail(email, (err, info) => {
                            if(err) {
                                console.log(err);
                            } else {
                                console.log(info.response);
                            }
                        });

                        res.json({ success: true, message: 'Password has been reset.' });
                    }
                });
            }  
        });
});

// User Profile Route
router.get('/profile/:username', (req, res) => {
    User.findOne({ username: req.params.username }).select('nameFirst nameLast username avatar created social')
        .exec(function(err, user) {
            if(err) throw err;

            if(!user) {
                res.json({ success: false, message: 'An account with that username was not found.' } );
            } else {
                res.json({ success: true, public_user: user });
            }
        });
});

// Middleware for token
router.use((req, res, next) => {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    if(token && token != 'null') {
        var tokenEmail = GetTokenPayload(token).email;

        User.findOne({ email: tokenEmail }).select('token_secret')
            .exec((err, user) => {
                if(err) throw err;

                if(!user) {
                    res.json({ success: false, message: 'Token invalid' } );
                } else {
                    jwt.verify(token, user.token_secret, (err, decoded) => {
                        if (err) {
                            res.json({ success: false, message: 'Token invalid' });
                        } else {
                            req.decoded = decoded;
                            next();
                        }
                    });
                }
            });
    } else {
        res.json({ success: false, message: 'No token provided' });
    }
});

// User Token Route
router.post('/me', (req, res) => {
    res.json({ success: true, email: req.decoded.email, username: req.decoded.username, iat: req.decoded.iat });
});

// User Permission Route
router.get('/permission', (req, res) => {
    User.findOne({ email: req.decoded.email }, (err, user) => {
        if (err) throw err;

        if(!user) {
            res.json({ success: false, message: 'No user was found'});
        } else {
            res.json({ success: true, permission: user.permission });
        }
    });
});

// User Deletion Route
router.delete('/', (req, res) => {
    var userEmail = req.body.email;

    User.findOne({ email: req.decoded.email }, (err, mainUser) => {
        if(err) throw err;

        if(!mainUser) {
            res.json({ success: false, message: 'No user was found' });
        } else {
            if(mainUser.permission !== 2) {
                res.json({ success: false, message: 'Insufficient Permissions' });
            } else {
                    User.findOneAndDelete({ email: userEmail }, (err, user) => {
                        if(err) throw err;

                        if(!user) {
                            res.json({ success: false, message: `${userEmail} does not exist` });
                        } else {
                            res.json({ success: true, message: `${userEmail} has been deleted` });
                        }
                    });
                }
            }
    });
});

module.exports = router;