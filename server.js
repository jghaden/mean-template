const express    = require('express');
const app        = express();
const morgan     = require('morgan');
const mongoose   = require('mongoose');
const bodyParser = require('body-parser');
const router     = express.Router();
const appRoutes  = require('./app/routes/api')(router);
const path       = require('path');

const PORT       = process.env.PORT || 8080;

// Middleware
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:true }));
app.use(express.static(__dirname + '/public'));
app.use('/api', appRoutes);
//

// Database Connection
//mongoose.connect('mongodb://localhost:27017/electronics-inventory', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }, function(err) {
// SENSITIVE
mongoose.connect('mongodb+srv://root:zKPQtx0msSnQitf0@cluster0.9chsv.mongodb.net/mean-template', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }, function(err) {
    if(err) {
        console.log('Not connected to MongoDB: ' + err);
        throw err;
    } else {
        console.log('Connected to MongoDB');
    }
});
//

app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/app/views/index.html'));
})

app.listen(PORT, function(err) {
    if(err) {
        console.log('Cannot start server at http://localhost:' + PORT + '/ =>' + err)
    } else {
        console.log('Running server at http://localhost:' + PORT + '/');
    }
});