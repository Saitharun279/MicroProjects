const express = require('express');
const { WebhookClient } = require('dialogflow-fulfillment');
const { Payload } = require('dialogflow-fulfillment');
const app = express();

const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://127.0.0.1:27017";
const dbName = 'userInfo';
var randomstring = require('randomstring');
var username= "";

app.get('/favicon.ico', (req, res) => res.status(200));

app.get("/",(req,res)=>{
    res.send("HI");
    //console.log("HI");
});
app.post("/webhook",express.json(),(req,res)=>{

    const agent = new WebhookClient({
        request:req,response:res
    });

    async function customerIdentification(agent)
    {
        const customerPhno = agent.parameters.phoneNumber[0];
        const client = new MongoClient(url);
        await client.connect();
        console.log(customerPhno);
        const user = await client.db(dbName).collection("userData").findOne({"phno":Number(customerPhno)});
        if(user==null)
        {
            agent.add("Re-Enter your mobile number");
        }
        else
        {
            username = user.name;
            agent.add("Welcome "+username+"!! \n How can I help you");
        }
    }
    function payload(agent)
    {
        var payLoadData=
		{
    "richContent": [
        [
        {
            "type": "list",
            "title": "Internet Down",
            "subtitle": "Press '1' for Internet is down",
            "event": {
            "name": "",
            "languageCode": "",
            "parameters": {}
            }
        },
        {
            "type": "divider"
        },
        {
            "type": "list",
            "title": "Slow Internet",
            "subtitle": "Press '2' Slow Internet",
            "event": {
            "name": "",
            "languageCode": "",
            "parameters": {}
            }
        },
        {
            "type": "divider"
        },
        {
            "type": "list",
            "title": "Buffering problem",
            "subtitle": "Press '3' for Buffering problem",
            "event": {
            "name": "",
            "languageCode": "",
            "parameters": {}
            }
        },
        {
            "type": "divider"
        },
        {
            "type": "list",
            "title": "No connectivity",
            "subtitle": "Press '4' for No connectivity",
            "event": {
            "name": "",
            "languageCode": "",
            "parameters": {}
            }
        }
        ]
    ]
    }
    agent.add(new Payload(agent.UNSPECIFIED,payLoadData,{sendAsMessage:true, rawPayload:true }));
    }

    function report_issue(agent)
    {
    
    var issue_vals={1:"Internet Down",2:"Slow Internet",3:"Buffering problem",4:"No connectivity"};
    
    const intent_val=agent.parameters.issue_num;
    
    var val=issue_vals[intent_val];
    
    var trouble_ticket=randomstring.generate(7);

    //Generating trouble ticket and storing it in Mongodb
    //Using random module
    MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("userInfo");
        
        var u_name = username;    
        var issue_val=  val; 
        var status="pending";

        let ts = Date.now();
        let date_ob = new Date(ts);
        let date = date_ob.getDate();
        let month = date_ob.getMonth() + 1;
        let year = date_ob.getFullYear();

        var time_date=year + "-" + month + "-" + date;

        var myobj = { username:u_name, issue:issue_val,status:status,time_date:time_date,trouble_ticket:trouble_ticket };

        dbo.collection("userIssue").insertOne(myobj, function(err, res) {
        if (err) throw err;
        db.close();    
    });
    });
    agent.add("The issue reported is: "+ val +"\nThe ticket number is: "+trouble_ticket);
    }
    var intentMap = new Map();
    intentMap.set("Customer Login",customerIdentification);
    intentMap.set("Customer Issue Categorization",payload);
    intentMap.set("TTicket",report_issue);
    agent.handleRequest(intentMap);
});

app.listen(3000);