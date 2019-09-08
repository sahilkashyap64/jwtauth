const mongoose = require('mongoose');

var validator = require('validator');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3
  },
  email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: value => {
            if (!validator.isEmail(value)) {
                throw new Error({error: 'Invalid Email address'})
            }
        }
    },
	password:{
		type: String,
	required:true},
	
	register_date:{
		type:Date,
		default:Date.now
	}
}, {
  timestamps: true,
});

const User = mongoose.model('User', userSchema);

module.exports = User;