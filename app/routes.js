const express = require('express');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const jwt = require('jsonwebtoken');
const {withAuth} = require('./middleware');

const secret = 'secret';

var router = express.Router();
var api = function(router){
  const resource = [
    {
      'id': 0,
      'name': 'aaa',
    }
  ];
  router.get('/', function(req, res){
    res.json({
      resource: resource
    });
  });
  router.get('/:id', function(req, res){
//    console.log(req.params.id);
    res.send(`id: ${req.params.id}`);
  });

  return router;
}(router);


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
  app.use('/api', api);
}
