
# MEAN/Bootstrap SPA Template

This is a Single Page Application using MongoDB, ExpressJS, AngularJS, and NodeJS with a RESTful API.

# Overview

1. [Description](#description)
2. [Requirements](#requirements)
3. [Installation](#installation)
4. [Running](#start-server)
5. [Styling](#styling)
6. [Testing](#testing)

# Description

This template was created to act as a boiler plate for quick web application development.

The template implements user registration, user login, item creation, viewing and deletion. However, users can only proceed after accepting a confirmation email sent with [**Nodemailer**](https://nodemailer.com/about/) configured using Gmail SMTP.

Here is a [**video**](https://www.youtube.com/watch?v=rujXkHMfauI) showcasing the template.

# Requirements

This application requires installation of [**NodeJS**](https://nodejs.org/) and [**MongoDB**](https://www.mongodb.com/) prior to running.

# Installation
```
$ npm install
```

### Enter your own MongoDB configuration settings in [**server.js**](/server.js)

![](/pics/code-block-1.png)

### If you are using Gmail SMTP, adjust the email client parameters in [/app/routes/**api.js**](/app/routes/api.js)

![](/pics/code-block-2.png)

### Update all email callbacks in the [/app/routes/**api.js**](/app/routes/api.js)

![](/pics/code-block-3.png)

## Start server

If you wish to have [**nodemon**](https://www.npmjs.com/package/nodemon) watch your code changes, run:

```
$ npm dev
```

or if you wish to simplay start the server only with Node (such as a deployed application), run:

```
$ npm start
```

# Styling

This application makes use of [**Bootstrap v4.5**](https://getbootstrap.com/docs/4.5/getting-started/introduction/) for elements such as ```<table>``` for viewing Users or Items found in the database in a clean fashion as well as ```<nav>``` for the main navigation bar located in [public/app/views/**index.html**](/public/app/views/index.html)

## Sass

Sass *(.scss)* files are located in [/public/assets/**sass**](/public/assets/sass).

There is a **watch-css** NPM script in [**package.json**](package.json) that will actively watch for changes (only on saves) in the Sass folder. When you save a change in a scss file, **node-sass** will process the Sass and save it as [**main.css**](/public/assets/css/main.css) in the css folder located in [public/assets/**css**](/public/assets/css).

[public/assets/css/**main.css**](/public/assets/css/main.css) is loaded after the Bootstrap CDN files in [public/app/views/**index.html**](/public/app/views/index.html)

## **WARNING**

Do not make changes to the [**main.css**](/public/assets/css/main.css) file if you plan to use Sass.

Node-sass will over write anything in [**main.css**](/public/assets/css/main.css) if the **watch-sass** NPM script is running

# Testing

There is sample data provided in [data/**items.json**](/data/items.json) containing 10 entries that have the following layout:

![](/pics/code-block-4.png)

This JSON object is directly related to the Mongoose item model in [app/models/**item.js**](/app/models/item.js):

![](/pics/code-block-5.png)

## **REMINDER**

The [data/**items.json**](/data/items.json) file itself does not provide anything to the application or the Mongo database. You must import the JSON document into your local or remote Mongo database. Make sure to add the [data/**items.json**](/data/items.json) document to **items** collection in the **mean-template** database or whatever you decide to name your database (just make sure to have the same DB name in the [**server.js**](/server.js) file)

Tools such as [**MongoDB Compass**](https://www.mongodb.com/products/compass) can make the process of importing, updating, and deleting documents a lot easier.