var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');


var userSchema = new Schema({

	local: {
		username: String,
		password: String,
		email: String,
		cnName: String,
		//facebook欄位
		facebook: {
			id: String,
			token: String,
			email: String,
			name: String
		},
		googleAuthenticatorSecret: String
	}
});

userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);
};

userSchema.methods.validPassword = function(password){
	return bcrypt.compareSync(password, this.local.password);
}


module.exports = mongoose.model('User', userSchema);