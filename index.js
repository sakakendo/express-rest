const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3000

/*
const mongo_uri = 'mongodb://localhost/express-rest' 
mongoose.connect(mongo_uri, function(err){
  if(err){
    throw err
  }else{
    console.log(`successfully connected to mongodb: ${mongo_uri}`)
  }
})
*/

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

app.use('/api', api);

app.listen(port, ()=>console.log(`start app at ${port}`));

