
# SPA MEAN/Bootstrap Template

This is a Single Page Application using MongoDB, ExpressJS, AngularJS, and NodeJS with a RESTful API.

## Requirements

This application requires installation of NodeJS and MongoDB prior to running.

## Description

This template was created to act as a quick spring board or boiler plate to quickly build web applications.

## Installation
```
$ npm install
```

- Enter your own MongoDB configuration settings in the [server.js](/server.js)

```
mongoose.connect('mongodb://localhost:27017/mean-template', { useNewUrlParser:  true, useUnifiedTopology:  true, useCreateIndex:  true }, function(err) {
	if(err) {
		console.log('Not connected to MongoDB: ' + err);
		throw  err;
	} else {
		console.log('Connected to MongoDB');
	}
});
```

- If you are using Gmail SMTP, adjust the email client parameters in [api.js](/app/routes/api.js)

```
var  client = nodemailer.createTransport({
	host:  'smtp.gmail.com',
	port:  587,
	secure:  false,
	auth: {
		user:  'username@gmail.com',
		pass:  'app-specific-password'
	}
});
```

- Update all email callbacks in the [api.js](/app/routes/api.js)

```
var  email = {
	from:  'MEAN Template, username@gmail.com',
	to:  user.email,
	subject:  'Email Verification',
	text:  'Hello ' + user.name + '. Verify your email to activate your account: http://localhost:8080/activate/' + user.temorarytoken,
	html:  '<h3>Hello ' + user.username + ',</h3>' +
		   '<p>Verify your email to activate your account</p><br>'+
		   '<a href="http://localhost:8080/activate/' + user.temporarytoken + '"><button>Confirm Email</button>'
}
```

### Start server

```
$ npm start
```
or
```
$ npm start server.js
```