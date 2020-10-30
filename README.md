
# MEAN/Bootstrap SPA Template

This is a Single Page Application using MongoDB, ExpressJS, AngularJS, and NodeJS with a RESTful API.

## Requirements

This application requires installation of [NodeJS](https://nodejs.org/) and [MongoDB](https://www.mongodb.com/) prior to running.

## Description

This template was created to act as a quick spring board or boiler plate to quickly build web applications.

The application implements user login, registration, and authentication. However, users can only proceed after accepting a confirmation email sent with [Nodemailer](https://nodemailer.com/about/) configured using Gmail SMTP.

# Installation
```
$ npm install
```

- Enter your own MongoDB configuration settings in the [server.js](/server.js)

```js
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

```js
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

```js
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

# Styling

This application makes use of [Bootstrap v4.5](https://getbootstrap.com/docs/4.5/getting-started/introduction/) for elements such as ```<table>``` for viewing Users or Items found in the database in a clean fashion as well as ```<nav>``` for the main navigation bar located in [index.html](/public/app/views/index.html)

## Sass

Sass *(.scss)* files are located in [public/assets/sass](/public/assets/sass).

There is a **watch-css** NPM script in [package.json](package.json) that will actively watch for changes (only on saves) in the Sass folder. When you save a change in a scss file, **node-sass** will process the Sass and save it as [main.css](/public/assets/css/main.css) in the css folder located in [public/assets/css](/public/assets/css).

[main.css](/public/assets/css/main.css) is loaded after the Bootstrap CDN files in [index.html](/public/app/views/index.html)

## **WARNING**

Do not make changes to the [main.css](/public/assets/css/main.css) files if you plan to use Sass.

Node-sass will over write anything in [main.css](/public/assets/css/main.css) if the **watch-sass** NPM script is running