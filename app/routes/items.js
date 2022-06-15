const express = require('express');
const router  = express.Router();

const Item       = require('../models/item');

const jwt        = require('jsonwebtoken');
const User       = require('../models/user');

// Item List Route
router.get('/', (req, res) => {
    Item.find({}, (err, items) => {
        if(err) throw err;

        if(!items) {
            res.json({ success: false, message: 'Items were not found' });
        } else {
            res.json({ success: true, items: items });
        }
    });
});

// Item View Route
router.get('/:part', (req, res) => {
    Item.findOne({ part: req.params.part }).select('part quanity category note url owner created')
        .exec((err, item) => {
            if(err) throw err;

            if(!item) {
                res.json({ success: false, message: 'An item with that Part name was not found' });
            } else {
                res.json({ success: true, item: item, data: item.created });
            }
        });
});

// Middleware for token
router.use((req, res, next) => {
    var token = req.body.token || req.body.query || req.headers['x-access-token'];

    if(token) {
        jwt.verify(token, secret, (err, decoded) => {
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

// Check Part Route
router.post('/checkpart', (req, res) => {
    Item.findOne({ part: req.body.part }).select('part')
        .exec((err, item) => {
            if(err) throw err;

            if(item) {
                res.json({ success: false, message: 'That part is already in the database' });
            } else {
                res.json({ success: true, message: 'Part name is valid' });
            }
        });
});

// Item Creation Route
router.post('/create', (req, res) => {
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
            .exec((err, user) => {
                if(err) throw err;

                if(!user) {
                    res.json({ success: false, message: 'User ownership could not be made.'} );
                } else {
                    item.owner.id = user._id;
                    item.owner.username = user.username;

                    item.save((err) => {
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

// Item Deletion Route
router.delete('/delete/:item', (req, res) => {
    var deletedItem = req.params.item;

    User.findOne({ username: req.decoded.username }, (err, mainUser) => {
        if(err) throw err;

        if(!mainUser) {
            res.json({ success: false, message: 'No user was found' });
        } else {
            if(mainUser.permission !== 'admin') {
                res.json({ success: false, message: 'Insufficient Permissions' });
            } else {
                    Item.findOneAndRemove({ part: req.params.item }, (err, user) => {
                        if(err) throw err;

                        res.json({ success: true });
                    });
                }
            }
    });
});

module.exports = router;