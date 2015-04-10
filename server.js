// Get the packages we need
var express = require('express');
var mongoose = require('mongoose');
var User = require('./models/users');
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
  next();
};
app.use(allowCrossDomain);

// Use the body-parser package in our application
app.use(bodyParser.urlencoded({
  extended: true
}));

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
        var user = new User();
        user.name = req.body.name;
        user.email = req.body.email;
        // user.pendingTasks.push(req.body.pendingTasks);
        //user.dateCreated = req.body.dateCreated;

        if(typeof user.name === "undefined" && user.email === 'undefined') {
            res.json('User name and/or email is undefined');
            //res.json({message:"User name and/or email is undefined"});
        }
        else {
            user.save(function(err, user) {
                if (err)
                {
                    res.status(500);
                    res.send(err);
                    //res.send(err);
                }
                res.json({message: 'user created with name ' + user.name}); 
            });
        }
    })
    
    .get(function(req, res) {
        User.find(function(err, users){
            if (err)
                res.send(err);
            res.json(users);
        });
    })

    .options(function(req, res){
      res.writeHead(200);
      res.end();
    });

//Add more routes here
router.route('/users/:user_id')
    .get(function(req, res) {
        User.findById(req.params.user_id, function(err, user) {
            if (err)
                res.send(err);
            res.json(user);
        });
    })

// var indiUserRoute = router.route('/users/:id');

// indiUserRoute.get(function(req, res){
//     User.findById(req.params.id, function(err, user){
//         if(err){
//             res.status(404);
//             res.send(err);
//         }
//         res.status(200);
//         res.json(user);
//     });
// });

    .put(function(req, res) {
        User.findById(req.params.user_id, function(err, user) {
            if (err)
                res.send(err);

            user.name = req.body.name;
            user.email = req.body.email; 
            user.pendingTasks.push(req.body.pendingTasks);

            if(typeof user.name === "undefined" && user.email === 'undefined') {
                res.json({message:"User name and/or email is undefined"});
            }

            user.save(function(err) {
                if (err)
                    res.send(err); 
                res.json({message: 'User updated!'});
            });
        });
    })

    .delete(function(req, res) {
        User.remove({
            _id: req.params.user_id
        }, function(err, user) {
            if (err)
                res.send(err);

            res.json({ message: 'Successfully deleted' });
        });
    });

// Start the server
app.listen(port);
console.log('Server running on port ' + port); 