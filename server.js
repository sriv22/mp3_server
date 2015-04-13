// Get the packages we need
var express = require('express');
var mongoose = require('mongoose');
var User = require('./models/users');
var Task = require('./models/tasks');
var bodyParser = require('body-parser');
var router = express.Router();


//replace this with your Mongolab URL
mongoose.connect('mongodb://user1:user1@ds059471.mongolab.com:59471/mp3');

// Create our Express application
var app = express();

// Use environment defined port or 4000
var port = process.env.PORT || 4000;

//Allow CORS so that backend and frontend could pe put on different servers
var allowCrossDomain = function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept");
  res.header('Access-Control-Allow-Methods',"GET, POST, PUT, OPTIONS, DELETE");
  res.header('Content-Type','application/x-www-form-urlencoded');
  next();
};
app.use(allowCrossDomain);

// Use the body-parser package in our application
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

// All our routes will start with /api
app.use('/api', router);

//Default route here
var homeRoute = router.route('/');

homeRoute.get(function(req, res) {
  res.json({ message: 'Hello World!' });
});

//User route 
router.route('/users') 
    .post(function(req, res) {
        // console.log("in sri's post");
        // console.log(req.body.name);
        var user = new User();
        if (typeof req.body.name === 'undefined' || typeof req.body.email === 'undefined') {
           res.json({message: 'User name and/or email is undefined', data:[]});
        }
        else { 
            user.name = req.body.name;
            user.email = req.body.email;

            User.find({email:user.email}, function(err, docs) {
                if (docs.length) {
                    res.json({message: "Email already exists!", data:[]});
                }
                else {
                    user.save(function(err, user) {
                        if (err) {
                            res.status(500);
                            res.send(err);
                        }
                        res.status(201);
                        //user.pendingTasks = req.body.pendingTasks;
                        user.pendingTasks = [];
                        res.json({message: 'OK', data:user}); 
                    });
                }
            });
        }
    })
    
    .get(function(req, res) {
        var where = JSON.parse(req.query.where || "{}");
        var fields = JSON.parse(req.query.select || "{}");
        var queryOptions = {
            sort: JSON.parse(req.query.sort || "{}"),
            skip: JSON.parse(req.query.skip || "{}"),
            limit: JSON.parse(req.query.limit || "{}")
        };

        User.find(where, fields, queryOptions, function(err, users) {
            if (err || users === null){
                res.status(404);
                res.json({message: 'Cannot find user', data:[]});
            }

            res.status(200);
            res.json({message:"OK", data:users});
        });
    })

    .options(function(req, res){
      res.writeHead(200);
      res.end();
    });

// Route for userID
router.route('/users/:user_id')
    .get(function(req, res) {
        User.findById(req.params.user_id, function(err, user) {
            if (err || user === null) {
                res.status(404);
                res.json({message: 'Cannnot find user', data:[]});
            }
            else {
                // console.log(data:user);
                // console.log(data);
                res.json({message:"OK",data:user});
                // console.log(data:user);
                // console.log(data);
            }
        });
    })

    .put(function(req, res) {
        User.findById(req.params.user_id, function(err, user) {
            if (err || user === null) {
                res.status(404);
                res.json({message: 'Cannnot find user', data:[]});
            }
            else { 
                if(typeof req.body.name === "undefined" || typeof req.body.email === 'undefined')  {
                    res.json({message:"User name and/or email is undefined", data:[]});
                }
                else {
                    user.name = req.body.name;
                    user.email = req.body.email; 
                    user.pendingTasks = req.body.pendingTasks;
                    
                    user.save(function(err, user) {
                        if (err) {
                            res.status(500);
                            res.send(err);
                        }
                        res.json({message: 'User updated!', data:user}); 
                    });
                }
            }
        });
    })

    .delete(function(req, res) {
        User.findById(req.params.user_id, function(err, user) {
            if (err || user === null) {
                res.status(404);
                res.json({message: 'Cannnot find user',data:[]});
            }
            else {
                User.remove({
                    _id: req.params.user_id
                }, function(err, user) {
                    if (err)
                        res.send(err);

                    res.json({ message: 'Successfully deleted', data:[]});
                });
            }
        });
    });

//Tasks route
router.route('/tasks') 
    .post(function(req, res) {
        var task = new Task();

        if(typeof req.body.name === "undefined" || typeof req.body.deadline === 'undefined') {
            res.json({message:'Task name or deadline is undefined!', data:[]});
        }
        else {
            task.name = req.body.name;
            task.description = req.body.description;
            task.deadline = req.body.deadline;
            task.completed = req.body.completed;
            task.assignedUser = req.body.assignedUser;
            task.assignedUserName = req.body.assignedUserName;

            task.save(function(err, task) {
                if (err)
                {
                    res.status(500);
                    res.send(err);
                }
                res.status(201);
                res.json({message: 'OK', data:task}); 
            });
        }
    })

    .get(function(req, res) {
        var where = JSON.parse(req.query.where || "{}");
        var fields = JSON.parse(req.query.select || "{}");
        var queryOptions = {
            sort: JSON.parse(req.query.sort || "{}"),
            skip: JSON.parse(req.query.skip || "{}"),
            limit: JSON.parse(req.query.limit || "{}")
        };

        Task.find(where, fields, queryOptions, function(err, tasks) {
            if (err /*|| tasks === null*/){
                res.status(404);
                res.send(err);
            }

            res.status(200);
            res.json({message:"OK", data:tasks});
        });
    })

    .options(function(req, res){
      res.writeHead(200);
      res.end();
    });

router.route('/tasks/:task_id')
    .get(function(req, res) {
        Task.findById(req.params.task_id, function(err, task) {
            if (err || task === null) {
                res.status(404);
                res.json({message: 'Task is not found', data:[]});
                //res.send(err);
            }
            else
                res.json({message:"OK",data:task});
        });
    })

    .put(function(req, res) {
        Task.findById(req.params.task_id, function(err, task) {
            if (err || task === null) {
                res.status(404);
                res.json({message: 'Cannot find task', data:[]});
            }
            else {
                task.name = req.body.name;
                task.description = req.body.description;
                task.deadline = req.body.deadline; 
                task.completed = req.body.completed;
                task.assignedUser = req.body.assignedUser;
                task.assignedUserName = req.body.assignedUserName; 

                if(typeof task.name === "undefined" || typeof task.deadline === 'undefined') {
                    res.json({message:"Task name or deadline is undefined", data:[]});
                }
                else { 
                    task.save(function(err) {
                        if (err)
                            res.send(err); 
                        res.json({message: 'Task updated!', data:task});
                    });
                }
            }
        });
    })

    .delete(function(req, res) {
        Task.findById(req.params.task_id, function(err, task) {
            if (err || task === null) {
                res.status(404);
                res.json({message: 'Cannot find task', data:[]});
            }
            else {
                Task.remove({
                    _id: req.params.task_id
                }, function(err, task) {
                    if (err)
                        res.send(err);

                    res.json({ message: 'Successfully deleted', data:[] });
                });
            }
        });
    });


// Start the server
app.listen(port);
console.log('Server running on port ' + port); 