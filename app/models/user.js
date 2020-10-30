const mongoose = require('mongoose');
const Schema   = mongoose.Schema;
const bcrypt   = require('bcrypt');
const titlize  = require('mongoose-title-case');
const validate = require('mongoose-validator');

const saltRounds = 10;

///// User creation validators, uses various regex and length checks even if the front end is defeated
var nameValidator = [
    validate({
        validator: 'matches',
        arguments: /^(([a-zA-Z]{2,20})+[ ]+([a-zA-Z]{2,20})+)+$/,
        message: 'Name must be at least 5 characters, max 40, no special characters or numbers, and must have a space between first and last name.'
    }),
    validate({
        validator: 'isLength',
        arguments: [5, 40],
        message: 'Name must be between {ARGS[0]} and {ARGS[1]} characters.'
    })
];

var emailValidator = [
    validate({
        validator: 'isEmail',
        message: 'Email is not valid.'
    }),
    validate({
        validator: 'isLength',
        arguments: [5, 40],
        message: 'Email must be between {ARGS[0]} and {ARGS[1]} characters.'
    })
];

var usernameValidator = [
    validate({
        validator: 'isLength',
        arguments: [3, 30],
        message: 'Username must be between {ARGS[0]} and {ARGS[1]} characters.'
    }),
    validate({
        validator: 'isAlphanumeric',
        message: 'Username must contain letters and numbers only'
    })
];

var passwordValidator = [
    validate({
        validator: 'matches',
        arguments: /^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d])(?=.*?[\W]).{8,256}$/,
        message: 'Password must have at least one lowercase, one uppercase, one number, one special character, and must be at least 8 characters long'
    }),
    validate({
        validator: 'isLength',
        arguments: [8, 256],
        message: 'Password must be between {ARGS[0]} and {ARGS[1]} characters.'
    })
];
/////

///// Setting up the Mongoose User model
var UserSchema = new Schema({
    name:           { type: String, required: true, validate: nameValidator },
    username:       { type: String, required: true, unique: true, lowercase: true, validate: usernameValidator },
    password:       { type: String, required: true, validate: passwordValidator, select: false },
    email:          { type: String, required: true, unique: true, lowercase: true, validate: emailValidator },
    created:        { type: Date, default: Date.now },
    active:         { type: Boolean, required: true, default: false },
    permission:     { type: String, required: true, default: 'user'},
    
    temporarytoken: { type: String, required: true },
    resettoken:     { type: String, required: false },

    social:         {
        profession:     { type: String, required: false, default: 'N/A' },
        location:       { type: String, required: false, default: 'N/A' },
        
        website:        { type: String, required: false, default: 'N/A' },
        github:         { type: String, required: false, default: 'N/A' },
        linkedin:       { type: String, required: false, default: 'N/A' }
    }
});
/////

///// Bcrypt hashes user password before adding the user to the database
UserSchema.pre('save', function(next) {
    var user = this;

    if(!user.isModified('password')) {
        return next();
    }
    
    bcrypt
        .genSalt(saltRounds)
        .then(salt => {           
            return bcrypt.hash(user.password, salt);
        })
        .then(hash => {
            user.password = hash;

            next();
        })
        .catch(err => console.error(err.message));
});
/////

UserSchema.plugin(titlize, {
    paths: [ 'name' ]
});

// Bcrypt hashes user login password and compares to the hash found in the database
UserSchema.methods.comparePassword = function(password) {
    return bcrypt.compareSync(password, this.password)
}

module.exports =  mongoose.model('User', UserSchema);