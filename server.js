const express    = require('express');
const app        = express();
const morgan     = require('morgan');
const mongoose   = require('mongoose');
const bodyParser = require('body-parser');
const router     = express.Router();
const mainRoutes = require('./app/routes/api')(router);
const path       = require('path');

const PORT       = process.env.PORT || 8080;

///// Middleware
// HTTP request logger for Node.js
app.use(morgan('dev'));
// Setup body parsing to grab data from user input (e.g req.body.data)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:true }));
app.use(express.static(__dirname + '/public'));
// Define API name for the application
// API routes and their configurations are in 'public/routes.js'
app.use('/api', mainRoutes);
/////

///// Database Connection
// If this app is deployed on the web, ensure the Mongo database is not on the localhost machine
mongoose.connect('mongodb://localhost:27017/mean-template', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }, function(err) {
    if(err) {
        console.log('Not connected to MongoDB: ' + err);
        throw err;
    } else {
        console.log('Connected to MongoDB');
    }
});
/////

// Every page on the website will first load the template index file containing the navbar
app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/app/views/index.html'));
})

// Express and Node will start the server and listen on the port defined above
app.listen(PORT, function(err) {
    if(err) {
        console.log('Cannot start server at http://localhost:' + PORT + '/ =>' + err)
    } else {
        console.log('Running server at http://localhost:' + PORT + '/');
    }
});