const User = require('../models/user')
const bcrypt = require('bcrypt')
const { generatejsowebtoken } = require('../jwt')

//user signup api
exports.postsignup = async (req, res, next) => {
    try {
        const { name, age, email, mobile, address, aadharcardnumber, password, role } = req.body
        const p = await bcrypt.hash(password, 10)
        const findadmin = await User.findOne({ role: 'admin' })
        if (role && findadmin) {
            return res.status(409).json({
                success: false,
                message: "Admin user already exists",
                errorCode: "USER_EXISTS"
            });
        }
        if (age < 18) {
            return res.status(400).json({
                success: false, message: "Cannot create account. Age must be 18 or above.", errorCode: "AGE_VALIDATION_FAILED"
            });
        }
        const existingemail = await User.findOne({ email: email })
        if (existingemail) {
            return res.status(400).json({ success: false, message: 'Email already exists', errorCode: "EMAIL_VALIDATION_FAILED" });
        }
        const existingmobilenumber = await User.findOne({ mobile: mobile })
        if (existingmobilenumber) {
            return res.status(400).json({ success: false, message: 'MobileNumber already exists', errorCode: "MOBILE_VALIDATION_FAILED" });
        }
        let str = aadharcardnumber.toString()
        if (str.length < 12) {
            return res.status(400).json({
                success: false, message: "Aadhar Card Number must be exactly 12 digits", errorCode: "AADHARNUMBER_VALIDATION_FAILED"
            });
        }
        const existinguser = await User.findOne({ aadharcardnumber: aadharcardnumber })
        if (existinguser) {
            return res.status(409).json({ success: false, message: 'User with the same Aadhar Card Number already exists', errorCode: "AADHAR_VALIDATION_FAILED" });
        }
        const user = new User({ name: name, age: age, email: email, mobile: mobile, address: address, aadharcardnumber: aadharcardnumber, password: p, role: role })
        const suser = await user.save()
        const Payload = {
            id: suser._id,
            aadharnumber: suser.aadharcardnumber
        }
        const token = generatejsowebtoken(Payload)
        return res.status(201).json({ status: true, message: "User Created Successfully", data: suser, usertoken: token });
    }
    catch (er) {
        return res.status(500).json({
            "success": false,
            "message": "Internal Server Error",
            "errorCode": "INTERNAL_SERVER_ERROR"
        }
        );
    }
}

//user login api
exports.postlogin = async (req, res, next) => {
    try {
        const { aadharcardnumber, password } = req.body
        let str = aadharcardnumber.toString()
        if (str.length < 12) {
            return res.status(400).json({
                success: false, message: "Aadhar Card Number must be exactly 12 digits", errorCode: "AADHARNUMBER_VALIDATION_FAILED"
            });
        }
        const user = await User.findOne({ aadharcardnumber: aadharcardnumber })
        if (!user) {
            return res.status(400).json({ status: false, message: 'invaild aadharcardnumber', errorCode: "INVAILD_AADHARNUMBER" })
        }
        if (!await bcrypt.compare(password, user.password)) {
            return res.status(400).json({ status: false, message: 'invaild password', errorCode: "INVAILD_PASSWORD" })
        }
        const Payload = {
            id: user._id,
            aadharnumber: user.aadharcardnumber
        }
        const token = generatejsowebtoken(Payload)
        return res.status(201).json({ status: true, message: "User login Successfully", data: user, usertoken: token });
    }
    catch (er) {
        return res.status(500).json({
            "success": false,
            "message": "Internal Server Error",
            "errorCode": "INTERNAL_SERVER_ERROR"
        })
    }
}

//user profile api
exports.getprofile = async (req, res, next) => {
    try {
        const obj = Object(req.user.userData)
        const up = await User.findOne({ aadharcardnumber: obj.aadharnumber })
        return res.status(200).json({ status: true, message: "User Profile", data: up })
    }
    catch (er) {
        return res.status(500).json({
            "success": false,
            "message": "Internal Server Error",
            "errorCode": "INTERNAL_SERVER_ERROR"
        })
    }
}

//user changepassword api

exports.postChangePassword = async (req, res, next) => {
    try {
        const { currentpassword, newpassword } = req.body
        const obj = Object(req.user.userData)
        const up = await User.findOne({ aadharcardnumber: obj.aadharnumber })
        if (!await bcrypt.compare(currentpassword, up.password)) {
            return res.status(400).json({ status: true, message: 'Invaild Password', errorCode: "INVAILD_PASSWORD" })
        }
        const np = await bcrypt.hash(newpassword, 10)
        up.password = np
        await up.save()
        return res.status(201).json({ status: true, message: "Password Changed Successfully" })
    }
    catch {
        return res.status(500).json({
            "success": false,
            "message": "Internal Server Error",
            "errorCode": "INTERNAL_SERVER_ERROR"
        })
    }
}

