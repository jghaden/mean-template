const express    = require('express');
const app        = express();
const cors       = require('cors');
const server     = require('http').createServer(app);
const bodyParser = require('body-parser');
const morgan     = require('morgan');
const mongoose   = require('mongoose');
const path       = require('path');

const PORT       = 8080;

///// Middleware
// Allow Cross-Origin access
app.use(cors());
// HTTP request logger for Node.js
app.use(morgan('dev'));
// Setup body parsing to grab data from user input (e.g req.body.data)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:true }));
app.use(express.static(__dirname + '/public'));
// Define API routes
const routeItems = require('./app/routes/items');
const routeUsers = require('./app/routes/users');

app.use('/api/items', routeItems);
app.use('/api/users', routeUsers);
/////

///// Database Connection
// If this app is deployed on the web, ensure the Mongo database is not on the localhost machine
mongoose.connect('mongodb://localhost:27017/mean-template', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }, (err) => {
    if(err) {
        console.log(`Not connected to MongoDB: ${err}`);
        throw err;
    } else {
        console.log('Connected to MongoDB (mean-template)');
    }
});
/////

// Every page on the website will first load the template index file containing the navbar
app.get('*', function(req, res) {
    res.sendFile(path.join(`${__dirname}/public/app/views/index.html`));
})

// Express and Node will start the server and listen on the port defined above
server.listen(PORT, (err) => {
    if(err) {
        console.log(`Cannot start server at http://localhost:${PORT}/ => ${err}`);
    } else {
        console.log(`Running server at http://localhost:${PORT}/`);
    }
});