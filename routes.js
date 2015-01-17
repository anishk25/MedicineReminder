var mongoose = require('mongoose');
var myCrypt = require('./myCrypt.js');
var medUser = require('./schema.js');
var jwt = require("jwt-simple");
var tokenSecret = "hj89l9nbjk9";


module.exports = function(app){

	app.get('/',function(req,res){
		res.end("Medicine Reminder App, Welcome to the API!");
	});

	app.post('/register',function(req,res){
		var u_name = req.body.name;
		var u_email = req.body.email;
		var u_pass = req.body.password;
		var mobile_number = req.body.mobile_number;

		medUser.findOne({email: u_email}, function(err,user){
			if(err){
				res.send(err);
			}else{
				if(user){
					res.json({message:"User already exists"});
				}else{
					var newUser = new medUser();
					newUser.name = u_name;
					newUser.email = u_email;
					newUser.password = myCrypt.encrypt(u_pass);
					newUser.mobile_number = mobile_number;
					newUser.accessToken = jwt.encode(u_email,tokenSecret);
					newUser.save(function(err){
						if(err){
							res.send(err);
						}else{
							res.json({message:"Registration Successful!"});
						}
					});
				}
			}
		});
	});


	app.post('/login', function(req,res){
		var u_email = req.body.email;
		var u_pass = req.body.password;

		medUser.findOne({email: u_email}, function(err,user){
			if(err){
				res.send(err);
			}else{
				if(user){
					if(u_pass == myCrypt.decrypt(user.password)){
						res.json({
							message:"Login Successful",
							accessToken: user.accessToken
						});
					}else{
						res.json({
							message: "Invalid username/password"
						});
					}
				}else{
					res.json({
						message: "Invalid username/password"
					});
				}
			}
		})
	});

	app.put('/updateinfo',ensureAuthorized,function(req,res){
		accessUser(req,res, function(user){
			user.name = req.body.name;
			user.email = req.body.email;
			user.password = myCrypt.encrypt(req.body.password);
			user.mobile_number = req.body.mobile_number;
			user.save(function(err){
				if(err){
					res.send(err);
				}else{
					res.json({message:"Info update sucessfully"});
				}
			});
		})
	});

	app.put('/updateSparkInfo',ensureAuthorized,function(req,res){
		accessUser(req,res, function(user){
			user.sparkToken = req.body.sparkToken;
			user.sparkId = req.body.sparkId;
			user.save(function(err){
				if(err){
					res.send(err);
				}else{
					res.json({message:"Spark Info Updated sucessfully"});
				}
			});
		});
	});

	app.put('/updateSchedule', ensureAuthorized, function(req, res){
		accessUser(req,res, function(user){
			user.schedule = JSON.parse(req.body.jsonSchedule);
			user.notificationFreq = req.body.notificationFreq;
			user.notificationLimit = req.body.notificationLimit;
			user.save(function(err){
				if(err){
					res.send(err);
				}else{
					res.json({message:"Spark Info Updated sucessfully"});
				}
			});
		});
	});

	app.put('/logMedicineDate', ensureAuthorized, function(req, res){
		accessUser(req,res, function(user){
			var dateStr = req.body.date;
			var linuxTime = parseInt(dateStr);
			var date = new Date(linuxTime);
			user.medicineLog.push(date);

			user.save(function(err){
				if(err){
					res.send(err);
				}else{
					res.json({message:"Date sucessfully logged"});
				}
			});
		});
	});

	app.get('/getUserInfo', ensureAuthorized, function(req,res){
		accessUser(req,res, function(user){
			var userInfo = {
				name: user.name,
				email: user.email,
				password : myCrypt.decrypt(user.password),
				mobile_number : user.mobile_number
			}
			res.json(userInfo);
		});
	});

	app.get('/getSparkInfo', ensureAuthorized, function(req,res){
		accessUser(req,res, function(user){
			var sparkInfo = {
				sparkId: user.sparkId,
				sparkToken: user.sparkToken
			}
			res.json(sparkInfo);
		});
	});

	app.get('/getSchedule', ensureAuthorized, function(req,res){
		accessUser(req,res, function(user){
			res.json(
				{
					schedule: user.schedule,
					frequency : user.notificationFreq,
					limit : user.notificationLimit

				});
		});
	});

	app.get('/getLogData', ensureAuthorized, function(req,res){
		accessUser(req,res, function(user){
			res.json(user.medicineLog);
		});
	});

}

function ensureAuthorized(req, res, next){
	var bearerHeader = req.headers["authorization"];
	if(typeof bearerHeader != 'undefined'){
		var bearer = bearerHeader.split(" ");
		var bearerToken = bearer[0];
		req.token = bearerToken;
		next();
	}else{
		response.send(403);
	}
}

function accessUser(req, res, succFunc){
	medUser.findOne({accessToken: req.token}, function(err,user){
			if(err){
				res.send(err);
			}else{
				if(user){
					succFunc(user);
				}else{
					res.json({message: "User not authorized"});
				}
			}
	});
}




