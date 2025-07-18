const Candidate = require('../models/candidate')
const User = require("../models/user")


const checkadminrole = async (userdata) => {
    try {
        const user = await User.findOne({ aadharcardnumber: userdata })
        if (user.role === 'admin') {
            return true
        }
    }
    catch (er) {
        return false
    }
}

//add Candidate api
exports.postcandidate = async (req, res, next) => {
    try {
        const obj = Object(req.user.userData)
        if (!await checkadminrole(obj.aadharnumber)) {
            return res.status(403).json({ status: false, message: 'Access denied. Admins only.' })
        }
        const data = req.body
        const c = new Candidate(data)
        const cc = await c.save()
        return res.status(201).json({ status: true, message: "Candidate is Added Sucessfully", data: cc })
    }
    catch (er) {
        return res.status(500).json({
            "success": false,
            "message": "Internal Server Error",
            "errorCode": "INTERNAL_SERVER_ERROR"
        })
    }
}

//update candidate api
exports.updatecandidate = async (req, res, next) => {
    try {
        const obj = Object(req.user.userData)
        if (!await checkadminrole(obj.aadharnumber)) {
            return res.status(403).json({ status: false, message: 'Access denied. Admins only.' })
        }
        const cid = req.params.id
        const { name, party, age, votes, votecount } = req.body
        const candidate = await Candidate.findById({ _id: cid })
        if (!candidate) {
            return res.status(400).json({ status: false, message: 'candidate not found..', errorCode: 'CANDIDATE_NOT_FOUND' })
        }
        candidate.name = name
        candidate.party = party
        candidate.age = age
        candidate.votes = votes
        candidate.votecount = votecount
        await candidate.save()
        return res.status(201).json({ status: true, message: "Candidate is Updated Sucessfully", data: candidate })
    }
    catch (er) {
        return res.status(500).json({
            "success": false,
            "message": "Internal Server Error",
            "errorCode": "INTERNAL_SERVER_ERROR"
        })
    }
}


//delete candidate api
exports.deletecandidate = async (req, res, next) => {
    try {
        const obj = Object(req.user.userData)
        if (!await checkadminrole(obj.aadharnumber)) {
            return res.status(403).json({ status: false, message: 'Access denied. Admins only.' })
        }
        const cid = req.params.id
        const candidateid = await Candidate.findById({ _id: cid })
        if (!candidateid) {
            return res.status(400).json({ status: false, message: 'candidate not found..', errorCode: 'CANDIDATE_NOT_FOUND' })
        }
        await Candidate.findByIdAndDelete({ _id: cid })
        return res.status(200).json({ status: true, message: "Candidate is Deleted Sucessfully", data: candidateid })
    }
    catch (er) {
        return res.status(500).json({
            "success": false,
            "message": "Internal Server Error",
            "errorCode": "INTERNAL_SERVER_ERROR"
        })
    }
}

//let's start vote
exports.candidatevote = async (req, res, next) => {
    // no admin can vote
    // user can only once time vote
    const cid = req.params.id
    const obj = Object(req.user.userData)
    try {
        const candidate = await Candidate.findById({ _id: cid })
        if (!candidate) {
            return res.status(400).json({ status: false, message: 'candidate not found..', errorCode: 'CANDIDATE_NOT_FOUND' })
        }
        const user = await User.findOne({ aadharcardnumber: obj.aadharnumber })
        if (!user) {
            return res.status(400).json({ status: false, message: 'user not found', errorCode: 'USER_NOT_FOUND' })
        }
        if (user.isvoted) {
            return res.status(400).json({ status: false, message: 'Voting failed. You have already voted.', data: user, errorCode: 'ALREADY_VOTED' })
        }
        if (user.role === 'admin') {
            return res.status(403).json({ status: false, message: 'admin is not allow for Voting only allow voters', errorCode: 'ADMIN_NOT_ALLOW' })
        }
        candidate.votes.push({ user: obj.id })
        candidate.votecount = candidate.votecount + 1
        await candidate.save()
        // update user document
        user.isvoted = true
        await user.save()
        return res.status(201).json({ status: true, message: 'Vote recored sucessfully. Thank you for vote', data: user })
    }
    catch (er) {
        return res.status(500).json({
            "success": false,
            "message": "Internal Server Error",
            "errorCode": "INTERNAL_SERVER_ERROR"
        })
    }
}

//votecount
exports.getvotecount = async (req, res, next) => {
    try {
        const candidate = await Candidate.find().sort({ votecount: 'desc' })
        const record = candidate.map((v) => {
            return {
                name:v.name,
                party: v.party,
                count: v.votecount
            }
        })
        return res.status(200).json({ status: true, message: 'Vote Count Lists', data: record })
    }
    catch (er) {
        return res.status(500).json({
            "success": false,
            "message": "Internal Server Error",
            "errorCode": "INTERNAL_SERVER_ERROR"
        })
    }
}

//list candidate api
exports.listcandidates = async (req, res, next) => {
    try {
        const candidates = await Candidate.find({}, 'name party -_id');
        res.status(200).json({ status: true, message: 'List Of Candidates', data: candidates });
    } catch (err) {
        return res.status(500).json({
            "success": false,
            "message": "Internal Server Error",
            "errorCode": "INTERNAL_SERVER_ERROR"
        })
    }
}
