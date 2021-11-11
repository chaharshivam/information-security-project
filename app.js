/*jslint node:true */
'use strict';

// Declarations
var express = require('express'),
    bodyParser = require('body-parser'),
    app = express(),
    sequelize = require('sequelize'),
    mysql = require('mysql'),
    session = require('express-session'),
    fs = require('fs'),
    dbConnection = require('./db/db-connect');

// Application setup
app.set('view engine','ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended:true}));

let reviews = [];

app.use(session({
    secret: 'my-secret',
    resave: true,
    saveUninitialized: true,
    cookie: {
        httpOnly: false
    }
}));

// Db Connection
dbConnection.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

//Routing requirements
app.get('/index', function(req,res){
    res.render('indexPage');
});

app.post('/login', function(req,res){
    console.log(`username: ${req.body.uname} , password: ${req.body.passwd}`);
    res.render('signinPage');
});
app.get('/login', function(req,res){
    console.log(req.body.passwd);
    res.render('loginPage');
});

app.get('/signin', function(req,res){
    res.render('signinPage');
});
app.get('/', function(req,res){
    res.render('facultySearch');
});

// app.get('/coursefeedback/', function(req,res){
//     res.sendfile(__dirname + '/public/index.html');
// });

app.get('/coursefeedback/', function (req, res) {
    if (req.query.newReview) reviews.push(req.query.newReview);
    const formattedReviews = reviews.map((review)=> `<dt>User</dt><dd>${review}</dd>`).join(' ');
    const template = fs.readFileSync('./public/indexCourseFeedback.html', 'utf8');
    const view = template.replace('$reviews$', formattedReviews);
    res.send(view);
});

app.post('/query', function(req,res){
   var connection_string = `SELECT * FROM faculty WHERE name LIKE '%${req.body.query}%'`;
   dbConnection.query(connection_string, function(err, result){
       if (err){
           console.log(err);
            console.log("SQL Query: " + mysql.raw(connection_string).toSqlString());
       }else{
           console.log("SQL Query: " + mysql.raw(connection_string).toSqlString());
           res.setHeader('Content-Type', 'application/json');
           res.send(JSON.stringify(result));
       }
   });

});


app.listen(process.env.PORT | 3000, process.env.IP, function(){
    console.log("Server started...");
});
