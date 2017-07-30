var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');

var users = require('./users/userRoutes');

var app = express();

var port = process.env.port || 3000;

//Set Static Folder
app.use(express.static(path.join(__dirname, 'client')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use('/api', users);

app.listen(port, function(){
	console.log('Server started on port' + port);
});
