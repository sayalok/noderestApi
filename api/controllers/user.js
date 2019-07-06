const mongoose = require('mongoose');
const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

exports.user_signup = (req, res, next) => {
	User.find({email:req.body.email})
		.exec()
		.then(data => {
			if(data.length >= 1){
				return res.status(409).json({
					message: "Email already exists."
				})
			}else {
				bcrypt.hash(req.body.password, 10, (err, hash) => {
			    	if(err) {
			    		return res.status(500).json({
			    			error: err
			    		})
			    	}else{
			    		const user = new User({
							_id: new mongoose.Types.ObjectId(),
					        email: req.body.email,
					        password: hash
						})
						user
							.save()
							.then(result => {
								console.log(result)
								res.status(201).json({
									message: "User has been created Successfully"
								})
							})
							.catch(err => {
								res.status(500).json({
									error: err
								})
							})
			    	}
			    })
			}
		})
}

exports.user_login = (req, res, next) => {
	User.find({email: req.body.email})
		.exec()
		.then(user => {
			if(user.length < 1) {
				return res.status(401).json({
					message: 'Authentication Failed'
				})
			}
			bcrypt.compare(req.body.password, user[0].password, (err, data) => {
				if(err) {
					return res.status(401).json({
						message: 'Authentication Failed'
					})
				}
				if(data) {
					const token = jwt.sign({
						email: user[0].email,
						userid: user[0]._id
					},
					"faisal",
					{
						expiresIn: "1h"
					},

					)
					return res.status(200).json({
						message: "Authentication Successful",
						token: token
					})
				}
				return res.status(401).json({
					message: 'Authentication Failed'
				})
			})
		})
		.catch(err => {
			res.status(500).json({
				error: err
			})
		})
}