/**
 * Created by Will on 9/14/2016.
 */
// set up

var express = require('express');
var app = express();  // creates the app with express
var mongoose = require('mongoose');  // mongoose for mongodb
var morgan = require('morgan');  // logs requests to the console
var bodyParser = require('body-parser');  // pulls info from the HTML POST
var methodOverride = require('method-override');  // simulates the DELETE and PUT

// configuration

mongoose.connect("mongodb://<user>:<pw>@ds033096.mlab.com:33096/todolisttest");

app.use(express.static(__dirname + '/public'));  // set the static files location /public/img will be /img for users
app.use(morgan('dev'));  // logs every request to the console
app.use(bodyParser.urlencoded({'extended':'true'}));  // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));  // parse application/vnd.api+json as json
app.use(methodOverride());

// listen (start app with nodemon server.js)

app.listen(8080);
console.log("Now listening on port 8080");


// define the model

var Todo = mongoose.model('Todo', {
    text : String
});


// routes ==================

    // api ------------------------
    // get all the todos
    app.get('/api/todos', function (req, res) {

        // use mongoose to get all the todos in the database
        Todo.find(function (err, todos) {

            // if there is an error while retrieving, send the error.
            if (err)
                res.send(err);

            res.json(todos); // return all the todos in JSON format

        });
    });

    // create todo and send back all todos after creation
    app.post('/api/todos', function (req, res) {

        // create a todo, info comes from the AJAX request from Angular

        Todo.create({
            text : req.body.text,
            done : false
        }, function (err, todo) {
            if (err)
                res.send(err);

            // get and return all the todos after creating one
            Todo.find(function (err, todos) {
                if (err)
                    res.send(err);
                res.json(todos);
            });
        });
    });

    // delete a todo
    app.delete('/api/todos/:todo_id', function (req, res) {
        Todo.remove({
            _id : req.params.todo_id
        }, function (err, todo) {
            if (err)
                res.send(err);

            // get and return all todos after deletion
            Todo.find(function (err, todos) {
                if (err)
                    res.send(err);
                res.json(todos)
            });
        });
    });

    // application -----------------------------------
    app.get('*', function (req, res) {
        res.sendfile('./public/index.html')  // loads the single view. angular handles the updates
    });
