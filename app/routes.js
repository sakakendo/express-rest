const express = require('express');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const Task = mongoose.model('Task');
const jwt = require('jsonwebtoken');
const { withAuth } = require('./middleware');

const secret = 'secret';

function getUserID(email, cb, fb) {
  User.findOne({ email }, function (err, user) {
    if (err) console.error(err);
    if (!user) console.error('user not found');
    cb(user._id);
  })
}

var serializer = function (model) {
  return {
    get: function (req, res) {
      getUserID(req.email, (userId) => {
        model.find({ 'owner': userId }, 'title note completed due', function (err, resource) {
          if (err) res.json({
            error: err.message
          })
          res.json({
            message: '',
            resource: resource
          });
        });
      }, () => { });
    },
    getOne: function (req, res) {
      model.findById(req.params.id, function (err, resource) {
        if (err) res.status(401).json({
          error: err.message
        });
        const { title, note, completed, _id, owner, created_at } = resource;
        res.json({
          id: _id,
          title,
          note,
          completed,
          owner,
          created_at
        })
      });
    },
    create: function (req, res) {
      const { title, note, completed, due } = req.body;
      getUserID(req.email, (userId) => {
        const resource = new model({
          title,
          note,
          //              completed,
          //              due,
          owner: userId,
        });
        resource.save(function (err) {
          if(err) res.status(401).json({
            error: err.message
          })
          res.json({
            message: "success to create task",
            resource
          })
        });
      })
    },
    updateOne: function (req, res) {
      model.findById(req.params.id, function (err, resource) {
        if(err) res.status(401).json({
          error: err.message
        })
        for(const [key, value] of Object.entries(req.body)){
          resource[key]  = value;
        }
        resource.save();
        res.json({
          message: 'success',
          resource
        })
      });
    },
    deleteOne: function (req, res) {
      const _id = req.params.id;
      model.findByIdAndDelete(_id, function (err, resource) {
        if (err) res.status(401).json({
          error: err.message
        });
        res.json({
          message: `successs to delete id: ${_id}`
        })
      })
    }
  }
}

var router = express.Router();
var api = function (router, serializer) {
  router.get('/', withAuth, serializer.get);
  router.post('/', withAuth, serializer.create)
  router.get('/:id', withAuth, serializer.getOne);
  router.put('/:id', withAuth, serializer.updateOne)
  router.delete('/:id', withAuth, serializer.deleteOne)
  return router;
}(router, serializer(Task));


const userRoutes = {
  create: function (req, res) {
    const { name, email, password } = req.body;
    const user = new User({ name, email, password });
    user.save(function (err) {
      if (err) {
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

  authenticate: function (req, res) {
    const { email, password } = req.body;
    User.findOne({ email }, function (err, user) {
      if (err) {
        console.error(err)
        res.status(500)
          .json({
            error: 'Internal Error'
          });
      } else if (!user) {
        res.status(401)
          .json({
            error: 'Incorrect email or password'
          })
      } else {
        user.isCorrectPassword(password, function (err, same) {
          if (err) {
            console.error(err);
            res.status(500)
              .json({
                error: 'Internal Error'
              })
          } else if (!same) {
            res.status(401)
              .json({
                error: 'Incorrect email or password'
              });
          } else {
            const payload = { email };
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


module.exports = function (app) {
  app.get('/api/secret', withAuth, function (req, res) {
    res.json({
      message: 'loged in user only'
    })
  });
  app.post('/api/user/signup', userRoutes.create);
  app.post('/api/user/authenticate', userRoutes.authenticate);
  app.get('/api/user/delete', userRoutes.authenticate);
  app.use('/api/task', api);
}
