const express = require('express')
const router = express.Router()
const db = require('./db.js')
const bodyParser = require('body-parser')

router.use(bodyParser.json())
router.use(bodyParser.urlencoded({
  extended: true
}))
class Response{
  constructor(status,obj){
    this.status = Boolean(status)
    this.obj = Object(obj)
  }
}

router.route('/all')
  .all((req,res,next)=>{
    res.type('json')
    if(req.method === 'GET')
      next()
    else(res.json(new Response(false, 'Cannot '+ req.method)))
  })
  .get((req,res,next)=>{

    db.getAll((contents)=>{
      if(!!contents[0])
        res.json(new Response(true,contents))
      else
        res.json(new Response(false, 'Empty'))
    })

  })
router.route(['/latest/:timetag','/latest'])
    .all((req,res,next)=>{
      res.type('json')
      if(req.method === 'GET')
        next()
      else(res.json(new Response(false, 'Cannot '+ req.method)))
    })
    .get((req,res,next)=>{
      let timetag = req.params.timetag||req.body.timetag||req.query.timetag

      db.getLatest(timetag,(contents)=>{
        if(!!contents[0])
          res.json(new Response(true,contents))
        else
          res.json(new Response(false,'Empty'))
      })

    })



router.route('/post/:id')
  .post((req,res,next)=>{
    res.type('json')
    let id = req.params.id
    let content = req.body.content

    try{
      db.addPost(id,content,(err)=>{
        if(!err){
          res.json(new Response(true, 'Posted'))
        }
        else
          throw err
      })

    }
    catch(e){
        res.json(new Response(false, 'Posted Failed'))
    }

  })

router.route('/del')
  .all((req,res,next)=>{
    res.type('json')
    let token = req.query.token||req.body.token
    db.deleteAll(token,(err,txt)=>{
      if(err)
        res.json(new Response(false, err.toString()))
      else
        res.json(new Response(true, txt))
    })

  })
router.route('/del/:id')
    .get((req,res,next)=>{
      res.type('json')
      let id = req.params.id
      db.deletePost(id,(err,txt)=>{
        if(err)
          res.json(new Response(false, err.toString()))
        else
          res.json(new Response(true, txt))
      })

    })
module.exports = router
