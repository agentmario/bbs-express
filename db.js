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
      cb(err,p.timetag)
    })

  },
  getLatest(__timetag,cb){
    Post.find({timetag:{$gt:__timetag}},(err,posts)=>{
        cb(posts)
    })
  },
  deleteAll(token,cb){
    if(token === '1145141919')
      Post.remove({},(err)=>{
        cb(null,"Collection cleared")
      })
    else
      cb(new Error('Token invalid'),null)
  },
  count(cb){
      Post.count({},(err,ct)=>{
          if(!err)    
            cb(ct);
          else
            cb(0);
      });
  },
  deletePost(__id,cb){
    Post.remove({_id:__id},(err)=>{
      if(!err)
        cb(null,`Post id: ${__id} deleted`)
      else
        cb(err,`Failed to delete ${__id}`)
    })
  }
}
