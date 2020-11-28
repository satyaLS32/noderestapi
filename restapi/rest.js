var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongo = require('mongodb')
var MongoClient = mongo.MongoClient;
var mongourl = "mongodb://localhost:27017";
var port = 6700;
let db;
let col_name="eduJan";


app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())


//create(post call)
app.post('/createUser', (req,res) => {
    db.collection(col_name).insert(req.body,(err,result) => {
        if(err) {
            res.status(401).send('error while inserting')
            }
            else{
                res.send('Data Added')
            }
    })
})

//Read(get call)
app.get('/getUser',(req,res) => {
    db.collection(col_name).find({"active":true}).toArray((err,result) => {
        if(err){
            res.status(401).send('error while fetching')
        }
        else {
            res.send(result)

            //res.send('get data')
        }
    })
    })

    //udate(put call)
app.put('/updateUser',(req,res) => {
    db.collection(col_name).findOneAndUpdate({'id':req.body.id},{
    $set: {
        'id':req.body.id,
        'name':req.body.name,
        'phone':req.body.phone,
        'location':req.body.location,
        'active' :req.body.active,

    }
},(err,result) => {
    if(err){
        res.status(401).send('error while updating')
    }
    else {
        res.send('data updated')
    }
})
  })

  //delete(delete call
  app.delete('/deleteUser', (req,res) => {
      db.collection(col_name).findOneAndDelete({'id':req.body.id},(err,result)=>{
        if(err){
            res.status(401).send('error while deleting')
        }
        else {
            res.send('data deleted')
        }
      })
  })


MongoClient.connect(mongourl,(err,client) => {
    if(err)
    console.log('error while connecting')
    db = client.db('classpractice')
    app.listen(port,(err) => {
        if(err) throw err
        else{
            console.log(`server is runnning on port${port}`)
        }
    })
})
