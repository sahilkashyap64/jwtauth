require('dotenv').config();
//create middleware to deal with private routes
const express = require('express');
const router = require('express').Router();
const bcrypt = require('bcryptjs'); //to hash the ppassword
const jwt = require('jsonwebtoken');

 const jwtSecret = process.env.jwtSecret;

//User model
let User = require('../models/user.model');

function auth (req,res,next){
	const token=req.header('x-auth-token');
	if(!token) res.status(401).json({msg:'No token,authoriation denied'});
		try{//verify token
		const decoded=jwt.verify(token,jwtSecret);
		//add user from payload
		req.user=decoded;
		next();}
		catch(e){ 
		res.status(400).json({msg:'Token is invalid'});
		}
		
	
}
module.exports = auth;