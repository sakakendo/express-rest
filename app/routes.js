const express = require('express');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const Task = mongoose.model('Task');
const jwt = require('jsonwebtoken');
const {withAuth} = require('./middleware');

const secret = 'secret';

function getUserID(email, cb, fb){
    User.findOne({email}, function(err, user){
        if(err) console.error(err);
        if(!user) console.error('user not found');
        cb(user._id);
    })
}

var router = express.Router();
var api = function(router, model){
  router.get('/', withAuth, function(req, res){
    getUserID(req.email, (userId)=>{
        model.find({'owner': userId}, 'title note completed due', function(err, resource){
            if(err) res.json({
                error: err.message
            })
            res.json({
                message: '',
                resource: resource
            });
        });
    }, ()=>{});
  });
  router.post('/', withAuth, function(req, res){
      const {title, note, completed, due} = req.body;
      getUserID(req.email, (userId)=>{
          const resource = new model({
              title,
              note,
//              completed,
//              due,
              owner: userId,
          });
          resource.save(function (err) {
              console.error(err);
          });
      })
      res.json({
          message: "success to create task"
      })
  })
  router.get('/:id', function(req, res){
//    console.log(req.params.id);
    res.send(`id: ${req.params.id}`);
  });

  return router;
}(router, Task);


const userRoutes = {
    create: function(req, res){
//        console.log(req.body)
        const {name, email, password} = req.body;
        const user = new User({name, email, password});
        user.save(function(err){
            if(err){
                console.error(err);
                res.status(500)
                    .json({
                        'message': err.message
                    })
            }
            res.status(200)
                .json({
                    message: 'successfully loged in'
                })
        })
    },

    authenticate: function(req, res){
        const {email, password} = req.body;
        User.findOne({email}, function(err, user){
            if(err){
                console.error(err)
                res.status(500)
                    .json({
                        error: 'Internal Error'
                    });
            }else if(!user){
                res.status(401)
                    .json({
                        error: 'Incorrect email or password'
                    })
            }else{
                user.isCorrectPassword(password, function(err, same){
                    if(err){
                        console.error(err);
                        res.status(500)
                            .json({
                                error: 'Internal Error'
                            })
                    }else if(!same){
                        res.status(401)
                            .json({
                                error: 'Incorrect email or password'
                            });
                    }else{
                        const payload = {email};
                        const token = jwt.sign(payload, secret, {
                            expiresIn: '24h',
                        });
                        res.json({
                            message: 'successfully authenticated',
                            token: token
                        });
                    }
                })
            }
        })
    }
};


module.exports = function(app){
  app.get('/api/secret', withAuth, function(req,res){
      res.json({
          message: 'loged in user only'
      })
  });
  app.post('/api/user/signup', userRoutes.create);
  app.post('/api/user/authenticate', userRoutes.authenticate);
  app.get('/api/user/delete', userRoutes.authenticate);
  app.use('/api/task', api);
}
