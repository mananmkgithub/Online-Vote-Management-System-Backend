const jwt = require('jsonwebtoken');

const jwtauthmiddleware = (req, res, next) => {
    const authorization = req.headers.authorization
    if (!authorization) {
        return res.status(401).json({status: false, message: "Token Not Found", errorCode:'TOKEN_NOT_FOUND'})
    }
    const token = req.headers.authorization.split(' ')[1]
    if (!token) {
        return res.status(401).json({status: false, message: "unauthorized", errorCode:'UNAUTHORIZED'})
    }
    try {
        const decode = jwt.verify(token, process.env.SECERT_KEY)
        req.user = decode
        next()
    }
    catch (er) {
        return res.status(401).json({status: false, message: "Invaild Token", errorCode:'INVAILD_TOKEN'})
    }
}

const generatejsowebtoken=(userData)=>{
    return jwt.sign({userData},process.env.SECERT_KEY,{expiresIn:'30m'})
}

module.exports={generatejsowebtoken,jwtauthmiddleware}