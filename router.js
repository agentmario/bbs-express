const express = require('express')
const router = express.Router()
const db = require('./db.js')
const bodyParser = require('body-parser')

router.use(bodyParser.json())
router.use(bodyParser.urlencoded({
  extended: true
}))

router.route('/all')
  .all((req,res,next)=>{
    res.type('json')
    next()
  })
  .get((req,res,next)=>{

    db.getAll((contents)=>{
      if(contents)
        res.json(contents)
      else
        res.end("Error")
    })

  })
router.route(['/latest/:timetag','/latest'])
    .all((req,res,next)=>{
      res.type('json')
      next()
    })
    .get((req,res,next)=>{
      let timetag = req.params.timetag||req.body.timetag||req.query.timetag

      db.getLatest(timetag,(contents)=>{
        res.json(contents)
      })

    })


router.route('/:id')
  .post((req,res,next)=>{
    let id = req.params.id
    let content = req.body.content
    res.writeHead(200, {'Content-Type':'text-plain'})
    try{
      db.addPost(id,content,(err)=>{
        if(!err){
          res.end('Posted')
        }
        else
          throw err
      })

    }
    catch(e){
      res.end(`Failed: ${e}`)
    }

  })

router.route('/del')
  .get((req,res,next)=>{
    let token = req.query.token||req.body.token
    db.deleteAll(token,(err,txt)=>{
      if(err)
        console.log(err)
      res.end(txt)
    })

  })

module.exports = router
