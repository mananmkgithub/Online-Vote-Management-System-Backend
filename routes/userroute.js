const express = require('express');
const userroute=express.Router()
const { jwtauthmiddleware } = require('../jwt')
const usercontroller=require('../controller/usercontroller')

userroute.post('/signup',usercontroller.postsignup)
userroute.post('/login',usercontroller.postlogin)
userroute.get('/profile',jwtauthmiddleware,usercontroller.getprofile)
userroute.put('/profile/changepassword',jwtauthmiddleware,usercontroller.postChangePassword)

module.exports=userroute