const express = require('express');
const https = require('https');
const read = require('fs').readFileSync;
const key = read('/etc/ssl/comodo/server.key','utf8');
const cert = read('/etc/ssl/comodo/server.crt','utf8');
const app = express();
const compress = require('compression');
const port = 3333;
const host = '0.0.0.0';
const morgan = require('morgan');
const router = require(__dirname + '/router.js');
app.use(compress());
app.use(morgan('dev'));
app.use('/api',router);
app.use(express.static('static',{maxAge:86400000}));
app.set('json spaces', 0);
srv = https.createServer({key,cert},app);

srv.listen(port,host,(req,res,next)=>{
  console.log(`Server started on https://${host}:${port}/`);
});
