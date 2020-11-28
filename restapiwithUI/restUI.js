var express = require('express');
var app = express();
var ejs = require('ejs');
var bodyParser =  require('body-parser');
var port = 2300;
var mongo = require('mongodb');
var MongoClient = mongo.MongoClient;
var mongourl = "mongodb://localhost:27017";

let db;
let col_name = "eduJan";

app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())

//static file path
app.use(express.static(__dirname+'/public'))
//View files
app.set('views', './src/views');
//View engine
app.set('view engine', 'ejs');

//health check
app.get('/health',(req,res)=>{
    res.status(200).send('Api is working')
})

//create(post call)
app.post('/addUser',(req,res)=>{
    var id = Math.floor(Math.random()*1000)
    var data = {
        id:id,
        name :req.body.name,
        city : req.body.city,
        phone : req.body.phone,
        active : true
    }
    db.collection(col_name).insert(data,(err,result)=>{
        if(err)
        res.status(401).send('error while inserting');
        else
        res.redirect('/')
       // res.send('Data Added')
    })
})



app.get('/',(req,res)=>{
    db.collection(col_name).find({}).toArray((err,result)=>{
        if(err)
        res.status(401).send('error while fetching');
        else
        res.render('index',{data:result})

    })

})

//read(get call)
app.get('/user',(req,res)=>{
    var query = {}
    if(req.query.id && req.query.name){
        query = {id:parseInt(req.query.id),name:req.query.name,active:true}
    }
    else if(req.query.id){
        query = {id:parseInt(req.query.id),active:true}
    }
        else if( req.query.name){
            query = {name:req.query.name,active:true}
}
            else{
                query = {active:true}
            }
            
        
    db.collection(col_name).find(query).toArray((err,result)=>{
        if(err)
        res.status(401).send('error while fetching');
        else
        res.send(result)

    })
})


//update(put call)
app.put('/updateUser',(req,res)=>{
    db.collection(col_name).findOneAndUpdate({"id":parseInt(req.body.id)},{
        $set :{
            id : parseInt(req.body.id),
            name :req.body.name,
            city : req.body.city,
            phone : req.body.phone,
            //active : req.body.active
            active:true

        }

    },(err,result)=>{
        
        if(err)
        res.status(401).send('error while updating');
        else
        res.send('Data Updated');

    })
})

//softdelete(put call)
app.put('/softDelete',(req,res)=>{
    db.collection(col_name).findOneAndUpdate({"id":parseInt(req.body.id)},{
        $set :{
            id : parseInt(req.body.id),
            name :req.body.name,
            city : req.body.city,
            phone : req.body.phone,
            active : false

        }

    },(err,result)=>{
        
        if(err)
        res.status(401).send('error while updating');
        else
        res.send('Data Updated');

    })
})



//delete(delete call)
app.delete('/deleteUser',(req,res)=>{
    db.collection(col_name).findOneAndDelete({"id":parseInt(req.body.id)},(err,result)=>{
        if(err)
        res.status(401).send('error while deleting');
        else
        res.send('Data Deleted');

    })
})


app.get('/new',(req,res)=>{
    var id = Math.floor(Math.random()*10000)
    res.render('admin',{id:id})
})




MongoClient.connect(mongourl,(err,client)=>{
    if(err) throw err
    db = client.db('classpractice1');
    app.listen(port,(err)=>{
        console.log(`server is listening on the port ${port}`)
    })
})









