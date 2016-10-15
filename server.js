const express = require('express');

const app = express();
const port = 3333;
const host = '0.0.0.0';
const morgan = require('morgan');
const router = require(__dirname + '/router.js')
app.use(morgan('dev'));
app.use('/api',router);
app.use(express.static('static'));
app.set('json spaces', 0);
app.listen(port,host,(req,res,next)=>{
  console.log(`Server started on http://${host}:${port}/`);
});
