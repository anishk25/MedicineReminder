var express = require('express');
var body_parser = require('body-parser');
var routes = require('./routes.js');
var cron = require('cron');
var medUser = require('./schema.js');
var twilio = require('twilio');
var request = require('request');
var constants = require('./constants.js');

var app = express();
var port = process.env.PORT||8080;

var schedulerDelay = 30000;

app.use(body_parser.json());
app.use(body_parser.urlencoded({extended:true}));

app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization');
    next();
});


// app router
routes(app);
app.listen(port);


// scheduler, this will query the database every 30 seconds
setTimeout(checkForMedTime,schedulerDelay);


function checkForMedTime(){
	// check all users and see if the time now matches 
	// their scheduled medicine time
	console.log("checking users!");
	var date  = new Date();
	var day = date.getDay() + 1;
	var hours = (date.getHours() + 1)-1;
	//hours = hours < 0 ? 24 + hours : hours;
	var minutes = date.getMinutes();
	var c_user;
	console.log("Time now is " + hours + ":" + minutes);
	medUser.find(function(err,users){
		if(!err){
			for(var u = 0 ; u < users.length; u++){
				var schedule = users[u]['schedule'];
				for(var c_day in schedule){
					var times = schedule[c_day];
					if(c_day == day){
						for(var t = 0; t < times.length; t++){
							var split = times[t].split(':');
							var s_hour = split[0];
							var s_min = split[1];
							if(s_hour == hours && (s_min == minutes)){
								console.log("sending text message to " + users[u]['name']);
								//sendText(user.name, user.mobile_number,user.sparkToken,user.sparkId);
								var sparkID = "53ff6f066667574829262367";
								var sparkToken = "9bc94f1eafef16d3c1a2f14e942442c1b9393bcf";
								sendText(users[u]['name'], users[u]['mobile_number'],sparkToken,sparkID);
							}
						}
					}
				}
			}
		}
	});
	setTimeout(checkForMedTime,schedulerDelay);
}



function sendText(name,number,sparkToken,sparkID){
	var twilioClient = twilio(constants.twilioAccountSid, constants.twilioAuthToken);
	var msg = "Please take your medicine now " + name;
	twilioClient.messages.create({ 
		to: number, 
		from: constants.myTwilioNumber, 
		body: msg
	}, function(err, message) { 
		if(!err){
			sendRequestToSpark(name,sparkToken,sparkID);
			console.log(message);
		}else{
			console.log(err);
		}
	});

}

function sendRequestToSpark(name,sparkToken,sparkID){
	var msg = "Please take your medicine now " + name;
	var req_body = encodeURI("access_token="+sparkToken+"&message="+msg);
	var req_uri = 'https://api.spark.io/v1/devices/'+ sparkID +'/sendTextMsgs'
	request(
		{
			method:'POST',
			uri:req_uri,
			body:req_body
		},function(err,response,body){
				console.log(body);
		}
	);
}
