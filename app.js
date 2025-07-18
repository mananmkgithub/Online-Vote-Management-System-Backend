require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const app = express()
const PORT = process.env.PORT || 4000
const userroute = require('./routes/userroute')
const candidate = require('./routes/candidateroute')

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use('/api/user', userroute)
app.use('/api/candidate',candidate)

app.use((req,res,next)=>{
     res.status(404).json({message:'Page Not Found..'})
})
mongoose.connect(process.env.DB_URL).then(() => {
     app.listen(PORT, () => {
          console.log(`http://localhost:${PORT}`)
     })
}).catch((er) => {
     console.log('Mongodb is not Connected...')
})
