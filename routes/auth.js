require('dotenv').config();
const express = require('express');
const router = require('express').Router();
const bcrypt = require('bcryptjs'); //to hash the ppassword
const jwt = require('jsonwebtoken');

 const jwtSecret = process.env.jwtSecret;

//User model
let User = require('../models/user.model');

const auth = require('../middleware/auth');

//@route post /auth 
//@desc  authenticate
//@access Pulic
router.route('/').post((req, res) => {
  
const {email,password}=req.body;
//simple vaalidation
if(!email || !password){
	return res.status(400).json({msg:'Please enter all fields'});
}
//check if user exist
User.findOne({email})
.then(user=>{
	if(!user) return res.status(400).json({msg:'User doesnot exsit'}); //check email exist or not
	 
	//validate password
	bcrypt.compare(password,user.password)//check if password exit or not
	.then(isMatch=>{
		if(!isMatch) return res.status(400).json({msg:'IInvalid credenntials'});
		 //jwt sign start
				 jwt.sign({id:user.id},//user id is payload
				 jwtSecret,//our jwt secret
				 {expiresIn:3600},//expires in an hour
				 (err,token)=>{ //our callback
					 if(err) throw err;
				 res.json({token, //sended with a reponse token and user
					 user:{  
					 id:user.id,
					 name:user.username,
				 email:user.email
				 }
				 });})
				 //jwtsign end
	})
})
 

  /** newUser.save()
    .then(() => res.json('User added!'))
    .catch(err => res.status(400).json('Error: ' + err)); **/
});

// @route   GET auth user
// @desc    Get user data
// @access  Private
//dont return the password
router.get('/user',auth,(req, res) => {
  User.findById(req.user.id)
  .select('-password')
    .then(user => res.json(user))

    .catch(err => res.status(400).json('Error: ' + err));
});
module.exports = router;