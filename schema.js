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
	medicineLog: [Date]
});

mongoose.connect('mongodb://localhost:27017/MedicineDB');
module.exports = mongoose.model('MedUser',UserSchema);