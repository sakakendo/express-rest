const express = require('express');
const mongoose = require('mongoose');
const next = require('next');
const port = parseInt(process.env.PORT) || 3000
const dev = process.env.NODE_ENV !== 'production';
const app = next({dev});
const handle= app.getRequestHandler();

require('./app/models/user');
require('./app/models/task');

const mongo_uri = process.env.MONGODB_URI
if(!mongo_uri) throw 'mongodb uri is undefined';
mongoose.connect(mongo_uri, {useNewUrlParser: true}, function(err){
  if(err){
    throw err
  }else{
    console.log(`successfully connected to mongodb: ${mongo_uri}`)
  }
})



app.prepare().then(function(){
  const server = express();

  server.use(express.json())

  require('./app/routes')(server)

  server.all('*', (req, res)=>{
    return handle(req, res);
  })
  server.listen(port, ()=>console.log(`start app at ${port}`));
});

