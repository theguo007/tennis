var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var morgan = require('morgan');

var config = require('./config/database');
mongoose.connect(config.database);

var passport = require('passport');
var cors = require('cors');
var app = express();

var users = require('./users/userRoutes');

var port = process.env.port || 3001;

//Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);

app.use(cors());
app.use('/api', users);

// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public/index.html'));
// });

app.get('/',(req,res)=>{
	res.send('yup');
})

app.use(morgan('dev')); // log everything

app.listen(port, function(){
	console.log('Server started on port' + port);
});
