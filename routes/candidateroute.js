const express = require('express');
const candidateroute=express.Router()
const candidatecontroller=require('../controller/candidatecontroller')
const { jwtauthmiddleware } = require('../jwt')

candidateroute.post('/',jwtauthmiddleware,candidatecontroller.postcandidate)
candidateroute.put('/update/:id',jwtauthmiddleware,candidatecontroller.updatecandidate)
candidateroute.delete('/delete/:id',jwtauthmiddleware,candidatecontroller.deletecandidate)
candidateroute.post('/vote/:id',jwtauthmiddleware,candidatecontroller.candidatevote)
candidateroute.get('/vote/count',candidatecontroller.getvotecount)
candidateroute.get('/listcandidate',candidatecontroller.listcandidates)

module.exports=candidateroute

