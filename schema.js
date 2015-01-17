var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var UserSchema = new Schema({
	name:String,
	email:String,
	password:String,
	mobile_number:String,
	accessToken:String,
	sparkToken:String,
	sparkId:String,
	schedule:Schema.Types.Mixed,
	notificationFreq:Number,
	notificationLimit: Number,
	medicineLog: [Date]
});

mongoose.connect('mongodb://badBois:pennApps25@ds031701.mongolab.com:31701/mytestdatabase');
module.exports = mongoose.model('MedUser',UserSchema);