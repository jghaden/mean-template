const User       = require('../models/user');
const Item       = require('../models/item');
const jwt        = require('jsonwebtoken');
const nodemailer = require('nodemailer');
var secret       = 'token_secret';

module.exports = function(router) {
    // SENSITIVE
    var client = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: 'joshghaden@gmail.com',
            // app-specific password
            pass: 'thulcoziwuhfcfbq'
        }
    });

    // User Registration Route
    // http://localhost:8080/api/users
    router.post('/users', function(req, res) {
        var user = new User();
    
        user.name           = req.body.name;
        user.username       = req.body.username;
        user.password       = req.body.password;
        user.email          = req.body.email;
        user.temporarytoken = jwt.sign({ username: user.username, email: user.email }, secret, { expiresIn: '24h' });
    
        if(user.name == null || user.name == '' || user.username == null || user.username == '' || user.password == null || user.password == '' || user.email == null || user.email == '') {
            res.json({ success: false, message: 'Email, username, or password were not provided.' });
        } else {
            user.save(function(err) {
                if(err) {
                    if(err.errors != null) {
                        if(err.errors.name) {
                            res.json({ success: false, message: err.errors.name.message });
                        } else if(err.errors.email) {
                            res.json({ success: false, message: err.errors.email.message });
                        } else if(err.errors.username) {
                            res.json({ success: false, message: err.errors.username.message });
                        } else if(err.errors.password) {
                            res.json({ success: false, message: err.errors.password.message });
                        } else {
                            res.json({ success: false, message: err });
                        }
                    } else if(err) {
                        if(err.code == 11000) {
                            res.json({ success: false, message: 'Email or username already in use.' });
                        } else {
                            res.json({ success: false, message: err });
                        }
                    }
                } else {
                    res.json({ success: true, message: 'Confirm your email via our activation link.' });

                    var email = {
                        from: 'MEAN Template, joshghaden@gmail.com',
                        to: user.email,
                        subject: 'Email Verification',
                        text: 'EMPTY',
                        html: '<h3>Hello ' + user.username + ',</h3>' +
                              '<p>Verify your email to activate your account</p><br>'+
                              '<a href="http://localhost:8080/activate/' + user.temporarytoken + '"><button style="background-color: #4682B4;  border: none;  color: white;  padding: 15px 32px;  text-align: center;  text-decoration: none;  display: inline-block;  font-size: 16px;  margin: 4px 2px;  cursor: pointer;">Confirm Email</button>'
                    }
                
                    client.sendMail(email, function(err, info) {
                        if(err) {
                            console.log(err);
                        } else {
                            console.log(info.respone);
                        }
                    });
                }
            });
        }
    });

    // Check Username Route
    // http://localhost:8080/api/checkusername
    router.post('/checkusername', function(req, res) {
        User.findOne({ username: req.body.username }).select('username')
            .exec(function(err, user) {
                if(err) throw err;

                if(user) {
                    res.json({ success: false, message: 'That username is already taken' });
                } else {
                    res.json({ success: true, message: 'Valid username' });
                }
            });
    });

    // Check Email Route
    // http://localhost:8080/api/checkemail
    router.post('/checkemail', function(req, res) {
        User.findOne({ email: req.body.email }).select('email')
            .exec(function(err, user) {
                if(err) throw err;

                if(user) {
                    res.json({ success: false, message: 'That email is already taken' });
                } else {
                    res.json({ success: true, message: 'Valid email' });
                }
            });
    });

    // User Login Route
    // http://localhost:8080/api/authenticate
    router.post('/authenticate', function(req, res) {
        User.findOne({ username: req.body.username }).select('email username password active')
            .exec(function(err, user) {
                if(err) throw err;

                if(user) {
                    if(req.body.password) {
                        var validPassword = user.comparePassword(req.body.password);
                    }
                }
                
                if(!user || !validPassword) {
                    res.json({ success: false, message: 'Could not authenticate username or password' });
                } else if(!user.active) {
                    res.json({ success: false, message: 'Account is not yet activated.', expired: true });
                } else if(validPassword) {
                    var token = jwt.sign({ username: user.username, email: user.email }, secret, { expiresIn: '24h' });
                    res.json({ success: true, message: 'User authenticated', token: token });
                }
            });
    });

    // User Activation Route
    // http://localhost:8080/api/activate/token
    router.put('/activate/:token', function(req, res) {
        User.findOne({ temporarytoken: req.params.token }, function(err, user) {    
            if(err) throw err;

            var token = req.params.token;

            jwt.verify(token, secret, function(err, decoded) {
                if (err) {
                    res.json({ success: false, message: 'Activation link has expired.' });
                } else if(!user) {
                    res.json({ success: false, message: 'Activation link has expired.' });
                } else {
                    user.temporarytoken = false;
                    user.active = true;
                    
                    user.save(function(err) {
                        if(err) {
                            console.log(err);
                        } else {
                            var email = {
                                from: 'MEAN Template, joshghaden@gmail.com',
                                to: user.email,
                                subject: 'Account Activated',
                                text: 'EMPTY',
                                html: '<h3>Hello ' + user.username + ',</h3>' +
                                      '<p>Your account has been activated.</p>'+
                                      '<a href="http://localhost:8080/login"><button style="background-color: #4682B4;  border: none;  color: white;  padding: 15px 32px;  text-align: center;  text-decoration: none;  display: inline-block;  font-size: 16px;  margin: 4px 2px;  cursor: pointer;">Login</button>'
                            }
                        
                            client.sendMail(email, function(err, info) {
                                if(err) {
                                    console.log(err);
                                } else {
                                    console.log(info.respone);
                                }
                            });

                            res.json({ success: true, message: 'Your account has been activated.' });
                        }
                    });                   
                }
            });
        });
    });

    // User Resend Route
    // http://localhost:8080/api/resend
    router.post('/resend', function(req, res) {
        User.findOne({ username: req.body.username }).select('username password active')
            .exec(function(err, user) {
                if(err) throw err;

                if(user) {
                    if(req.body.password) {
                        var validPassword = user.comparePassword(req.body.password);
                    }
                }
                
                if(!user || !validPassword) {
                    res.json({ success: false, message: 'Could not authenticate username or password'});
                } else if(user.active) {
                    res.json({ success: false, message: 'Account is already activated.' });
                } else if(validPassword) {
                    res.json({ success: true, user: user });
                }
            });
    });

    router.put('/resend', function(req, res) {
        User.findOne({ username: req.body.username }).select('email username name temporarytoken')
            .exec(function(err, user) {
                if(err) throw err;

                user.temporarytoken = jwt.sign({ username: user.username, email: user.email }, secret, { expiresIn: '24h' });

                user.save(function(err) {
                    if(err) {
                        console.log(err);
                    } else {
                        var email = {
                            from: 'MEAN Template, joshghaden@gmail.com',
                            to: user.email,
                            subject: 'Activation Request',
                            text: 'EMPTY',
                            html: '<h3>Hello ' + user.username + ',</h3>' +
                                  '<p>Here is the activation link you requested.</p><br>'+
                                  '<a href="http://localhost:8080/activate/' + user.temporarytoken + '"><button style="background-color: #4682B4;  border: none;  color: white;  padding: 15px 32px;  text-align: center;  text-decoration: none;  display: inline-block;  font-size: 16px;  margin: 4px 2px;  cursor: pointer;">Activate</button>'
                        }
                    
                        client.sendMail(email, function(err, info) {
                            if(err) {
                                console.log(err);
                            } else {
                                console.log(info.respone);
                            }
                        });

                        res.json({ success: true, message: 'Activation link has been sent to ' + user.email });
                    }
                });
            });
    });

    router.get('/resetusername/:email', function(req, res) {
        User.findOne({ email: req.params.email }).select('email username name')
            .exec(function(err, user) {
                if(err) {
                    res.json({ success: false, message: err });
                } else {
                    if(!req.params.email) {
                        res.json({ success: false, message: 'No email was provided.' });
                    } else {
                        if(!user) {
                            res.json({ success: false, message: 'An account with that email was not found.' });
                        } else {
                            var email = {
                                from: 'MEAN Template, joshghaden@gmail.com',
                                to: user.email,
                                subject: 'Username Request',
                                text: 'EMPTY',
                                html: '<h3>Hello ' + user.name + ',</h3>' +
                                      '<p>You recently requested your username: <strong>'+ user.username + '</strong></p>'
                            }
                        
                            client.sendMail(email, function(err, info) {
                                if(err) {
                                    console.log(err);
                                } else {
                                    console.log(info.respone);
                                }
                            });
                            
                            res.json({ success: true, message: 'Username has been sent to your email.' });
                        }
                    }
                }
            });
    });

    router.put('/resetpassword', function(req, res) {
        User.findOne({ username: req.body.username }).select('username email active resettoken name')
            .exec(function(err, user) {
                if(err) {
                    res.json({ success: false, message: err });
                } else {
                    if(!user) {
                        res.json({ success: false, message: 'An account with that username was not found.' });
                    } else if(!user.active) {
                        res.json({ success: false, message: 'Account has not yet been activated.' });
                    } else {
                        user.resettoken = jwt.sign({ name: user.name, username: user.username, email: user.email }, secret, { expiresIn: '24h' });
                        
                        user.save(function(err) {
                            if(err) {
                                res.json({ success: false, message: err });
                            } else {
                                var email = {
                                    from: 'MEAN Template, joshghaden@gmail.com',
                                    to: user.email,
                                    subject: 'Password Reset Request',
                                    text: 'EMPTY',
                                    html: '<h3>Hello ' + user.username + ',</h3>' +
                                          '<p>Click the button below to reset your password.</p><br>'+
                                          '<a href="http://localhost:8080/reset/' + user.resettoken + '"><button style="background-color: #4682B4;  border: none;  color: white;  padding: 15px 32px;  text-align: center;  text-decoration: none;  display: inline-block;  font-size: 16px;  margin: 4px 2px;  cursor: pointer;">Reset Password</button>'
                                }
                            
                                client.sendMail(email, function(err, info) {
                                    if(err) {
                                        console.log(err);
                                    } else {
                                        console.log(info.respone);
                                    }
                                });
                                
                                res.json({ success: true, message: 'Password reset link has been emailed.' });
                            }
                        });
                    }
                }
            });
    });

    router.get('/resetpassword/:token', function(req, res) {
        User.findOne({ resettoken: req.params.token }).select()
            .exec(function(err, user) {
                if (err) throw err;

                var token = req.params.token;

                jwt.verify(token, secret, function(err, decoded) {
                    if (err) {
                        res.json({ success: false, message: 'Password reset link has expired.' });
                    } else {
                        if(!user) {
                            res.json({ success: false, message: 'Password reset link has expired' });
                        } else {
                            res.json({ success: true, user: user });
                        }
                    }
                });
            });
    });

    router.put('/savepassword', function(req, res) {
        User.findOne({ username: req.body.username }).select('username email name password resettoken')
            .exec(function(err, user) {
                if (err) throw err;

                if(req.body.password == null || req.body.password == '') {
                    res.json({ success: false, message: 'Password was not provided.' });
                } else {
                    user.password = req.body.password;
                    user.resettoken = false;

                    user.save(function(err) {
                        if(err) {
                            res.json({ success: false, message: err });
                        } else {
                            var email = {
                                from: 'MEAN Template, joshghaden@gmail.com',
                                to: user.email,
                                subject: 'Password Reset',
                                text: 'EMPTY',
                                html: '<h3>Hello ' + user.username + ',</h3>' +
                                      '<p>Your password was recently reset.</p><br>'
                            }
                        
                            client.sendMail(email, function(err, info) {
                                if(err) {
                                    console.log(err);
                                } else {
                                    console.log(info.respone);
                                }
                            });

                            res.json({ success: true, message: 'Password has been reset.' });
                        }
                    });
                }  
            });
    });

    // User Profile Route
    // http://localhost:8080/api/profile/username
    router.get('/profile/:username', function(req, res) {
        User.findOne({ username: req.params.username }).select('name username email created social')
            .exec(function(err, user) {
                if(err) throw err;

                if(!user) {
                    res.json({ success: false, message: 'An account with that username was not found.' } );
                } else {
                    res.json({ success: true, user: user });
                }
            });
    });

    // Item List Route
    // http://localhost:8080/api/items
    router.get('/items', function(req, res) {
        Item.find({}, function(err, items) {
            if(err) throw err;

            if(!items) {
                res.json({ success: false, message: 'Items were not found' });
            } else {
                res.json({ success: true, items: items });
            }
        });
    });

    // Item View Route
    // http://localhost:8080/api/item/item_part
    router.get('/item/:part', function(req, res) {
        Item.findOne({ part: req.params.part }).select('part quanity category note url owner created')
            .exec(function(err, item) {
                if(err) throw err;

                if(!item) {
                    res.json({ success: false, message: 'An item with that Part name was not found' });
                } else {
                    res.json({ success: true, item: item, data: item.created });
                }
            });
    });

    // Middleware for token
    router.use(function(req, res, next) {
        var token = req.body.token || req.body.query || req.headers['x-access-token'];

        if(token) {
            jwt.verify(token, secret, function(err, decoded) {
                if (err) {
                    res.json({ success: false, message: 'Token invalid' });
                } else {
                    req.decoded = decoded;
                    next();
                }
            });
        } else {
            res.json({ success: false, message: 'No token provided' });
        }
    });

    // User Token Route
    // http://localhost:8080/api/me
    router.post('/me', function(req, res) {
        res.send(req.decoded);
    });

    // Check Part Route
    // http://localhost:8080/api/checkpart
    router.post('/checkpart', function(req, res) {
        Item.findOne({ part: req.body.part }).select('part')
            .exec(function(err, item) {
                if(err) throw err;

                if(item) {
                    res.json({ success: false, message: 'That part is already in the database' });
                } else {
                    res.json({ success: true, message: 'Part name is valid' });
                }
            });
    });

    // Item Creation Route
    // http://localhost:8080/api/items/create
    router.post('/items/create', function(req, res) {
        var item = new Item();

        item.part     = req.body.part;
        item.quanity  = req.body.quanity;
        item.category = req.body.category;
        item.note     = req.body.note;
        item.url      = req.body.url;

        if(item.part == null || item.part == '' || item.quanity == null || item.quanity == '' || item.category == null || item.category == '') {
            res.json({ success: false, message: 'Part, quanity, category or were not provided.' });
        } else {
            User.findOne({username: req.decoded.username }).select('id username')
                .exec(function(err, user) {
                    if(err) throw err;

                    if(!user) {
                        res.json({ success: false, message: 'User ownership could not be made.'} );
                    } else {
                        item.owner.id = user._id;
                        item.owner.username = user.username;

                        item.save(function(err) {
                            if(err) {
                                if(err.errors != null) {
                                    if(err.errors.part) {
                                        res.json({ success: false, message: err.errors.part.message });
                                    } else if(err.errors.quanity) {
                                        res.json({ success: false, message: err.errors.quanity.message });
                                    } else if(err.errors.category) {
                                        res.json({ success: false, message: err.errors.category.message });
                                    } else if(err.errors.note) {
                                        res.json({ success: false, message: err.errors.note.message });
                                    } else if(err.errors.url) {
                                        res.json({ success: false, message: err.errors.url.message });
                                    } else {
                                        res.json({ success: false, message: err });
                                    }
                                } else if(err) {
                                    if(err.code == 11000) {
                                        res.json({ success: false, message: 'Item already in database.' });
                                    } else {
                                        res.json({ success: false, message: err });
                                    }
                                }
                            } else {
                                res.json({ success: true, message: 'Item has been added to the database.' });
                            }
                        });
                    }
            });      
        }
    });

    router.get('/permission', function(req, res) {
        User.findOne({ username: req.decoded.username }, function(err, user) {
            if (err) throw err;

            if(!user) {
                res.json({ success: false, message: 'No user was found'});
            } else {
                res.json({ success: true, permission: user.permission });
            }
        });
    });

    router.get('/manage', function(req, res) {
        User.find({}, function(err, users) {
            if(err) throw err;

            User.findOne({ username: req.decoded.username }, function(err, mainUser) {
                if(err) throw err;

                if(!mainUser) {
                    res.json({ success: false, message: 'No user was found' });
                } else {
                    if(mainUser.permission == 'admin' || mainUser.permission == 'moderator') {
                        if(!users) {
                            res.json({ success: false, message: 'Users were not found' });
                        } else {
                            res.json({ success: true, users: users, permission: mainUser.permission });
                        }
                    } else {
                        res.json({ success: false, message: 'Insufficient Permissions' });
                    }
                }
            })
        });
    });

    router.delete('/manage/:username', function(req, res) {
        var deletedUser = req.params.username;

        User.findOne({ username: req.decoded.username }, function(err, mainUser) {
            if(err) throw err;

            if(!mainUser) {
                res.json({ success: false, message: 'No user was found' });
            } else {
                if(mainUser.permission !== 'admin') {
                    res.json({ success: false, message: 'Insufficient Permissions' });
                } else {
                        User.findOneAndRemove({ username: deletedUser}, function(err, user) {
                            if(err) throw err;

                            res.json({ success: true });
                        });
                    }
                }
        });
    });

    return router;
}