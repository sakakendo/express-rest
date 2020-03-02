const express = require('express');
const mongoose = require('mongoose');
const next = require('next');
//const app = express();
const port = parseInt(process.env.PORT) || 3000
const dev = process.env.NODE_ENV !== 'production';
const app = next({dev});
const handle= app.getRequestHandler();

const mongo_uri = process.env.MONGODB_URI
if(!mongo_uri) throw 'mongodb uri is undefined';
mongoose.connect(mongo_uri, {useNewUrlParser: true}, function(err){
  if(err){
    throw err
  }else{
    console.log(`successfully connected to mongodb: ${mongo_uri}`)
  }
})

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

app.prepare().then(function(){
  const server = express();

  server.use('/api', api);

  server.all('*', (req, res)=>{
    return handle(req, res);
  })
  server.listen(port, ()=>console.log(`start app at ${port}`));


});

