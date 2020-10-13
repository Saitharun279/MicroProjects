var express = require("express");
var app = express();
app.use(express.json());
const MongoClient = require("mongodb").MongoClient;


const url = "mongodb://127.0.0.1:27017";
const dbName = 'hospitalManagement';
let server = require("./server");
let config = require("./config");
let middleware = require("./middleware");

let db
MongoClient.connect(url, (err, client) => {
    if (err) return console.log(err);

    db = client.db(dbName);
    
    console.log(`Connected database :${url}`);

    console.log(`Databse : ${dbName}`);
});

//reading hospital details
app.get('/readHospitals',middleware.checkToken,(req,res)=>{
    console.log("Reading the Hospital Details");
    var data = db.collection('Hospital').find().toArray().then(result => res.json(result));
})

//reading ventilator details
app.get('/readVentilators',middleware.checkToken,(req,res)=>{
    console.log("Reading the Ventilator Details");
    var data = db.collection('Ventilator').find().toArray().then(result => res.json(result));
    
})

//Searching Ventilator by status and Hospital Name
app.get('/searchVentilator',middleware.checkToken,(req,res)=>{
    console.log("Searching ventilator by status and hospital name");
    var name = req.query.name;
    var status = req.query.status;
    var data = db.collection('Ventilator').find({"name":name,"status":status}).toArray().then(result => res.json(result));
})

//Search by Hospital name
app.get('/searchHospital',middleware.checkToken,(req,res)=>{
    console.log("Searching hospital by name");
    var name = req.query.name;
    var data = db.collection('Hospital').find({"name":name}).toArray().then(result => res.json(result));
})

//Update Ventilator details
app.put('/updateVentilator',middleware.checkToken,(req,res)=>{
    console.log("Updating Ventilator details");
    var hid = req.body.hid;
    var ventID = req.body.ventID;
    var status = req.body.status;
    var name = req.body.name;
    var data = db.collection('Ventilator').updateOne({"hid":hid,"ventID":ventID},{$set:{"status":status}},(err,result)=>{
        res.json("Document Updated");
        if(err) throw err;
    });
})


//Add Ventilator
app.post('/addVentilator',middleware.checkToken,(req,res)=>{
    console.log("Updating Ventilator details");
    var hid = req.body.hid;
    var ventID = req.body.ventID;
    var status = req.body.status;
    var name = req.body.name;
    var data = db.collection('Ventilator').insertOne({"hid":hid,"ventID":ventID,"status":status,"name":name},(err,result)=>{
        res.json("Document Added");
        if(err) throw err;
    });
})

//Delete Ventilator
app.delete('/deleteVentilator',middleware.checkToken,(req,res)=>{
    console.log("Deleting Ventilator details");
    var hid = req.body.hid;
    var ventID = req.body.ventID;
   /* var flag;
    console.log(flag);
    var find = db.collection('Ventilator').find({"hid":hid,"ventID":ventID}).toArray().then(result=>(flag = result));
    console.log(flag);
    if(flag!=[])
    {*/
    var data = db.collection('Ventilator').deleteOne({"hid":hid,"ventID":ventID},(err,result)=>{
        res.json("Document Deleted");

        if(err) throw err;
    });
    /*}
    else{
        res,json("Document Not Found");
    }*/

})


app.listen(3000);

