let mongo = require('mongoose')
let url = 'mongodb://localhost/bbs'

mongo.connect(url)
let db = mongo.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function() {
  console.log('mongodb connected')
})
let postSchema = mongo.Schema({
  id:String,
  content:String,
  timetag:Number
})
let Post = mongo.model('Post',postSchema)

Post.find({},(err,post)=>{console.log(post)})
module.exports = {
  getAll(cb){
    Post.find({},(err,posts)=>{
      if(!err)// throw new Error("Failed to update")
        cb(posts)
    })

  },
  addPost(__id,__content,cb){
    let p = new Post({id:__id, content:__content, timetag:Date.now()})
    p.save((err,p)=>{
      cb(err)
    })

  },
  getLatest(_timetag,cb){
    Post.find({timetag:{$gt:_timetag}},(err,posts)=>{
        cb(posts)
    })
  },
  deleteAll(token,cb){
    if(token === '1145141919')
      Post.remove({},(err)=>{
        cb(err,"Collection cleared")
      })
    else
      cb(null,"Token invalid")
  }
}
