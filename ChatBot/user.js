var express = require("express");
var app = express();
app.use(express.json());
const MongoClient = require("mongodb").MongoClient;


const url = "mongodb://127.0.0.1:27017";
const dbName = 'userInfo';

let db;
MongoClient.connect(url, (err, client) => {
    if (err) return console.log(err);

    db = client.db(dbName);
    
    console.log(`Connected database :${url}`);

    console.log(`Databse : ${dbName}`);
});

//Search by User name
app.post('/searchUserByName',(req,res)=>{
    console.log("Searching user by name");
    var name = req.body.queryResult.queryText;
    var data = db.collection('userData').findOne({"name":new RegExp(name)}).toArray().then(result => res.json(result));
});

app.post('/searchUserByPhno',(req,res)=>{
    console.log("Searching user by phno");
    var phno = req.body.phno;//queryResult.queryText;//req.body.queryResult.parameters.phone-number[0];
    //console.log(req.body);
    console.log(phno);
    var name = "Welcome ";
    res.setHeader('Content-Type', 'application/json');
    var data = db.collection('userData').find({"phno":Number(phno)}).toArray().then(result => res.send(JSON.stringify(
        {
            "fulfillmentMessages": [
              {
                "text": {
                  "text": [
                    "Welcome "+result[0]["name"]
                  ]
                }
              }
            ]
          }
    )));
    console.log(name);

    
    /*
    var data = db.collection('userData').find({"phno":Number(phno)}).toArray().then(result => res.send(JSON.stringify({
        "speech" : result.name,
        "displayText":result.name
    })));*/
    
});

/*//Search by User Phno
*/
app.get('/searchUserByPhno',(req,res)=>{
    console.log("Searching user by Phno");
    var phno = req.body.queryResult.queryText;//req.query.phno;
    var data = db.collection('userData').find({"phno":phno}).toArray().then(result => res.json(result));
});

app.listen(3000);