require('dotenv').config();
const express = require('express');
const router = require('express').Router();
const bcrypt = require('bcryptjs'); //to hash the ppassword
const jwt = require('jsonwebtoken');

 const jwtSecret = process.env.jwtSecret;

//User model
let User = require('../models/user.model');
//@route get / 
//@desc  get user 
//@access Pulic
router.route('/').get((req, res) => {
  User.find()
    .then(users => res.json(users))
    .catch(err => res.status(400).json('Error: ' + err));
});

//@route post /add 
//@desc  add user 
//@access Pulic
router.route('/add').post((req, res) => {
  
const {username,email,password}=req.body;
//simple vaalidation
if(!username || !email || !password){
	return res.status(400).json({msg:'Please enter all fields'});
}
//check if user exist
User.findOne({email})
.then(user=>{
	if(user) return res.status(400).json({msg:'User already exsit'});
	 const newUser = new User({username,
	 email,
	 password});
	 //create salt nd hash
	 bcrypt.genSalt(10,(err,salt)=>{
		 bcrypt.hash(newUser.password,salt,(err,hash)=>{
			 if(err) throw err;
			 newUser.password = hash;//password hashed
			 newUser.save( { writeConcern: { w: "majority", wtimeout: 5000 }})
			 .then(user => {
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
				 
			 });
		 })
	 });
})
 

  /** newUser.save()
    .then(() => res.json('User added!'))
    .catch(err => res.status(400).json('Error: ' + err)); **/
});

module.exports = router;